/**
 * Animation and Transformation Language
 * @see https://www.renpy.org/doc/html/atl.html
 */
 var ATL = {
  queue: [],
  to: 0,
  current: 0,
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
        fn.done = fn(fn.repeats - fn.repeat);
        fn.fired = true;
      }

      //If the action isn't done, skip deleting/repeating it
      if (fn.done && !fn.done()) continue;

      //Repeat action if needed
      if (fn.repeat--) {
        fn.fired = false;
        continue;
      }

      //Delete the action
      this.queue[this.current].splice(i, 1);
      if (fn.callback) fn.callback();
    }

    /* advance queue */
    if (!this.queue[this.current].length && this.current < this.queue.length - 1) this.current++;
  },

  /**
   * Add a callback to the latest scheduled action.
   * @callback fn Function to run when finished
   */
  then: function (fn) {
    this.last.callback = fn;
    return this;
  },

  /**
   * Schedule an action.
   * @callback fn - Action to schedule
        @returns {boolean} An expression to wait for before leaving the queue
   * @param {integer*} at  - Index of queue to schedule at
        @default this.to Insert into the current global index

   * @note All consecutive actions are parallel unless you change the global index. @see ATL.next
   */
  schedule: function (fn, at = this.to) {
    if (!this.queue[at]) this.queue[at] = [];
    this.last = fn;
    this.queue[at].push(fn);
    return this;
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
   * Create an ATL block.
   * @syntax 
      ATL.block = fn;
      ATL.block = () => {};
      ATL.block = function() {};
   * @callback fn A function full of actions ( @see ATL.schedule )
   * @nestable true
   */
  set block(fn) {
    this.previousBlock = this.currentBlock;
    fn.repeated = 0;
    (this.currentBlock = fn)();
    this.currentBlock = this.previousBlock;
  },
  
  /**
   * These functions are used inside blocks to access information.
   * @example
      ATL.block = () => {
        ATL.block; //returns arguments.callee
        ATL.repeated; //returns current rep
        ATL.repeat = 5; //repeat the block 5 times
      }
   */
  get block() { return this.currentBlock; },
  get repeated() { return this.block.repeated; },

  /**
   * Schedule actions in the next queue.
   * @syntax ATL.next;
   */
  get next() {
    this.to++;
    return this;
  },

  /**
   * Schedule actions to the previous queue.
   * @syntax ATL.prev;
   */
  get prev() {
    this.to = this.to - 1 < 0 ? 0 : this.to - 1;
    return this;
  },

  /**
   * @param {integer} reps How many times to repeat
   * 
   * Repeat the latest scheduled action.
   * @syntax ATL.repeat(reps*);
      @default reps is Infinity
   * 
   * Repeat the current block infinitely.
   * @syntax ATL.repeat;
   * 
   * Repeat the current block a number of times.
   * @syntax ATL.repeat = reps;
   */
  get repeat() {
    this.currentBlock.repeated++;
    this.then(this.currentBlock);
    return function (times = Infinity) {
      this.currentBlock.repeated--;
      this.last.callback = undefined;
      this.last.repeats = this.last.repeat = times;
      return this;
    };
  },
  set repeat(reps) {
    var fn = this.currentBlock;
    while (fn.repeated++ < reps) {
      this.next.currentBlock();
    }
  },
  
  /**
   * Schedule a pause.
   * @syntax
       ATL.pause;
       ATL.pause = seconds;
   * @param {number} seconds How long to pause
   */
  get pause() {
    this.pause = 1.0;
    return this;
  },
  set pause(time) {
    this.next.schedule(function () {
      var start = Date.now();
      return () => Date.now() - start > time * 1000;
    });
  },
};
export default ATL;