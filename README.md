# Update Local Table from Google Spreadsheets

This project borrows from [Knex](knexjs.org) for table definitions, [Bookshelf](bookshelfjs.org) for SQL ORM modelling, [Ghost](https://ghost.org/) table definition migrations, and uses [Google Sheets API v4](https://developers.google.com/sheets/api/).

This document describes steps to setup and use this updater CLI tool (2 minute read).

## Setup

This program requires a MySQL database and a set of OAuth client credentials for accessing Google Spreadsheets API. The instructions assume you are in the directory of the node package (in the directory containing `package.json`).

Fill out .env file (no spaces around `=`):

```bash
$ cat template.env | tee .env
dbhost=
dbuser=
dbpass=
dbname=
```

Then edit the `.env` file w/ database name, username, password (you probably want `dbhost=127.0.0.1`).

If necessary, setup a new database:

```bash
$ dbname="justatest"
$ read user
$ read pass
$ mysql -u$user -p$pass -e "create database if not exists $dbname;"
mysql: [Warning] Using a password on the command line interface can be insecure.
```

Lastly, if you need to get new credentials:

> TODO: write this section. contact daveankin@gmail.com for now.
> 
> The steps I followed are outlined [here](https://developers.google.com/sheets/api/quickstart/nodejs). The `client_secret.json` file belongs in the same directory as `package.json`.

## Usage

```bash
$ npm run
```
