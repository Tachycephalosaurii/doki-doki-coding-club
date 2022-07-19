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