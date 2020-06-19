---
title: "QEMU services with socat"
date: 2020-06-19T13:00:39-07:00
draft: false
url: /posts/qemu-services-with-socat
---


# QEMU Services?

I've been working on an integration testing environment for a few
interconnected services. Such a thing would be easy with containers,
but I am modeling an environment of bare metal hosts running these services,
leaving little choice but VMs. It's been easy testing the VMs
in isolation using QEMU, which by default with `-nographic` drops
one into the console.

But when one wants to kick off several VMs at once, it's much easier
if they can be started as services in the background. Any number of
service supervisiors can run them, that's no problem. QEMU even has the
`-daemonize` option to background itself.

But now, with some backgrounded VM service, how can one connect to it
and do things? No longer can we use the default console connection from
`-nographic`.

As I was trying to answer this question, I realized my
[recent experience with socat]({{< ref "/posts/serial_with_socat.md" >}})
might lend a hand...


# What does `-nographic` do anyway?

It is a lot easier to know what way to go when you know where you started.
So, before we go much further, it is probably good to understand what `-nographic`
does.

From what I could tell, the `-nographic` option does three things:
* Sets `-display none` to disable video output to the user.
* Sets `-echr 0x01` to make ctrl+a the escape sequence.
* Binds the monitor and serial connections to stdio like `-serial mon:stdio`.

Well, at least the first of these is pretty obvious: we're trying to run
headless services, so we want `-display none`.

To understand the escape sequence, we also have to understand what that
`-serial` option is. And what is the monitor?

The manpage has all of this in detail, but it breaks down like this:
* The serial connection is what gives us console access.
* The "monitor" interface provides a way to control QEMU and the emulated
  hardware running the VM  after it is has started.
* The `-serial mon:stdio` is _multiplexing_ the serial and monitor connections
  together onto a single file descriptor, in this case that being stdio.
  To access the multiplex controls, we need an escape sequence,
  set by the `-echr` options, which is ctrl+a by default.
* To get to the monitor connection from a multiplexed serial connection, one can
  use the escape sequence ctrl+a then press c.

It is important to note that the serial and monitor connections do not have to be
multiplexed, but can be bound to two different file descriptors. In fact one can
configure multiple serial connections, if needed (though we only get one monitor).
As these connection are bound to a file descriptor, we could bind these connections
to named files, and then we get unix sockets we can use with other processes.
And socat can connect to unix sockets!


# How I ended up configuring QEMU

To give the VM something that it can read from/write to for the serial and monitor
connections, we actually end up emulating char devices. The `-serial mon:stdio` is
shorthand for something like this:

```
-chardev stdio,id=char0,signal=off \
-serial mon:char0
```

Knowing that, we can put together the options in the manpage regarding unix sockets,
to get something like this:

```
-chardev socket,id=char0,path=./monitor.sock,server,nowait \
-mon chardev=char0 \
-chardev socket,id=char1,path=./serial.sock,server,nowait \
-serial chardev:char1
```

If we add these options to our QEMU command, we'll end up with two files created in
the current directory, both being unix sockets that we can connect to with socat.


# The socat command

```
socat -,icanon=0,echo=0,isig=0,escape=0x0f UNIX-CONNECT:$SOCKET
```

That's all there is to it, just sub `$SOCKET` with the name of the unix socket you
want to connect to (`serial.sock` or `monitor.sock` in the QEMU example above).
Then stdio will be connected to it. As in my previous post, this socat command looks
and feels just like a native terminal connection. The only exception is the escape
sequence here is ctrl+o, as I like to use ctrl+a to get to the beginning of the
line.

Regarding the options we set on the stdio side, we use the `icanon` option to disable
canonical input mode, so we don't have to wait until we hit enter to pass the input
along to the socket side, same as how a serial connection typically works. We also
disable socat's echo, because the shell's echo on the other end of the connection should
take care of that for us. `isig` we disable as well, as we don't want socat to handle
signals but to send them along too.

There you have it, socat for the win yet again. Truly, the more I understand what this
tool can do, the more I see simple but powerful uses lying all around.

Need a good way to level up you unix powers? Learn socat.
