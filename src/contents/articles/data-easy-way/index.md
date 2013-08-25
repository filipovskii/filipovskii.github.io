---
title: "Storing data, the easy way"
author: filipovsky
date: 2013-08-25
template: article.jade
---

Choosing appropriate data storage is one of the first and most important
decisions you have to face once you've started implementing an application
(at least in web or mobile world). There are lots of possibilities out
there, SQL and NoSQL, documents and objects and graphs and tables and
whatnot. But I want to talk about those cases, when a fully-featured
database for storing your data may be either not enough or too much.
<span class="more"></span>

To be clear, by database I mean [DBMS] [DBMS] or database management
system, and by data storage I mean any organized representation of your
data.


## RAM

That's pretty obvious. You need to store non-critical data and have fast
access to it &mdash; use RAM. Classical use cases include:

  - Mock storage for unit tests

    Instead of running your tests using real database, sometimes it's
    easier to mock storage using some build-in collections like lists,
    dictionaries (aka maps) etc.

    It forces you to write database-agnostic code, isolate storage
    interaction and concentrate on application logic. Which is a good
    thing, obviously.

    Here is an example of a simple mock in javascript:

      ```javascript

        var users = {}; // fill this with mock data

        function getUserById(id) {
          return users[id];
        }
      ```


  - Cache

    Instead of reading often used data from disk all the time, cache it in
    memory! It is fast and nothing inevitable can happen once your app
    unexpectedly shut down.

    I use it a lot. In the most recent project, I've been working on, all
    the vital data gets loaded into cache in RAM on application start up
    and is updated in cache first, before any changes get stored to disk.

  - Pre-aggregation

    Suppose you need to track page views on popular site&hellip; all of
    them. That's a lot of data. Writing each page view to disk real-time
    will certainly lead to performance issues.

    It is possible to improve performance by storing data in RAM first,
    and flushing it to disk every now and then. To optimize even more in
    case you need to track just certain parameters (e.g. User-Agent),
    pre-aggregate data based on those and then flush it:

        Chrome    300 visits
        Firefox   220 visits

    There is a chance of losing data, while it is not on the disk. That's
    a price you have to pay for performance. Think about how much data you
    can afford to loose and tweak *period in which flushing occurs*
    accordingly.

    [Heymoose] [heymoose], advertising platform I was working on,
    uses this tactics to store ad shows and clicks.

Of course there are more possible use cases. The general idea is: "If
you want to keep things simple and you're not afraid to loose data up
to some point, RAM is a great easy-to-use storage available out of (your
favourite language) box."

## Files

This is *the most underestimated storage* in web development of all time.
I think it all began with [LAMP] [LAMP]. *MySQL* became a minimum
requirement for building a website, thus the simplest, fastest and
sometimes even more reliable storage forgotten&hellip;

*Plain-text files* can be used for lots of stuff, although there are
certain use cases, when they are simply the best fit for the job:

  - Log-like data

    Access logs, error logs, debug logs &mdash; this is a huge amount of
    important data. Applications do not tend to use *DBMS* for this. It's
    simpler and faster to write to files.  And, most importantly, it
    *reduces the number of levels of complexity*.

    In the past I was working on [FIX] [FIX] traffic analyser tool. The
    low level part of this project was written in C and was responsible
    for capturing and writing FIX messages into rotated log. High level
    part was providing a fancy web interface for searching and analyzing
    those messages.

    Amount of data was huge, DBMS would require lots of resources to
    handle it. With files (in conjunction with with pre-aggregation) it
    became possible.

    Indexing and searching through this data was implemented with
    [ElasticSearch] [elasticsearch]. It all worked like a charm!

  - Replacement for a database with a simple structure

    For prototypes, tests or even working apps, it is possible to use
    files to store your data like you would use a database:

        db
        ├── painters
        │   ├── k.malevich@square.io.json
        │   ├── r.falk@msk.ru.json
        │   └── v.kandinsky@circles.ru.json
        └── paintings
            ├── black-square.json
            ├── moscow-I.json
            └── portrait-of-a-tatar-journalist-midhat-refatov.json


Working with files in high-level languages is fun and easy. Considering
[caching] [pagecache], [epoll] [epoll] and other cool options, it can also
be very efficient and convenient.

## To summarize

Storing your data is not only about MySQL, PostgreSQL, MongoDB etc. Very
often compound solutions may lead to cleaner code, higher performance and
flexibility. And sometimes you don't even need fully-featured DBMS at all.

Use programs that do one thing and do it well. Use programs to work
together.


[DBMS]: http://en.wikipedia.org/wiki/Database
[elasticsearch]: http://www.elasticsearch.org/
[epoll]: http://en.wikipedia.org/wiki/Epoll
[FIX]: http://en.wikipedia.org/wiki/Financial_Information_eXchange
[heymoose]: http://heymoose.com
[LAMP]: http://en.wikipedia.org/wiki/LAMP_(software_bundle)
[pagecache]: http://en.wikipedia.org/wiki/Page_cache
[unixphilosophy]: http://en.wikipedia.org/wiki/Unix_philosophy
