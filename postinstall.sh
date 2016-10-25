#!/usr/bin/env bash
set -x #echo on

node ./node_modules/bower/bin/bower install
gulp build
