/**
 * Animation and Transformation Language
 * @see https://www.renpy.org/doc/html/Animation.html
 * @TODO Have certain properties be in jquery animation (transform)
*/
var ATL = {
  queue: [],
  current: 0, to: 0,
  last: '',

  /**
   * Execute all actions in queue. Put this in a loop.
   * @syntax ATL.exec;
   * @chainable no
   */
  get exec() {
    if (!this.queue.length) return;
    /* run current queue */
    for (var i = 0; i < this.queue[this.current].length; i++) {
      //Save action in a variable
      var fn = this.queue[this.current][i];

      //Fire action
      if (!fn.fired) {
        fn.done = fn(fn);
        if (typeof fn.done === 'number' || typeof fn.done === 'string') fn.done = this.wait(fn.done);
        else if (typeof fn.done === 'object') fn.done = this.wait(fn.done.duration);
        fn.fired = true;
      }

      //If the action isn't done, don't delete it
      if (typeof fn.done === 'function' && !fn.done()) continue;

      //Delete the action
      this.queue[this.current].splice(i, 1);
      if (fn.callback) this.queue[this.current].push(fn.callback);
    }

    /* advance queue */
    if (!this.queue[this.current].length && this.current < this.queue.length - 1) this.current++;
  },


  /**
   * Clear action queue.
   * @syntax ATL.clear;
   */
  get clear() {
    this.queue.length = this.to = this.current = 0;
    return this;
  },


  /**
   * Schedule an action.
   * @note All consecutive actions and blocks are parallel unless you change the global index. @see ATL.next
   * @param {callback} fn - Action to schedule
     * @returns {boolean} An expression to wait for before leaving the queue
     * @returns {seconds} A string or integer to pass into ATL.wait.
     * 
   * @example
      ATL.schedule(fn);
      ATL.schedule(function() {});
      ATL.schedule(() => {});
      ATL.schedule(()=> <single-line action>);
   * 
   * @example
    ATL
      //Wait for a condition:
      .schedule(()=>{
        ...action...
        return ()=> frameCount > 200; //must be a function
      })

      //Wait a certain time:
      .schedule(()=>{
        ...action...
        return '5s'; //5 also works
      })
      //You could do:
      .schedule(()=>'5s')
      //But this is better:
      .pause(5)

      //Wait for a transition:
      .schedule(()=>
        myDisplayable
          .ease('0.5s')
          ._(...)
          ._(...)
          .duration //very important
      );
   */
  schedule(fn) {
    if (!this.queue[this.to]) this.queue[this.to] = [];
    this.last = fn;
    this.queue[this.to++].push(fn);
    return this;
  },


  /**
   * Create an ATL block. This groups actions so you can repeat them.
   * @syntax 
      ATL.block = fn;
      ATL.block = function() {};
      ATL.block = () => {};
      ATL.block=()=>
        <single-line action>
   * @callback fn A function full of actions ( @see ATL.schedule )
   */
  set block(fn) {
    fn.repeated = 0;
    fn(fn);
  },

  /**
   * 
   */
  set parallel(fn) {
    this.to = this.to - 1 < 0 ? 0 : this.to - 1;
    fn.parallel = true;
    fn.repeated = 0;
    fn(fn);
  },

  /**
   * DSFFEGFJGIRGIRGRUGN
   */
  repeat(block, times = Infinity) {
    if (block.repeated >= times) return this;
    if (block.parallel) this.then(()=>this.to = this.to - 1 < 0 ? 0 : this.to - 1);

    var b = block.bind(); //clear data
    b.parallel = block.parallel;
    b.repeated = block.repeated + 1;
    this.then(b);
    
    return this;
  },


  /**
   * Add a callback to the latest scheduled action.
   * @callback fn Function to run when finished
   */
  then: function (fn) {
    var l = this.last;
    while (l.callback) { l = l.callback; }
    l.callback = fn;
    return this;
  },

  /**
   * Schedule a pause.
   * @syntax
       ATL.pause(seconds);
   * @param {number} seconds How long to pause
   */
  pause(time) {
    this.then(function () {
      var start = Date.now();
      return () => Date.now() - start > time * 1000;
    });
    return this;
  },

  /**
   * Create a timer function that returns true is timer is finished
   * @param {seconds} time How long to wait before returning true
   * @returns Returns a timer function
   * @example:
    ATL.schedule(function() {
      ...
      return ATL.wait(5); //Wait 5 seconds before moving on
    }).next.schedule(function() {
      ...
      //This is executed 5 seconds after the previous action
    });
   */
  wait(time) {
    if (typeof time === 'string') time = +time.replace(/[^0-9.,]+/, '');
    var start = Date.now();
    return () => Date.now() - start > time * 1000;
  },
};

function isFloat(num) {
  if (typeof num === 'string' && num.indexOf('.') !== -1) return true;
  else if (typeof num === 'number' && !Number.isInteger(num) && !Number.isNaN(num)) return true;
  else return false;
}
function pos(p) {
  var res = '';
  if (typeof p === 'string' && p.indexOf('=') + p.indexOf('px') + p.indexOf('%') !== -3) res = p;
  else if (isFloat(p)) res = (+p*100)+'%';
  else if (Number.isInteger(+p)) res = p+'px';
  
  if (!res.length) console.error(p+' is not a valid position. Use integers and floats.');
  return res;
} 
class Transform {
  defaultConfig = {
    apply: 0, //how many properties to apply to
    duration: 0, //duration of the transition
    easing: 'linear', //style of the transition
    queue: false,
  };
  config = this.defaultConfig;
  
  get duration() {
    return this.config.duration/1000;
  }
  get easing() {
    return this.config.easing;
  }
  
  $(easing, duration, next=1) {
    this.config.easing = easing;
    this.config.duration = duration*1000;
    this.config.apply = next;
    return this;
  }
  updateTransition(ops) {
    if (--this.config.apply < 0) this.config.duration = 0;
    else if (ops) this.config.apply += ops;
  }
  pos(x=0, y=0) {
    this.updateTransition();
    $(this.div).velocity({
      left: pos(x),
      top: pos(y),
    }, this.config)
    return this;
  }
  xpos(x=0) {
    this.updateTransition();
    $(this.div).velocity({
      left: pos(x),
    }, this.config)
    return this;
  }
  ypos(y=0) {
    this.updateTransition();
    $(this.div).velocity({
      top: pos(y),
    }, this.config)
    return this;
  }
  
  anchor(x=0, y=0) {
    this.updateTransition();
    $(this.el).velocity({
      left: '-'+pos(x),
      top: '-'+pos(y),
      transformOriginX: pos(x),
      transformOriginY: pos(y)
    }, this.config)
    return this;
  }
  xanchor(x=0) {
    this.updateTransition();
    $(this.el).velocity({
      left: '-'+pos(x),
      transformOriginX: pos(x)
    }, this.config)
    return this;
  }
  yanchor(y=0) {
    this.updateTransition();
    $(this.el).velocity({
      top: '-'+pos(y),
      transformOriginY: pos(y)
    }, this.config)
    return this;
  }

  align(x, y) {
    if (!isFloat(x) || !isFloat(y)) console.error('Alignment will not work unless values are floats.');
    this.updateTransition(2);
    this.anchor(x, y).pos(x, y);
    return this;
  }
  xalign(x) {
    if (!isFloat(x)) console.error('Alignment will not work unless values are floats.');
    this.updateTransition(2);
    this.xpos(x).xanchor(x);
    return this;
  }
  yalign(y) {
    if (!isFloat(y)) console.error('Alignment will not work unless values are floats.');
    this.updateTransition(2);
    this.ypos(y).yanchor(y);
    return this;
  }

  offset(x, y) {
    this.updateTransition();
    $(this.el).velocity({
      translateX: x+'px',
      translateY: y+'px',
    }, this.config)
    return this;
  }
  xoffset(x) {
    this.updateTransition();
    $(this.el).velocity({
      translateX: x+'px',
    }, this.config)
    return this;
  }
  yoffset(y) {
    this.updateTransition();
    $(this.el).velocity({
      translateY: y+'px',
    }, this.config)
    return this;
  }

  xycenter(x, y) {
    this.updateTransition(2);
    this.pos(x, y).anchor(0.5, 0.5);
    return this;
  }
  xcenter(x) {
    this.updateTransition(2);
    this.xpos(x).xanchor(0.5);
    return this;
  }
  ycenter(y) {
    this.updateTransition(2);
    this.ypos(y).yanchor(0.5);
    return this;
  }

  rotate(r) {
    this.updateTransition();
    $(this.el).velocity({
      rotateZ: r+'deg',
    }, this.config)
    return this;
  }

  zoom(z) {
    this.updateTransition();
    $(this.el).velocity({
      scaleX: z, scaleY: z
    }, this.config)
    return this;
  }
  xzoom(z) {
    this.updateTransition();
    $(this.el).velocity({
      scaleX: z
    }, this.config)
    return this;
  }
  yzoom(z) {
    this.updateTransition();
    $(this.el).velocity({
      scaleY: z
    }, this.config)
    return this;
  }

  alpha(a=1.0) {
    this.updateTransition();
    $(this.div).velocity({
      opacity: a
    }, this.config)
    return this;
  }

  

  xysize(x, y) {
    this.updateTransition();
    $(this.div).velocity({
      width: x, height: y
    }, this.config)
    return this;
  }
  xsize(x) {
    this.updateTransition();
    $(this.div).velocity({
      width: x
    }, this.config)
    return this;
  }
  ysize(y) {
    this.updateTransition();
    $(this.div).velocity({
      height: y
    }, this.config)
    return this;
  }

  

  subpixel(boolean) {
    this.updateTransition();
    if (boolean) {
      $(this.div).css({
        'image-rendering': 'optimizeQuality',
        '-ms-interpolation-mode': 'bicubic'
      })
      $(this.el).css({
        'image-rendering': 'optimizeQuality',
        '-ms-interpolation-mode': 'bicubic'
      })
    } else {
      $(this.div).css({
        'image-rendering': 'optimizeSpeed',
        'image-rendering': '-moz-crisp-edges',
        'image-rendering': 'optimizeContrast',
        '-ms-interpolation-mode': 'nearest-neighbor'
      })
      $(this.el).css({
        'image-rendering': 'optimizeSpeed',
        'image-rendering': '-moz-crisp-edges',
        'image-rendering': 'optimizeContrast',
        '-ms-interpolation-mode': 'nearest-neighbor'
      })
    }
    return this;
  }

  blur(b) {
    this.updateTransition();
    $(this.el).velocity({
      blur: y+'px'
    }, this.config)
    return this;
  }

  zorder(o) {
    this.updateTransition();
    $(this.div).css('z-index', o);
    return this;
  }

  /* TODO */
  crop(x, y, w, h) {
    
  }
  corner1(x, y) {
    
  }
  corner2(x, y) {
    
  }
  fit(f) {
    this.updateTransition();
    $(this.div).css('object-fit', f);
    return this;
  }
  transform_anchor() {
    /**IMPORTANT**/
  }
}
class Image extends Transform {
  clone(id, at = this.at) {
    var a = new this.constructor(id, this.el.src, at);
    a.div.style.cssText = this.div.style.cssText;
    a.el.style.cssText = this.el.style.cssText;
    return a;
  }
  constructor(id, src, at = 'master') {
    super(Transform);
    this.div = document.createElement('container');
    this.el = document.createElement('img');

    this.div.id = id;
    this.div.context = this.div.ctx = this;
    this.el.src = src;
    this.div.style.cssText = `
      position: absolute;  
      width: ${this.el.width}px;
      height: ${this.el.height}px;
      display: none;
      left: 0;
      top: 0;
    `;
    this.el.style.cssText = `
      position: relative;
      width: 100%;
      height: 100%;
      transform-origin: top left;
      transform: scaleX(1) scaleY(1) rotateZ(0deg) translateX(0px) translateY(0px);
      left: 0;
      top: 0;
    `;

    this.at = at;
    var target = document.getElementById(at);
    this.div.style['z-index'] = target.children.length;
    target.appendChild(this.div);
    this.div.appendChild(this.el);
  }

  /** @event show */
  onshow = () => { };
  /**
   * Show the Displayable.
   * @example d.show;
   */
  get show() {
    this.onshow(this);
    this.div.style.display = 'inline';
    delete this.onshow;
    return this;
  }
  set show(opt) {
    if (opt.src) this.src = opt.src;
    if (opt.as) {
      var loc = $('#'+this.at).children();
      for (var i = 0; i < loc.length; i++) {
        if (loc[i].id === opt.as) break;
      }
      if (!loc[i]) {
        var c = this.clone(opt.as, opt.onlayer);
        delete opt.as;
        c.show = opt;
      } else {
        delete opt.as;
        loc[i].context.show = opt;
      }
      return;
    }
    if (opt.behind) {
      var i = this.div.style['z-index'];
      opt.behind.forEach(v => {
        if (v.div.style['z-index'] < i) i = v.div.style['z-index']-1;
      });
      this.zorder(i);
    }
    if (opt.onlayer) $('#'+this.div.id).appendTo('#'+opt.onlayer);
    if (opt.at) opt.at.bind(this)();
    if (opt.zorder) this.zorder(opt.zorder);
    if (this.div.style.display === 'none') {
      this.onshow();
      this.onshow = ()=>{};
      this.div.style.display = 'inline';
    } else {
      this.onreplace();
      this.onshow = ()=>{};
    }
  }


  /** @event hide */
  onhide = () => { };
  /**
   * Hide the Image.
   * @example d.hide;
   */
  get hide() {
    this.onhide();
    this.div.style.display = 'none';
  }

  /** @event replace */
  onreplace = () => { };


  get kill() {
    document.getElementById(this.at).removeChild(this.html);
  }
}
