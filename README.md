<img src="https://svgshare.com/i/6W0.svg" alt="" data-canonical-src="https://svgshare.com/i/6W0.svg" width="200" />

# HouseOps (Beta) 
#### Do science and monitoring your ClickHouse Database Cluster!

HouseOps is an enterprise ClickHouse Ops UI for you run querys, monitoring ClickHouse health and make a lot of others thinks.
<br/>
#### Contirbute
To-do list https://github.com/HouseOps/HouseOps/projects/5

Issues https://github.com/HouseOps/HouseOps/issues

<br/><br/>
### Download now
[Linux](http://bit.ly/2kHI3qD) | [OSX](http://bit.ly/2kFKwSv) | Windows soon (or `npm run dev`)
<br/><br/>

![preview](https://image.ibb.co/hPjCiJ/ezgif_com_gif_maker_1.gif)

<br /><br />

## About ClickHouse
*Yandex ClickHouse* is an open source peta-byte scale, column-oriented OLAP distributed database, capable of real time generation of analytical data reports using SQL queries, see more informations in https://clickhouse.yandex/. HouseOps is an third-party tool.

This project is listed in ClickHouse Official Documentation (https://clickhouse.yandex/docs/en/interfaces/third-party_gui).

<br /><br />

HousOps is based on [Electron](http://electron.atom.io/), [React](https://facebook.github.io/react/) and [Blueprint UI Toolkit](http://blueprintjs.com) for rapid application development.

<br /><br />

# How to start collaboration
Hi! If this project is helping you, help him too, HouseOps wants to be the best tool for ClickHouse.


## If you need, easy start a new ClickHouse test server with Docker
```
docker run -it --rm -p 8123:8123 --name clickhouse-server-house-ops yandex/clickhouse-server
```


## Clone this repo and install dependencies

* **Note: requires a node version >= 7 and an npm version >= 4.**

First, clone the repo via git:

```bash
git clone https://github.com/HouseOps/HouseOps.git
```

And then install dependencies with NPM.

```bash
$ cd HouseOps
$ npm install
```


## Run

Start the app in the `dev` environment. This starts the renderer process in [**hot-module-replacement**](https://webpack.js.org/guides/hmr-react/) mode and starts a webpack dev server that sends hot updates to the renderer process:

```bash
$ npm run dev
```

Alternatively, you can run the renderer and main processes separately. This way, you can restart one process without waiting for the other. Run these two commands **simultaneously** in different console tabs:

```bash
$ npm run start-renderer-dev
$ npm run start-main-dev
```


## Packaging

To package apps for the local platform:

```bash
$ npm run package
```

To package apps for all platforms:

First, refer to [Multi Platform Build](https://www.electron.build/multi-platform-build) for dependencies.

Then,
```bash
$ npm run package-all
```

To package apps with options:

```bash
$ npm run package -- --[option]
```

To run End-to-End Test

```bash
$ npm run build
$ npm run test-e2e
```

:bulb: You can debug your production build with devtools by simply setting the `DEBUG_PROD` env variable:
```bash
DEBUG_PROD=true npm run package
```

This project use https://github.com/chentsulin/electron-react-boilerplate.
