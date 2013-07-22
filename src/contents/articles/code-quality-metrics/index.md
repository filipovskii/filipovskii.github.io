---
title: "Rethinking DRY and KISS"
author: filipovsky
date: 2013-07-21
template: article.jade
---

Every programmer instantly measures quality of code, whether it is his
(her/their?) own masterpiece, or some crap written by some other guy. And
there are lots of metrics defined by smart people out there, that help you
in this
([cohesion](http://en.wikipedia.org/wiki/Cohesion_%28computer_science%29),
[code coverage](http://en.wikipedia.org/wiki/Code_coverage),
[WTFs/minute](http://www.osnews.com/story/19266/WTFs_m)). Well, I'm no
exception, and just recently I've started to think about what am I paying
attention to in the first place.  <span class="more"></span>

Turned out, there are just two things, that bother me most of the time:
**complexity** and **duplication**. This is all I need to tell whether code
I'm looking at is worth something.. And that's what **DRY** (don't repeat
yourself) and **KISS** (keep it super simple) are about.

## Complexity

*Writing software is hard!* You have to joggle all this abstract concepts,
think about what library to use and how efficient your code is and so on.
Years spent doing this made me come to a simple conclusion:

I am not that smart.

There are people that can handle it much better than me. They can keep in
mind *stack traces 200 calls long*, name you all *70 functions* of a module
in alphabetical order and tell what is that *100 lines of code block* doing
just by looking at it for 5 secs.

I can't. This things matter to me:

* Actual size of code Number of levels of abstraction Number of condition
* operators Presence of naming conventions Number of third party libraries
* used A lot more..

Looking at code I ask myself:

* Is the purpose of this function/method/class obvious and *unambiguous*?

  Or should I change its name, signature, remove it, break into several
  smaller peaces, or merge into greater meaningful peace.

* Is this level of abstraction necessary? *Does it remove any duplication?*

  Introducing unnecessary abstractions is, sadly, one of the most favourite
  activities of contemporary programmer. Too many abstractions make code
  harder to understand, debug and ...yeah... change. So [use functions
  instead of classes]( http://pyvideo.org/video/880/stop-writing-classes),
  lightweight frameworks instead of huge `MV(\w*)C` beasts, and no ORMs,
  *please*!

* Is it absolutely inevitably to use inheritance? In most cases it adds
  incredible amount of complexity.

  Should I use composition? Oh look, they even got
  [wikipedia](http://en.wikipedia.org/wiki/Composition_over_inheritance)
  article for this..

* Do I *need* this third party library here?

  First answer should be *NO*, cause everyone working with this code will
  also need to understand how this library works and foreign code may
  introduce subtle bugs and/or performance issues.

  Won't it be easier to write something using just standard libs first?

  If I'm absolutely sure, I will look through its source and check if it's
  still actively supported by community before adding this library to the
  project.

["Simple made easy" by Rich
Hickey](http://www.infoq.com/presentations/Simple-Made-Easy) is a great
source of inspiration for me when it comes to complexity in software. I
strongly recommend watching it, regardless of your opinion about *Closure*.

## Duplication

Although it seems superficial, *code duplication*, in my opinion, is a
fundamental problem in software engineering. All this complex concepts, such
as design patterns and programming paradigms serve just one purpose - remove
duplication from code. That's it. *It is that simple!*

Same or *roughly similar* code in several different places is bad. You have
to keep in mind all these peaces and change them simultaneously. Well...
you know.

I began to realize this mostly after reading some of the books on TDD by
[Kent Beck](http://en.wikipedia.org/wiki/Kent_Beck), which I again strongly
recommend.

Interesting thing is that there is *only one way* to solve this problem of
similar code. And that is complicating things. *What an irony!*

Think about it.

* Once I see a duplication (aka *reusable behavior*), I abstract it in a
  class or function or module or even whole abstraction layer.

* Instead of writing my own implementation of http-protocol (*duplicating
  something somebody else wrote*) every time I develop a webapp, I simply
  use a third-party library.


## Tradeoff

All I am saying is that without oversimplifying things, **complexity**
and **duplication** are all I really care about in programming.

Like most things in the industry, you need to find a tradeoff between those
two. Removing duplication leads to increasing complexity and vice versa.
Depending on situation, project, time-performance-[other] constrains I
prefer one over another. Sometimes I make a decision, that implies some
duplication, and only if it keeps bothering me, I refactor it later. It's
important that **common sense plays the main role in it!**

    “All theory is gray, my friend. But forever green is the tree of life.”


That's why I'm going to write about some cases, where I apply this two
criterions, in future posts.

Till then!
