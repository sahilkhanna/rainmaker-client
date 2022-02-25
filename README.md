# rainmaker-client

A NodeJs Package for interfacing Espressif Rainmaker IoT.

## Install

```bash
npm install rainmaker-client
```

## Usage

```js
import RainMaker from "rainmaker-client";
const client = new RainMaker("username", "password");

const SUCCESS = 200;

async function isAuth() {
  const { status, result } = await client.authenticate();
  if (status == SUCCESS) {
    console.log(result);
  } else {
    console.log(result);
  }
}
isAuth();
```

## Authenticate

`authenticate` method is used to get accesstoken for Authnticated APIs. Pass `true` as param to extend session using `refreshtoken` instead of `password`.

Stored `refreshtoken` can be retrieved by :

```js
const token = client.refreshtoken;
```

## User Nodes

`getUserNodes` returns a list of nodes associated to the user. Pass argument true to get details information for the nodes.

## Time Series Data

`getTimeSeriesData` returns time series data for a specific node. Currently it only supports aggregate = `raw`.

## Demo

This package is being developed to create a webApp dashboard for ESP Rainmaker IoT solution. Checkout the link below -

[Rainmaker IoT Dashboard](https://sahilkhanna.github.io/rainmaker-iot-dashboard/)

## Quick links

- [ESP Rainmaker](https://rainmaker.espressif.com/)
- [API Definitions for RainMaker Backend Service](https://swaggerapis.rainmaker.espressif.com/)
