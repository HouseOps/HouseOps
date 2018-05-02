<img src="https://svgshare.com/i/6W0.svg" alt="" data-canonical-src="https://svgshare.com/i/6W0.svg" width="200" />

# HouseOps (Alpha)
#### HouseOps is a unique Desktop ClickHouse Ops UI / IDE for OSX, Linux and Windows

Download [here for linux](https://github.com/HouseOps/HouseOps/releases/download/0.0.2-alpha/HouseOps_0.0.2_amd64.deb) and [here for windows](https://github.com/HouseOps/HouseOps/releases/download/0.0.2-alpha.1/HouseOps.Setup.0.0.2.exe) last alpha version.

### Features:
- Query builder;
- Database manangement (soon);
- Users manangement (soon);
- Real-Time Data Analytics (soon);
- Cluster/Infra monitoring (soon);
- Cluster manangement (soon);
- Kafka and Replicated tables monitoring (soon);

And a lot of others features (soon) for you take a beautiful implementation of ClickHouse S2.



*Yandex ClickHouse* is an open source column-oriented database management system capable of real time generation of analytical data reports using SQL queries, see more informations in https://clickhouse.yandex/.



HousOps is based on [Electron](http://electron.atom.io/), [React](https://facebook.github.io/react/), [Redux](https://github.com/reactjs/redux), [React Router](https://github.com/reactjs/react-router), [Webpack](http://webpack.github.io/docs/), [React Transform HMR](https://github.com/gaearon/react-transform-hmr) and [Ant Design](https://ant.design/) for rapid application development.

[![React](/internals/img/react-padded-90.png)](https://facebook.github.io/react/)
[![Webpack](/internals/img/webpack-padded-90.png)](https://webpack.github.io/)
[![Redux](/internals/img/redux-padded-90.png)](http://redux.js.org/)
[![React Router](/internals/img/react-router-padded-90.png)](https://github.com/ReactTraining/react-router)
[![Flow](/internals/img/flow-padded-90.png)](https://flowtype.org/)
[![ESLint](/internals/img/eslint-padded-90.png)](http://eslint.org/)
[![Jest](/internals/img/jest-padded-90.png)](https://facebook.github.io/jest/)
[![Yarn](/internals/img/yarn-padded-90.png)](https://yarnpkg.com/)
<img src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg" alt="" data-canonical-src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg" width="90" />
____

### Colaborate, please!
This project need UX/UI/Designers and React specialist.
See https://github.com/HouseOps/HouseOps/projects or/and open issue or/and send e-mail to jonatasfreitasv@gmail.com.
____

## Preview:
![alt text](https://image.ibb.co/jGvQJc/Screenshot_from_2018_04_26_03_39_58.png)

____

##### My motivation, message sent to Yandex team (https://github.com/yandex/ClickHouse/issues/2218):
```
Hello Yandex friends,

after several tests on ClickHouse, I felt the power of this tool.

I would like to thank the wonderful work done by the Yandex team.

We are already using the company where I work, Zenvia, and is bringing us great solutions for data analysis.

However we are having some difficulties in making it available for "non-technical" users to do querys, monitor features and everything else. For the tools of interaction with ClickHouse are very bad and full of bug (like Tabix).

ClickHouse has to have a tool similar to that of MemSQL for example, I'm sure it will greatly increase the use of ClickHouse throughout the community.

Thinking about that, I decided to start a project to make it possible, it's right at the beginning, but I have good visions of how it should be.

This is the initial repository -> https://github.com/jonatasfreitasv/HouseOps
The name I'm still thinking, if you have suggestions hehe :).

My vision with some features -> https://github.com/jonatasfreitasv/HouseOps/projects

I want to do something really relevant, to be proud of Yandex and your team.

If anyone wants to contribute to the project, I will be very grateful (jonatasfreitasv@gmail.com).

I need UX / UI and React professionals.

If you can publish this work so that I can get more contributors, I would appreciate it.

Thank you again, and go to work hard!!!
```

____

# Instructions for start development
This project use https://github.com/chentsulin/electron-react-boilerplate.

## Install

* **Note: requires a node version >= 7 and an npm version >= 4.**
* **If you have installation or compilation issues with this project, please see [our debugging guide](https://github.com/chentsulin/electron-react-boilerplate/issues/400)**

First, clone the repo via git:

```bash
git clone --depth=1 https://github.com/chentsulin/electron-react-boilerplate.git your-project-name
```

And then install dependencies with yarn.

```bash
$ cd your-project-name
$ yarn
```
**Note**: If you can't use [yarn](https://github.com/yarnpkg/yarn), run `npm install`.

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
