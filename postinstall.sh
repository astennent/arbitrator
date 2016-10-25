#!/usr/bin/env bash
set -x #echo on

node ./node_modules/bower/bin/bower install
npm update
node ./node_modules/gulp/bin/gulp build
