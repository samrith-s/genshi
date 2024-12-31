#!/usr/bin/env bash

# This just stores the scripts, doesn't run it
export ROOT=$(readlink -f $PWD/../../)
export NODE_MODULES = $(readlink -f $ROOT/node_modules)
export NODE_MODULES_BIN = $(readlink -f $NODE_MODULES/.bin)

