# ZOOM Link Server

Simple Zoom link sharing server.

Uses the following technologies:

-   **Golang** with the **Fiber** and **GORM** frameworks for the backend
-   **ReactJS** for frontend with the **Vite** framework.
-   **TailwindCSS** for all CSS

## Installation / Usage

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

## Credits

<a href="https://www.flaticon.com/free-icons/zoom" title="zoom icons">Zoom icons created by Enamo Studios - Flaticon</a>
