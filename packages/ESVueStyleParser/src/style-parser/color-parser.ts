/*
 * Tencent is pleased to support the open source community by making
 * Hippy available.
 *
 * Copyright (C) 2017-2022 THL A29 Limited, a Tencent company.
 * All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* eslint-disable no-bitwise */
/* eslint-disable no-mixed-operators */
import { namedColors } from "./named-colors";

export interface ColorType {
  [key: string]: number;
}

const convertRegExp = (...args: string[]) => `\\(\\s*(${args.join(")\\s*,\\s*(")})\\s*\\)`;

const NUMBER = "[-+]?\\d*\\.?\\d+";
const PERCENTAGE = `${NUMBER}%`;

const matchers = {
  rgb: new RegExp(`rgb${convertRegExp(NUMBER, NUMBER, NUMBER)}`),
  rgba: new RegExp(`rgba${convertRegExp(NUMBER, NUMBER, NUMBER, NUMBER)}`),
  hsl: new RegExp(`hsl${convertRegExp(NUMBER, PERCENTAGE, PERCENTAGE)}`),
  hsla: new RegExp(`hsla${convertRegExp(NUMBER, PERCENTAGE, PERCENTAGE, NUMBER)}`),
  hex3: /^#([0-9a-fA-F])([0-9a-fA-F])([0-9a-fA-F])$/,
  hex4: /^#([0-9a-fA-F])([0-9a-fA-F])([0-9a-fA-F])([0-9a-fA-F])$/,
  hex6: /^#([0-9a-fA-F]{6})$/,
  hex8: /^#([0-9a-fA-F]{8})$/,
};

const parse255 = (str: string) => {
  const int = parseInt(str, 10);
  if (int < 0) {
    return 0;
  }
  if (int > 255) {
    return 255;
  }
  return int;
};

const parse1 = (str: string) => {
  const num = parseFloat(str);
  if (num < 0) {
    return 0;
  }
  if (num > 1) {
    return 255;
  }
  return Math.round(num * 255);
};

const hue2rgb = (p: number, q: number, tx: number) => {
  let t = tx;
  if (t < 0) {
    t += 1;
  }
  if (t > 1) {
    t -= 1;
  }
  if (t < 1 / 6) {
    return p + (q - p) * 6 * t;
  }
  if (t < 1 / 2) {
    return q;
  }
  if (t < 2 / 3) {
    return p + (q - p) * (2 / 3 - t) * 6;
  }
  return p;
};

const hslToRgb = (h: number, s: number, l: number) => {
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const r = hue2rgb(p, q, h + 1 / 3);
  const g = hue2rgb(p, q, h);
  const b = hue2rgb(p, q, h - 1 / 3);

  return (Math.round(r * 255) << 24) | (Math.round(g * 255) << 16) | (Math.round(b * 255) << 8);
};

const parse360 = (str: string) => {
  const int = parseFloat(str);
  return (((int % 360) + 360) % 360) / 360;
};

const parsePercentage = (str: string) => {
  const int = parseFloat(str);
  if (int < 0) {
    return 0;
  }
  if (int > 100) {
    return 1;
  }
  return int / 100;
};

// eslint-disable-next-line complexity
function baseColor(color: string | number) {
  let match;

  if (typeof color === "number") {
    if (color >>> 0 === color && color >= 0 && color <= 0xffffffff) {
      return color;
    }
    return null;
  }

  match = matchers.hex6.exec(color);
  if (Array.isArray(match)) {
    return parseInt(`${match[1]}ff`, 16) >>> 0;
  }

  if (Object.hasOwnProperty.call(namedColors, color)) {
    return namedColors[color];
  }

  match = matchers.rgb.exec(color);
  if (Array.isArray(match)) {
    return (
      ((parse255(match[1]) << 24) | // r
        (parse255(match[2]) << 16) | // g
        (parse255(match[3]) << 8) | // b
        0x000000ff) >>> // a
      0
    );
  }

  match = matchers.rgba.exec(color);
  if (match) {
    return (
      ((parse255(match[1]) << 24) | // r
        (parse255(match[2]) << 16) | // g
        (parse255(match[3]) << 8) | // b
        parse1(match[4])) >>> // a
      0
    );
  }

  match = matchers.hex3.exec(color);
  if (match) {
    return (
      parseInt(
        `${
          match[1] +
          match[1] + // r
          match[2] +
          match[2] + // g
          match[3] +
          match[3] // b
        }ff`, // a
        16,
      ) >>> 0
    );
  }

  match = matchers.hex8.exec(color);
  if (match) {
    return parseInt(match[1], 16) >>> 0;
  }

  match = matchers.hex4.exec(color);
  if (match) {
    return (
      parseInt(
        match[1] +
          match[1] + // r
          match[2] +
          match[2] + // g
          match[3] +
          match[3] + // b
          match[4] +
          match[4], // a
        16,
      ) >>> 0
    );
  }

  match = matchers.hsl.exec(color);
  if (match) {
    return (
      (hslToRgb(
        parse360(match[1]), // h
        parsePercentage(match[2]), // s
        parsePercentage(match[3]), // l
      ) |
        0x000000ff) >>> // a
      0
    );
  }

  match = matchers.hsla.exec(color);
  if (match) {
    return (
      (hslToRgb(
        parse360(match[1]), // h
        parsePercentage(match[2]), // s
        parsePercentage(match[3]), // l
      ) |
        parse1(match[4])) >>> // a
      0
    );
  }

  return null;
}

/**
 * Convert css color value or string description to native supported color format
 *
 * @param color - color value or string description
 * @param options - options
 *
 * @public
 */
export function translateColor(
  color: string | number,
  options: { platform?: string } = {},
): number {
  let int32Color = baseColor(color);

  if (int32Color === null) {
    throw new Error(`Bad color value: ${color}`);
  }

  int32Color = ((int32Color << 24) | (int32Color >>> 8)) >>> 0;

  // the android platform color needs to be processed
  if (options?.platform === "android") {
    int32Color |= 0;
  }

  return int32Color;
}
