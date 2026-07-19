# Anatomy of a file — working notes

Accepted at FOSS4G 2026 (Hiroshima, 2026-09-03):
https://talks.osgeo.org/foss4g-2026/talk/CYWZVB/
Site page: content/presentations/20260903-foss4g-2026-anatomy-of-a-file/

What is a file?

* bytes
* data and data encoding
* compression
* metadata
* is a file just a file?

What if this is an interactive exercise? Let's build a file format together?
Say we have some simple data, we have some options how to chunk it, encode it?
We then need to index it.
Can we do this in python? Can we build up a dict or object based parser using struct?

See `file-demo.py` in this directory for the struct-based demo scratch code.
