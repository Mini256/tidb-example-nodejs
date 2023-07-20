# TiDB Develop Guide with mysqljs/mysql

This guide will introduce how to use the Node.js library [node-mysql2](https://github.com/sidorares/node-mysql2) to develop and build applications with TiDB as the underlying database.

Next, this guide will introduce the features of TiDB through sample codes. Because of TiDB's compatibility with the MySQL protocol, most of the examples are also applicable to MySQL and MariaDB databases.

## Table of Content

- [Prerequisites](#prerequisites)
- [Examples](#examples)

## Prerequisites

### 1. Prepare development environment

If you are developing in local, please install the following programs in advance:

- Node.js >= 16.x

Alternatively, you can use the cloud-native development environment like GitHub Codespaces or GitPod to open the sample code repository, where the above programs are already installed in advance.

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/pingcap-inc/tidb-example-nodejs)

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/pingcap-inc/tidb-example-nodejs)

### 2. Clone the repository

If you are developing in local, please clone the repository to your local machine (Skip if you use GitHub Codespaces or GitPod):

```shell
git clone https://github.com/pingcap/tidb-example-nodejs.git
cd node_mysql2
```

### 3. Install dependencies

Install the Node.js dependencies required by the sample code (Skip if you use GitHub Codespaces or GitPod):

```shell
npm install
```

### 4. Config environment variables

Copy the `.env` file from `.env.example` file, and configure the connection URL by set up the `DATABASE_URL` variable in the `.env` file as the following format:

```dotenv
DATABASE_URL=mysql://USERNAME:PASSWORD@HOST:PORT/DB_NAME?<KEY1>=<VALUE1>&<KEY2>=<VALUE2>
```

> **Note:**
> If you are connecting to a **TiDB Cloud Serverless cluster**, you MUST enable the SSL connection arguments, see [With SSL Connection Arguments](#with-ssl-connection-arguments-required-for-tidb-cloud-serverless).

<details>

<summary>Example</summary>

Here is an example of connecting to a local TiDB Playground cluster:

```dotenv
DATABASE_URL=mysql://root:password@127.0.0.1:4000/test
```

</details>

#### With SSL Connection Arguments (Required for TiDB Cloud Serverless)

To establish an SSL (TLS) connection to the TiDB cluster, you can append the query string `?ssl={"minVersion": "TLSv1.2", "rejectUnauthorized":true}` to the path in the connection string:

```dotenv
DATABASE_URL=mysql://USERNAME:PASSWORD@HOST:PORT/DB_NAME?ssl={"minVersion":"TLSv1.2","rejectUnauthorized":true}
```

<details>

<summary>Example</summary>

Here is an example of connecting to a TiDB Cloud Serverless cluster:

```dotenv
DATABASE_URL=mysql://xxxxx.root:password@gateway01.us-west-2.prod.aws.tidbcloud.com:4000/test?ssl={"minVersion":"TLSv1.2","rejectUnauthorized":true}
```

</details>

## Examples

- [Connect with Connection URL](./src/connect-with-url/README.md)
- [Connect with Connection Options](./src/connect-with-options/README.md)
- [Connect with SSL Connection Options](./src/connect-with-ssl-options/README.md)
- [Simple Example](./src/simple/README.md)
- [Query data](./src/query-data/README.md)
- [Insert data](./src/insert-data/README.md)
- [Bulk insert data](./src/bulk-insert-data/README.md)
- [Update data](./src/update-data/README.md)
- [Bulk update data](./src/bulk-update-data/README.md)
- [Delete data](./src/delete-data/README.md)
- [Bulk delete data](./src/bulk-delete-data/README.md)
- [Transaction](./src/transaction/README.md)
- [Optimistic Transaction](./src/transaction-optimistic/README.md)
- [Pessimistic Transaction](./src/transaction-pessimistic/README.md)
- [Resolve the Write Skew Problem](./src/transaction-write-skew/README.md)

## Read more

- [TiDB Documentation](https://docs.pingcap.com/tidb/stable)
- [node-mysql2 Documentation](https://github.com/sidorares/node-mysql2)
