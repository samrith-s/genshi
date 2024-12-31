#!/usr/bin/env bash

export ROOT=$(readlink -f $PWD/../../);
export NODE_MODULES=$(readlink -f $ROOT/node_modules);
export NODE_MODULES_BIN=$(readlink -f $NODE_MODULES/.bin);

chmod +x $NODE_MODULES_BIN/prettier;

$NODE_MODULES_BIN/prettier --cache --ignore-path $ROOT/.prettierignore $@;
