(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.suntime = factory());
}(this, (function () { 'use strict';

  var PI = Math.PI;
  var DR = PI / 180;
  var K1 = 15 * DR * 1.0027379; // Local Sidereal Time for zone

  var lst = function lst(lon, jd, z) {
    var s = 24110.5 + 8640184.812999999 * jd / 36525 + 86636.6 * z + 86400 * lon;
    s = s / 86400;
    s = s - Math.floor(s);
    return s * 360 * DR;
  }; // returns value for sign of argument


  var sgn = function sgn(x) {
    return x > 0 ? 1 : x < 0 ? -1 : 0;
  }; // format a positive integer with leading zeroes


  var zintstr = function zintstr(num, width) {
    var str = num.toString(10);
    var len = str.length;
    var intgr = '';

    for (var i = 0; i < width - len; i++) {
      intgr += '0';
    }

    for (var _i = 0; _i < len; _i++) {
      intgr += str.charAt(_i);
    }

    return intgr;
  };
  /**
   * suntime
   * Calculate sunset and sunrise times for given date and coordinates.
   *
   * @param {Date} d The date you want to find the sun data for.
   * @param {Number} lat The latitude.
   * @param {Number} lon The longitude.
   * @returns {Object} An object containing:
   *    - `sunrise` (Object):
   *      - `raw_time` (Array): An array of two numbers (hours and minutes)
   *      - `time` (String): Formatted sunrise time (`HH:mm`)
   *    - `sunset` (Object):
   *      - `raw_time` (Array): An array of two numbers (hours and minutes)
   *      - `time` (String): Formatted sunset time (`HH:mm`)
   *    - `date` (Date): The provided date.
   *    - `coordinates` (Array): An array of latitude and longitude values.
   *
   */


  var main = function suntime(d, lat, lon) {
    var Rise_time = [0, 0];
    var Set_time = [0, 0];
    var Sunrise = false;
    var Sunset = false;
    var Rise_az = 0.0;
    var Set_az = 0.0;
    var Sky = [0.0, 0.0];
    var RAn = [0.0, 0.0, 0.0];
    var Dec = [0.0, 0.0, 0.0];
    var VHz = [0.0, 0.0, 0.0]; // determine Julian day from calendar date
    // (Jean Meeus, "Astronomical Algorithms", Willmann-Bell, 1991)

    var julian_day = function julian_day(d) {
      var a, b, jd;
      var gregorian;
      var year = d.getFullYear();
      var month = d.getMonth() + 1;
      var day = d.getDate();
      gregorian = year < 1583 ? false : true;

      if (month == 1 || month == 2) {
        year = year - 1;
        month = month + 12;
      }

      a = Math.floor(year / 100);

      if (gregorian) {
        b = 2 - a + Math.floor(a / 4);
      } else {
        b = 0.0;
      }

      jd = Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + b - 1524.5;
      return jd;
    }; // test an hour for an event


    var test_hour = function test_hour(k, zone, t0, lat) {
      var ha = new Array(3);
      var a, b, c, d, e, s, z;
      var hr, min, time;
      var az, dz, hz, nz;
      ha[0] = t0 - RAn[0] + k * K1;
      ha[2] = t0 - RAn[2] + k * K1 + K1;
      ha[1] = (ha[2] + ha[0]) / 2; // hour angle at half hour

      Dec[1] = (Dec[2] + Dec[0]) / 2; // declination at half hour

      s = Math.sin(lat * DR);
      c = Math.cos(lat * DR);
      z = Math.cos(90.833 * DR); // refraction + sun semidiameter at horizon

      if (k <= 0) {
        VHz[0] = s * Math.sin(Dec[0]) + c * Math.cos(Dec[0]) * Math.cos(ha[0]) - z;
      }

      VHz[2] = s * Math.sin(Dec[2]) + c * Math.cos(Dec[2]) * Math.cos(ha[2]) - z;

      if (sgn(VHz[0]) == sgn(VHz[2])) {
        return VHz[2]; // no event this hour
      }

      VHz[1] = s * Math.sin(Dec[1]) + c * Math.cos(Dec[1]) * Math.cos(ha[1]) - z;
      a = 2 * VHz[0] - 4 * VHz[1] + 2 * VHz[2];
      b = -3 * VHz[0] + 4 * VHz[1] - VHz[2];
      d = b * b - 4 * a * VHz[0];

      if (d < 0) {
        return VHz[2]; // no event this hour
      }

      d = Math.sqrt(d);
      e = (-b + d) / (2 * a);

      if (e > 1 || e < 0) {
        e = (-b - d) / (2 * a);
      }

      time = k + e + 1 / 120; // time of an event

      hr = Math.floor(time);
      min = Math.floor((time - hr) * 60);
      hz = ha[0] + e * (ha[2] - ha[0]); // azimuth of the sun at the event

      nz = -Math.cos(Dec[1]) * Math.sin(hz);
      dz = c * Math.sin(Dec[1]) - s * Math.cos(Dec[1]) * Math.cos(hz);
      az = Math.atan2(nz, dz) / DR;

      if (az < 0) {
        az = az + 360;
      }

      if (VHz[0] < 0 && VHz[2] > 0) {
        Rise_time[0] = hr;
        Rise_time[1] = min;
        Rise_az = az;
        Sunrise = true;
      }

      if (VHz[0] > 0 && VHz[2] < 0) {
        Set_time[0] = hr;
        Set_time[1] = min;
        Set_az = az;
        Sunset = true;
      }

      return VHz[2];
    }; // sun's position using fundamental arguments
    // (Van Flandern & Pulkkinen, 1979)


    var sun = function sun(jd, ct) {
      var g, lo, s, u, v, w;
      lo = 0.779072 + 0.00273790931 * jd;
      lo = lo - Math.floor(lo);
      lo = lo * 2 * PI;
      g = 0.993126 + 0.0027377785 * jd;
      g = g - Math.floor(g);
      g = g * 2 * PI;
      v = 0.39785 * Math.sin(lo);
      v = v - 0.01 * Math.sin(lo - g);
      v = v + 0.00333 * Math.sin(lo + g);
      v = v - 0.00021 * ct * Math.sin(lo);
      u = 1 - 0.03349 * Math.cos(g);
      u = u - 0.00014 * Math.cos(2 * lo);
      u = u + 0.00008 * Math.cos(lo);
      w = -0.0001 - 0.04129 * Math.sin(2 * lo);
      w = w + 0.03211 * Math.sin(g);
      w = w + 0.00104 * Math.sin(2 * lo - g);
      w = w - 0.00035 * Math.sin(2 * lo + g);
      w = w - 0.00008 * ct * Math.sin(g);
      s = w / Math.sqrt(u - v * v); // compute sun's right ascension

      Sky[0] = lo + Math.atan(s / Math.sqrt(1 - s * s));
      s = v / Math.sqrt(u); // ...and declination

      Sky[1] = Math.atan(s / Math.sqrt(1 - s * s));
    };

    var zone = Math.round(d.getTimezoneOffset() / 60);
    var jd = julian_day(d) - 2451545; // Julian day relative to Jan 1.5, 2000

    if (sgn(zone) === sgn(lon) && zone) {
      return {
        error: 'Invalid input data.'
      };
    }

    lon = lon / 360;
    var tz = zone / 24;
    var ct = jd / 36525 + 1; // centuries since 1900.0

    var t0 = lst(lon, jd, tz); // local sidereal time

    jd += tz; // get sun position at start of day

    sun(jd, ct);
    var ra0 = Sky[0];
    var dec0 = Sky[1];
    ++jd; // get sun position at end of day

    sun(jd, ct);
    var ra1 = Sky[0];
    var dec1 = Sky[1]; // make continuous

    if (ra1 < ra0) {
      ra1 += 2 * PI;
    }

    RAn[0] = ra0;
    Dec[0] = dec0; // check each hour of this day

    for (var k = 0; k < 24; ++k) {
      RAn[2] = ra0 + (k + 1) * (ra1 - ra0) / 24;
      Dec[2] = dec0 + (k + 1) * (dec1 - dec0) / 24;
      VHz[2] = test_hour(k, zone, t0, lat); // advance to next hour

      RAn[0] = RAn[2];
      Dec[0] = Dec[2];
      VHz[0] = VHz[2];
    }

    var result = {}; // This will create the sunset and sunrise fields in the return object

    var setSunriseOrSunset = function setSunriseOrSunset(key, time, az) {
      var item = result[key] = {
        raw_time: time,
        angle: az
      };
      item.time = zintstr(time[0], 2) + ':' + zintstr(time[1], 2);
      item.formatted = "".concat(item.raw_time[0], ":").concat(item.raw_time[1], ", az = ").concat(item.angle, "\xB0");
    };

    setSunriseOrSunset('sunrise', Rise_time, Rise_az);
    setSunriseOrSunset('sunset', Set_time, Set_az); // Special message

    if (!Sunrise && !Sunset) {
      if (VHz[2] < 0) {
        result.special_message = 'The sun is under the horizon the whole day.';
      } else {
        result.special_message = 'The sun is above the horizon the whole day.';
      }
    } else {
      if (!Sunrise) {
        result.special_message = "The sun doesn't rise.";
      } else if (!Sunset) {
        result.special_message = "The sun doesn't set.";
      }
    }

    result.date = d;
    result.coordinates = [lat, lon];
    return result;
  };

  return main;

})));
