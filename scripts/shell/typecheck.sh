#!/usr/bin/env bash

export ROOT=$(readlink -f $PWD/../../);
export NODE_MODULES=$(readlink -f $ROOT/node_modules);
export NODE_MODULES_BIN=$(readlink -f $NODE_MODULES/.bin);

echo $ROOT
echo $NODE_MODULES
echo $NODE_MODULES_BIN

$NODE_MODULES_BIN/eslint --ignore-path $ROOT/.eslintignore $@;
