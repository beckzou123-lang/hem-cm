#!/usr/bin/env bash
set -e
cd /Users/zoubin/Documents/HEM.CM_System
npm run db:init || true
npm run seed
npm run dev
