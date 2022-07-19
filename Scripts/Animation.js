var replace = function (desc, value) {
  var obj = window,
    arr = desc.split('.');
  while (arr.length > 1) { obj = obj[arr.shift()]; }
  return (obj[arr[0]] = value || obj[arr[0]]);
}, read = replace;

const PI = Math.PI;
const cos = Math.cos;
const constrain = (aNumber, aMin, aMax) => aNumber > aMax ? aMax : aNumber < aMin ? aMin : aNumber;
const lerp = (value1, value2, amt) => ((value2 - value1) * amt) + value1;
const pause = t => t === 1 ? t : 0;
const linear = t => t;
const ease = t => 0.5 - cos(PI * t) / 2;
const easein = t => cos((1.0 - t) * PI / 2.0);
const easeout = t => 1.0 - cos(t * PI / 2.0);

const Animation = {
  stack: {},
  warp: function (op, duration, path, to) {
    for (var i = 2; i < arguments.length; i += 2) {
      Animation.stack[arguments[i]] = {
        from: read(arguments[i]), op: op, to: arguments[i + 1],
        time: Date.now(),
        duration: duration
      };
    }
    return () => !Animation.stack[arguments[2]];
  },
  
  get exec() {
    var time;
    for (var path in this.stack) {
      time = constrain((Date.now() - this.stack[path].time) / (1000 * this.stack[path].duration), 0, 1);
      replace(path, lerp(this.stack[path].from, this.stack[path].to, this.stack[path].op(time)));
      if (~~time) delete this.stack[path];
    }
  }
}, warp = Animation.warp;
