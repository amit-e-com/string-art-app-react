// src/models/Line.js

import Nail from './Nail';

export default class Line {
  constructor(fromNail, toNail) {
    this.from = fromNail;
    this.to = toNail;
  }
}
