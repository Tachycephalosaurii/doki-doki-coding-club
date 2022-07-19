var pos = (v, type) => {
  if (!type) {
    if (Number.isInteger(v)) type = 'int';
    else if (!Number.isNaN(v)) type = 'float';
    else type = typeof v;
  }
  switch (type) {
    case 'int': return v + 'px';
    case 'float': return (v * 100) + '%';
    case 'string':
      if (v.indexOf('px') + v.indexOf('%') === -2) {
        if (!Number.isNaN(+v)) return pos(+v);
        else return v;
      } else return v;
    default: return v;
  }
}

var getUnit = (num) => {
  var u = /[^0-9.,]+/.exec(num);
  if (u !== null) return u[0];
}
var getValue = (num) => +num.replace(/[^0-9.,]+/, '');

var float = (num) => {
  if (Number.isNaN(+num)) return float(+getValue(num)) + getUnit(num);
  return +num.toLocaleString("en", { useGrouping: false, minimumFractionDigits: 1 });
}

var int = (num) => {
  if (Number.isNaN(+num)) return int(+getValue(num)) + getUnit(num);
  return Math.round(+num);
}

class Displayable {
  constructor(src) {
    this.html = document.createElement('img');
    this.html.src = src;
    this.html.width = this.html.naturalWidth;
    this.html.height = this.html.naturalHeight;
    var style = this.html.style;
    style.position = 'absolute';
    style.top = 0;
    style.left = 0;
    style['transform-origin'] = 'top left';
    style.opacity = 1;
    style['object-fit'] = 'fill';
    style.transform = 'scale(1, 1) rotate(0) translate(0px, 0px)';
    style.filter = 'blur(0)';
    style.display = 'inline';
    var el = document.getElementById('displayables');
    el.appendChild(this.html);
    this.html.style['z-index'] = Array.from(el.children).indexOf(this.html);
  }

  /* events */
  onshow = ()=>{};
  get show() {
    this.onshow();
    this.html.style.display = 'inline';
  }

  onhide = ()=>{};
  get hide() {
    this.onhide();
    this.html.style.display = 'none';
  }
  
  set name(id) { this.html.id = id; }
  get name() { return this.html.id; }

  set pos(p) {
    this.html.style.left = pos(p[0]);
    this.html.style.top = pos(p[1]);
  }
  get pos() { return [this.xpos, this.ypos]; }
  set xpos(x) {
    this.html.style.left = pos(x);
  }
  get xpos() {
    var v = getValue(this.html.style.left), u = getUnit(this.html.style.left);
    return u === '%' ? v / 100 : v;
  }
  set ypos(y) {
    this.html.style.top = pos(y);
  }
  get ypos() {
    var v = getValue(this.html.style.top), u = getUnit(this.html.style.top);
    return u === '%' ? v / 100 : v;
  }

  set anchor(a) {
    //= [x, y]
    if (typeof a === 'object') this.html.style['transform-origin'] = pos(a[0]) + ' ' + pos(a[1]);
    else if (typeof a === 'string')
      //= 'x y'
      if (a.indexOf(' ') !== -1) this.anchor = a.split(' ');
      //= (x=y)
      else this.html.style['transform-origin'] = pos(a) + ' ' + pos(a);
    //= (x=y)
    else this.html.style['transform-origin'] = pos(a) + ' ' + pos(a);
  }
  get anchor() { return [this.xanchor, this.yanchor]; }
  set xanchor(x) {
    var o = this.html.style['transform-origin'].split(' ');
    o[0] = pos(x);
    this.html.style['transform-origin'] = o.join(' ');
  }
  get xanchor() {
    var o = this.html.style['transform-origin'].split(' ')[0];
    var v = getValue(o), u = getUnit(o);
    if (!v.length) return u; //= center, left, etc
    return u === '%' ? v / 100 : v;
  }
  set yanchor(x) {
    var o = this.html.style['transform-origin'].split(' ');
    o[1] = pos(x);
    this.html.style['transform-origin'] = o.join(' ');
  }
  get yanchor() {
    var o = this.html.style['transform-origin'].split(' ')[1];
    var v = getValue(o), u = getUnit(o);
    if (!v.length) return u; //= center, top, etc
    return u === '%' ? v / 100 : v;
  }

  set align(a) {
    this.pos = this.anchor = a;
  }
  get align() { return this.pos; }
  set xalign(x) {
    this.xpos = this.xanchor = x;
  }
  get xalign() { return this.xpos; }
  set yalign(y) {
    this.ypos = this.yanchor = y;
  }
  get yalign() { return this.ypos; }

  set offset(o) {
    var t = d.html.style.transform.split(/(?!\(.*)\s(?![^(]*?\))/g);
    t[2] = `translate(${o[0]}px, ${o[1]}px)`;
    this.html.style.transform = t.join(' ');
  }
  get offset() { return [this.xoffset, this.yoffset]; }

  set xoffset(x) {
    var t = d.html.style.transform.split(/(?!\(.*)\s(?![^(]*?\))/g);
    t[2] = `translate(${x}px, ${t[2].split(', ')[1].split(')')[0]}`;
    this.html.style.transform = t.join(' ');
  }
  get xoffset() {
    var t = d.html.style.transform.split(/(?!\(.*)\s(?![^(]*?\))/g);
    return getValue(t[2].split('(')[1].split(', ')[0]);
  }
  set yoffset(y) {
    var t = d.html.style.transform.split(/(?!\(.*)\s(?![^(]*?\))/g);
    t[2] = `translate(${t[2].split('(')[1].split(', ')[0]}, ${y}px`;
    this.html.style.transform = t.join(' ');
  }
  get yoffset() {
    var t = d.html.style.transform.split(/(?!\(.*)\s(?![^(]*?\))/g);
    return getValue(t[2].split(', ')[1].split(')')[0]);
  }

  set xycenter(c) {
    this.pos = c;
    this.anchor = '0.5 0.5';
  }
  set xcenter(x) {
    this.xpos = x;
    this.xanchor = 0.5;
  }
  set ycenter(y) {
    this.ypos = y;
    this.xanchor = 0.5;
  }

  set rotate(r) {
    var t = d.html.style.transform.split(/(?!\(.*)\s(?![^(]*?\))/g);
    t[1] = `rotate(${r}deg)`;
    this.html.style.transform = t.join(' ');
  }
  get rotate() {
    var t = d.html.style.transform.split(/(?!\(.*)\s(?![^(]*?\))/g);
    return getValue(t[1].slice(7, -1));
  }

  set zoom(z) {
    var t = d.html.style.transform.split(/(?!\(.*)\s(?![^(]*?\))/g);
    if (typeof z === 'object') t[0] = `scale(${z[0]}, ${z[1]})`;
    else t[0] = `scale(${z}, ${z})`;
    d.html.style.transform = t.join(' ');
  }
  get zoom() { return [this.xzoom, this.yzoom]; }
  set xzoom(x) {
    var t = d.html.style.transform.split(/(?!\(.*)\s(?![^(]*?\))/g);
    var res = t[0].slice(6, -1).split(', ');
    t[0] = `scale(${x}, ${res[1]})`;
    d.html.style.transform = t.join(' ');
  }
  get xzoom() {
    var t = d.html.style.transform.split(/(?!\(.*)\s(?![^(]*?\))/g);
    var res = t[0].slice(6, -1).split(', ');
    return +res[0];
  }
  set yzoom(y) {
    var t = d.html.style.transform.split(/(?!\(.*)\s(?![^(]*?\))/g);
    var res = t[0].slice(6, -1).split(', ');
    t[0] = `scale(${res[0]}, ${y})`;
    d.html.style.transform = t.join(' ');
  }
  get yzoom() {
    var t = d.html.style.transform.split(/(?!\(.*)\s(?![^(]*?\))/g);
    var res = t[0].slice(6, -1).split(', ');
    return +res[1];
  }

  set alpha(a) {
    this.html.style.opacity = a;
  }
  get alpha() {
    var v = getValue(this.html.style.opacity), u = getUnit(this.html.style.opacity);
    return u === '%' ? v / 100 : v;
  }

  set xysize(s) {
    this.html.width = s[0];
    this.html.height = s[1];
  }
  get xysize() { return [this.xsize, this.ysize]; }
  set xsize(x) { this.html.width = x; }
  get xsize() { return this.html.width; }
  set ysize(y) { this.html.height = y; }
  get ysize() { return this.html.height; }

  set fit(f) { this.html.style['object-fit'] = f; }
  get fit() { return this.html.style['object-fit']; }

  set subpixel(boolean) {
    if (boolean) {
      this.html.style['image-rendering'] = 'optimizeQuality';
      this.html.style['-ms-interpolation-mode'] = 'bicubic';
    } else {
      this.html.style['image-rendering'] = 'optimizeSpeed';
      this.html.style['image-rendering'] = '-moz-crisp-edges';
      this.html.style['image-rendering'] = 'optimizeContrast';
      this.html.style['-ms-interpolation-mode'] = 'nearest-neighbor';
    }
  }
  get subpixel() { return this.html.style['-ms-interpolation-mode'] === 'bicubic'; }

  set blur(b) {
    this.html.style.filter = `blur(${b}px)`;
  }
  get blur() { return getValue(this.html.style.filter.slice(5, -1));}

  set zorder(z) {
    this.html.style['z-index'] = z;
  }
  get zorder() { return this.html.style['z-index']; }
}
Displayable.init = async () => {
  Displayable.all = Object.keys(window).filter((e) => window[e] instanceof Displayable);
  Displayable.all.forEach((e) => window[e].name = e);
}
