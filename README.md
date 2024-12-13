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

## Gallery
### Mocha
![image](https://github.com/user-attachments/assets/7d70c409-7be4-4886-987a-e1a31af67174)

![image](https://github.com/user-attachments/assets/c2dd7556-4ab0-4af4-94f7-f515e8bfb5bd)

![image](https://github.com/user-attachments/assets/ac6c9b32-9103-4e24-97f8-d90e3dff47dd)

![image](https://github.com/user-attachments/assets/c776e104-f7c2-46b4-8835-1af3b0040541)

![image](https://github.com/user-attachments/assets/f6e842de-b8b5-4c11-8a7c-f7de28926831)

### Macchiato
![image](https://github.com/user-attachments/assets/3a0e33c7-12a4-4ae9-ae66-69f0ff902ea4)

![image](https://github.com/user-attachments/assets/bc8b8bf7-9307-42bc-a776-75d4c2a4717f)

![image](https://github.com/user-attachments/assets/1ebca906-1617-4d0a-ad12-e08fcad57cdc)

![image](https://github.com/user-attachments/assets/3f033c09-574b-4c8b-984a-4d03a8806b01)





## Author
edjubert <edjubert@student.42.fr>
fldoucet <fldoucet@student.42.fr>
