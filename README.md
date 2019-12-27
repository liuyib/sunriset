<h3 align="center" style="font-size: 2em;">🌞 suntime</h3>

<p align="center">Calculate sunrise and sunset times for a given date and location.</p>

<p align="center">
  <a href="http://standardjs.com" target="_blank" rel="noopener noreferrer">
    <img alt="npm" src="https://img.shields.io/npm/v/suntime.svg?style=flat-square">
  </a>
  <a href="http://standardjs.com" target="_blank" rel="noopener noreferrer">
    <img alt="npm" src="https://img.shields.io/npm/dt/suntime.svg?style=flat-square">
  </a>
</p>

[English](https://github.com/liuyib/suntime/blob/master/README.md) | [简体中文](https://github.com/liuyib/suntime/blob/master/README-zh-Hans.md)

## :cloud: Installation

```bash
# npm
npm install --save suntime

# yarn
yarn add suntime
```

## :package: Usage

Support `UMD` packaging specification:

```js
import suntime from 'suntime';

// OR

const suntime = require('suntime');
```

Example:

```js
import suntime from 'suntime';

// Sunrise and sunset times of Beijing, December 27, 2019.
const longitude = 116.404;
const latitude = 39.908;

const getSuntime = suntime(new Date(), latitude, longitude);
// {
//   sunrise: {
//     raw_time: [7, 35],
//     angle: 120.28914956738069,
//     time: '07:35',
//     formatted: '7:35, az = 120.28914956738069°',
//   },
//   sunset: {
//     raw_time: [16, 56],
//     angle: 239.73664214319098,
//     time: '16:56',
//     formatted: '16:56, az = 239.73664214319098°',
//   },
//   date: '2019-12-27T01:25:08.897Z',
//   coordinates: [39.908, 0.32334444444444443],
// }
```

Also support CDN:

```html
<script src="https://www.jsdelivr.com/package/npm/suntime"></script>
```

## :memo: Documentation

### `suntime(date, lat, lon)`

Calculate sunrise and sunset times for a given date and location.

#### Params

- **Date** `date`: The date you want to find the sun data for.
- **Number** `lat`: The latitude.
- **Number** `lon`: The longitude.

#### Return

- **Object** An object containing:
  - `sunrise` (Object):
    - `raw_time` (Array): An array of two numbers (hours and minutes)
    - `time` (String): Formatted sunrise time (`HH:mm`)
  - `sunset` (Object):
    - `raw_time` (Array): An array of two numbers (hours and minutes)
    - `time` (String): Formatted sunset time (`HH:mm`)
  - `date` (Date): The provided date.
  - `coordinates` (Array): An array of latitude and longitude values.

## :handshake: License

[MIT](https://github.com/liuyib/suntime/blob/master/LICENSE) Copyright (c) 2019 [liuyib](https://github.com/liuyib/)
