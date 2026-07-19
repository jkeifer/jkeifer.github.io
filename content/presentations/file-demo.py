#!/usr/bin/env python
import struct
import random

# We can use randbytes to generate a dataset
# But we need to know the dataset size and data type
size = 100
dtype = 'i'
dsize = struct.calcsize(dtype)

# now we can generate the data
data = struct.unpack(dtype*size, random.randbytes(size*dsize))

print(data)
