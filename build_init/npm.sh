#!/bin/sh

cnpm install
npm audit fix --force --registry https://registry.npm.taobao.org
cnpm install node-sass
npm run build:prod