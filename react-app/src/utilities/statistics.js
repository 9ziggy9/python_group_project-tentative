export class Simulation {
  constructor(history, fn=x=>x) {
    this.realtime = [...history];
    this.interval = this.realtime.length;
    this.fn = fn;
    this.domain = this.realtime.map(datapoint => datapoint.time);
    this.range = this.realtime.map(datapoint => datapoint.price);
  }

  map_domain(domain) {
    return domain.map(x => this.fn(x))
  }

  proceed() {
    const uTime = Date.now()
    this.realtime = [...this.realtime.slice(1),
                     {time: uTime, price: this.fn(Math.floor(uTime / 1000))}];

    this.domain = this.realtime.map(datapoint => datapoint.time);
    this.range = this.realtime.map(datapoint => datapoint.price);

    return {domain: this.domain, range: this.range}
  }
}

export class LiveCrypto {
  constructor(interval,api) {
    this.start = 0;
    this.interval = interval;
    this.api = api;
    this.domain = [...Array(interval).keys()];
    this.range = [];
  }

  proceed() {
    const domain = [];

    for(let x = this.start; x < this.interval; x++)
      domain.push(x);

    this.domain = domain;
    this.range = [...this.range.slice(1), this.api()];

    this.start++;
    this.interval++;

    return {domain: this.domain, range: this.range}
  }
}

export function gauss_boxmuller() {
  let x = 0;
  let y = 0;
  while(x===0) x = Math.random();
  while(y===0) y = Math.random();
  return Math.sqrt(-2.0 * Math.log(x)) * Math.cos(2.0 * Math.PI * y);
}

export function log_normal() {
  return Math.exp(gauss_boxmuller());
}

export const rand_walk = x => {
  const sgn = Math.pow(-1, Math.floor(2*Math.random()));
  const step = sgn * Math.floor(4*Math.random());
  return x + step < 0 ? 0 : x + step;
}
