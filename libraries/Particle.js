function hslToRgb(h, s, l) {
  var r, g, b;

  if (s == 0) {
    r = g = b = l; // achromatic
  } else {
    var hue2rgb = function hue2rgb(p, q, t) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    var p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

class Particle {
  constructor() {
    this.pos = createVector(random(0, width), random(0, height));
    this.prevPos = this.pos.copy();

    this.vel = p5.Vector.random2D();
    this.acc = createVector(0, 0);
    this.maxSpeed = 4;

    this.age = 0;
    this.ageRate = 0.01;

    this.alpha = 2;
    this.color = 255;
  }

  update() {
    this.handleFlow();
    this.handleMotion();

    // If we handle edges, update right away to avoid lines accross screen
    this.handleEdges() && this.updatePrev();

    this.handleColor();
    this.draw();
    this.updatePrev();

    this.age += this.ageRate;
  }

  handleColor() {
    const h = (noise(this.age) * 2) % 1;
    this.color = hslToRgb(h, 1, 0.5);
    // console.log(this.color);
  }

  handleMotion() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);

    this.vel.limit(this.maxSpeed);
  }

  updatePrev() {
    this.prevPos.x = this.pos.x;
    this.prevPos.y = this.pos.y;
  }

  handleFlow() {
    const x = floor(this.pos.x / scale);
    const y = floor(this.pos.y / scale);
    const index = x + y * cols;

    const force = flowField[index];

    this.applyForce(force);
  }

  applyForce(force) {
    this.acc.add(force);
  }

  draw() {
    strokeWeight(1);
    stroke(this.color[0], this.color[1], this.color[2], this.alpha);
    line(this.prevPos.x, this.prevPos.y, this.pos.x, this.pos.y);
  }

  handleEdges() {
    let handled = false;

    if (this.pos.x < 0) {
      this.pos.x = width;
      handled = true;
    }

    if (this.pos.x > width) {
      this.pos.x = 0;
      handled = true;
    }
    if (this.pos.y < 0) {
      this.pos.y = height;
      handled = true;
    }
    if (this.pos.y > height) {
      this.pos.y = 0;
      handled = true;
    }

    return handled;
  }
}
