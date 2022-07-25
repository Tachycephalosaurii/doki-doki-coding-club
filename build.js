/* Layers */
const screens = document.getElementById('screens');
const master = document.getElementById('master');
const transient = document.getElementById('transient');
const overlay = document.getElementById('overlay');

function resize(...elements) {
  for (var i = 0; i < elements.length; i++) {
    var scl = Math.min(window.innerWidth / 1280, window.innerHeight / 720);
    $(elements[i]).css({
      'transform': `scale(${scl})`, //transform: translate(-50%, -50%);
      'margin': `-${360 * scl}px 0 0 -${640 * scl}px`
    });
  }
}

resize(master, transient, screens, overlay);
master.style.display = 'inline';
transient.style.display = 'inline';
screens.style.display = 'inline';
overlay.style.display = 'inline';

window.addEventListener('resize', ()=>resize(master, transient, screens, overlay));
$('#screens').contextmenu(ev=>ev.preventDefault()).on('dragstart', ev=>ev.preventDefault());
$('#master').contextmenu(ev=>ev.preventDefault()).on('dragstart', ev=>ev.preventDefault());
$('#transient').contextmenu(ev=>ev.preventDefault()).on('dragstart', ev=>ev.preventDefault());
$('#overlay').contextmenu(ev=>ev.preventDefault()).on('dragstart', ev=>ev.preventDefault());

var elem = document.documentElement;
function openFullscreen() {
  if (elem.requestFullscreen) {
    elem.requestFullscreen({ navigationUI: "show" });
  } else if (elem.webkitRequestFullscreen) { /* Safari */
    elem.webkitRequestFullscreen({ navigationUI: "show" });
  } else if (elem.msRequestFullscreen) { /* IE11 */
    elem.msRequestFullscreen({ navigationUI: "show" });
  }
}
