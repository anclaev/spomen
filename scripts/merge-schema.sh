#!/bin/bash
npx prisma-merge-schema --datasource ./scripts/datasource.prisma --datasource ./apps/**/prisma/*-shared.prisma --outputFile merged-schema.prisma

