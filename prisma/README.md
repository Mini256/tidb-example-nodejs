# TiDB Develop Guide with Prisma

In this guide, we will introduce how to use [Prisma](https://github.com/prisma/prisma) to develop and build applications with TiDB as the underlying database.

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/pingcap-inc/tidb-example-nodejs)

## Table of Content

- [What is Prisma?](#what-is-prisma)
- [Prerequisites](#prerequisites) (If you don't know how to run the sample code, please read it)
- [Connect](./connect/README.md)

## What is Prisma

Prisma is a Node.js ORM framework that contains a set of tools for developers to build and query databases:

- [Prisma Client](https://www.prisma.io/docs/concepts/components/prisma-client): A type-safe database client auto-generated based on the data model. It provides a set of APIs for CRUD operations and raw database access.
- [Prisma Migrate](https://www.prisma.io/docs/concepts/components/prisma-migrate): A declarative data modeling and migrations system. It allows developers to define the data model in the Prisma schema file and use the Prisma CLI to generate the corresponding database schema and migration files.
- [Prisma Studio](https://www.prisma.io/docs/concepts/components/prisma-studio): A visual database editor that allows developers to view and edit data in the database.

## Prerequisites

### 1. Prepare development environment

Please make sure the following tools are installed in your machine:

- [Node.js](https://nodejs.org/en/download) (version >= 16.x)
- [pnpm](https://pnpm.io/installation#using-npm)

### 2. Prepare TiDB cluster for running demos

Please prepare a local TiDB cluster or TiDB Serverless cluster for running demos.

#### (Option 1) Startup a local TiDB cluster

2.1 Install the TiDB component manager [TiUP](https://tiup.io) with the following command:

```shell
curl --proto '=https' --tlsv1.2 -sSf https://tiup-mirrors.pingcap.com/install.sh | sh
```

2.2 Use TiUP to start up a single-node TiDB cluster:

```shell
tiup playground
```

#### (Option 2) Startup a TiDB Serverless cluster