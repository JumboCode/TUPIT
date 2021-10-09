# Back-end

The back-end for TUPIT!

## Quick Start

Get your dev environment set up quickly and _hopefully_ painlessly.

1. Requirements: Python >=3.6
2. Create a Python virtual environment: `python3 -m venv env`
3. Activate the new environment: `source env/bin/activate` (you must do this every time you open a new terminal instance)
4. Install Python reqs: `pip install -r requirements.txt`

## PostgreSQL Setup

Set up a Postgre dev server on your machine to act as your database.

Linux:

1. Install PostgreSQL and other dependencies: `sudo apt install postgresql postgresql-contrib libpq-dev`
2. Activate Python virtual env: `source env/bin/activate`
3. Install Python dependencies: `pip install psycopg2`
4. Start PostgreSQL service: `sudo service postgresql start`
5. Use postgres user: `sudo su - postgres`
6. Launch Postgres shell: `psql`
7. Create TUPIT database: `CREATE DATABASE tupit;`
8. Create admin user: `CREATE USER admin WITH PASSWORD 'jctupit';`
9. Give admin all privelages: `GRANT ALL PRIVILEGES ON DATABASE tupit TO admin;`
10. Exit shell: `\q`
11. Exit postgres user: `exit`
12. Finally make Django migrations!

Mac:

1. Install Homebrew `https://brew.sh/`
2. Install PostgreSQL: `brew install postgresql postgis libpq`
3. Install Python dependencies: `pip install -r requirements.txt`
4. Start PostgreSQL service: `brew services start postgresql`
5. Enter PostgreSQL shell: `psql -d postgres`
6. Create TUPIT database: `CREATE DATABASE tupit;`
7. Exit shell: `\q`
8. Enter tupit database: `psql -d tupit`
9. Create admin user: `CREATE USER admin WITH PASSWORD 'jctupit';`
10. Give admin all privelages: `GRANT ALL PRIVILEGES ON DATABASE tupit TO admin;`
11. Exit shell: `\q`
12. Finally make Django migrations!

## Make Django Migrations

1. `python manage.py makemigrations`
2. `python manage.py migrate`

## Troubleshooting

Some common issues with simple solutions.

`django.db.utils.OperationalError: could not connect to server: Connection refused`

- The PostgreSQL service is not started.
- Start the service: `sudo service postgresql start`
