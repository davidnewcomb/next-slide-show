#!/bin/bash

pm2 start node_modules/.bin/next -- dev
pm2 ls
