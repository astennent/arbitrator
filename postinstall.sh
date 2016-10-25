#!/usr/bin/env bash
set -x #echo on

node node_modules/bower/bin/bower install
sleep 1
node node_modules/gulp/bin/gulp build
