# Back-end

The back-end for TUPIT!

## Quick Start

Get your dev environment set up quickly and _hopefully_ painlessly. We will install PostgreSQL and Python dependencies.

# Mac

1. Requirements:
   - [Python >=3.6](https://www.python.org/downloads/macos/)
   - [Homebrew](https://brew.sh/)
2. Install PostgreSQL: `brew install postgresql postgis libpq`
3. cd into backend/: `cd backend`
4. Create a Python virtual environment: `python3 -m venv env`
5. Activate the new environment: `source env/bin/activate` (you must do this every time you open a new terminal instance)
6. Install Python dependencies: `pip install -r requirements.txt`
7. Start PostgreSQL service: `brew services start postgresql`
8. Enter PostgreSQL shell: `psql -d postgres`
9. Create TUPIT database: `CREATE DATABASE tupit;`
10. Exit shell: `\q`
11. Enter tupit database: `psql -d tupit`
12. Create admin user: `CREATE USER admin WITH PASSWORD 'jctupit';`
13. Give admin all privileges: `GRANT ALL PRIVILEGES ON DATABASE tupit TO admin;`
14. Exit shell: `\q`
15. Finally make Django migrations!

# Linux

1. Requirements:
   - Python >=3.6
   - PostgreSQL
   - Install both: `sudo apt install python3 postgresql postgresql-contrib libpq-dev`
2. cd into backend/: `cd backend`
3. Create a Python virtual environment: `python3 -m venv env`
4. Activate the new environment: `source env/bin/activate`
5. Install Python dependencies: `pip install -r requirements.txt`
6. Start PostgreSQL service: `sudo service postgresql start`
7. Use postgres user: `sudo su - postgres`
8. Enter Postgres shell: `psql`
9. Create TUPIT database: `CREATE DATABASE tupit;`
10. Create admin user: `CREATE USER admin WITH PASSWORD 'jctupit';`
11. Give admin all privileges: `GRANT ALL PRIVILEGES ON DATABASE tupit TO admin;`
12. Exit shell: `\q`
13. Exit postgres user: `exit`
14. Finally make Django migrations!

## Make Django Migrations

If making migrations for the first time:

1. `python manage.py makemigrations`
2. `python manage.py migrate`

If just changing models:

1. `python manage.py makemigrations api`
2. `python manage.py migrate api`

## Start Django Server

1. Activate Python virtual environment
2. Start Django server: `python manage.py runserver`

## Troubleshooting

Some common issues with simple solutions.

```shell
django.db.utils.OperationalError: could not connect to server: Connection refused
```

- The PostgreSQL service is not started.
  - Mac:
    - `brew services start postgresql`
  - Linux:
    - `sudo service postgresql start`

```shell
File "manage.py", line 17
    ) from exc
         ^
SyntaxError: invalid syntax
```

- The Python virtual environment isn't activated
  - `source env/bin/activate`
- Or a Python dependency is missing
  - `pip install -r requirements.txt`

`[Error] Origin http://localhost:3000 is not allowed by Access-Control-Allow-Origin.`

- Use 127.0.0.1:3000 to connect to the frontend instead of localhost

## Nuke Database

If Django migrations have gone off the rails, dropping the PostgreSQL database almost always fixes things.

### Mac

1. Enter PostgreSQL shell: `psql -d postgres`
2. Drop database: `DROP DATABASE tupit;`
3. Create database: `CREATE DATABASE tupit;`
4. Give admin all privileges: `GRANT ALL PRIVILEGES ON DATABASE tupit TO admin;`
5. Exit shell: `\q`
6. Make migrations as described below.

### Linux

1. Use postgres user: `sudo su - postgres`
2. Enter Postgres shell: `psql`
3. Drop database: `DROP DATABASE tupit;`
4. Create database: `CREATE DATABASE tupit;`
5. Give admin all privileges: `GRANT ALL PRIVILEGES ON DATABASE tupit TO admin;`
6. Exit shell: `\q`
7. Make migrations as described below.

```shell
cd backend
source env/bin/activate
python manage.py makemigrations
python manage.py migrate
python manage.py makemigrations api
python manage.py migrate api
```
