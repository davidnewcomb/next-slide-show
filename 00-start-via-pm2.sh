#!/bin/bash

pm2 start node_modules/.bin/next --name slide-show -- dev
pm2 ls
