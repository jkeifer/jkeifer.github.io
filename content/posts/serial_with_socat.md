---
title: "Serial with socat"
date: 2020-05-20T23:00:39-07:00
draft: false
url: /posts/serial-with-socat
---

## Introduction

I do a lot of work with network devices, which are often headless and
require the use of serial consoles for out-of-band access. My go-to on
MacOS and Linux has been screen, but various little issues over the years
have led me to consider other options. I tried minicom on the recommendation
of a colleague, but that didn't work for me either.

I've struggled to pinpoint my problem with the aforementioned tools;
I think I just want something _less_ featurful, something that literally only
gives me a tty via serial and doesn't have anything unnecessary between
my terminal and the remote shell. Over the weekend, I randomly happened upon
[an article about using socat for serial](https://bloggerbust.ca/post/let-socket-cat-be-thy-glue-over-serial/)
on [Hacker News](https://news.ycombinator.com/), and thought it might
be just what I have been searching for. So I tried out the example
and it failed miserably with the socat from Homebrew (MacOS being the OS
on my daily driver).


## What went wrong

I took the example command from the article and made the minimal changes
for my environment (the name of my adapter's serial device), but right off
the bat I got an error:

```sh
> socat -,rawer,escape=0x0f /dev/tty.usbserial-AI066OQC,b115200,rawer
2020/05/20 22:25:06 socat[72638] E parseopts(): unknown option "b115200"
```

A quick google search turned up a number similar reports, and led me toward
the `ispeed` and `ospeed` options. Reviewing the manpage for these parameters
also suggests that the `b` option is not available on all operating systems,
MacOS presumably among those. The manpage also explains these are used to set
the baud rates for incoming and outgoing data on the line, respectively (anyone
ever run into asymmetric serial speeds in the wild?). Anyway, that's an easy change:

```sh
> socat -,rawer,escape=0x0f /dev/tty.usbserial-AI066OQC,ispeed=115200,ospeed=115200,rawer
# and nothing at all happens, nor does the ctrl+o escape work
# eventually I had to resort to a kill -9 in another window
```

Bummer. I guess it's not so easy after all.


# Not all hope is lost

After far too long playing with permutations of options and searching the
ends of the internet for suggestions, I finally found the magic incantation
(with some hints from the sample command in
[this stack overflow question](https://stackoverflow.com/questions/14235786/usb-serial-port-on-mac-using-socat))

```sh
> socat -,rawer,escape=0x0f /dev/tty.usbserial-AI066OQC,clocal=1,nonblock=1,ispeed=115200,ospeed=115200
```


# The end solution

I am really excited about this new way to connect via serial. If nothing
else, ctrl+a goes to the beginning of the line with no other escape sequence,
and I am not at the mercy of any scrollback buffer beyond that of iterm.
Alone, those are two killer features and make it so a serial connection
really isn't any different than any other terminal session I use throughout
the day (besides perhaps speed).

That said, the above solution isn't very pretty. But we can wrap it up as
a shell function to make it easier to use:

```sh
# socat-serial => social
social() {
    local DEV=${1?must specify the serial device}; shift
    local BAUD=${1:-9600}
    socat -,rawer,escape=0x0f ${DEV},clocal=1,nonblock=1,ispeed=${BAUD},ospeed=${BAUD}
}

# now you can invoke like
> social /dev/tty.usbserial-AI066OQC 115200
```

Drop that in your .bashrc or equivalent and off you go. Kill the connection with ctrl+o
per the escape code.

I don't have a need for more options, but `ixon/ixoff` turn flow
control on and off, respectively, and `csX` where `X is number of bit can change the
length of chars as needed. I am sure it supports other obscure parameters too; check the
manpage. For heavy-duty uses a function alone might not suffice. I could totally see this
evolving into a whole wapper script around socat, where needed.

Happy console-ing!
