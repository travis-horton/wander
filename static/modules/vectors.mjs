export default class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  minus(v) {
    return new Vector(this.x - v.x, this.y - v.y);
  }

  plus(v) {
    return new Vector(this.x + v.x, this.y + v.y);
  }

  times(v) {
    return new Vector(this.x * v, this.y * v);
  }

  norm() {
    return new Vector(this.x / this.length(), this.y / this.length());
  }

  length() {
    return (Math.sqrt((this.x * this.x) + (this.y * this.y)));
  }

  rotate(d) {
    return new Vector(
      this.x * (Math.cos(d)) - this.y * (Math.sin(d)),
      this.y * (Math.cos(d)) + this.x * (Math.sin(d)),
    );
  }
}
