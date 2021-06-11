---
title: "A bit about Linux namespaces"
date: 2020-06-19T20:00:39-07:00
draft: true
url: /posts/a-bit-about-linux-namespaces
---


# Introduction

Containers are all the rage these days, and so are the blog posts
trying to break them down so people understand them. It seems like
everyone has their version of "docker in $N lines of $LANG". All of
those essentially revolve around a way to use the clone or unshare
syscalls to exec some kind of init process in a chroot.

Most basically, one can do something like this in a shell:
```
$ unshare -inpuUCTf --mount-proc chroot $FILESYSTEM $INIT
```

And then you have a container, or at least the most basic start of
something like what you expect to get with docker. Sure, it lacks
networking and supervision, but we can tack those on if we want.

...And at this point it would be easy for me to keep going with my
"docker replacement", but that's not what I want to focus on. Rather,
I want to dig into those `-inpuUCT` args to unshare and see what
those are all about.

Note that the focus of this post is not necessarily on being as technically
correct as possible, but more to exhibit a practical working knowledge
of some of the ways to work with Linux namespaces. It will not be exhaustive,
and the examples will be mainly constrained to what you can do in a shell,
in the hope that the concepts will be easily groked by the reader into a
usable mental model of namespaces.


# Wait, unshare? What about namespaces?

The unshare command is a userspace command wrapping the eponymous
syscall unshare, the latter of which is described on
[its manpage](https://man7.org/linux/man-pages/man2/unshare.2.html) as,
a syscall that "allows a process (or thread) to disassociate parts of its
execution context that are currently being shared with other processes
(or threads)."

Um, what?

If we consider a arbitrary process, we know that it must at some point have
been forked from a parent, inheriting the same execution context of its parent.
Execution context could include many things, so let's try simplifying this a bit
by considering just one part of the execution context, say the PID namespace.

If we think traditionally about the process IDs on a running system, they must all
be unique. Init gets 1, and every new process gets the next available PID, up to some
limit where we rollover, and if this isn't a fork bomb or whatever then we hopefully
by then have cleaned up some PIDs so we can reuse them, right? In other words, the
PIDs are all part of a set, and we can query the set to find a given process.

A PID namespace is like defining another set to hold new process IDs. When we create
that PID namespace and assign the first process within it, it gets the PID of 1.
It's okay that we have duplicated that PID, as the kernel is aware of this whole
namespace concept, and knows that PID 1 in our namespace is a different PID 1 than
the init in the default namespace we started with.

It is important to note that processes within a PID namespace actually end up with
two PIDs: one inside and one outside the namespace. So outside the namespace we can
see all processes within the namespace, but inside the namespace the procs may or
may not have visibility to outside the namespace (more on that in a moment).
PID namespaces can also be nested, but we'll save that complication for another time.

I think words can only take us so far here, so let's see an example[^1]:

[^1]: All commands using unshare are run as root, as only root can create new namespaces
     by default.

```
$ unshare --fork --pid --mount-proc readlink /proc/self
1
```

What happens here is unshare creates a new process namespace and forks (`--fork`)
the readlink inside it. As the first process in the namespace, readlink has the PID 1.
Once readlink exits the namespace has no more processes and ceases to exist.
The `--mount-proc` creates a mount namespace[^2] and re-mounts proc such that proc
reflects the state inside the PID namespace. If we omit the `--mount-proc`,
processes inside the namespace--like readlink--still see the process state
as if from outside the namespace:

[^2]: We need a mount namespace, otherwise remounting proc will affect proc
      for all running processes, not just those in our namespace.


```
$ unshare --fork --pid --mount-proc readlink /proc/self
17395
```

Another bit of info in the proc filesystem is `/proc/$PID/status`:

```
$ unshare --fork --pid --mount-proc cat /proc/self/status | grep -i pid
Pid:	1
PPid:	0
TracerPid:	0
NSpid:	1
```

This isn't terribly interesting unless we drop the `--mount-proc` so we can
look at the view of the process from outside the namespace:

```
$ unshare --fork --pid cat /proc/self/status | grep -i pid
Pid:	17742
PPid:	17740
TracerPid:	0
NSpid:	17742	1
```

The NSpid field shows us the PID outside the namespace is 17742,
while the PID inside is 1. We can look at the proc status for any process;
all processes running within a PID namespace will show multiple PIDs.
Pretty cool.

If we try this again with a longer-lived command, we can inspect the process
tree and see what this looks like from outside the namespace:

```
$ unshare --fork --pid sleep 100 &
[1] 17846

$ ps afux
root      17431  0.1  0.0   8448  5232 pts/4    S    23:21   0:00  |               \_ -bash
root      17846  0.0  0.0   5248   752 pts/4    S    23:22   0:00  |                   \_ unshare --fork --pid --mount-proc sleep 100
root      17847  0.0  0.0   5260   748 pts/4    S    23:22   0:00  |                   |   \_ sleep 100

$ cat /proc/17847/status | grep -i pid
Pid:	17847
PPid:	17846
TracerPid:	0
NSpid:	17847	1
```

And as we can see more than just PID 1 in the namespace:

```
$ unshare --fork --pid --mount-proc bash -c "for i in \$(seq 1 10); do sleep 10000 & done; wait" &
[1] 17852

$ ps afux
root      17852  0.0  0.0   5248   748 pts/4    S    23:41   0:00  |                   \_ unshare --fork --pid --mount-proc bash -c for i in $(seq 1 10); do sle
root      17853  0.0  0.0   6644  3104 pts/4    S    23:41   0:00  |                   |   \_ bash -c for i in $(seq 1 10); do sleep 100 & done; wait
root      17855  0.0  0.0   5260   748 pts/4    S    23:41   0:00  |                   |       \_ sleep 10000
root      17856  0.0  0.0   5260   752 pts/4    S    23:41   0:00  |                   |       \_ sleep 10000
root      17857  0.0  0.0   5260   752 pts/4    S    23:41   0:00  |                   |       \_ sleep 10000
root      17858  0.0  0.0   5260   752 pts/4    S    23:41   0:00  |                   |       \_ sleep 10000
root      17859  0.0  0.0   5260   684 pts/4    S    23:41   0:00  |                   |       \_ sleep 10000
root      17860  0.0  0.0   5260   752 pts/4    S    23:41   0:00  |                   |       \_ sleep 10000
root      17861  0.0  0.0   5260   752 pts/4    S    23:41   0:00  |                   |       \_ sleep 10000
root      17862  0.0  0.0   5260   752 pts/4    S    23:41   0:00  |                   |       \_ sleep 10000
root      17863  0.0  0.0   5260   748 pts/4    S    23:41   0:00  |                   |       \_ sleep 10000
root      17864  0.0  0.0   5260   752 pts/4    S    23:41   0:00  |                   |       \_ sleep 10000

$ cat /proc/17862/status | grep -i pid
Pid:	17862
PPid:	17853
TracerPid:	0
NSpid:	17862	10
```

That's great, but we can have multiple PID namespaces, right? So how can
you know what namespace has that process as PID 10? Enter `/proc/$PID/ns`:

```
$ ls /proc/17862/ns
cgroup	ipc  mnt  net  pid  pid_for_children  user  uts
```

The kernel keeps track of all namespaces as part of each process's metadata.
That metadata is made available in the proc filesystem, specifically as
file descriptors within the process's ns directory. Each namespace for a
process is listed there. If you want to attach to one (or more) of a
process's namespace(s), use the nsenter command:

```
# we used --mount-proc with unshare so we can do things like the ps
# that follows, which means we also need to attach to the mount namespace
$ nsenter --pid --mount -t 17862 bash

$ echo $$
20

$ ps afux
USER        PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
root         20  0.0  0.0   6992  3760 pts/4    S    23:56   0:00 bash
root         31  0.0  0.0  10632  3120 pts/4    R+   23:58   0:00  \_ ps afux
root          1  0.0  0.0   6644  3116 pts/4    S    23:56   0:00 bash -c for i in $(seq 1 10); do sleep 10000 & done; wait
root          3  0.0  0.0   5260   748 pts/4    S    23:56   0:00 sleep 10000
root          4  0.0  0.0   5260   752 pts/4    S    23:56   0:00 sleep 10000
root          5  0.0  0.0   5260   748 pts/4    S    23:56   0:00 sleep 10000
root          6  0.0  0.0   5260   748 pts/4    S    23:56   0:00 sleep 10000
root          7  0.0  0.0   5260   752 pts/4    S    23:56   0:00 sleep 10000
root          8  0.0  0.0   5260   748 pts/4    S    23:56   0:00 sleep 10000
root          9  0.0  0.0   5260   752 pts/4    S    23:56   0:00 sleep 10000
root         10  0.0  0.0   5260   752 pts/4    S    23:56   0:00 sleep 10000
root         11  0.0  0.0   5260   688 pts/4    S    23:56   0:00 sleep 10000
root         12  0.0  0.0   5260   756 pts/4    S    23:56   0:00 sleep 10000
```

# something showing the stat from the ns/pid files and the pid ns ID


# make more subsections for the above to break it up
# start taking a bit more about nsenter
# show how to make a persistent namespace
# relate this to ip netns and why I started all of this

# ----

