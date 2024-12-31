#!/usr/bin/env bash

export ROOT=$(readlink -f $PWD/../../);
export NODE_MODULES=$(readlink -f $ROOT/node_modules);
export NODE_MODULES_BIN=$(readlink -f $NODE_MODULES/.bin);

$NODE_MODULES_BIN/eslint --cache --ignore-path $ROOT/.eslintignore $@;
