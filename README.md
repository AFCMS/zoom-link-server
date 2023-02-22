# ZOOM Link Server

Simple Zoom link sharing server.

Uses the following technologies:

-   **Golang** with the **Fiber** and **GORM** frameworks for the backend
-   **ReactJS** for frontend with the **Vite** framework.
-   **TailwindCSS** for all CSS

## Running

You first need to build the frontend.

You need NodeJS v18 installed.

```sh
cd frontend && npm install --include=dev && npm run build && cd ..
```

Then you will need to build the backend.

You need Go 1.19 installed.

For your machine:

```sh
go build -o zoom-link-server
```

For ARM systems (like RasberryPi):

```sh
env GOOS=linux GOARCH=arm GOARM=5 go build -o zoom-link-server-arm
```

Then running the server is as simple as:

```sh
./zoom-link-server
```

You can configure host and port in a `.env.local`, default to `localhost` and `30000`.

## Production Setup

There are no dependencies needed to run the server.

You need only the result of the frontend build (the `./frontend/build` folder after running `npm run build`) and the binary compiled for your system.

Here is an exemple file tree:

```
 ├──    .env.local
 └──    frontend/
 │  └────    assets/
 │  │  ├────    index-564d9bf7.css
 │  │  └────    index-f8707454.js
 │  ├────    index.html
 │  ├────    robots.txt
 │  └────    zoom-link-server-icon.png
 └──    zoom-link-server
```

The database is a SQLite database stored in the same folder and named `database.db`.

You can found an exemple Systemd Unit file in the repo, you may need to edit the file path.

## Credits

<a href="https://www.flaticon.com/free-icons/zoom" title="zoom icons">Zoom icons created by Enamo Studios - Flaticon</a>
