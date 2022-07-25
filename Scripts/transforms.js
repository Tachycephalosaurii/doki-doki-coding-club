function tdefault() {
  this.xcenter(0.5);
  this.yalign('1.0');
}
function tcommon(x = 640, z = 0.80) {
  this.yanchor('1.0').subpixel(true);
  this.onshow = () => {
    this.ypos(1.03);
    this.zoom(z * 0.95).alpha(0);
    this.xcenter(x).yoffset(-20);
    ATL.schedule(() => t.$('ease-in', .25, 3).yoffset(0).zoom(z * 1.00).alpha(1.00));
  }
}
function tinstant(x = 640, z = 0.80) {
  this.xcenter(x).yoffset(0).zoom(z * 1.00).alpha(1.00).yanchor('1.0').ypos(1.03);
}
function focus(x = 640, z = 0.80) {
  this.yanchor('1.0').ypos(1.03).subpixel(true);
  this.onshow = () => {
    this.zoom(z * 0.95).alpha(0);
    this.xcenter(x); this.yoffset(-20);
    ATL
      .schedule(() => this.$('ease-in', .25, 3).yoffset(0).zoom(z * 1.05).alpha(1.00))
      .schedule(() => { this.yanchor('1.0').ypos(1.03) });
  }
  this.onreplace = () => {
    this.alpha(1.00);
    ATL.parallel = () => ATL
      .schedule(() => this.$('ease-in', .25, 2).xcenter(x).zoom(z * 1.05))
    ATL.parallel = () => ATL
      .schedule(() => this.$('ease-in', .15).yoffset(0))
  }
}
function sink(x = 640, z = 0.80) {
  this.xcenter(x).yoffset(0).yanchor('1.0').ypos(1.03).zoom(z * 1.00).alpha(1.00).subpixel(true);
  ATL.schedule(() => this.$('ease-in', .5).ypos(1.06));
}
function hop(x = 640, z = 0.80) {
  this.xcenter(x).yoffset(0).yanchor('1.0').ypos(1.03).zoom(z * 1.00).alpha(1.00).subpixel(true);
  ATL
    .schedule(() => this.$('ease-in', .1).yoffset(-20))
    .schedule(() => this.$('ease-out', .1).yoffset(0));
}
function hopfocus(x = 640, z = 0.80) {
  this.xcenter(x).yoffset(0).yanchor('1.0').ypos(1.03).zoom(z * 1.05).alpha(1.00).subpixel(true);
  ATL
    .schedule(() => this.$('ease-in', .1).yoffset(-21))
    .schedule(() => this.$('ease-out', .1).yoffset(0));
}
function dip(x = 640, z = 0.80) {
  this.xcenter(x).yoffset(0).yanchor('1.0').ypos(1.03).zoom(z * 1.00).alpha(1.00).subpixel(true);
  ATL
    .schedule(() => this.$('ease-in', .25).yoffset(25))
    .schedule(() => this.$('ease-out', .25).yoffset(0));
}
function panic(x = 640, z = 0.80) {
  this.xcenter(x).yoffset(0).yanchor('1.0').ypos(1.03).zoom(z * 1.00).alpha(1.00).subpixel(true);
  ATL.parallel = (yAnimation) => ATL
    .schedule(() => this.$('ease', 1.2).yoffset(25))
    .then(() => this.$('ease', 1.2).yoffset(0))
    .repeat(yAnimation);
  ATL.parallel = (xAnimation) => ATL
    .schedule(() => this.$('ease-in', .3).xoffset(20))
    .then(() => this.$('ease', .6).xoffset(-20))
    .then(() => this.$('ease-out', .3).xoffset(0))
    .repeat(xAnimation);
}
function leftin(x = 640, z = 0.80) {
  this.xcenter(-300).yoffset(0).yanchor('1.0').ypos(1.03).zoom(z * 1.00).alpha(1.00).subpixel(true);
  ATL.schedule(() => this.$('ease-in', .25).xcenter(x));
}
function thide(z = 0.80) {
  this.subpixel(true);
  //this.transform_anchor(true);
  this.onhide = () => this.$('ease-in', .25, 3).zoom(z * 0.95).alpha(0.00).yoffset(-20);
}
function lhide() {
  this.subpixel(true);
  this.onhide = () => this.$('ease-out', .25).xcenter(-300);
}
function t41() { tcommon.bind(this)(200); }
function t42() { tcommon.bind(this)(493); }
function t43() { tcommon.bind(this)(786); }
function t44() { tcommon.bind(this)(1080); }
function t31() { tcommon.bind(this)(240); }
function t32() { tcommon.bind(this)(640); }
function t33() { tcommon.bind(this)(1040); }
function t21() { tcommon.bind(this)(400); }
function t22() { tcommon.bind(this)(880); }
function t11() { tcommon.bind(this)(640); }

function i41() { tinstant.bind(this)(200); }
function i42() { tinstant.bind(this)(493); }
function i43() { tinstant.bind(this)(786); }
function i44() { tinstant.bind(this)(1080); }
function i31() { tinstant.bind(this)(240); }
function i32() { tinstant.bind(this)(640); }
function i33() { tinstant.bind(this)(1040); }
function i21() { tinstant.bind(this)(400); }
function i22() { tinstant.bind(this)(880); }
function i11() { tinstant.bind(this)(640); }

function f41() { focus.bind(this)(200); }
function f42() { focus.bind(this)(493); }
function f43() { focus.bind(this)(786); }
function f44() { focus.bind(this)(1080); }
function f31() { focus.bind(this)(240); }
function f32() { focus.bind(this)(640); }
function f33() { focus.bind(this)(1040); }
function f21() { focus.bind(this)(400); }
function f22() { focus.bind(this)(880); }
function f11() { focus.bind(this)(640); }

function s41() { sink.bind(this)(200); }
function s42() { sink.bind(this)(493); }
function s43() { sink.bind(this)(786); }
function s44() { sink.bind(this)(1080); }
function s31() { sink.bind(this)(240); }
function s32() { sink.bind(this)(640); }
function s33() { sink.bind(this)(1040); }
function s21() { sink.bind(this)(400); }
function s22() { sink.bind(this)(880); }
function s11() { sink.bind(this)(640); }

function h41() { hop.bind(this)(200); }
function h42() { hop.bind(this)(493); }
function h43() { hop.bind(this)(786); }
function h44() { hop.bind(this)(1080); }
function h31() { hop.bind(this)(240); }
function h32() { hop.bind(this)(640); }
function h33() { hop.bind(this)(1040); }
function h21() { hop.bind(this)(400); }
function h22() { hop.bind(this)(880); }
function h11() { hop.bind(this)(640); }

function hf41() { hopfocus.bind(this)(200); }
function hf42() { hopfocus.bind(this)(493); }
function hf43() { hopfocus.bind(this)(786); }
function hf44() { hopfocus.bind(this)(1080); }
function hf31() { hopfocus.bind(this)(240); }
function hf32() { hopfocus.bind(this)(640); }
function hf33() { hopfocus.bind(this)(1040); }
function hf21() { hopfocus.bind(this)(400); }
function hf22() { hopfocus.bind(this)(880); }
function hf11() { hopfocus.bind(this)(640); }

function d41() { dip.bind(this)(200); }
function d42() { dip.bind(this)(493); }
function d43() { dip.bind(this)(786); }
function d44() { dip.bind(this)(1080); }
function d31() { dip.bind(this)(240); }
function d32() { dip.bind(this)(640); }
function d33() { dip.bind(this)(1040); }
function d21() { dip.bind(this)(400); }
function d22() { dip.bind(this)(880); }
function d11() { dip.bind(this)(640); }

function l41() { leftin.bind(this)(200); }
function l42() { leftin.bind(this)(493); }
function l43() { leftin.bind(this)(786); }
function l44() { leftin.bind(this)(1080); }
function l31() { leftin.bind(this)(240); }
function l32() { leftin.bind(this)(640); }
function l33() { leftin.bind(this)(1040); }
function l21() { leftin.bind(this)(400); }
function l22() { leftin.bind(this)(880); }
function l11() { leftin.bind(this)(640); }

function face(z = 0.80, y = 500) {
  this.subpixel(true);
  this.xcenter(640);
  this.yanchor('1.0').ypos(1.03);
  this.yoffset(y);
  this.zoom(z * 2.00);
}

function cg_fade() {
  this.onshow = () => {
    this.alpha(0.0);
    ATL.schedule(() => this.$('linear', 0.5).alpha(1.0));
  }
  this.onhide = () => {
    this.alpha(1.0);
    ATL.schedule(() => this.$('linear', 0.5).alpha(0));
  }
}

function n_cg2_wiggle() {
  this.subpixel(true);
  this.xoffset(0);
  ATL
    .schedule(() => this.$('ease-in', 0.15).xoffset(20))
    .schedule(() => this.$('ease-out', 0.15).xoffset(0))
    .schedule(() => this.$('ease-in', 0.15).xoffset(-15))
    .schedule(() => this.$('ease-out', 0.15).xoffset(0))
    .schedule(() => this.$('ease-in', 0.15).xoffset(10))
    .schedule(() => this.$('ease-out', 0.15).xoffset(0))
    .schedule(() => this.$('ease-in', 0.15).xoffset(-5))
    .schedule(() => this.$('ease-out', 0.15).xoffset(0))
}

function n_cg2_wiggle_loop() {
  ATL.block = (wiggle) => {
    n_cg2_wiggle.bind(this)();
    ATL.pause(1.0).repeat(wiggle);
  }
}

function n_cg2_zoom() {
  this.subpixel(true);
  this.pos(0.5, 0.5); //truecenter
  this.xoffset(0);
  ATL.schedule(() => this.$('ease-out', 0.20, 2).zoom(2.5).xoffset(200));
}

/*
define dissolve = Dissolve(0.25)
define dissolve_cg = Dissolve(0.75)
define dissolve_scene = Dissolve(1.0)
define dissolve = Dissolve(0.25)
define dissolve_cg = Dissolve(0.75)
define dissolve_scene = Dissolve(1.0)

define dissolve_scene_full = MultipleTransition([
  False, Dissolve(1.0),
  Solid("#000"), Pause(1.0),
  Solid("#000"), Dissolve(1.0),
  True])

define dissolve_scene_half = MultipleTransition([
    Solid("#000"), Pause(1.0),
    Solid("#000"), Dissolve(1.0),
    True])

define close_eyes = MultipleTransition([
      False, Dissolve(0.5),
      Solid("#000"), Pause(0.25),
      True])

define open_eyes = MultipleTransition([
        False, Dissolve(0.5),
        True])

define trueblack = MultipleTransition([
          Solid("#000"), Pause(0.25),
          Solid("#000")])

define wipeleft = ImageDissolve("images/menu/wipeleft.png", 0.5, ramplen = 64)

define wipeleft_scene = MultipleTransition([
            False, ImageDissolve("images/menu/wipeleft.png", 0.5, ramplen = 64),
            Solid("#000"), Pause(0.25),
            Solid("#000"), ImageDissolve("images/menu/wipeleft.png", 0.5, ramplen = 64),
            True])

define tpause = Pause(0.25)

image noise:
truecenter
"images/bg/noise1.jpg"
pause 0.1
"images/bg/noise2.jpg"
pause 0.1
"images/bg/noise3.jpg"
pause 0.1
"images/bg/noise4.jpg"
pause 0.1
xzoom - 1
"images/bg/noise1.jpg"
pause 0.1
"images/bg/noise2.jpg"
pause 0.1
"images/bg/noise3.jpg"
pause 0.1
"images/bg/noise4.jpg"
pause 0.1
yzoom - 1
"images/bg/noise1.jpg"
pause 0.1
"images/bg/noise2.jpg"
pause 0.1
"images/bg/noise3.jpg"
pause 0.1
"images/bg/noise4.jpg"
pause 0.1
xzoom 1
"images/bg/noise1.jpg"
pause 0.1
"images/bg/noise2.jpg"
pause 0.1
"images/bg/noise3.jpg"
pause 0.1
"images/bg/noise4.jpg"
pause 0.1
yzoom 1
repeat
*/
function noise_alpha() {
  this.alpha(0.25);
}

function noisefade(t = 0) {
    this.alpha(0.0);
    ATL.pause(t)
    .schedule(()=>this.$('linear', 5.0).alpha(0.40));
}
/*    
image vignette:
    truecenter
    "images/bg/vignette.png"
*/

function vignettefade(t = 0) {
    this.alpha(0.0);
    ATL.pause(t)
    .schedule(()=>this.$('linear', 25.0).alpha(1.00));
}

function vignetteflicker(t = 0) {
    this.alpha(0.0);
    ATL.pause(t + 2.030)
    .parallel=(flick)=> ATL
        .schedule(()=> this.alpha(1.00))
        .then(()=> this.$('linear', 0.2).alpha(0.8))
    .pause(0.1)
        .then(()=> this.alpha(0.7))
        .then(()=> this.$('linear', 0.1).alpha(1.00))
        .then(()=> this.alpha(0.0))
    .pause(1.19)
    .repeat(flick);
    ATL.parallel=()=> ATL
      .schedule(()=>this.$('easeout', 20).zoom(3.0));
}

function layerflicker(t = 0) {
    this.align(0.5, 0.5);//truecenter
    ATL.pause(t + 2.030)
    ATL.parallel=(flick)=> ATL
        .schedule(()=>this.zoom(1.05))
        .then(()=>this.$('linear', 0.2).zoom(1.04))
    .pause(0.1)
        .then(()=>this.zoom(1.035))
        .then(()=>this.$('linear', 0.1).zoom(1.05))
        .then(()=>this.zoom(1.0))
    .pause(1.19)
    .repeat(flick);
    ATL.parallel=(blockName)=> ATL
        .schedule(()=>this.$('easeOutBounce', 0.3).xalign(0.6))
        .then(()=>this.$('easeOutBounce', 0.3).xalign(0.4))
    .repeat(blockName);
}
function rewind() {
  this.align(0.5, 0.5);//truecenter
  this.zoom(1.20);
  ATL.parallel=(block)=> ATL
      .schedule(()=> this.$('easeOutBounce', 0.2).xalign(0.55))
      .then(()=> this.$('easeOutBounce', 0.2).xalign(0.45))
  .repeat(block);

  ATL.parallel=(bounce)=> ATL
      .schedule(()=> this.$('easeOutBounce', 0.33).yalign(0.55))
      .then(()=> this.$('easeOutBounce', 0.33).yalign(0.45))
  .repeat(bounce);
}
function heartbeat() { heartbeat2.bind(this)(1); }
function heartbeat2(m) {
  this.align(0.5, 0.5); //truecenter
  ATL.parallel=(block)=> ATL
  .schedule(()=>{})
  .pause(0.144)
      .then(()=>this.zoom(1.00 + 0.07 * m))
      .then(()=>this.$('ease-in', 0.250).zoom(1.00 + 0.04 * m))
      .then(()=>this.$('easeout', 0.269).zoom(1.00 + 0.07 * m))
      .then(()=>this.zoom(1.00))
  .pause(1.479)
  .repeat(block);
  ATL.parallel=(block)=> ATL
      .schedule('easeOutBounce', 0.3).xalign(0.5 + 0.02 * m)
      .then('easeOutBounce', 0.3).xalign(0.5 - 0.02 * m)
  .repeat(block);
}

function yuripupils_move() {
  this.xoffset(-1 + Math.random() * 9 - 4);
  this.yoffset(3 + Math.random() * 6 - 3);
  return Math.random() * 1.2 + 0.3;
}

function malpha(a=1.00) {
  i11.bind(this)();
  this.alpha(a);
}
