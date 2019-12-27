<h1 align="center">🌞 sunriset</h1>

<p align="center">通过日期和经纬度，计算日出和日落的时间。</p>

<p align="center">
  <a href="https://www.npmjs.com/package/sunriset" target="_blank" rel="noopener noreferrer">
    <img alt="npm" src="https://img.shields.io/npm/v/sunriset.svg?style=flat-square">
  </a>
  <a href="https://www.npmjs.com/package/sunriset" target="_blank" rel="noopener noreferrer">
    <img alt="npm" src="https://img.shields.io/npm/dt/sunriset.svg?style=flat-square">
  </a>
</p>

[English](https://github.com/liuyib/sunriset/blob/master/README.md) | [简体中文](https://github.com/liuyib/sunriset/blob/master/README-zh-Hans.md)

## :cloud: 安装

```bash
# npm
npm install --save sunriset

# yarn
yarn add sunriset
```

也支持 CDN 引用:

```html
<script src="https://www.jsdelivr.com/package/npm/sunriset"></script>
```

## :package: 使用

支持 `UMD` 打包规范：

```js
import sunriset from 'sunriset';

// OR

const sunriset = require('sunriset');
```

使用举例:

```js
import sunriset from 'sunriset';

// Sunrise and sunset times of Beijing, December 27, 2019.
const longitude = 116.404;
const latitude = 39.908;

const getSuntime = sunriset(new Date(), latitude, longitude);
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

## :memo: 文档

### `sunriset(date, lat, lon)`

通过日期和经纬度，计算日出和日落的时间。

#### 参数

- **Date** `date`: 日期
- **Number** `lat`: 维度
- **Number** `lon`: 经度

#### 返回值

- **Object**:
  - `sunrise` (Object):
    - `raw_time` (Array): 一个数组，包含两个数字（小时和分钟）
    - `time` (String): 格式化的日出时间（`HH:mm`）
  - `sunset` (Object):
    - `raw_time` (Array): 一个数组，包含两个数字（小时和分钟）
    - `time` (String): 格式化的日落时间（`HH:mm`）
  - `date` (Date): 输入的日期
  - `coordinates` (Array): 输入的经纬度

## :handshake: 开源协议

[MIT](https://github.com/liuyib/sunriset/blob/master/LICENSE) Copyright (c) 2019 [liuyib](https://github.com/liuyib/)
