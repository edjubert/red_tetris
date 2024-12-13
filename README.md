# Red Tetris
## Dependencies
- `pnpm`
- `docker`

## Start
### Generate .env
The backend need environment variables to run properly.
The file has to be located at `./back/.env`

Here is a template:
```dotenv
MARIADB_USER=<MARIADB_USER>
MARIADB_PASSWORD=<MARIADB_PASSWORD>
MARIADB_ROOT_PASSWORD=<MARIADB_ROOT_PASSWORD>
MARIADB_DB=<MARIADB_DB>
DB_HOST=<MARIADB_HOST>
DB_PORT=<MARIADB_PORT>
```

### Start the project
#### Dev
First of all, you need to start the database:
```shell
docker compose up mariadb -d
```

To start the backend, go to the `back` folder, install and run the project with the dev command:
```shell
cd ./back
pnpm install
pnpm dev
```

To start the frontend, go to the `front` folder, install and run the project with the dev command:
```shell
cd ./front
pnpm install
pnpm dev
```

Go to http://localhost:5173

#### Production
The production mode is automated. Simply run from the root directory the following command:
```shell
docker compose up
```

Go to http://localhost:4173

## Author
edjubert <edjubert@student.42.fr>
fldoucet <fldoucet@student.42.fr>