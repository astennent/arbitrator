#!/usr/bin/env bash
set -x #echo on

node ./node_modules/bower/bin/bower install
npm install gulp gulp-sass gulp-sourcemaps gulp-concat gulp-connect
node ./node_modules/gulp/bin/gulp build
