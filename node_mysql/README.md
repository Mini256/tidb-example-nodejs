# TiDB Develop Guide with mysqljs/mysql

This guide will introduce how to use the Node.js library [mysqljs/mysql](https://github.com/mysqljs/mysql) to develop and build applications with TiDB as the underlying database.

Next, this guide will introduce the features of TiDB through sample codes. Because of TiDB's compatibility with the MySQL protocol, most of the examples are also applicable to MySQL and MariaDB databases.

## Table of Content

- [Prerequisites](#prerequisites) (If you don't know how to run the sample code, please read it)
- [Connect with options](./src/connect-with-options/README.md)
- [Connect with url](./src/connect-with-url/README.md)
- [Connect with SSL options](./src/connect-with-ssl-options/README.md) (For TiDB Serverless, which requires SSL connection)
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

## Prerequisites

### 1. Prepare development environment

If you are developing in local, please install the following tools in advance:

- [MySQL Command-Line Client](https://dev.mysql.com/doc/refman/8.0/en/mysql.html)
- Node.js >= 16.x

Alternatively, you can use the cloud-native development environment GitHub Codespaces or GitPod to open the sample code repository, where the above tools are already installed in advance.

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/pingcap-inc/tidb-example-nodejs)

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/pingcap-inc/tidb-example-nodejs)

### 2. Clone the repository

If you are developing in local, please clone the repository to your local machine:

```shell
git clone https://github.com/pingcap/tidb-example-nodejs.git
cd node_mysql
```

### 3. Install dependencies

Install the Node.js dependencies required by the sample code:

```shell
npm install
```

For your project, you can install `mysqljs/mysql` with the following command:

```shell
npm install mysql
```

### 4. Config environment variables

Copy out a `.env` file, and fill in your TiDB cluster connection information to the corresponding environment variables in the `.env` file:

```shell
cp .env.example .env
```

For example:

```
DATABASE_URL=mysql://xxxxxx.root:password@gateway01.us-west-2.prod.aws.tidbcloud.com:4000/test
TIDB_HOST=gateway01.us-west-2.prod.aws.tidbcloud.com
TIDB_PORT=4000
TIDB_USER=xxxxxx.root
TIDB_PASSWORD=password
TIDB_DATABASE=test
```

### 5. Run the sample code

After finishing the above steps, you can choose the chapter you are interested in the [Table of Content](#table-of-content) to learn, or learn one by one in the order of the [Table of Content](#table-of-content).

The sample code in each chapter will have a corresponding `npm run` command and a `README.md` file to explain the code.

You can directly run the npm command to run the sample code, for example:

```shell
npm run demo:connect-with-options
```

Or you can see the detailed description of the code in `README.md` file, for example: [Connect with options](./src/connect-with-options/README.md)
