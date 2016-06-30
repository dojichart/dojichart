(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

"use strict";

var Chart = require("./src/core/Chart");
var TimePanel = require("./src/panel/TimePanel");
var TimeValuePanel = require("./src/panel/TimeValuePanel");
var TimeLabelsPanel = require("./src/panel/TimeLabelsPanel");
var CandleLayer = require("./src/layer/CandleLayer");
var OHLCLayer = require("./src/layer/OHLCLayer");
var ValueGridLayer = require("./src/layer/ValueGridLayer");
var TimeGridLayer = require("./src/layer/TimeGridLayer");
var VolumeLayer = require("./src/layer/indicator/VolumeLayer");
var SimpleMovingAverageLayer = require("./src/layer/indicator/SimpleMovingAverageLayer");
var ExponentialMovingAverageLayer = require("./src/layer/indicator/ExponentialMovingAverageLayer");
var VolumeProfileLayer = require("./src/layer/indicator/VolumeProfileLayer");
var RSILayer = require("./src/layer/indicator/RSILayer");
var BollingerBandsLayer = require("./src/layer/indicator/BollingerBandsLayer");
var StochasticLayer = require("./src/layer/indicator/StochasticLayer");

var _exports = {
  /** @namespace core */
  core: {
    Chart: Chart
  },
  /** @namespace panel */
  panel: {
    TimePanel: TimePanel,
    TimeValuePanel: TimeValuePanel,
    TimeLabelsPanel: TimeLabelsPanel
  },
  /** @namespace layer */
  layer: {
    CandleLayer: CandleLayer,
    OHLCLayer: OHLCLayer,
    ValueGridLayer: ValueGridLayer,
    TimeGridLayer: TimeGridLayer,
    /** @namespace layer.indicator */
    indicator: {
      VolumeLayer: VolumeLayer,
      SimpleMovingAverageLayer: SimpleMovingAverageLayer,
      ExponentialMovingAverageLayer: ExponentialMovingAverageLayer,
      VolumeProfileLayer: VolumeProfileLayer,
      RSILayer: RSILayer,
      StochasticLayer: StochasticLayer,
      BollingerBandsLayer: BollingerBandsLayer
    }
  }
};

module.exports = _exports;

window.DojiChart = _exports;

},{"./src/core/Chart":7,"./src/layer/CandleLayer":23,"./src/layer/OHLCLayer":25,"./src/layer/TimeGridLayer":26,"./src/layer/ValueGridLayer":28,"./src/layer/indicator/BollingerBandsLayer":29,"./src/layer/indicator/ExponentialMovingAverageLayer":30,"./src/layer/indicator/RSILayer":31,"./src/layer/indicator/SimpleMovingAverageLayer":32,"./src/layer/indicator/StochasticLayer":33,"./src/layer/indicator/VolumeLayer":34,"./src/layer/indicator/VolumeProfileLayer":35,"./src/panel/TimeLabelsPanel":37,"./src/panel/TimePanel":38,"./src/panel/TimeValuePanel":39}],2:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      }
      throw TypeError('Uncaught, unspecified "error" event.');
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        len = arguments.length;
        args = new Array(len - 1);
        for (i = 1; i < len; i++)
          args[i - 1] = arguments[i];
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    len = arguments.length;
    args = new Array(len - 1);
    for (i = 1; i < len; i++)
      args[i - 1] = arguments[i];

    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    var m;
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.listenerCount = function(emitter, type) {
  var ret;
  if (!emitter._events || !emitter._events[type])
    ret = 0;
  else if (isFunction(emitter._events[type]))
    ret = 1;
  else
    ret = emitter._events[type].length;
  return ret;
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}],3:[function(require,module,exports){
(function (process,__filename){
/*
Note that if your data is too large, there _will_ be overflow.
*/


function asc(a, b) { return a-b; }

var config_params = {
	bucket_precision: function(o, s) {
		if(typeof s != "number" || s <= 0) {
			throw new Error("bucket_precision must be a positive number");
		}
		o._config.bucket_precision = s;
		o.buckets = [];
	},

	buckets: function(o, b) {
		if(!Array.isArray(b) || b.length == 0) {
			throw new Error("buckets must be an array of bucket limits");
		}

		o._config.buckets = b;
		o.buckets = [];
	},

	bucket_extension_interval: function(o, s) {
		if(s === undefined)
			return;
		if(typeof s != "number" || s<=0) {
			throw new Error("bucket_extension_interval must be a positive number");
		}
		o._config.bucket_extension_interval = s;
	},

	store_data: function(o, s) {
		if(typeof s != "boolean") {
			throw new Error("store_data must be a true or false");
		}
		o._config.store_data = s;
	},

	sampling: function(o, s) {
		if(typeof s != "boolean") {
			throw new Error("sampling must be a true or false");
		}
		o._config.sampling = s;
	}
};

function Stats(c) {
	this._config = { store_data:  true };

	if(c) {
		for(var k in config_params) {
			if(c.hasOwnProperty(k)) {
				config_params[k](this, c[k]);
			}
		}
	}

	this.reset();

	return this;
}

Stats.prototype = {

	reset: function() {
		if(this._config.store_data)
			this.data = [];

		this.length = 0;
	
		this.sum = 0;
		this.sum_of_squares = 0;
		this.sum_of_logs = 0;
		this.sum_of_square_of_logs = 0;
		this.zeroes = 0;
		this.max = this.min = null;
	
		this._reset_cache();

		return this;
	},

	_reset_cache: function() {
		this._stddev = null;

		if(this._config.store_data)
			this._data_sorted = null;
	},

	_find_bucket: function(a) {
		var b=0, e, l;
		if(this._config.buckets) {
			l = this._config.buckets.length;
			if(this._config.bucket_extension_interval && a >= this._config.buckets[l-1]) {
				e=a-this._config.buckets[l-1];
				b = parseInt(e/this._config.bucket_extension_interval) + l;
				if(this._config.buckets[b] === undefined)
					this._config.buckets[b] = this._config.buckets[l-1] + (parseInt(e/this._config.bucket_extension_interval)+1)*this._config.bucket_extension_interval;
				if(this._config.buckets[b-1] === undefined)
					this._config.buckets[b-1] = this._config.buckets[l-1] + parseInt(e/this._config.bucket_extension_interval)*this._config.bucket_extension_interval;
			}
			for(; b<l; b++) {
				if(a < this._config.buckets[b]) {
					break;
				}
			}
		}
		else if(this._config.bucket_precision) {
			b = Math.floor(a/this._config.bucket_precision);
		}

		return b;
	},

	_add_cache: function(a) {
		var tuple=[1], i;
		if(a instanceof Array) {
			tuple = a;
			a = tuple.shift();
		}

		this.sum += a*tuple[0];
		this.sum_of_squares += a*a*tuple[0];
		if(a === 0) {
			this.zeroes++;
		}
		else {
			this.sum_of_logs += Math.log(a)*tuple[0];
			this.sum_of_square_of_logs += Math.pow(Math.log(a), 2)*tuple[0];
		}
		this.length += tuple[0];

		if(tuple[0] > 0) {
			if(this.max === null || this.max < a)
				this.max = a;
			if(this.min === null || this.min > a)
				this.min = a;
		}

		if(this.buckets) {
			var b = this._find_bucket(a);
			if(!this.buckets[b])
				this.buckets[b] = [0];
			this.buckets[b][0] += tuple.shift();

			for(i=0; i<tuple.length; i++)
				this.buckets[b][i+1] = (this.buckets[b][i+1]|0) + (tuple[i]|0);
		}

		this._reset_cache();
	},

	_del_cache: function(a) {
		var tuple=[1], i;
		if(a instanceof Array) {
			tuple = a;
			a = tuple.shift();
		}

		this.sum -= a*tuple[0];
		this.sum_of_squares -= a*a*tuple[0];
		if(a === 0) {
			this.zeroes--;
		}
		else {
			this.sum_of_logs -= Math.log(a)*tuple[0];
			this.sum_of_square_of_logs -= Math.pow(Math.log(a), 2)*tuple[0];
		}
		this.length -= tuple[0];

		if(this._config.store_data) {
			if(this.length === 0) {
				this.max = this.min = null;
			}
			if(this.length === 1) {
				this.max = this.min = this.data[0];
			}
			else if(tuple[0] > 0 && (this.max === a || this.min === a)) {
				var i = this.length-1;
				if(i>=0) {
					this.max = this.min = this.data[i--];
					while(i-- >= 0) {
						if(this.max < this.data[i])
							this.max = this.data[i];
						if(this.min > this.data[i])
							this.min = this.data[i];
					}
				}
			}
		}

		if(this.buckets) {
			var b=this._find_bucket(a);
			if(this.buckets[b]) {
				this.buckets[b][0] -= tuple.shift();

				if(this.buckets[b][0] === 0)
					delete this.buckets[b];
				else
					for(i=0; i<tuple.length; i++)
						this.buckets[b][i+1] = (this.buckets[b][i+1]|0) - (tuple[i]|0);
			}
		}

		this._reset_cache();
	},

	push: function() {
		var i, a, args=Array.prototype.slice.call(arguments, 0);
		if(args.length && args[0] instanceof Array)
			args = args[0];
		for(i=0; i<args.length; i++) {
			a = args[i];
			if(this._config.store_data)
				this.data.push(a);
			this._add_cache(a);
		}

		return this;
	},

	push_tuple: function(tuple) {
		if(!this.buckets) {
			throw new Error("push_tuple is only valid when using buckets");
		}
		this._add_cache(tuple);
	},

	pop: function() {
		if(this.length === 0 || this._config.store_data === false)
			return undefined;

		var a = this.data.pop();
		this._del_cache(a);

		return a;
	},

	remove_tuple: function(tuple) {
		if(!this.buckets) {
			throw new Error("remove_tuple is only valid when using buckets");
		}
		this._del_cache(tuple);
	},

	reset_tuples: function(tuple) {
		var b, l, t, ts=tuple.length;
		if(!this.buckets) {
			throw new Error("reset_tuple is only valid when using buckets");
		}

		for(b=0, l=this.buckets.length; b<l; b++) {
			if(!this.buckets[b] || this.buckets[b].length <= 1) {
				continue;
			}
			for(t=0; t<ts; t++) {
				if(typeof tuple[t] !== 'undefined') {
					this.buckets[b][t] = tuple[t];
				}
			}
		}
	},

	unshift: function() {
		var i, a, args=Array.prototype.slice.call(arguments, 0);
		if(args.length && args[0] instanceof Array)
			args = args[0];
		i=args.length;
		while(i--) {
			a = args[i];
			if(this._config.store_data)
				this.data.unshift(a);
			this._add_cache(a);
		}

		return this;
	},

	shift: function() {
		if(this.length === 0 || this._config.store_data === false)
			return undefined;

		var a = this.data.shift();
		this._del_cache(a);

		return a;
	},

	amean: function() {
		if(this.length === 0)
			return NaN;
		return this.sum/this.length;
	},

	gmean: function() {
		if(this.length === 0)
			return NaN;
		if(this.zeroes > 0)
			return NaN;
		return Math.exp(this.sum_of_logs/this.length);
	},

	stddev: function() {
		if(this.length === 0)
			return NaN;
		var n=this.length;
		if(this._config.sampling)
			n--;
		if(this._stddev === null)
			this._stddev = Math.sqrt((this.length * this.sum_of_squares - this.sum*this.sum)/(this.length*n));

		return this._stddev;
	},

	gstddev: function() {
		if(this.length === 0)
			return NaN;
		if(this.zeroes > 0)
			return NaN;
		var n=this.length;
		if(this._config.sampling)
			n--;
		return Math.exp(Math.sqrt((this.length * this.sum_of_square_of_logs - this.sum_of_logs*this.sum_of_logs)/(this.length*n)));
	},

	moe: function() {
		if(this.length === 0)
			return NaN;
		// see http://en.wikipedia.org/wiki/Standard_error_%28statistics%29
		return 1.96*this.stddev()/Math.sqrt(this.length);
	},

	range: function() {
		if(this.length === 0)
			return [NaN, NaN];
		return [this.min, this.max];
	},

	distribution: function() {
		if(this.length === 0)
			return [];
		if(!this.buckets)
			throw new Error("bucket_precision or buckets not configured.");

		var d=[], i, j, k, l;

		if(this._config.buckets) {
			j=this.min;
			l=Math.min(this.buckets.length, this._config.buckets.length);

			for(i=0; i<l; j=this._config.buckets[i++]) {	// this has to be i++ and not ++i
				if(this._config.buckets[i] === undefined && this._config.bucket_extension_interval)
					this._config.buckets[i] = this._config.buckets[i-1] + this._config.bucket_extension_interval;
				if(this.min > this._config.buckets[i])
					continue;

				d[i] = {
					bucket: (j+this._config.buckets[i])/2,
					range: [j, this._config.buckets[i]],
					count: (this.buckets[i]?this.buckets[i][0]:0),
					tuple: this.buckets[i]?this.buckets[i].slice(1):[]
				};

				if(this.max < this._config.buckets[i])
					break;
			}
			if(i == l && this.buckets[i]) {
				d[i] = {
					bucket: (j + this.max)/2,
					range: [j, this.max],
					count: this.buckets[i][0],
					tuple: this.buckets[i]?this.buckets[i].slice(1):[]
				};
			}
		}
		else if(this._config.bucket_precision) {
			i=Math.floor(this.min/this._config.bucket_precision);
			l=Math.floor(this.max/this._config.bucket_precision)+1;
			for(j=0; i<l && i<this.buckets.length; i++, j++) {
				if(!this.buckets[i]) {
					continue;
				}
				d[j] = {
					bucket: (i+0.5)*this._config.bucket_precision,
					range: [i*this._config.bucket_precision, (i+1)*this._config.bucket_precision],
					count: this.buckets[i][0],
					tuple: this.buckets[i]?this.buckets[i].slice(1):[]
				};
			}
		}

		return d;
		
	},

	percentile: function(p) {
		if(this.length === 0 || (!this._config.store_data && !this.buckets))
			return NaN;

		// If we come here, we either have sorted data or sorted buckets

		var v;

		if(p <=  0)
			v=0;
		else if(p == 25)
			v = [Math.floor((this.length-1)*0.25), Math.ceil((this.length-1)*0.25)];
		else if(p == 50)
			v = [Math.floor((this.length-1)*0.5), Math.ceil((this.length-1)*0.5)];
		else if(p == 75)
			v = [Math.floor((this.length-1)*0.75), Math.ceil((this.length-1)*0.75)];
		else if(p >= 100)
			v = this.length-1;
		else
			v = Math.floor(this.length*p/100);

		if(v === 0)
			return this.min;
		if(v === this.length-1)
			return this.max;

		if(this._config.store_data) {
			if(this._data_sorted === null)
				this._data_sorted = this.data.slice(0).sort(asc);

			if(typeof v == 'number')
				return this._data_sorted[v];
			else
				return (this._data_sorted[v[0]] + this._data_sorted[v[1]])/2;
		}
		else {
			var j;
			if(typeof v != 'number')
				v = (v[0]+v[1])/2;

			if(this._config.buckets)
				j=0;
			else if(this._config.bucket_precision)
				j = Math.floor(this.min/this._config.bucket_precision);

			for(; j<this.buckets.length; j++) {
				if(!this.buckets[j])
					continue;
				if(v<=this.buckets[j][0]) {
					break;
				}
				v-=this.buckets[j][0];
			}

			return this._get_nth_in_bucket(v, j);
		}
	},

	_get_nth_in_bucket: function(n, b) {
		var range = [];
		if(this._config.buckets) {
			range[0] = (b>0?this._config.buckets[b-1]:this.min);
			range[1] = (b<this._config.buckets.length?this._config.buckets[b]:this.max);
		}
		else if(this._config.bucket_precision) {
			range[0] = Math.max(b*this._config.bucket_precision, this.min);
			range[1] = Math.min((b+1)*this._config.bucket_precision, this.max);
		}
		return range[0] + (range[1] - range[0])*n/this.buckets[b][0];
	},

	median: function() {
		return this.percentile(50);
	},

	iqr: function() {
		var q1, q3, fw;

		q1 = this.percentile(25);
		q3 = this.percentile(75);
	
		fw = (q3-q1)*1.5;
	
		return this.band_pass(q1-fw, q3+fw, true);
	},

	band_pass: function(low, high, open, config) {
		var i, j, b, b_val, i_val;

		if(!config)
			config = this._config;

		b = new Stats(config);

		if(this.length === 0)
			return b;

		if(this._config.store_data) {
			if(this._data_sorted === null)
				this._data_sorted = this.data.slice(0).sort(asc);
	
			for(i=0; i<this.length && (this._data_sorted[i] < high || (!open && this._data_sorted[i] === high)); i++) {
				if(this._data_sorted[i] > low || (!open && this._data_sorted[i] === low)) {
					b.push(this._data_sorted[i]);
				}
			}
		}
		else if(this._config.buckets) {
			for(i=0; i<=this._config.buckets.length; i++) {
				if(this._config.buckets[i] < this.min)
					continue;

				b_val = (i==0?this.min:this._config.buckets[i-1]);
				if(b_val < this.min)
					b_val = this.min;
				if(b_val > this.max)
					b_val = this.max;

				if(high < b_val || (open && high === b_val)) {
					break;
				}
				if(low < b_val || (!open && low === b_val)) {
					for(j=0; j<(this.buckets[i]?this.buckets[i][0]:0); j++) {
						i_val = Stats.prototype._get_nth_in_bucket.call(this, j, i);
						if( (i_val > low || (!open && i_val === low))
							&& (i_val < high || (!open && i_val === high))
						) {
							b.push(i_val);
						}
					}
				}
			}

			b.min = Math.max(low, b.min);
			b.max = Math.min(high, b.max);
		}
		else if(this._config.bucket_precision) {
			var low_i = Math.floor(low/this._config.bucket_precision),
			    high_i = Math.floor(high/this._config.bucket_precision)+1;

			for(i=low_i; i<Math.min(this.buckets.length, high_i); i++) {
				for(j=0; j<(this.buckets[i]?this.buckets[i][0]:0); j++) {
					i_val = Stats.prototype._get_nth_in_bucket.call(this, j, i);
					if( (i_val > low || (!open && i_val === low))
						&& (i_val < high || (!open && i_val === high))
					) {
						b.push(i_val);
					}
				}
			}

			b.min = Math.max(low, b.min);
			b.max = Math.min(high, b.max);
		}

		return b;
	},

	copy: function(config) {
		var b = Stats.prototype.band_pass.call(this, this.min, this.max, false, config);

		b.sum = this.sum;
		b.sum_of_squares = this.sum_of_squares;
		b.sum_of_logs = this.sum_of_logs;
		b.sum_of_square_of_logs = this.sum_of_square_of_logs;
		b.zeroes = this.zeroes;

		return b;
	},

	Σ: function() {
		return this.sum;
	},

	Π: function() {
		return this.zeroes > 0 ? 0 : Math.exp(this.sum_of_logs);
	}
};

Stats.prototype.σ=Stats.prototype.stddev;
Stats.prototype.μ=Stats.prototype.amean;


exports.Stats = Stats;

if(process.argv[1] && process.argv[1].match(__filename)) {
	var s = new Stats().push(1, 2, 3);
	var l = process.argv.slice(2);
	if(!l.length) l = [10, 11, 15, 8, 13, 12, 19, 32, 17, 16];
	l.forEach(function(e, i, a) { a[i] = parseFloat(e, 10); });
	Stats.prototype.push.apply(s, l);
	console.log(s.amean().toFixed(2), s.μ().toFixed(2), s.stddev().toFixed(2), s.σ().toFixed(2), s.gmean().toFixed(2), s.median().toFixed(2), s.moe().toFixed(2));
}

}).call(this,require("g5I+bs"),"/node_modules/fast-stats/faststats.js")
},{"g5I+bs":5}],4:[function(require,module,exports){
//! moment.js
//! version : 2.13.0
//! authors : Tim Wood, Iskren Chernev, Moment.js contributors
//! license : MIT
//! momentjs.com

;(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    global.moment = factory()
}(this, function () { 'use strict';

    var hookCallback;

    function utils_hooks__hooks () {
        return hookCallback.apply(null, arguments);
    }

    // This is done to register the method called with moment()
    // without creating circular dependencies.
    function setHookCallback (callback) {
        hookCallback = callback;
    }

    function isArray(input) {
        return input instanceof Array || Object.prototype.toString.call(input) === '[object Array]';
    }

    function isDate(input) {
        return input instanceof Date || Object.prototype.toString.call(input) === '[object Date]';
    }

    function map(arr, fn) {
        var res = [], i;
        for (i = 0; i < arr.length; ++i) {
            res.push(fn(arr[i], i));
        }
        return res;
    }

    function hasOwnProp(a, b) {
        return Object.prototype.hasOwnProperty.call(a, b);
    }

    function extend(a, b) {
        for (var i in b) {
            if (hasOwnProp(b, i)) {
                a[i] = b[i];
            }
        }

        if (hasOwnProp(b, 'toString')) {
            a.toString = b.toString;
        }

        if (hasOwnProp(b, 'valueOf')) {
            a.valueOf = b.valueOf;
        }

        return a;
    }

    function create_utc__createUTC (input, format, locale, strict) {
        return createLocalOrUTC(input, format, locale, strict, true).utc();
    }

    function defaultParsingFlags() {
        // We need to deep clone this object.
        return {
            empty           : false,
            unusedTokens    : [],
            unusedInput     : [],
            overflow        : -2,
            charsLeftOver   : 0,
            nullInput       : false,
            invalidMonth    : null,
            invalidFormat   : false,
            userInvalidated : false,
            iso             : false,
            parsedDateParts : [],
            meridiem        : null
        };
    }

    function getParsingFlags(m) {
        if (m._pf == null) {
            m._pf = defaultParsingFlags();
        }
        return m._pf;
    }

    var some;
    if (Array.prototype.some) {
        some = Array.prototype.some;
    } else {
        some = function (fun) {
            var t = Object(this);
            var len = t.length >>> 0;

            for (var i = 0; i < len; i++) {
                if (i in t && fun.call(this, t[i], i, t)) {
                    return true;
                }
            }

            return false;
        };
    }

    function valid__isValid(m) {
        if (m._isValid == null) {
            var flags = getParsingFlags(m);
            var parsedParts = some.call(flags.parsedDateParts, function (i) {
                return i != null;
            });
            m._isValid = !isNaN(m._d.getTime()) &&
                flags.overflow < 0 &&
                !flags.empty &&
                !flags.invalidMonth &&
                !flags.invalidWeekday &&
                !flags.nullInput &&
                !flags.invalidFormat &&
                !flags.userInvalidated &&
                (!flags.meridiem || (flags.meridiem && parsedParts));

            if (m._strict) {
                m._isValid = m._isValid &&
                    flags.charsLeftOver === 0 &&
                    flags.unusedTokens.length === 0 &&
                    flags.bigHour === undefined;
            }
        }
        return m._isValid;
    }

    function valid__createInvalid (flags) {
        var m = create_utc__createUTC(NaN);
        if (flags != null) {
            extend(getParsingFlags(m), flags);
        }
        else {
            getParsingFlags(m).userInvalidated = true;
        }

        return m;
    }

    function isUndefined(input) {
        return input === void 0;
    }

    // Plugins that add properties should also add the key here (null value),
    // so we can properly clone ourselves.
    var momentProperties = utils_hooks__hooks.momentProperties = [];

    function copyConfig(to, from) {
        var i, prop, val;

        if (!isUndefined(from._isAMomentObject)) {
            to._isAMomentObject = from._isAMomentObject;
        }
        if (!isUndefined(from._i)) {
            to._i = from._i;
        }
        if (!isUndefined(from._f)) {
            to._f = from._f;
        }
        if (!isUndefined(from._l)) {
            to._l = from._l;
        }
        if (!isUndefined(from._strict)) {
            to._strict = from._strict;
        }
        if (!isUndefined(from._tzm)) {
            to._tzm = from._tzm;
        }
        if (!isUndefined(from._isUTC)) {
            to._isUTC = from._isUTC;
        }
        if (!isUndefined(from._offset)) {
            to._offset = from._offset;
        }
        if (!isUndefined(from._pf)) {
            to._pf = getParsingFlags(from);
        }
        if (!isUndefined(from._locale)) {
            to._locale = from._locale;
        }

        if (momentProperties.length > 0) {
            for (i in momentProperties) {
                prop = momentProperties[i];
                val = from[prop];
                if (!isUndefined(val)) {
                    to[prop] = val;
                }
            }
        }

        return to;
    }

    var updateInProgress = false;

    // Moment prototype object
    function Moment(config) {
        copyConfig(this, config);
        this._d = new Date(config._d != null ? config._d.getTime() : NaN);
        // Prevent infinite loop in case updateOffset creates new moment
        // objects.
        if (updateInProgress === false) {
            updateInProgress = true;
            utils_hooks__hooks.updateOffset(this);
            updateInProgress = false;
        }
    }

    function isMoment (obj) {
        return obj instanceof Moment || (obj != null && obj._isAMomentObject != null);
    }

    function absFloor (number) {
        if (number < 0) {
            return Math.ceil(number);
        } else {
            return Math.floor(number);
        }
    }

    function toInt(argumentForCoercion) {
        var coercedNumber = +argumentForCoercion,
            value = 0;

        if (coercedNumber !== 0 && isFinite(coercedNumber)) {
            value = absFloor(coercedNumber);
        }

        return value;
    }

    // compare two arrays, return the number of differences
    function compareArrays(array1, array2, dontConvert) {
        var len = Math.min(array1.length, array2.length),
            lengthDiff = Math.abs(array1.length - array2.length),
            diffs = 0,
            i;
        for (i = 0; i < len; i++) {
            if ((dontConvert && array1[i] !== array2[i]) ||
                (!dontConvert && toInt(array1[i]) !== toInt(array2[i]))) {
                diffs++;
            }
        }
        return diffs + lengthDiff;
    }

    function warn(msg) {
        if (utils_hooks__hooks.suppressDeprecationWarnings === false &&
                (typeof console !==  'undefined') && console.warn) {
            console.warn('Deprecation warning: ' + msg);
        }
    }

    function deprecate(msg, fn) {
        var firstTime = true;

        return extend(function () {
            if (utils_hooks__hooks.deprecationHandler != null) {
                utils_hooks__hooks.deprecationHandler(null, msg);
            }
            if (firstTime) {
                warn(msg + '\nArguments: ' + Array.prototype.slice.call(arguments).join(', ') + '\n' + (new Error()).stack);
                firstTime = false;
            }
            return fn.apply(this, arguments);
        }, fn);
    }

    var deprecations = {};

    function deprecateSimple(name, msg) {
        if (utils_hooks__hooks.deprecationHandler != null) {
            utils_hooks__hooks.deprecationHandler(name, msg);
        }
        if (!deprecations[name]) {
            warn(msg);
            deprecations[name] = true;
        }
    }

    utils_hooks__hooks.suppressDeprecationWarnings = false;
    utils_hooks__hooks.deprecationHandler = null;

    function isFunction(input) {
        return input instanceof Function || Object.prototype.toString.call(input) === '[object Function]';
    }

    function isObject(input) {
        return Object.prototype.toString.call(input) === '[object Object]';
    }

    function locale_set__set (config) {
        var prop, i;
        for (i in config) {
            prop = config[i];
            if (isFunction(prop)) {
                this[i] = prop;
            } else {
                this['_' + i] = prop;
            }
        }
        this._config = config;
        // Lenient ordinal parsing accepts just a number in addition to
        // number + (possibly) stuff coming from _ordinalParseLenient.
        this._ordinalParseLenient = new RegExp(this._ordinalParse.source + '|' + (/\d{1,2}/).source);
    }

    function mergeConfigs(parentConfig, childConfig) {
        var res = extend({}, parentConfig), prop;
        for (prop in childConfig) {
            if (hasOwnProp(childConfig, prop)) {
                if (isObject(parentConfig[prop]) && isObject(childConfig[prop])) {
                    res[prop] = {};
                    extend(res[prop], parentConfig[prop]);
                    extend(res[prop], childConfig[prop]);
                } else if (childConfig[prop] != null) {
                    res[prop] = childConfig[prop];
                } else {
                    delete res[prop];
                }
            }
        }
        return res;
    }

    function Locale(config) {
        if (config != null) {
            this.set(config);
        }
    }

    var keys;

    if (Object.keys) {
        keys = Object.keys;
    } else {
        keys = function (obj) {
            var i, res = [];
            for (i in obj) {
                if (hasOwnProp(obj, i)) {
                    res.push(i);
                }
            }
            return res;
        };
    }

    // internal storage for locale config files
    var locales = {};
    var globalLocale;

    function normalizeLocale(key) {
        return key ? key.toLowerCase().replace('_', '-') : key;
    }

    // pick the locale from the array
    // try ['en-au', 'en-gb'] as 'en-au', 'en-gb', 'en', as in move through the list trying each
    // substring from most specific to least, but move to the next array item if it's a more specific variant than the current root
    function chooseLocale(names) {
        var i = 0, j, next, locale, split;

        while (i < names.length) {
            split = normalizeLocale(names[i]).split('-');
            j = split.length;
            next = normalizeLocale(names[i + 1]);
            next = next ? next.split('-') : null;
            while (j > 0) {
                locale = loadLocale(split.slice(0, j).join('-'));
                if (locale) {
                    return locale;
                }
                if (next && next.length >= j && compareArrays(split, next, true) >= j - 1) {
                    //the next array item is better than a shallower substring of this one
                    break;
                }
                j--;
            }
            i++;
        }
        return null;
    }

    function loadLocale(name) {
        var oldLocale = null;
        // TODO: Find a better way to register and load all the locales in Node
        if (!locales[name] && (typeof module !== 'undefined') &&
                module && module.exports) {
            try {
                oldLocale = globalLocale._abbr;
                require('./locale/' + name);
                // because defineLocale currently also sets the global locale, we
                // want to undo that for lazy loaded locales
                locale_locales__getSetGlobalLocale(oldLocale);
            } catch (e) { }
        }
        return locales[name];
    }

    // This function will load locale and then set the global locale.  If
    // no arguments are passed in, it will simply return the current global
    // locale key.
    function locale_locales__getSetGlobalLocale (key, values) {
        var data;
        if (key) {
            if (isUndefined(values)) {
                data = locale_locales__getLocale(key);
            }
            else {
                data = defineLocale(key, values);
            }

            if (data) {
                // moment.duration._locale = moment._locale = data;
                globalLocale = data;
            }
        }

        return globalLocale._abbr;
    }

    function defineLocale (name, config) {
        if (config !== null) {
            config.abbr = name;
            if (locales[name] != null) {
                deprecateSimple('defineLocaleOverride',
                        'use moment.updateLocale(localeName, config) to change ' +
                        'an existing locale. moment.defineLocale(localeName, ' +
                        'config) should only be used for creating a new locale');
                config = mergeConfigs(locales[name]._config, config);
            } else if (config.parentLocale != null) {
                if (locales[config.parentLocale] != null) {
                    config = mergeConfigs(locales[config.parentLocale]._config, config);
                } else {
                    // treat as if there is no base config
                    deprecateSimple('parentLocaleUndefined',
                            'specified parentLocale is not defined yet');
                }
            }
            locales[name] = new Locale(config);

            // backwards compat for now: also set the locale
            locale_locales__getSetGlobalLocale(name);

            return locales[name];
        } else {
            // useful for testing
            delete locales[name];
            return null;
        }
    }

    function updateLocale(name, config) {
        if (config != null) {
            var locale;
            if (locales[name] != null) {
                config = mergeConfigs(locales[name]._config, config);
            }
            locale = new Locale(config);
            locale.parentLocale = locales[name];
            locales[name] = locale;

            // backwards compat for now: also set the locale
            locale_locales__getSetGlobalLocale(name);
        } else {
            // pass null for config to unupdate, useful for tests
            if (locales[name] != null) {
                if (locales[name].parentLocale != null) {
                    locales[name] = locales[name].parentLocale;
                } else if (locales[name] != null) {
                    delete locales[name];
                }
            }
        }
        return locales[name];
    }

    // returns locale data
    function locale_locales__getLocale (key) {
        var locale;

        if (key && key._locale && key._locale._abbr) {
            key = key._locale._abbr;
        }

        if (!key) {
            return globalLocale;
        }

        if (!isArray(key)) {
            //short-circuit everything else
            locale = loadLocale(key);
            if (locale) {
                return locale;
            }
            key = [key];
        }

        return chooseLocale(key);
    }

    function locale_locales__listLocales() {
        return keys(locales);
    }

    var aliases = {};

    function addUnitAlias (unit, shorthand) {
        var lowerCase = unit.toLowerCase();
        aliases[lowerCase] = aliases[lowerCase + 's'] = aliases[shorthand] = unit;
    }

    function normalizeUnits(units) {
        return typeof units === 'string' ? aliases[units] || aliases[units.toLowerCase()] : undefined;
    }

    function normalizeObjectUnits(inputObject) {
        var normalizedInput = {},
            normalizedProp,
            prop;

        for (prop in inputObject) {
            if (hasOwnProp(inputObject, prop)) {
                normalizedProp = normalizeUnits(prop);
                if (normalizedProp) {
                    normalizedInput[normalizedProp] = inputObject[prop];
                }
            }
        }

        return normalizedInput;
    }

    function makeGetSet (unit, keepTime) {
        return function (value) {
            if (value != null) {
                get_set__set(this, unit, value);
                utils_hooks__hooks.updateOffset(this, keepTime);
                return this;
            } else {
                return get_set__get(this, unit);
            }
        };
    }

    function get_set__get (mom, unit) {
        return mom.isValid() ?
            mom._d['get' + (mom._isUTC ? 'UTC' : '') + unit]() : NaN;
    }

    function get_set__set (mom, unit, value) {
        if (mom.isValid()) {
            mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](value);
        }
    }

    // MOMENTS

    function getSet (units, value) {
        var unit;
        if (typeof units === 'object') {
            for (unit in units) {
                this.set(unit, units[unit]);
            }
        } else {
            units = normalizeUnits(units);
            if (isFunction(this[units])) {
                return this[units](value);
            }
        }
        return this;
    }

    function zeroFill(number, targetLength, forceSign) {
        var absNumber = '' + Math.abs(number),
            zerosToFill = targetLength - absNumber.length,
            sign = number >= 0;
        return (sign ? (forceSign ? '+' : '') : '-') +
            Math.pow(10, Math.max(0, zerosToFill)).toString().substr(1) + absNumber;
    }

    var formattingTokens = /(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|kk?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g;

    var localFormattingTokens = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g;

    var formatFunctions = {};

    var formatTokenFunctions = {};

    // token:    'M'
    // padded:   ['MM', 2]
    // ordinal:  'Mo'
    // callback: function () { this.month() + 1 }
    function addFormatToken (token, padded, ordinal, callback) {
        var func = callback;
        if (typeof callback === 'string') {
            func = function () {
                return this[callback]();
            };
        }
        if (token) {
            formatTokenFunctions[token] = func;
        }
        if (padded) {
            formatTokenFunctions[padded[0]] = function () {
                return zeroFill(func.apply(this, arguments), padded[1], padded[2]);
            };
        }
        if (ordinal) {
            formatTokenFunctions[ordinal] = function () {
                return this.localeData().ordinal(func.apply(this, arguments), token);
            };
        }
    }

    function removeFormattingTokens(input) {
        if (input.match(/\[[\s\S]/)) {
            return input.replace(/^\[|\]$/g, '');
        }
        return input.replace(/\\/g, '');
    }

    function makeFormatFunction(format) {
        var array = format.match(formattingTokens), i, length;

        for (i = 0, length = array.length; i < length; i++) {
            if (formatTokenFunctions[array[i]]) {
                array[i] = formatTokenFunctions[array[i]];
            } else {
                array[i] = removeFormattingTokens(array[i]);
            }
        }

        return function (mom) {
            var output = '', i;
            for (i = 0; i < length; i++) {
                output += array[i] instanceof Function ? array[i].call(mom, format) : array[i];
            }
            return output;
        };
    }

    // format date using native date object
    function formatMoment(m, format) {
        if (!m.isValid()) {
            return m.localeData().invalidDate();
        }

        format = expandFormat(format, m.localeData());
        formatFunctions[format] = formatFunctions[format] || makeFormatFunction(format);

        return formatFunctions[format](m);
    }

    function expandFormat(format, locale) {
        var i = 5;

        function replaceLongDateFormatTokens(input) {
            return locale.longDateFormat(input) || input;
        }

        localFormattingTokens.lastIndex = 0;
        while (i >= 0 && localFormattingTokens.test(format)) {
            format = format.replace(localFormattingTokens, replaceLongDateFormatTokens);
            localFormattingTokens.lastIndex = 0;
            i -= 1;
        }

        return format;
    }

    var match1         = /\d/;            //       0 - 9
    var match2         = /\d\d/;          //      00 - 99
    var match3         = /\d{3}/;         //     000 - 999
    var match4         = /\d{4}/;         //    0000 - 9999
    var match6         = /[+-]?\d{6}/;    // -999999 - 999999
    var match1to2      = /\d\d?/;         //       0 - 99
    var match3to4      = /\d\d\d\d?/;     //     999 - 9999
    var match5to6      = /\d\d\d\d\d\d?/; //   99999 - 999999
    var match1to3      = /\d{1,3}/;       //       0 - 999
    var match1to4      = /\d{1,4}/;       //       0 - 9999
    var match1to6      = /[+-]?\d{1,6}/;  // -999999 - 999999

    var matchUnsigned  = /\d+/;           //       0 - inf
    var matchSigned    = /[+-]?\d+/;      //    -inf - inf

    var matchOffset    = /Z|[+-]\d\d:?\d\d/gi; // +00:00 -00:00 +0000 -0000 or Z
    var matchShortOffset = /Z|[+-]\d\d(?::?\d\d)?/gi; // +00 -00 +00:00 -00:00 +0000 -0000 or Z

    var matchTimestamp = /[+-]?\d+(\.\d{1,3})?/; // 123456789 123456789.123

    // any word (or two) characters or numbers including two/three word month in arabic.
    // includes scottish gaelic two word and hyphenated months
    var matchWord = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i;


    var regexes = {};

    function addRegexToken (token, regex, strictRegex) {
        regexes[token] = isFunction(regex) ? regex : function (isStrict, localeData) {
            return (isStrict && strictRegex) ? strictRegex : regex;
        };
    }

    function getParseRegexForToken (token, config) {
        if (!hasOwnProp(regexes, token)) {
            return new RegExp(unescapeFormat(token));
        }

        return regexes[token](config._strict, config._locale);
    }

    // Code from http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
    function unescapeFormat(s) {
        return regexEscape(s.replace('\\', '').replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function (matched, p1, p2, p3, p4) {
            return p1 || p2 || p3 || p4;
        }));
    }

    function regexEscape(s) {
        return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }

    var tokens = {};

    function addParseToken (token, callback) {
        var i, func = callback;
        if (typeof token === 'string') {
            token = [token];
        }
        if (typeof callback === 'number') {
            func = function (input, array) {
                array[callback] = toInt(input);
            };
        }
        for (i = 0; i < token.length; i++) {
            tokens[token[i]] = func;
        }
    }

    function addWeekParseToken (token, callback) {
        addParseToken(token, function (input, array, config, token) {
            config._w = config._w || {};
            callback(input, config._w, config, token);
        });
    }

    function addTimeToArrayFromToken(token, input, config) {
        if (input != null && hasOwnProp(tokens, token)) {
            tokens[token](input, config._a, config, token);
        }
    }

    var YEAR = 0;
    var MONTH = 1;
    var DATE = 2;
    var HOUR = 3;
    var MINUTE = 4;
    var SECOND = 5;
    var MILLISECOND = 6;
    var WEEK = 7;
    var WEEKDAY = 8;

    var indexOf;

    if (Array.prototype.indexOf) {
        indexOf = Array.prototype.indexOf;
    } else {
        indexOf = function (o) {
            // I know
            var i;
            for (i = 0; i < this.length; ++i) {
                if (this[i] === o) {
                    return i;
                }
            }
            return -1;
        };
    }

    function daysInMonth(year, month) {
        return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    }

    // FORMATTING

    addFormatToken('M', ['MM', 2], 'Mo', function () {
        return this.month() + 1;
    });

    addFormatToken('MMM', 0, 0, function (format) {
        return this.localeData().monthsShort(this, format);
    });

    addFormatToken('MMMM', 0, 0, function (format) {
        return this.localeData().months(this, format);
    });

    // ALIASES

    addUnitAlias('month', 'M');

    // PARSING

    addRegexToken('M',    match1to2);
    addRegexToken('MM',   match1to2, match2);
    addRegexToken('MMM',  function (isStrict, locale) {
        return locale.monthsShortRegex(isStrict);
    });
    addRegexToken('MMMM', function (isStrict, locale) {
        return locale.monthsRegex(isStrict);
    });

    addParseToken(['M', 'MM'], function (input, array) {
        array[MONTH] = toInt(input) - 1;
    });

    addParseToken(['MMM', 'MMMM'], function (input, array, config, token) {
        var month = config._locale.monthsParse(input, token, config._strict);
        // if we didn't find a month name, mark the date as invalid.
        if (month != null) {
            array[MONTH] = month;
        } else {
            getParsingFlags(config).invalidMonth = input;
        }
    });

    // LOCALES

    var MONTHS_IN_FORMAT = /D[oD]?(\[[^\[\]]*\]|\s+)+MMMM?/;
    var defaultLocaleMonths = 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_');
    function localeMonths (m, format) {
        return isArray(this._months) ? this._months[m.month()] :
            this._months[MONTHS_IN_FORMAT.test(format) ? 'format' : 'standalone'][m.month()];
    }

    var defaultLocaleMonthsShort = 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_');
    function localeMonthsShort (m, format) {
        return isArray(this._monthsShort) ? this._monthsShort[m.month()] :
            this._monthsShort[MONTHS_IN_FORMAT.test(format) ? 'format' : 'standalone'][m.month()];
    }

    function units_month__handleStrictParse(monthName, format, strict) {
        var i, ii, mom, llc = monthName.toLocaleLowerCase();
        if (!this._monthsParse) {
            // this is not used
            this._monthsParse = [];
            this._longMonthsParse = [];
            this._shortMonthsParse = [];
            for (i = 0; i < 12; ++i) {
                mom = create_utc__createUTC([2000, i]);
                this._shortMonthsParse[i] = this.monthsShort(mom, '').toLocaleLowerCase();
                this._longMonthsParse[i] = this.months(mom, '').toLocaleLowerCase();
            }
        }

        if (strict) {
            if (format === 'MMM') {
                ii = indexOf.call(this._shortMonthsParse, llc);
                return ii !== -1 ? ii : null;
            } else {
                ii = indexOf.call(this._longMonthsParse, llc);
                return ii !== -1 ? ii : null;
            }
        } else {
            if (format === 'MMM') {
                ii = indexOf.call(this._shortMonthsParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._longMonthsParse, llc);
                return ii !== -1 ? ii : null;
            } else {
                ii = indexOf.call(this._longMonthsParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._shortMonthsParse, llc);
                return ii !== -1 ? ii : null;
            }
        }
    }

    function localeMonthsParse (monthName, format, strict) {
        var i, mom, regex;

        if (this._monthsParseExact) {
            return units_month__handleStrictParse.call(this, monthName, format, strict);
        }

        if (!this._monthsParse) {
            this._monthsParse = [];
            this._longMonthsParse = [];
            this._shortMonthsParse = [];
        }

        // TODO: add sorting
        // Sorting makes sure if one month (or abbr) is a prefix of another
        // see sorting in computeMonthsParse
        for (i = 0; i < 12; i++) {
            // make the regex if we don't have it already
            mom = create_utc__createUTC([2000, i]);
            if (strict && !this._longMonthsParse[i]) {
                this._longMonthsParse[i] = new RegExp('^' + this.months(mom, '').replace('.', '') + '$', 'i');
                this._shortMonthsParse[i] = new RegExp('^' + this.monthsShort(mom, '').replace('.', '') + '$', 'i');
            }
            if (!strict && !this._monthsParse[i]) {
                regex = '^' + this.months(mom, '') + '|^' + this.monthsShort(mom, '');
                this._monthsParse[i] = new RegExp(regex.replace('.', ''), 'i');
            }
            // test the regex
            if (strict && format === 'MMMM' && this._longMonthsParse[i].test(monthName)) {
                return i;
            } else if (strict && format === 'MMM' && this._shortMonthsParse[i].test(monthName)) {
                return i;
            } else if (!strict && this._monthsParse[i].test(monthName)) {
                return i;
            }
        }
    }

    // MOMENTS

    function setMonth (mom, value) {
        var dayOfMonth;

        if (!mom.isValid()) {
            // No op
            return mom;
        }

        if (typeof value === 'string') {
            if (/^\d+$/.test(value)) {
                value = toInt(value);
            } else {
                value = mom.localeData().monthsParse(value);
                // TODO: Another silent failure?
                if (typeof value !== 'number') {
                    return mom;
                }
            }
        }

        dayOfMonth = Math.min(mom.date(), daysInMonth(mom.year(), value));
        mom._d['set' + (mom._isUTC ? 'UTC' : '') + 'Month'](value, dayOfMonth);
        return mom;
    }

    function getSetMonth (value) {
        if (value != null) {
            setMonth(this, value);
            utils_hooks__hooks.updateOffset(this, true);
            return this;
        } else {
            return get_set__get(this, 'Month');
        }
    }

    function getDaysInMonth () {
        return daysInMonth(this.year(), this.month());
    }

    var defaultMonthsShortRegex = matchWord;
    function monthsShortRegex (isStrict) {
        if (this._monthsParseExact) {
            if (!hasOwnProp(this, '_monthsRegex')) {
                computeMonthsParse.call(this);
            }
            if (isStrict) {
                return this._monthsShortStrictRegex;
            } else {
                return this._monthsShortRegex;
            }
        } else {
            return this._monthsShortStrictRegex && isStrict ?
                this._monthsShortStrictRegex : this._monthsShortRegex;
        }
    }

    var defaultMonthsRegex = matchWord;
    function monthsRegex (isStrict) {
        if (this._monthsParseExact) {
            if (!hasOwnProp(this, '_monthsRegex')) {
                computeMonthsParse.call(this);
            }
            if (isStrict) {
                return this._monthsStrictRegex;
            } else {
                return this._monthsRegex;
            }
        } else {
            return this._monthsStrictRegex && isStrict ?
                this._monthsStrictRegex : this._monthsRegex;
        }
    }

    function computeMonthsParse () {
        function cmpLenRev(a, b) {
            return b.length - a.length;
        }

        var shortPieces = [], longPieces = [], mixedPieces = [],
            i, mom;
        for (i = 0; i < 12; i++) {
            // make the regex if we don't have it already
            mom = create_utc__createUTC([2000, i]);
            shortPieces.push(this.monthsShort(mom, ''));
            longPieces.push(this.months(mom, ''));
            mixedPieces.push(this.months(mom, ''));
            mixedPieces.push(this.monthsShort(mom, ''));
        }
        // Sorting makes sure if one month (or abbr) is a prefix of another it
        // will match the longer piece.
        shortPieces.sort(cmpLenRev);
        longPieces.sort(cmpLenRev);
        mixedPieces.sort(cmpLenRev);
        for (i = 0; i < 12; i++) {
            shortPieces[i] = regexEscape(shortPieces[i]);
            longPieces[i] = regexEscape(longPieces[i]);
            mixedPieces[i] = regexEscape(mixedPieces[i]);
        }

        this._monthsRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
        this._monthsShortRegex = this._monthsRegex;
        this._monthsStrictRegex = new RegExp('^(' + longPieces.join('|') + ')', 'i');
        this._monthsShortStrictRegex = new RegExp('^(' + shortPieces.join('|') + ')', 'i');
    }

    function checkOverflow (m) {
        var overflow;
        var a = m._a;

        if (a && getParsingFlags(m).overflow === -2) {
            overflow =
                a[MONTH]       < 0 || a[MONTH]       > 11  ? MONTH :
                a[DATE]        < 1 || a[DATE]        > daysInMonth(a[YEAR], a[MONTH]) ? DATE :
                a[HOUR]        < 0 || a[HOUR]        > 24 || (a[HOUR] === 24 && (a[MINUTE] !== 0 || a[SECOND] !== 0 || a[MILLISECOND] !== 0)) ? HOUR :
                a[MINUTE]      < 0 || a[MINUTE]      > 59  ? MINUTE :
                a[SECOND]      < 0 || a[SECOND]      > 59  ? SECOND :
                a[MILLISECOND] < 0 || a[MILLISECOND] > 999 ? MILLISECOND :
                -1;

            if (getParsingFlags(m)._overflowDayOfYear && (overflow < YEAR || overflow > DATE)) {
                overflow = DATE;
            }
            if (getParsingFlags(m)._overflowWeeks && overflow === -1) {
                overflow = WEEK;
            }
            if (getParsingFlags(m)._overflowWeekday && overflow === -1) {
                overflow = WEEKDAY;
            }

            getParsingFlags(m).overflow = overflow;
        }

        return m;
    }

    // iso 8601 regex
    // 0000-00-00 0000-W00 or 0000-W00-0 + T + 00 or 00:00 or 00:00:00 or 00:00:00.000 + +00:00 or +0000 or +00)
    var extendedIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})-(?:\d\d-\d\d|W\d\d-\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?::\d\d(?::\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?/;
    var basicIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})(?:\d\d\d\d|W\d\d\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?:\d\d(?:\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?/;

    var tzRegex = /Z|[+-]\d\d(?::?\d\d)?/;

    var isoDates = [
        ['YYYYYY-MM-DD', /[+-]\d{6}-\d\d-\d\d/],
        ['YYYY-MM-DD', /\d{4}-\d\d-\d\d/],
        ['GGGG-[W]WW-E', /\d{4}-W\d\d-\d/],
        ['GGGG-[W]WW', /\d{4}-W\d\d/, false],
        ['YYYY-DDD', /\d{4}-\d{3}/],
        ['YYYY-MM', /\d{4}-\d\d/, false],
        ['YYYYYYMMDD', /[+-]\d{10}/],
        ['YYYYMMDD', /\d{8}/],
        // YYYYMM is NOT allowed by the standard
        ['GGGG[W]WWE', /\d{4}W\d{3}/],
        ['GGGG[W]WW', /\d{4}W\d{2}/, false],
        ['YYYYDDD', /\d{7}/]
    ];

    // iso time formats and regexes
    var isoTimes = [
        ['HH:mm:ss.SSSS', /\d\d:\d\d:\d\d\.\d+/],
        ['HH:mm:ss,SSSS', /\d\d:\d\d:\d\d,\d+/],
        ['HH:mm:ss', /\d\d:\d\d:\d\d/],
        ['HH:mm', /\d\d:\d\d/],
        ['HHmmss.SSSS', /\d\d\d\d\d\d\.\d+/],
        ['HHmmss,SSSS', /\d\d\d\d\d\d,\d+/],
        ['HHmmss', /\d\d\d\d\d\d/],
        ['HHmm', /\d\d\d\d/],
        ['HH', /\d\d/]
    ];

    var aspNetJsonRegex = /^\/?Date\((\-?\d+)/i;

    // date from iso format
    function configFromISO(config) {
        var i, l,
            string = config._i,
            match = extendedIsoRegex.exec(string) || basicIsoRegex.exec(string),
            allowTime, dateFormat, timeFormat, tzFormat;

        if (match) {
            getParsingFlags(config).iso = true;

            for (i = 0, l = isoDates.length; i < l; i++) {
                if (isoDates[i][1].exec(match[1])) {
                    dateFormat = isoDates[i][0];
                    allowTime = isoDates[i][2] !== false;
                    break;
                }
            }
            if (dateFormat == null) {
                config._isValid = false;
                return;
            }
            if (match[3]) {
                for (i = 0, l = isoTimes.length; i < l; i++) {
                    if (isoTimes[i][1].exec(match[3])) {
                        // match[2] should be 'T' or space
                        timeFormat = (match[2] || ' ') + isoTimes[i][0];
                        break;
                    }
                }
                if (timeFormat == null) {
                    config._isValid = false;
                    return;
                }
            }
            if (!allowTime && timeFormat != null) {
                config._isValid = false;
                return;
            }
            if (match[4]) {
                if (tzRegex.exec(match[4])) {
                    tzFormat = 'Z';
                } else {
                    config._isValid = false;
                    return;
                }
            }
            config._f = dateFormat + (timeFormat || '') + (tzFormat || '');
            configFromStringAndFormat(config);
        } else {
            config._isValid = false;
        }
    }

    // date from iso format or fallback
    function configFromString(config) {
        var matched = aspNetJsonRegex.exec(config._i);

        if (matched !== null) {
            config._d = new Date(+matched[1]);
            return;
        }

        configFromISO(config);
        if (config._isValid === false) {
            delete config._isValid;
            utils_hooks__hooks.createFromInputFallback(config);
        }
    }

    utils_hooks__hooks.createFromInputFallback = deprecate(
        'moment construction falls back to js Date. This is ' +
        'discouraged and will be removed in upcoming major ' +
        'release. Please refer to ' +
        'https://github.com/moment/moment/issues/1407 for more info.',
        function (config) {
            config._d = new Date(config._i + (config._useUTC ? ' UTC' : ''));
        }
    );

    function createDate (y, m, d, h, M, s, ms) {
        //can't just apply() to create a date:
        //http://stackoverflow.com/questions/181348/instantiating-a-javascript-object-by-calling-prototype-constructor-apply
        var date = new Date(y, m, d, h, M, s, ms);

        //the date constructor remaps years 0-99 to 1900-1999
        if (y < 100 && y >= 0 && isFinite(date.getFullYear())) {
            date.setFullYear(y);
        }
        return date;
    }

    function createUTCDate (y) {
        var date = new Date(Date.UTC.apply(null, arguments));

        //the Date.UTC function remaps years 0-99 to 1900-1999
        if (y < 100 && y >= 0 && isFinite(date.getUTCFullYear())) {
            date.setUTCFullYear(y);
        }
        return date;
    }

    // FORMATTING

    addFormatToken('Y', 0, 0, function () {
        var y = this.year();
        return y <= 9999 ? '' + y : '+' + y;
    });

    addFormatToken(0, ['YY', 2], 0, function () {
        return this.year() % 100;
    });

    addFormatToken(0, ['YYYY',   4],       0, 'year');
    addFormatToken(0, ['YYYYY',  5],       0, 'year');
    addFormatToken(0, ['YYYYYY', 6, true], 0, 'year');

    // ALIASES

    addUnitAlias('year', 'y');

    // PARSING

    addRegexToken('Y',      matchSigned);
    addRegexToken('YY',     match1to2, match2);
    addRegexToken('YYYY',   match1to4, match4);
    addRegexToken('YYYYY',  match1to6, match6);
    addRegexToken('YYYYYY', match1to6, match6);

    addParseToken(['YYYYY', 'YYYYYY'], YEAR);
    addParseToken('YYYY', function (input, array) {
        array[YEAR] = input.length === 2 ? utils_hooks__hooks.parseTwoDigitYear(input) : toInt(input);
    });
    addParseToken('YY', function (input, array) {
        array[YEAR] = utils_hooks__hooks.parseTwoDigitYear(input);
    });
    addParseToken('Y', function (input, array) {
        array[YEAR] = parseInt(input, 10);
    });

    // HELPERS

    function daysInYear(year) {
        return isLeapYear(year) ? 366 : 365;
    }

    function isLeapYear(year) {
        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    }

    // HOOKS

    utils_hooks__hooks.parseTwoDigitYear = function (input) {
        return toInt(input) + (toInt(input) > 68 ? 1900 : 2000);
    };

    // MOMENTS

    var getSetYear = makeGetSet('FullYear', true);

    function getIsLeapYear () {
        return isLeapYear(this.year());
    }

    // start-of-first-week - start-of-year
    function firstWeekOffset(year, dow, doy) {
        var // first-week day -- which january is always in the first week (4 for iso, 1 for other)
            fwd = 7 + dow - doy,
            // first-week day local weekday -- which local weekday is fwd
            fwdlw = (7 + createUTCDate(year, 0, fwd).getUTCDay() - dow) % 7;

        return -fwdlw + fwd - 1;
    }

    //http://en.wikipedia.org/wiki/ISO_week_date#Calculating_a_date_given_the_year.2C_week_number_and_weekday
    function dayOfYearFromWeeks(year, week, weekday, dow, doy) {
        var localWeekday = (7 + weekday - dow) % 7,
            weekOffset = firstWeekOffset(year, dow, doy),
            dayOfYear = 1 + 7 * (week - 1) + localWeekday + weekOffset,
            resYear, resDayOfYear;

        if (dayOfYear <= 0) {
            resYear = year - 1;
            resDayOfYear = daysInYear(resYear) + dayOfYear;
        } else if (dayOfYear > daysInYear(year)) {
            resYear = year + 1;
            resDayOfYear = dayOfYear - daysInYear(year);
        } else {
            resYear = year;
            resDayOfYear = dayOfYear;
        }

        return {
            year: resYear,
            dayOfYear: resDayOfYear
        };
    }

    function weekOfYear(mom, dow, doy) {
        var weekOffset = firstWeekOffset(mom.year(), dow, doy),
            week = Math.floor((mom.dayOfYear() - weekOffset - 1) / 7) + 1,
            resWeek, resYear;

        if (week < 1) {
            resYear = mom.year() - 1;
            resWeek = week + weeksInYear(resYear, dow, doy);
        } else if (week > weeksInYear(mom.year(), dow, doy)) {
            resWeek = week - weeksInYear(mom.year(), dow, doy);
            resYear = mom.year() + 1;
        } else {
            resYear = mom.year();
            resWeek = week;
        }

        return {
            week: resWeek,
            year: resYear
        };
    }

    function weeksInYear(year, dow, doy) {
        var weekOffset = firstWeekOffset(year, dow, doy),
            weekOffsetNext = firstWeekOffset(year + 1, dow, doy);
        return (daysInYear(year) - weekOffset + weekOffsetNext) / 7;
    }

    // Pick the first defined of two or three arguments.
    function defaults(a, b, c) {
        if (a != null) {
            return a;
        }
        if (b != null) {
            return b;
        }
        return c;
    }

    function currentDateArray(config) {
        // hooks is actually the exported moment object
        var nowValue = new Date(utils_hooks__hooks.now());
        if (config._useUTC) {
            return [nowValue.getUTCFullYear(), nowValue.getUTCMonth(), nowValue.getUTCDate()];
        }
        return [nowValue.getFullYear(), nowValue.getMonth(), nowValue.getDate()];
    }

    // convert an array to a date.
    // the array should mirror the parameters below
    // note: all values past the year are optional and will default to the lowest possible value.
    // [year, month, day , hour, minute, second, millisecond]
    function configFromArray (config) {
        var i, date, input = [], currentDate, yearToUse;

        if (config._d) {
            return;
        }

        currentDate = currentDateArray(config);

        //compute day of the year from weeks and weekdays
        if (config._w && config._a[DATE] == null && config._a[MONTH] == null) {
            dayOfYearFromWeekInfo(config);
        }

        //if the day of the year is set, figure out what it is
        if (config._dayOfYear) {
            yearToUse = defaults(config._a[YEAR], currentDate[YEAR]);

            if (config._dayOfYear > daysInYear(yearToUse)) {
                getParsingFlags(config)._overflowDayOfYear = true;
            }

            date = createUTCDate(yearToUse, 0, config._dayOfYear);
            config._a[MONTH] = date.getUTCMonth();
            config._a[DATE] = date.getUTCDate();
        }

        // Default to current date.
        // * if no year, month, day of month are given, default to today
        // * if day of month is given, default month and year
        // * if month is given, default only year
        // * if year is given, don't default anything
        for (i = 0; i < 3 && config._a[i] == null; ++i) {
            config._a[i] = input[i] = currentDate[i];
        }

        // Zero out whatever was not defaulted, including time
        for (; i < 7; i++) {
            config._a[i] = input[i] = (config._a[i] == null) ? (i === 2 ? 1 : 0) : config._a[i];
        }

        // Check for 24:00:00.000
        if (config._a[HOUR] === 24 &&
                config._a[MINUTE] === 0 &&
                config._a[SECOND] === 0 &&
                config._a[MILLISECOND] === 0) {
            config._nextDay = true;
            config._a[HOUR] = 0;
        }

        config._d = (config._useUTC ? createUTCDate : createDate).apply(null, input);
        // Apply timezone offset from input. The actual utcOffset can be changed
        // with parseZone.
        if (config._tzm != null) {
            config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);
        }

        if (config._nextDay) {
            config._a[HOUR] = 24;
        }
    }

    function dayOfYearFromWeekInfo(config) {
        var w, weekYear, week, weekday, dow, doy, temp, weekdayOverflow;

        w = config._w;
        if (w.GG != null || w.W != null || w.E != null) {
            dow = 1;
            doy = 4;

            // TODO: We need to take the current isoWeekYear, but that depends on
            // how we interpret now (local, utc, fixed offset). So create
            // a now version of current config (take local/utc/offset flags, and
            // create now).
            weekYear = defaults(w.GG, config._a[YEAR], weekOfYear(local__createLocal(), 1, 4).year);
            week = defaults(w.W, 1);
            weekday = defaults(w.E, 1);
            if (weekday < 1 || weekday > 7) {
                weekdayOverflow = true;
            }
        } else {
            dow = config._locale._week.dow;
            doy = config._locale._week.doy;

            weekYear = defaults(w.gg, config._a[YEAR], weekOfYear(local__createLocal(), dow, doy).year);
            week = defaults(w.w, 1);

            if (w.d != null) {
                // weekday -- low day numbers are considered next week
                weekday = w.d;
                if (weekday < 0 || weekday > 6) {
                    weekdayOverflow = true;
                }
            } else if (w.e != null) {
                // local weekday -- counting starts from begining of week
                weekday = w.e + dow;
                if (w.e < 0 || w.e > 6) {
                    weekdayOverflow = true;
                }
            } else {
                // default to begining of week
                weekday = dow;
            }
        }
        if (week < 1 || week > weeksInYear(weekYear, dow, doy)) {
            getParsingFlags(config)._overflowWeeks = true;
        } else if (weekdayOverflow != null) {
            getParsingFlags(config)._overflowWeekday = true;
        } else {
            temp = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy);
            config._a[YEAR] = temp.year;
            config._dayOfYear = temp.dayOfYear;
        }
    }

    // constant that refers to the ISO standard
    utils_hooks__hooks.ISO_8601 = function () {};

    // date from string and format string
    function configFromStringAndFormat(config) {
        // TODO: Move this to another part of the creation flow to prevent circular deps
        if (config._f === utils_hooks__hooks.ISO_8601) {
            configFromISO(config);
            return;
        }

        config._a = [];
        getParsingFlags(config).empty = true;

        // This array is used to make a Date, either with `new Date` or `Date.UTC`
        var string = '' + config._i,
            i, parsedInput, tokens, token, skipped,
            stringLength = string.length,
            totalParsedInputLength = 0;

        tokens = expandFormat(config._f, config._locale).match(formattingTokens) || [];

        for (i = 0; i < tokens.length; i++) {
            token = tokens[i];
            parsedInput = (string.match(getParseRegexForToken(token, config)) || [])[0];
            // console.log('token', token, 'parsedInput', parsedInput,
            //         'regex', getParseRegexForToken(token, config));
            if (parsedInput) {
                skipped = string.substr(0, string.indexOf(parsedInput));
                if (skipped.length > 0) {
                    getParsingFlags(config).unusedInput.push(skipped);
                }
                string = string.slice(string.indexOf(parsedInput) + parsedInput.length);
                totalParsedInputLength += parsedInput.length;
            }
            // don't parse if it's not a known token
            if (formatTokenFunctions[token]) {
                if (parsedInput) {
                    getParsingFlags(config).empty = false;
                }
                else {
                    getParsingFlags(config).unusedTokens.push(token);
                }
                addTimeToArrayFromToken(token, parsedInput, config);
            }
            else if (config._strict && !parsedInput) {
                getParsingFlags(config).unusedTokens.push(token);
            }
        }

        // add remaining unparsed input length to the string
        getParsingFlags(config).charsLeftOver = stringLength - totalParsedInputLength;
        if (string.length > 0) {
            getParsingFlags(config).unusedInput.push(string);
        }

        // clear _12h flag if hour is <= 12
        if (getParsingFlags(config).bigHour === true &&
                config._a[HOUR] <= 12 &&
                config._a[HOUR] > 0) {
            getParsingFlags(config).bigHour = undefined;
        }

        getParsingFlags(config).parsedDateParts = config._a.slice(0);
        getParsingFlags(config).meridiem = config._meridiem;
        // handle meridiem
        config._a[HOUR] = meridiemFixWrap(config._locale, config._a[HOUR], config._meridiem);

        configFromArray(config);
        checkOverflow(config);
    }


    function meridiemFixWrap (locale, hour, meridiem) {
        var isPm;

        if (meridiem == null) {
            // nothing to do
            return hour;
        }
        if (locale.meridiemHour != null) {
            return locale.meridiemHour(hour, meridiem);
        } else if (locale.isPM != null) {
            // Fallback
            isPm = locale.isPM(meridiem);
            if (isPm && hour < 12) {
                hour += 12;
            }
            if (!isPm && hour === 12) {
                hour = 0;
            }
            return hour;
        } else {
            // this is not supposed to happen
            return hour;
        }
    }

    // date from string and array of format strings
    function configFromStringAndArray(config) {
        var tempConfig,
            bestMoment,

            scoreToBeat,
            i,
            currentScore;

        if (config._f.length === 0) {
            getParsingFlags(config).invalidFormat = true;
            config._d = new Date(NaN);
            return;
        }

        for (i = 0; i < config._f.length; i++) {
            currentScore = 0;
            tempConfig = copyConfig({}, config);
            if (config._useUTC != null) {
                tempConfig._useUTC = config._useUTC;
            }
            tempConfig._f = config._f[i];
            configFromStringAndFormat(tempConfig);

            if (!valid__isValid(tempConfig)) {
                continue;
            }

            // if there is any input that was not parsed add a penalty for that format
            currentScore += getParsingFlags(tempConfig).charsLeftOver;

            //or tokens
            currentScore += getParsingFlags(tempConfig).unusedTokens.length * 10;

            getParsingFlags(tempConfig).score = currentScore;

            if (scoreToBeat == null || currentScore < scoreToBeat) {
                scoreToBeat = currentScore;
                bestMoment = tempConfig;
            }
        }

        extend(config, bestMoment || tempConfig);
    }

    function configFromObject(config) {
        if (config._d) {
            return;
        }

        var i = normalizeObjectUnits(config._i);
        config._a = map([i.year, i.month, i.day || i.date, i.hour, i.minute, i.second, i.millisecond], function (obj) {
            return obj && parseInt(obj, 10);
        });

        configFromArray(config);
    }

    function createFromConfig (config) {
        var res = new Moment(checkOverflow(prepareConfig(config)));
        if (res._nextDay) {
            // Adding is smart enough around DST
            res.add(1, 'd');
            res._nextDay = undefined;
        }

        return res;
    }

    function prepareConfig (config) {
        var input = config._i,
            format = config._f;

        config._locale = config._locale || locale_locales__getLocale(config._l);

        if (input === null || (format === undefined && input === '')) {
            return valid__createInvalid({nullInput: true});
        }

        if (typeof input === 'string') {
            config._i = input = config._locale.preparse(input);
        }

        if (isMoment(input)) {
            return new Moment(checkOverflow(input));
        } else if (isArray(format)) {
            configFromStringAndArray(config);
        } else if (format) {
            configFromStringAndFormat(config);
        } else if (isDate(input)) {
            config._d = input;
        } else {
            configFromInput(config);
        }

        if (!valid__isValid(config)) {
            config._d = null;
        }

        return config;
    }

    function configFromInput(config) {
        var input = config._i;
        if (input === undefined) {
            config._d = new Date(utils_hooks__hooks.now());
        } else if (isDate(input)) {
            config._d = new Date(input.valueOf());
        } else if (typeof input === 'string') {
            configFromString(config);
        } else if (isArray(input)) {
            config._a = map(input.slice(0), function (obj) {
                return parseInt(obj, 10);
            });
            configFromArray(config);
        } else if (typeof(input) === 'object') {
            configFromObject(config);
        } else if (typeof(input) === 'number') {
            // from milliseconds
            config._d = new Date(input);
        } else {
            utils_hooks__hooks.createFromInputFallback(config);
        }
    }

    function createLocalOrUTC (input, format, locale, strict, isUTC) {
        var c = {};

        if (typeof(locale) === 'boolean') {
            strict = locale;
            locale = undefined;
        }
        // object construction must be done this way.
        // https://github.com/moment/moment/issues/1423
        c._isAMomentObject = true;
        c._useUTC = c._isUTC = isUTC;
        c._l = locale;
        c._i = input;
        c._f = format;
        c._strict = strict;

        return createFromConfig(c);
    }

    function local__createLocal (input, format, locale, strict) {
        return createLocalOrUTC(input, format, locale, strict, false);
    }

    var prototypeMin = deprecate(
         'moment().min is deprecated, use moment.max instead. https://github.com/moment/moment/issues/1548',
         function () {
             var other = local__createLocal.apply(null, arguments);
             if (this.isValid() && other.isValid()) {
                 return other < this ? this : other;
             } else {
                 return valid__createInvalid();
             }
         }
     );

    var prototypeMax = deprecate(
        'moment().max is deprecated, use moment.min instead. https://github.com/moment/moment/issues/1548',
        function () {
            var other = local__createLocal.apply(null, arguments);
            if (this.isValid() && other.isValid()) {
                return other > this ? this : other;
            } else {
                return valid__createInvalid();
            }
        }
    );

    // Pick a moment m from moments so that m[fn](other) is true for all
    // other. This relies on the function fn to be transitive.
    //
    // moments should either be an array of moment objects or an array, whose
    // first element is an array of moment objects.
    function pickBy(fn, moments) {
        var res, i;
        if (moments.length === 1 && isArray(moments[0])) {
            moments = moments[0];
        }
        if (!moments.length) {
            return local__createLocal();
        }
        res = moments[0];
        for (i = 1; i < moments.length; ++i) {
            if (!moments[i].isValid() || moments[i][fn](res)) {
                res = moments[i];
            }
        }
        return res;
    }

    // TODO: Use [].sort instead?
    function min () {
        var args = [].slice.call(arguments, 0);

        return pickBy('isBefore', args);
    }

    function max () {
        var args = [].slice.call(arguments, 0);

        return pickBy('isAfter', args);
    }

    var now = function () {
        return Date.now ? Date.now() : +(new Date());
    };

    function Duration (duration) {
        var normalizedInput = normalizeObjectUnits(duration),
            years = normalizedInput.year || 0,
            quarters = normalizedInput.quarter || 0,
            months = normalizedInput.month || 0,
            weeks = normalizedInput.week || 0,
            days = normalizedInput.day || 0,
            hours = normalizedInput.hour || 0,
            minutes = normalizedInput.minute || 0,
            seconds = normalizedInput.second || 0,
            milliseconds = normalizedInput.millisecond || 0;

        // representation for dateAddRemove
        this._milliseconds = +milliseconds +
            seconds * 1e3 + // 1000
            minutes * 6e4 + // 1000 * 60
            hours * 1000 * 60 * 60; //using 1000 * 60 * 60 instead of 36e5 to avoid floating point rounding errors https://github.com/moment/moment/issues/2978
        // Because of dateAddRemove treats 24 hours as different from a
        // day when working around DST, we need to store them separately
        this._days = +days +
            weeks * 7;
        // It is impossible translate months into days without knowing
        // which months you are are talking about, so we have to store
        // it separately.
        this._months = +months +
            quarters * 3 +
            years * 12;

        this._data = {};

        this._locale = locale_locales__getLocale();

        this._bubble();
    }

    function isDuration (obj) {
        return obj instanceof Duration;
    }

    // FORMATTING

    function offset (token, separator) {
        addFormatToken(token, 0, 0, function () {
            var offset = this.utcOffset();
            var sign = '+';
            if (offset < 0) {
                offset = -offset;
                sign = '-';
            }
            return sign + zeroFill(~~(offset / 60), 2) + separator + zeroFill(~~(offset) % 60, 2);
        });
    }

    offset('Z', ':');
    offset('ZZ', '');

    // PARSING

    addRegexToken('Z',  matchShortOffset);
    addRegexToken('ZZ', matchShortOffset);
    addParseToken(['Z', 'ZZ'], function (input, array, config) {
        config._useUTC = true;
        config._tzm = offsetFromString(matchShortOffset, input);
    });

    // HELPERS

    // timezone chunker
    // '+10:00' > ['10',  '00']
    // '-1530'  > ['-15', '30']
    var chunkOffset = /([\+\-]|\d\d)/gi;

    function offsetFromString(matcher, string) {
        var matches = ((string || '').match(matcher) || []);
        var chunk   = matches[matches.length - 1] || [];
        var parts   = (chunk + '').match(chunkOffset) || ['-', 0, 0];
        var minutes = +(parts[1] * 60) + toInt(parts[2]);

        return parts[0] === '+' ? minutes : -minutes;
    }

    // Return a moment from input, that is local/utc/zone equivalent to model.
    function cloneWithOffset(input, model) {
        var res, diff;
        if (model._isUTC) {
            res = model.clone();
            diff = (isMoment(input) || isDate(input) ? input.valueOf() : local__createLocal(input).valueOf()) - res.valueOf();
            // Use low-level api, because this fn is low-level api.
            res._d.setTime(res._d.valueOf() + diff);
            utils_hooks__hooks.updateOffset(res, false);
            return res;
        } else {
            return local__createLocal(input).local();
        }
    }

    function getDateOffset (m) {
        // On Firefox.24 Date#getTimezoneOffset returns a floating point.
        // https://github.com/moment/moment/pull/1871
        return -Math.round(m._d.getTimezoneOffset() / 15) * 15;
    }

    // HOOKS

    // This function will be called whenever a moment is mutated.
    // It is intended to keep the offset in sync with the timezone.
    utils_hooks__hooks.updateOffset = function () {};

    // MOMENTS

    // keepLocalTime = true means only change the timezone, without
    // affecting the local hour. So 5:31:26 +0300 --[utcOffset(2, true)]-->
    // 5:31:26 +0200 It is possible that 5:31:26 doesn't exist with offset
    // +0200, so we adjust the time as needed, to be valid.
    //
    // Keeping the time actually adds/subtracts (one hour)
    // from the actual represented time. That is why we call updateOffset
    // a second time. In case it wants us to change the offset again
    // _changeInProgress == true case, then we have to adjust, because
    // there is no such time in the given timezone.
    function getSetOffset (input, keepLocalTime) {
        var offset = this._offset || 0,
            localAdjust;
        if (!this.isValid()) {
            return input != null ? this : NaN;
        }
        if (input != null) {
            if (typeof input === 'string') {
                input = offsetFromString(matchShortOffset, input);
            } else if (Math.abs(input) < 16) {
                input = input * 60;
            }
            if (!this._isUTC && keepLocalTime) {
                localAdjust = getDateOffset(this);
            }
            this._offset = input;
            this._isUTC = true;
            if (localAdjust != null) {
                this.add(localAdjust, 'm');
            }
            if (offset !== input) {
                if (!keepLocalTime || this._changeInProgress) {
                    add_subtract__addSubtract(this, create__createDuration(input - offset, 'm'), 1, false);
                } else if (!this._changeInProgress) {
                    this._changeInProgress = true;
                    utils_hooks__hooks.updateOffset(this, true);
                    this._changeInProgress = null;
                }
            }
            return this;
        } else {
            return this._isUTC ? offset : getDateOffset(this);
        }
    }

    function getSetZone (input, keepLocalTime) {
        if (input != null) {
            if (typeof input !== 'string') {
                input = -input;
            }

            this.utcOffset(input, keepLocalTime);

            return this;
        } else {
            return -this.utcOffset();
        }
    }

    function setOffsetToUTC (keepLocalTime) {
        return this.utcOffset(0, keepLocalTime);
    }

    function setOffsetToLocal (keepLocalTime) {
        if (this._isUTC) {
            this.utcOffset(0, keepLocalTime);
            this._isUTC = false;

            if (keepLocalTime) {
                this.subtract(getDateOffset(this), 'm');
            }
        }
        return this;
    }

    function setOffsetToParsedOffset () {
        if (this._tzm) {
            this.utcOffset(this._tzm);
        } else if (typeof this._i === 'string') {
            this.utcOffset(offsetFromString(matchOffset, this._i));
        }
        return this;
    }

    function hasAlignedHourOffset (input) {
        if (!this.isValid()) {
            return false;
        }
        input = input ? local__createLocal(input).utcOffset() : 0;

        return (this.utcOffset() - input) % 60 === 0;
    }

    function isDaylightSavingTime () {
        return (
            this.utcOffset() > this.clone().month(0).utcOffset() ||
            this.utcOffset() > this.clone().month(5).utcOffset()
        );
    }

    function isDaylightSavingTimeShifted () {
        if (!isUndefined(this._isDSTShifted)) {
            return this._isDSTShifted;
        }

        var c = {};

        copyConfig(c, this);
        c = prepareConfig(c);

        if (c._a) {
            var other = c._isUTC ? create_utc__createUTC(c._a) : local__createLocal(c._a);
            this._isDSTShifted = this.isValid() &&
                compareArrays(c._a, other.toArray()) > 0;
        } else {
            this._isDSTShifted = false;
        }

        return this._isDSTShifted;
    }

    function isLocal () {
        return this.isValid() ? !this._isUTC : false;
    }

    function isUtcOffset () {
        return this.isValid() ? this._isUTC : false;
    }

    function isUtc () {
        return this.isValid() ? this._isUTC && this._offset === 0 : false;
    }

    // ASP.NET json date format regex
    var aspNetRegex = /^(\-)?(?:(\d*)[. ])?(\d+)\:(\d+)(?:\:(\d+)\.?(\d{3})?\d*)?$/;

    // from http://docs.closure-library.googlecode.com/git/closure_goog_date_date.js.source.html
    // somewhat more in line with 4.4.3.2 2004 spec, but allows decimal anywhere
    // and further modified to allow for strings containing both week and day
    var isoRegex = /^(-)?P(?:(-?[0-9,.]*)Y)?(?:(-?[0-9,.]*)M)?(?:(-?[0-9,.]*)W)?(?:(-?[0-9,.]*)D)?(?:T(?:(-?[0-9,.]*)H)?(?:(-?[0-9,.]*)M)?(?:(-?[0-9,.]*)S)?)?$/;

    function create__createDuration (input, key) {
        var duration = input,
            // matching against regexp is expensive, do it on demand
            match = null,
            sign,
            ret,
            diffRes;

        if (isDuration(input)) {
            duration = {
                ms : input._milliseconds,
                d  : input._days,
                M  : input._months
            };
        } else if (typeof input === 'number') {
            duration = {};
            if (key) {
                duration[key] = input;
            } else {
                duration.milliseconds = input;
            }
        } else if (!!(match = aspNetRegex.exec(input))) {
            sign = (match[1] === '-') ? -1 : 1;
            duration = {
                y  : 0,
                d  : toInt(match[DATE])        * sign,
                h  : toInt(match[HOUR])        * sign,
                m  : toInt(match[MINUTE])      * sign,
                s  : toInt(match[SECOND])      * sign,
                ms : toInt(match[MILLISECOND]) * sign
            };
        } else if (!!(match = isoRegex.exec(input))) {
            sign = (match[1] === '-') ? -1 : 1;
            duration = {
                y : parseIso(match[2], sign),
                M : parseIso(match[3], sign),
                w : parseIso(match[4], sign),
                d : parseIso(match[5], sign),
                h : parseIso(match[6], sign),
                m : parseIso(match[7], sign),
                s : parseIso(match[8], sign)
            };
        } else if (duration == null) {// checks for null or undefined
            duration = {};
        } else if (typeof duration === 'object' && ('from' in duration || 'to' in duration)) {
            diffRes = momentsDifference(local__createLocal(duration.from), local__createLocal(duration.to));

            duration = {};
            duration.ms = diffRes.milliseconds;
            duration.M = diffRes.months;
        }

        ret = new Duration(duration);

        if (isDuration(input) && hasOwnProp(input, '_locale')) {
            ret._locale = input._locale;
        }

        return ret;
    }

    create__createDuration.fn = Duration.prototype;

    function parseIso (inp, sign) {
        // We'd normally use ~~inp for this, but unfortunately it also
        // converts floats to ints.
        // inp may be undefined, so careful calling replace on it.
        var res = inp && parseFloat(inp.replace(',', '.'));
        // apply sign while we're at it
        return (isNaN(res) ? 0 : res) * sign;
    }

    function positiveMomentsDifference(base, other) {
        var res = {milliseconds: 0, months: 0};

        res.months = other.month() - base.month() +
            (other.year() - base.year()) * 12;
        if (base.clone().add(res.months, 'M').isAfter(other)) {
            --res.months;
        }

        res.milliseconds = +other - +(base.clone().add(res.months, 'M'));

        return res;
    }

    function momentsDifference(base, other) {
        var res;
        if (!(base.isValid() && other.isValid())) {
            return {milliseconds: 0, months: 0};
        }

        other = cloneWithOffset(other, base);
        if (base.isBefore(other)) {
            res = positiveMomentsDifference(base, other);
        } else {
            res = positiveMomentsDifference(other, base);
            res.milliseconds = -res.milliseconds;
            res.months = -res.months;
        }

        return res;
    }

    function absRound (number) {
        if (number < 0) {
            return Math.round(-1 * number) * -1;
        } else {
            return Math.round(number);
        }
    }

    // TODO: remove 'name' arg after deprecation is removed
    function createAdder(direction, name) {
        return function (val, period) {
            var dur, tmp;
            //invert the arguments, but complain about it
            if (period !== null && !isNaN(+period)) {
                deprecateSimple(name, 'moment().' + name  + '(period, number) is deprecated. Please use moment().' + name + '(number, period).');
                tmp = val; val = period; period = tmp;
            }

            val = typeof val === 'string' ? +val : val;
            dur = create__createDuration(val, period);
            add_subtract__addSubtract(this, dur, direction);
            return this;
        };
    }

    function add_subtract__addSubtract (mom, duration, isAdding, updateOffset) {
        var milliseconds = duration._milliseconds,
            days = absRound(duration._days),
            months = absRound(duration._months);

        if (!mom.isValid()) {
            // No op
            return;
        }

        updateOffset = updateOffset == null ? true : updateOffset;

        if (milliseconds) {
            mom._d.setTime(mom._d.valueOf() + milliseconds * isAdding);
        }
        if (days) {
            get_set__set(mom, 'Date', get_set__get(mom, 'Date') + days * isAdding);
        }
        if (months) {
            setMonth(mom, get_set__get(mom, 'Month') + months * isAdding);
        }
        if (updateOffset) {
            utils_hooks__hooks.updateOffset(mom, days || months);
        }
    }

    var add_subtract__add      = createAdder(1, 'add');
    var add_subtract__subtract = createAdder(-1, 'subtract');

    function moment_calendar__calendar (time, formats) {
        // We want to compare the start of today, vs this.
        // Getting start-of-today depends on whether we're local/utc/offset or not.
        var now = time || local__createLocal(),
            sod = cloneWithOffset(now, this).startOf('day'),
            diff = this.diff(sod, 'days', true),
            format = diff < -6 ? 'sameElse' :
                diff < -1 ? 'lastWeek' :
                diff < 0 ? 'lastDay' :
                diff < 1 ? 'sameDay' :
                diff < 2 ? 'nextDay' :
                diff < 7 ? 'nextWeek' : 'sameElse';

        var output = formats && (isFunction(formats[format]) ? formats[format]() : formats[format]);

        return this.format(output || this.localeData().calendar(format, this, local__createLocal(now)));
    }

    function clone () {
        return new Moment(this);
    }

    function isAfter (input, units) {
        var localInput = isMoment(input) ? input : local__createLocal(input);
        if (!(this.isValid() && localInput.isValid())) {
            return false;
        }
        units = normalizeUnits(!isUndefined(units) ? units : 'millisecond');
        if (units === 'millisecond') {
            return this.valueOf() > localInput.valueOf();
        } else {
            return localInput.valueOf() < this.clone().startOf(units).valueOf();
        }
    }

    function isBefore (input, units) {
        var localInput = isMoment(input) ? input : local__createLocal(input);
        if (!(this.isValid() && localInput.isValid())) {
            return false;
        }
        units = normalizeUnits(!isUndefined(units) ? units : 'millisecond');
        if (units === 'millisecond') {
            return this.valueOf() < localInput.valueOf();
        } else {
            return this.clone().endOf(units).valueOf() < localInput.valueOf();
        }
    }

    function isBetween (from, to, units, inclusivity) {
        inclusivity = inclusivity || '()';
        return (inclusivity[0] === '(' ? this.isAfter(from, units) : !this.isBefore(from, units)) &&
            (inclusivity[1] === ')' ? this.isBefore(to, units) : !this.isAfter(to, units));
    }

    function isSame (input, units) {
        var localInput = isMoment(input) ? input : local__createLocal(input),
            inputMs;
        if (!(this.isValid() && localInput.isValid())) {
            return false;
        }
        units = normalizeUnits(units || 'millisecond');
        if (units === 'millisecond') {
            return this.valueOf() === localInput.valueOf();
        } else {
            inputMs = localInput.valueOf();
            return this.clone().startOf(units).valueOf() <= inputMs && inputMs <= this.clone().endOf(units).valueOf();
        }
    }

    function isSameOrAfter (input, units) {
        return this.isSame(input, units) || this.isAfter(input,units);
    }

    function isSameOrBefore (input, units) {
        return this.isSame(input, units) || this.isBefore(input,units);
    }

    function diff (input, units, asFloat) {
        var that,
            zoneDelta,
            delta, output;

        if (!this.isValid()) {
            return NaN;
        }

        that = cloneWithOffset(input, this);

        if (!that.isValid()) {
            return NaN;
        }

        zoneDelta = (that.utcOffset() - this.utcOffset()) * 6e4;

        units = normalizeUnits(units);

        if (units === 'year' || units === 'month' || units === 'quarter') {
            output = monthDiff(this, that);
            if (units === 'quarter') {
                output = output / 3;
            } else if (units === 'year') {
                output = output / 12;
            }
        } else {
            delta = this - that;
            output = units === 'second' ? delta / 1e3 : // 1000
                units === 'minute' ? delta / 6e4 : // 1000 * 60
                units === 'hour' ? delta / 36e5 : // 1000 * 60 * 60
                units === 'day' ? (delta - zoneDelta) / 864e5 : // 1000 * 60 * 60 * 24, negate dst
                units === 'week' ? (delta - zoneDelta) / 6048e5 : // 1000 * 60 * 60 * 24 * 7, negate dst
                delta;
        }
        return asFloat ? output : absFloor(output);
    }

    function monthDiff (a, b) {
        // difference in months
        var wholeMonthDiff = ((b.year() - a.year()) * 12) + (b.month() - a.month()),
            // b is in (anchor - 1 month, anchor + 1 month)
            anchor = a.clone().add(wholeMonthDiff, 'months'),
            anchor2, adjust;

        if (b - anchor < 0) {
            anchor2 = a.clone().add(wholeMonthDiff - 1, 'months');
            // linear across the month
            adjust = (b - anchor) / (anchor - anchor2);
        } else {
            anchor2 = a.clone().add(wholeMonthDiff + 1, 'months');
            // linear across the month
            adjust = (b - anchor) / (anchor2 - anchor);
        }

        //check for negative zero, return zero if negative zero
        return -(wholeMonthDiff + adjust) || 0;
    }

    utils_hooks__hooks.defaultFormat = 'YYYY-MM-DDTHH:mm:ssZ';
    utils_hooks__hooks.defaultFormatUtc = 'YYYY-MM-DDTHH:mm:ss[Z]';

    function toString () {
        return this.clone().locale('en').format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ');
    }

    function moment_format__toISOString () {
        var m = this.clone().utc();
        if (0 < m.year() && m.year() <= 9999) {
            if (isFunction(Date.prototype.toISOString)) {
                // native implementation is ~50x faster, use it when we can
                return this.toDate().toISOString();
            } else {
                return formatMoment(m, 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
            }
        } else {
            return formatMoment(m, 'YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
        }
    }

    function format (inputString) {
        if (!inputString) {
            inputString = this.isUtc() ? utils_hooks__hooks.defaultFormatUtc : utils_hooks__hooks.defaultFormat;
        }
        var output = formatMoment(this, inputString);
        return this.localeData().postformat(output);
    }

    function from (time, withoutSuffix) {
        if (this.isValid() &&
                ((isMoment(time) && time.isValid()) ||
                 local__createLocal(time).isValid())) {
            return create__createDuration({to: this, from: time}).locale(this.locale()).humanize(!withoutSuffix);
        } else {
            return this.localeData().invalidDate();
        }
    }

    function fromNow (withoutSuffix) {
        return this.from(local__createLocal(), withoutSuffix);
    }

    function to (time, withoutSuffix) {
        if (this.isValid() &&
                ((isMoment(time) && time.isValid()) ||
                 local__createLocal(time).isValid())) {
            return create__createDuration({from: this, to: time}).locale(this.locale()).humanize(!withoutSuffix);
        } else {
            return this.localeData().invalidDate();
        }
    }

    function toNow (withoutSuffix) {
        return this.to(local__createLocal(), withoutSuffix);
    }

    // If passed a locale key, it will set the locale for this
    // instance.  Otherwise, it will return the locale configuration
    // variables for this instance.
    function locale (key) {
        var newLocaleData;

        if (key === undefined) {
            return this._locale._abbr;
        } else {
            newLocaleData = locale_locales__getLocale(key);
            if (newLocaleData != null) {
                this._locale = newLocaleData;
            }
            return this;
        }
    }

    var lang = deprecate(
        'moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.',
        function (key) {
            if (key === undefined) {
                return this.localeData();
            } else {
                return this.locale(key);
            }
        }
    );

    function localeData () {
        return this._locale;
    }

    function startOf (units) {
        units = normalizeUnits(units);
        // the following switch intentionally omits break keywords
        // to utilize falling through the cases.
        switch (units) {
        case 'year':
            this.month(0);
            /* falls through */
        case 'quarter':
        case 'month':
            this.date(1);
            /* falls through */
        case 'week':
        case 'isoWeek':
        case 'day':
        case 'date':
            this.hours(0);
            /* falls through */
        case 'hour':
            this.minutes(0);
            /* falls through */
        case 'minute':
            this.seconds(0);
            /* falls through */
        case 'second':
            this.milliseconds(0);
        }

        // weeks are a special case
        if (units === 'week') {
            this.weekday(0);
        }
        if (units === 'isoWeek') {
            this.isoWeekday(1);
        }

        // quarters are also special
        if (units === 'quarter') {
            this.month(Math.floor(this.month() / 3) * 3);
        }

        return this;
    }

    function endOf (units) {
        units = normalizeUnits(units);
        if (units === undefined || units === 'millisecond') {
            return this;
        }

        // 'date' is an alias for 'day', so it should be considered as such.
        if (units === 'date') {
            units = 'day';
        }

        return this.startOf(units).add(1, (units === 'isoWeek' ? 'week' : units)).subtract(1, 'ms');
    }

    function to_type__valueOf () {
        return this._d.valueOf() - ((this._offset || 0) * 60000);
    }

    function unix () {
        return Math.floor(this.valueOf() / 1000);
    }

    function toDate () {
        return this._offset ? new Date(this.valueOf()) : this._d;
    }

    function toArray () {
        var m = this;
        return [m.year(), m.month(), m.date(), m.hour(), m.minute(), m.second(), m.millisecond()];
    }

    function toObject () {
        var m = this;
        return {
            years: m.year(),
            months: m.month(),
            date: m.date(),
            hours: m.hours(),
            minutes: m.minutes(),
            seconds: m.seconds(),
            milliseconds: m.milliseconds()
        };
    }

    function toJSON () {
        // new Date(NaN).toJSON() === null
        return this.isValid() ? this.toISOString() : null;
    }

    function moment_valid__isValid () {
        return valid__isValid(this);
    }

    function parsingFlags () {
        return extend({}, getParsingFlags(this));
    }

    function invalidAt () {
        return getParsingFlags(this).overflow;
    }

    function creationData() {
        return {
            input: this._i,
            format: this._f,
            locale: this._locale,
            isUTC: this._isUTC,
            strict: this._strict
        };
    }

    // FORMATTING

    addFormatToken(0, ['gg', 2], 0, function () {
        return this.weekYear() % 100;
    });

    addFormatToken(0, ['GG', 2], 0, function () {
        return this.isoWeekYear() % 100;
    });

    function addWeekYearFormatToken (token, getter) {
        addFormatToken(0, [token, token.length], 0, getter);
    }

    addWeekYearFormatToken('gggg',     'weekYear');
    addWeekYearFormatToken('ggggg',    'weekYear');
    addWeekYearFormatToken('GGGG',  'isoWeekYear');
    addWeekYearFormatToken('GGGGG', 'isoWeekYear');

    // ALIASES

    addUnitAlias('weekYear', 'gg');
    addUnitAlias('isoWeekYear', 'GG');

    // PARSING

    addRegexToken('G',      matchSigned);
    addRegexToken('g',      matchSigned);
    addRegexToken('GG',     match1to2, match2);
    addRegexToken('gg',     match1to2, match2);
    addRegexToken('GGGG',   match1to4, match4);
    addRegexToken('gggg',   match1to4, match4);
    addRegexToken('GGGGG',  match1to6, match6);
    addRegexToken('ggggg',  match1to6, match6);

    addWeekParseToken(['gggg', 'ggggg', 'GGGG', 'GGGGG'], function (input, week, config, token) {
        week[token.substr(0, 2)] = toInt(input);
    });

    addWeekParseToken(['gg', 'GG'], function (input, week, config, token) {
        week[token] = utils_hooks__hooks.parseTwoDigitYear(input);
    });

    // MOMENTS

    function getSetWeekYear (input) {
        return getSetWeekYearHelper.call(this,
                input,
                this.week(),
                this.weekday(),
                this.localeData()._week.dow,
                this.localeData()._week.doy);
    }

    function getSetISOWeekYear (input) {
        return getSetWeekYearHelper.call(this,
                input, this.isoWeek(), this.isoWeekday(), 1, 4);
    }

    function getISOWeeksInYear () {
        return weeksInYear(this.year(), 1, 4);
    }

    function getWeeksInYear () {
        var weekInfo = this.localeData()._week;
        return weeksInYear(this.year(), weekInfo.dow, weekInfo.doy);
    }

    function getSetWeekYearHelper(input, week, weekday, dow, doy) {
        var weeksTarget;
        if (input == null) {
            return weekOfYear(this, dow, doy).year;
        } else {
            weeksTarget = weeksInYear(input, dow, doy);
            if (week > weeksTarget) {
                week = weeksTarget;
            }
            return setWeekAll.call(this, input, week, weekday, dow, doy);
        }
    }

    function setWeekAll(weekYear, week, weekday, dow, doy) {
        var dayOfYearData = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy),
            date = createUTCDate(dayOfYearData.year, 0, dayOfYearData.dayOfYear);

        this.year(date.getUTCFullYear());
        this.month(date.getUTCMonth());
        this.date(date.getUTCDate());
        return this;
    }

    // FORMATTING

    addFormatToken('Q', 0, 'Qo', 'quarter');

    // ALIASES

    addUnitAlias('quarter', 'Q');

    // PARSING

    addRegexToken('Q', match1);
    addParseToken('Q', function (input, array) {
        array[MONTH] = (toInt(input) - 1) * 3;
    });

    // MOMENTS

    function getSetQuarter (input) {
        return input == null ? Math.ceil((this.month() + 1) / 3) : this.month((input - 1) * 3 + this.month() % 3);
    }

    // FORMATTING

    addFormatToken('w', ['ww', 2], 'wo', 'week');
    addFormatToken('W', ['WW', 2], 'Wo', 'isoWeek');

    // ALIASES

    addUnitAlias('week', 'w');
    addUnitAlias('isoWeek', 'W');

    // PARSING

    addRegexToken('w',  match1to2);
    addRegexToken('ww', match1to2, match2);
    addRegexToken('W',  match1to2);
    addRegexToken('WW', match1to2, match2);

    addWeekParseToken(['w', 'ww', 'W', 'WW'], function (input, week, config, token) {
        week[token.substr(0, 1)] = toInt(input);
    });

    // HELPERS

    // LOCALES

    function localeWeek (mom) {
        return weekOfYear(mom, this._week.dow, this._week.doy).week;
    }

    var defaultLocaleWeek = {
        dow : 0, // Sunday is the first day of the week.
        doy : 6  // The week that contains Jan 1st is the first week of the year.
    };

    function localeFirstDayOfWeek () {
        return this._week.dow;
    }

    function localeFirstDayOfYear () {
        return this._week.doy;
    }

    // MOMENTS

    function getSetWeek (input) {
        var week = this.localeData().week(this);
        return input == null ? week : this.add((input - week) * 7, 'd');
    }

    function getSetISOWeek (input) {
        var week = weekOfYear(this, 1, 4).week;
        return input == null ? week : this.add((input - week) * 7, 'd');
    }

    // FORMATTING

    addFormatToken('D', ['DD', 2], 'Do', 'date');

    // ALIASES

    addUnitAlias('date', 'D');

    // PARSING

    addRegexToken('D',  match1to2);
    addRegexToken('DD', match1to2, match2);
    addRegexToken('Do', function (isStrict, locale) {
        return isStrict ? locale._ordinalParse : locale._ordinalParseLenient;
    });

    addParseToken(['D', 'DD'], DATE);
    addParseToken('Do', function (input, array) {
        array[DATE] = toInt(input.match(match1to2)[0], 10);
    });

    // MOMENTS

    var getSetDayOfMonth = makeGetSet('Date', true);

    // FORMATTING

    addFormatToken('d', 0, 'do', 'day');

    addFormatToken('dd', 0, 0, function (format) {
        return this.localeData().weekdaysMin(this, format);
    });

    addFormatToken('ddd', 0, 0, function (format) {
        return this.localeData().weekdaysShort(this, format);
    });

    addFormatToken('dddd', 0, 0, function (format) {
        return this.localeData().weekdays(this, format);
    });

    addFormatToken('e', 0, 0, 'weekday');
    addFormatToken('E', 0, 0, 'isoWeekday');

    // ALIASES

    addUnitAlias('day', 'd');
    addUnitAlias('weekday', 'e');
    addUnitAlias('isoWeekday', 'E');

    // PARSING

    addRegexToken('d',    match1to2);
    addRegexToken('e',    match1to2);
    addRegexToken('E',    match1to2);
    addRegexToken('dd',   function (isStrict, locale) {
        return locale.weekdaysMinRegex(isStrict);
    });
    addRegexToken('ddd',   function (isStrict, locale) {
        return locale.weekdaysShortRegex(isStrict);
    });
    addRegexToken('dddd',   function (isStrict, locale) {
        return locale.weekdaysRegex(isStrict);
    });

    addWeekParseToken(['dd', 'ddd', 'dddd'], function (input, week, config, token) {
        var weekday = config._locale.weekdaysParse(input, token, config._strict);
        // if we didn't get a weekday name, mark the date as invalid
        if (weekday != null) {
            week.d = weekday;
        } else {
            getParsingFlags(config).invalidWeekday = input;
        }
    });

    addWeekParseToken(['d', 'e', 'E'], function (input, week, config, token) {
        week[token] = toInt(input);
    });

    // HELPERS

    function parseWeekday(input, locale) {
        if (typeof input !== 'string') {
            return input;
        }

        if (!isNaN(input)) {
            return parseInt(input, 10);
        }

        input = locale.weekdaysParse(input);
        if (typeof input === 'number') {
            return input;
        }

        return null;
    }

    // LOCALES

    var defaultLocaleWeekdays = 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_');
    function localeWeekdays (m, format) {
        return isArray(this._weekdays) ? this._weekdays[m.day()] :
            this._weekdays[this._weekdays.isFormat.test(format) ? 'format' : 'standalone'][m.day()];
    }

    var defaultLocaleWeekdaysShort = 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_');
    function localeWeekdaysShort (m) {
        return this._weekdaysShort[m.day()];
    }

    var defaultLocaleWeekdaysMin = 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_');
    function localeWeekdaysMin (m) {
        return this._weekdaysMin[m.day()];
    }

    function day_of_week__handleStrictParse(weekdayName, format, strict) {
        var i, ii, mom, llc = weekdayName.toLocaleLowerCase();
        if (!this._weekdaysParse) {
            this._weekdaysParse = [];
            this._shortWeekdaysParse = [];
            this._minWeekdaysParse = [];

            for (i = 0; i < 7; ++i) {
                mom = create_utc__createUTC([2000, 1]).day(i);
                this._minWeekdaysParse[i] = this.weekdaysMin(mom, '').toLocaleLowerCase();
                this._shortWeekdaysParse[i] = this.weekdaysShort(mom, '').toLocaleLowerCase();
                this._weekdaysParse[i] = this.weekdays(mom, '').toLocaleLowerCase();
            }
        }

        if (strict) {
            if (format === 'dddd') {
                ii = indexOf.call(this._weekdaysParse, llc);
                return ii !== -1 ? ii : null;
            } else if (format === 'ddd') {
                ii = indexOf.call(this._shortWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            } else {
                ii = indexOf.call(this._minWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            }
        } else {
            if (format === 'dddd') {
                ii = indexOf.call(this._weekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._shortWeekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._minWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            } else if (format === 'ddd') {
                ii = indexOf.call(this._shortWeekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._weekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._minWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            } else {
                ii = indexOf.call(this._minWeekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._weekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._shortWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            }
        }
    }

    function localeWeekdaysParse (weekdayName, format, strict) {
        var i, mom, regex;

        if (this._weekdaysParseExact) {
            return day_of_week__handleStrictParse.call(this, weekdayName, format, strict);
        }

        if (!this._weekdaysParse) {
            this._weekdaysParse = [];
            this._minWeekdaysParse = [];
            this._shortWeekdaysParse = [];
            this._fullWeekdaysParse = [];
        }

        for (i = 0; i < 7; i++) {
            // make the regex if we don't have it already

            mom = create_utc__createUTC([2000, 1]).day(i);
            if (strict && !this._fullWeekdaysParse[i]) {
                this._fullWeekdaysParse[i] = new RegExp('^' + this.weekdays(mom, '').replace('.', '\.?') + '$', 'i');
                this._shortWeekdaysParse[i] = new RegExp('^' + this.weekdaysShort(mom, '').replace('.', '\.?') + '$', 'i');
                this._minWeekdaysParse[i] = new RegExp('^' + this.weekdaysMin(mom, '').replace('.', '\.?') + '$', 'i');
            }
            if (!this._weekdaysParse[i]) {
                regex = '^' + this.weekdays(mom, '') + '|^' + this.weekdaysShort(mom, '') + '|^' + this.weekdaysMin(mom, '');
                this._weekdaysParse[i] = new RegExp(regex.replace('.', ''), 'i');
            }
            // test the regex
            if (strict && format === 'dddd' && this._fullWeekdaysParse[i].test(weekdayName)) {
                return i;
            } else if (strict && format === 'ddd' && this._shortWeekdaysParse[i].test(weekdayName)) {
                return i;
            } else if (strict && format === 'dd' && this._minWeekdaysParse[i].test(weekdayName)) {
                return i;
            } else if (!strict && this._weekdaysParse[i].test(weekdayName)) {
                return i;
            }
        }
    }

    // MOMENTS

    function getSetDayOfWeek (input) {
        if (!this.isValid()) {
            return input != null ? this : NaN;
        }
        var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
        if (input != null) {
            input = parseWeekday(input, this.localeData());
            return this.add(input - day, 'd');
        } else {
            return day;
        }
    }

    function getSetLocaleDayOfWeek (input) {
        if (!this.isValid()) {
            return input != null ? this : NaN;
        }
        var weekday = (this.day() + 7 - this.localeData()._week.dow) % 7;
        return input == null ? weekday : this.add(input - weekday, 'd');
    }

    function getSetISODayOfWeek (input) {
        if (!this.isValid()) {
            return input != null ? this : NaN;
        }
        // behaves the same as moment#day except
        // as a getter, returns 7 instead of 0 (1-7 range instead of 0-6)
        // as a setter, sunday should belong to the previous week.
        return input == null ? this.day() || 7 : this.day(this.day() % 7 ? input : input - 7);
    }

    var defaultWeekdaysRegex = matchWord;
    function weekdaysRegex (isStrict) {
        if (this._weekdaysParseExact) {
            if (!hasOwnProp(this, '_weekdaysRegex')) {
                computeWeekdaysParse.call(this);
            }
            if (isStrict) {
                return this._weekdaysStrictRegex;
            } else {
                return this._weekdaysRegex;
            }
        } else {
            return this._weekdaysStrictRegex && isStrict ?
                this._weekdaysStrictRegex : this._weekdaysRegex;
        }
    }

    var defaultWeekdaysShortRegex = matchWord;
    function weekdaysShortRegex (isStrict) {
        if (this._weekdaysParseExact) {
            if (!hasOwnProp(this, '_weekdaysRegex')) {
                computeWeekdaysParse.call(this);
            }
            if (isStrict) {
                return this._weekdaysShortStrictRegex;
            } else {
                return this._weekdaysShortRegex;
            }
        } else {
            return this._weekdaysShortStrictRegex && isStrict ?
                this._weekdaysShortStrictRegex : this._weekdaysShortRegex;
        }
    }

    var defaultWeekdaysMinRegex = matchWord;
    function weekdaysMinRegex (isStrict) {
        if (this._weekdaysParseExact) {
            if (!hasOwnProp(this, '_weekdaysRegex')) {
                computeWeekdaysParse.call(this);
            }
            if (isStrict) {
                return this._weekdaysMinStrictRegex;
            } else {
                return this._weekdaysMinRegex;
            }
        } else {
            return this._weekdaysMinStrictRegex && isStrict ?
                this._weekdaysMinStrictRegex : this._weekdaysMinRegex;
        }
    }


    function computeWeekdaysParse () {
        function cmpLenRev(a, b) {
            return b.length - a.length;
        }

        var minPieces = [], shortPieces = [], longPieces = [], mixedPieces = [],
            i, mom, minp, shortp, longp;
        for (i = 0; i < 7; i++) {
            // make the regex if we don't have it already
            mom = create_utc__createUTC([2000, 1]).day(i);
            minp = this.weekdaysMin(mom, '');
            shortp = this.weekdaysShort(mom, '');
            longp = this.weekdays(mom, '');
            minPieces.push(minp);
            shortPieces.push(shortp);
            longPieces.push(longp);
            mixedPieces.push(minp);
            mixedPieces.push(shortp);
            mixedPieces.push(longp);
        }
        // Sorting makes sure if one weekday (or abbr) is a prefix of another it
        // will match the longer piece.
        minPieces.sort(cmpLenRev);
        shortPieces.sort(cmpLenRev);
        longPieces.sort(cmpLenRev);
        mixedPieces.sort(cmpLenRev);
        for (i = 0; i < 7; i++) {
            shortPieces[i] = regexEscape(shortPieces[i]);
            longPieces[i] = regexEscape(longPieces[i]);
            mixedPieces[i] = regexEscape(mixedPieces[i]);
        }

        this._weekdaysRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
        this._weekdaysShortRegex = this._weekdaysRegex;
        this._weekdaysMinRegex = this._weekdaysRegex;

        this._weekdaysStrictRegex = new RegExp('^(' + longPieces.join('|') + ')', 'i');
        this._weekdaysShortStrictRegex = new RegExp('^(' + shortPieces.join('|') + ')', 'i');
        this._weekdaysMinStrictRegex = new RegExp('^(' + minPieces.join('|') + ')', 'i');
    }

    // FORMATTING

    addFormatToken('DDD', ['DDDD', 3], 'DDDo', 'dayOfYear');

    // ALIASES

    addUnitAlias('dayOfYear', 'DDD');

    // PARSING

    addRegexToken('DDD',  match1to3);
    addRegexToken('DDDD', match3);
    addParseToken(['DDD', 'DDDD'], function (input, array, config) {
        config._dayOfYear = toInt(input);
    });

    // HELPERS

    // MOMENTS

    function getSetDayOfYear (input) {
        var dayOfYear = Math.round((this.clone().startOf('day') - this.clone().startOf('year')) / 864e5) + 1;
        return input == null ? dayOfYear : this.add((input - dayOfYear), 'd');
    }

    // FORMATTING

    function hFormat() {
        return this.hours() % 12 || 12;
    }

    function kFormat() {
        return this.hours() || 24;
    }

    addFormatToken('H', ['HH', 2], 0, 'hour');
    addFormatToken('h', ['hh', 2], 0, hFormat);
    addFormatToken('k', ['kk', 2], 0, kFormat);

    addFormatToken('hmm', 0, 0, function () {
        return '' + hFormat.apply(this) + zeroFill(this.minutes(), 2);
    });

    addFormatToken('hmmss', 0, 0, function () {
        return '' + hFormat.apply(this) + zeroFill(this.minutes(), 2) +
            zeroFill(this.seconds(), 2);
    });

    addFormatToken('Hmm', 0, 0, function () {
        return '' + this.hours() + zeroFill(this.minutes(), 2);
    });

    addFormatToken('Hmmss', 0, 0, function () {
        return '' + this.hours() + zeroFill(this.minutes(), 2) +
            zeroFill(this.seconds(), 2);
    });

    function meridiem (token, lowercase) {
        addFormatToken(token, 0, 0, function () {
            return this.localeData().meridiem(this.hours(), this.minutes(), lowercase);
        });
    }

    meridiem('a', true);
    meridiem('A', false);

    // ALIASES

    addUnitAlias('hour', 'h');

    // PARSING

    function matchMeridiem (isStrict, locale) {
        return locale._meridiemParse;
    }

    addRegexToken('a',  matchMeridiem);
    addRegexToken('A',  matchMeridiem);
    addRegexToken('H',  match1to2);
    addRegexToken('h',  match1to2);
    addRegexToken('HH', match1to2, match2);
    addRegexToken('hh', match1to2, match2);

    addRegexToken('hmm', match3to4);
    addRegexToken('hmmss', match5to6);
    addRegexToken('Hmm', match3to4);
    addRegexToken('Hmmss', match5to6);

    addParseToken(['H', 'HH'], HOUR);
    addParseToken(['a', 'A'], function (input, array, config) {
        config._isPm = config._locale.isPM(input);
        config._meridiem = input;
    });
    addParseToken(['h', 'hh'], function (input, array, config) {
        array[HOUR] = toInt(input);
        getParsingFlags(config).bigHour = true;
    });
    addParseToken('hmm', function (input, array, config) {
        var pos = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos));
        array[MINUTE] = toInt(input.substr(pos));
        getParsingFlags(config).bigHour = true;
    });
    addParseToken('hmmss', function (input, array, config) {
        var pos1 = input.length - 4;
        var pos2 = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos1));
        array[MINUTE] = toInt(input.substr(pos1, 2));
        array[SECOND] = toInt(input.substr(pos2));
        getParsingFlags(config).bigHour = true;
    });
    addParseToken('Hmm', function (input, array, config) {
        var pos = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos));
        array[MINUTE] = toInt(input.substr(pos));
    });
    addParseToken('Hmmss', function (input, array, config) {
        var pos1 = input.length - 4;
        var pos2 = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos1));
        array[MINUTE] = toInt(input.substr(pos1, 2));
        array[SECOND] = toInt(input.substr(pos2));
    });

    // LOCALES

    function localeIsPM (input) {
        // IE8 Quirks Mode & IE7 Standards Mode do not allow accessing strings like arrays
        // Using charAt should be more compatible.
        return ((input + '').toLowerCase().charAt(0) === 'p');
    }

    var defaultLocaleMeridiemParse = /[ap]\.?m?\.?/i;
    function localeMeridiem (hours, minutes, isLower) {
        if (hours > 11) {
            return isLower ? 'pm' : 'PM';
        } else {
            return isLower ? 'am' : 'AM';
        }
    }


    // MOMENTS

    // Setting the hour should keep the time, because the user explicitly
    // specified which hour he wants. So trying to maintain the same hour (in
    // a new timezone) makes sense. Adding/subtracting hours does not follow
    // this rule.
    var getSetHour = makeGetSet('Hours', true);

    // FORMATTING

    addFormatToken('m', ['mm', 2], 0, 'minute');

    // ALIASES

    addUnitAlias('minute', 'm');

    // PARSING

    addRegexToken('m',  match1to2);
    addRegexToken('mm', match1to2, match2);
    addParseToken(['m', 'mm'], MINUTE);

    // MOMENTS

    var getSetMinute = makeGetSet('Minutes', false);

    // FORMATTING

    addFormatToken('s', ['ss', 2], 0, 'second');

    // ALIASES

    addUnitAlias('second', 's');

    // PARSING

    addRegexToken('s',  match1to2);
    addRegexToken('ss', match1to2, match2);
    addParseToken(['s', 'ss'], SECOND);

    // MOMENTS

    var getSetSecond = makeGetSet('Seconds', false);

    // FORMATTING

    addFormatToken('S', 0, 0, function () {
        return ~~(this.millisecond() / 100);
    });

    addFormatToken(0, ['SS', 2], 0, function () {
        return ~~(this.millisecond() / 10);
    });

    addFormatToken(0, ['SSS', 3], 0, 'millisecond');
    addFormatToken(0, ['SSSS', 4], 0, function () {
        return this.millisecond() * 10;
    });
    addFormatToken(0, ['SSSSS', 5], 0, function () {
        return this.millisecond() * 100;
    });
    addFormatToken(0, ['SSSSSS', 6], 0, function () {
        return this.millisecond() * 1000;
    });
    addFormatToken(0, ['SSSSSSS', 7], 0, function () {
        return this.millisecond() * 10000;
    });
    addFormatToken(0, ['SSSSSSSS', 8], 0, function () {
        return this.millisecond() * 100000;
    });
    addFormatToken(0, ['SSSSSSSSS', 9], 0, function () {
        return this.millisecond() * 1000000;
    });


    // ALIASES

    addUnitAlias('millisecond', 'ms');

    // PARSING

    addRegexToken('S',    match1to3, match1);
    addRegexToken('SS',   match1to3, match2);
    addRegexToken('SSS',  match1to3, match3);

    var token;
    for (token = 'SSSS'; token.length <= 9; token += 'S') {
        addRegexToken(token, matchUnsigned);
    }

    function parseMs(input, array) {
        array[MILLISECOND] = toInt(('0.' + input) * 1000);
    }

    for (token = 'S'; token.length <= 9; token += 'S') {
        addParseToken(token, parseMs);
    }
    // MOMENTS

    var getSetMillisecond = makeGetSet('Milliseconds', false);

    // FORMATTING

    addFormatToken('z',  0, 0, 'zoneAbbr');
    addFormatToken('zz', 0, 0, 'zoneName');

    // MOMENTS

    function getZoneAbbr () {
        return this._isUTC ? 'UTC' : '';
    }

    function getZoneName () {
        return this._isUTC ? 'Coordinated Universal Time' : '';
    }

    var momentPrototype__proto = Moment.prototype;

    momentPrototype__proto.add               = add_subtract__add;
    momentPrototype__proto.calendar          = moment_calendar__calendar;
    momentPrototype__proto.clone             = clone;
    momentPrototype__proto.diff              = diff;
    momentPrototype__proto.endOf             = endOf;
    momentPrototype__proto.format            = format;
    momentPrototype__proto.from              = from;
    momentPrototype__proto.fromNow           = fromNow;
    momentPrototype__proto.to                = to;
    momentPrototype__proto.toNow             = toNow;
    momentPrototype__proto.get               = getSet;
    momentPrototype__proto.invalidAt         = invalidAt;
    momentPrototype__proto.isAfter           = isAfter;
    momentPrototype__proto.isBefore          = isBefore;
    momentPrototype__proto.isBetween         = isBetween;
    momentPrototype__proto.isSame            = isSame;
    momentPrototype__proto.isSameOrAfter     = isSameOrAfter;
    momentPrototype__proto.isSameOrBefore    = isSameOrBefore;
    momentPrototype__proto.isValid           = moment_valid__isValid;
    momentPrototype__proto.lang              = lang;
    momentPrototype__proto.locale            = locale;
    momentPrototype__proto.localeData        = localeData;
    momentPrototype__proto.max               = prototypeMax;
    momentPrototype__proto.min               = prototypeMin;
    momentPrototype__proto.parsingFlags      = parsingFlags;
    momentPrototype__proto.set               = getSet;
    momentPrototype__proto.startOf           = startOf;
    momentPrototype__proto.subtract          = add_subtract__subtract;
    momentPrototype__proto.toArray           = toArray;
    momentPrototype__proto.toObject          = toObject;
    momentPrototype__proto.toDate            = toDate;
    momentPrototype__proto.toISOString       = moment_format__toISOString;
    momentPrototype__proto.toJSON            = toJSON;
    momentPrototype__proto.toString          = toString;
    momentPrototype__proto.unix              = unix;
    momentPrototype__proto.valueOf           = to_type__valueOf;
    momentPrototype__proto.creationData      = creationData;

    // Year
    momentPrototype__proto.year       = getSetYear;
    momentPrototype__proto.isLeapYear = getIsLeapYear;

    // Week Year
    momentPrototype__proto.weekYear    = getSetWeekYear;
    momentPrototype__proto.isoWeekYear = getSetISOWeekYear;

    // Quarter
    momentPrototype__proto.quarter = momentPrototype__proto.quarters = getSetQuarter;

    // Month
    momentPrototype__proto.month       = getSetMonth;
    momentPrototype__proto.daysInMonth = getDaysInMonth;

    // Week
    momentPrototype__proto.week           = momentPrototype__proto.weeks        = getSetWeek;
    momentPrototype__proto.isoWeek        = momentPrototype__proto.isoWeeks     = getSetISOWeek;
    momentPrototype__proto.weeksInYear    = getWeeksInYear;
    momentPrototype__proto.isoWeeksInYear = getISOWeeksInYear;

    // Day
    momentPrototype__proto.date       = getSetDayOfMonth;
    momentPrototype__proto.day        = momentPrototype__proto.days             = getSetDayOfWeek;
    momentPrototype__proto.weekday    = getSetLocaleDayOfWeek;
    momentPrototype__proto.isoWeekday = getSetISODayOfWeek;
    momentPrototype__proto.dayOfYear  = getSetDayOfYear;

    // Hour
    momentPrototype__proto.hour = momentPrototype__proto.hours = getSetHour;

    // Minute
    momentPrototype__proto.minute = momentPrototype__proto.minutes = getSetMinute;

    // Second
    momentPrototype__proto.second = momentPrototype__proto.seconds = getSetSecond;

    // Millisecond
    momentPrototype__proto.millisecond = momentPrototype__proto.milliseconds = getSetMillisecond;

    // Offset
    momentPrototype__proto.utcOffset            = getSetOffset;
    momentPrototype__proto.utc                  = setOffsetToUTC;
    momentPrototype__proto.local                = setOffsetToLocal;
    momentPrototype__proto.parseZone            = setOffsetToParsedOffset;
    momentPrototype__proto.hasAlignedHourOffset = hasAlignedHourOffset;
    momentPrototype__proto.isDST                = isDaylightSavingTime;
    momentPrototype__proto.isDSTShifted         = isDaylightSavingTimeShifted;
    momentPrototype__proto.isLocal              = isLocal;
    momentPrototype__proto.isUtcOffset          = isUtcOffset;
    momentPrototype__proto.isUtc                = isUtc;
    momentPrototype__proto.isUTC                = isUtc;

    // Timezone
    momentPrototype__proto.zoneAbbr = getZoneAbbr;
    momentPrototype__proto.zoneName = getZoneName;

    // Deprecations
    momentPrototype__proto.dates  = deprecate('dates accessor is deprecated. Use date instead.', getSetDayOfMonth);
    momentPrototype__proto.months = deprecate('months accessor is deprecated. Use month instead', getSetMonth);
    momentPrototype__proto.years  = deprecate('years accessor is deprecated. Use year instead', getSetYear);
    momentPrototype__proto.zone   = deprecate('moment().zone is deprecated, use moment().utcOffset instead. https://github.com/moment/moment/issues/1779', getSetZone);

    var momentPrototype = momentPrototype__proto;

    function moment__createUnix (input) {
        return local__createLocal(input * 1000);
    }

    function moment__createInZone () {
        return local__createLocal.apply(null, arguments).parseZone();
    }

    var defaultCalendar = {
        sameDay : '[Today at] LT',
        nextDay : '[Tomorrow at] LT',
        nextWeek : 'dddd [at] LT',
        lastDay : '[Yesterday at] LT',
        lastWeek : '[Last] dddd [at] LT',
        sameElse : 'L'
    };

    function locale_calendar__calendar (key, mom, now) {
        var output = this._calendar[key];
        return isFunction(output) ? output.call(mom, now) : output;
    }

    var defaultLongDateFormat = {
        LTS  : 'h:mm:ss A',
        LT   : 'h:mm A',
        L    : 'MM/DD/YYYY',
        LL   : 'MMMM D, YYYY',
        LLL  : 'MMMM D, YYYY h:mm A',
        LLLL : 'dddd, MMMM D, YYYY h:mm A'
    };

    function longDateFormat (key) {
        var format = this._longDateFormat[key],
            formatUpper = this._longDateFormat[key.toUpperCase()];

        if (format || !formatUpper) {
            return format;
        }

        this._longDateFormat[key] = formatUpper.replace(/MMMM|MM|DD|dddd/g, function (val) {
            return val.slice(1);
        });

        return this._longDateFormat[key];
    }

    var defaultInvalidDate = 'Invalid date';

    function invalidDate () {
        return this._invalidDate;
    }

    var defaultOrdinal = '%d';
    var defaultOrdinalParse = /\d{1,2}/;

    function ordinal (number) {
        return this._ordinal.replace('%d', number);
    }

    function preParsePostFormat (string) {
        return string;
    }

    var defaultRelativeTime = {
        future : 'in %s',
        past   : '%s ago',
        s  : 'a few seconds',
        m  : 'a minute',
        mm : '%d minutes',
        h  : 'an hour',
        hh : '%d hours',
        d  : 'a day',
        dd : '%d days',
        M  : 'a month',
        MM : '%d months',
        y  : 'a year',
        yy : '%d years'
    };

    function relative__relativeTime (number, withoutSuffix, string, isFuture) {
        var output = this._relativeTime[string];
        return (isFunction(output)) ?
            output(number, withoutSuffix, string, isFuture) :
            output.replace(/%d/i, number);
    }

    function pastFuture (diff, output) {
        var format = this._relativeTime[diff > 0 ? 'future' : 'past'];
        return isFunction(format) ? format(output) : format.replace(/%s/i, output);
    }

    var prototype__proto = Locale.prototype;

    prototype__proto._calendar       = defaultCalendar;
    prototype__proto.calendar        = locale_calendar__calendar;
    prototype__proto._longDateFormat = defaultLongDateFormat;
    prototype__proto.longDateFormat  = longDateFormat;
    prototype__proto._invalidDate    = defaultInvalidDate;
    prototype__proto.invalidDate     = invalidDate;
    prototype__proto._ordinal        = defaultOrdinal;
    prototype__proto.ordinal         = ordinal;
    prototype__proto._ordinalParse   = defaultOrdinalParse;
    prototype__proto.preparse        = preParsePostFormat;
    prototype__proto.postformat      = preParsePostFormat;
    prototype__proto._relativeTime   = defaultRelativeTime;
    prototype__proto.relativeTime    = relative__relativeTime;
    prototype__proto.pastFuture      = pastFuture;
    prototype__proto.set             = locale_set__set;

    // Month
    prototype__proto.months            =        localeMonths;
    prototype__proto._months           = defaultLocaleMonths;
    prototype__proto.monthsShort       =        localeMonthsShort;
    prototype__proto._monthsShort      = defaultLocaleMonthsShort;
    prototype__proto.monthsParse       =        localeMonthsParse;
    prototype__proto._monthsRegex      = defaultMonthsRegex;
    prototype__proto.monthsRegex       = monthsRegex;
    prototype__proto._monthsShortRegex = defaultMonthsShortRegex;
    prototype__proto.monthsShortRegex  = monthsShortRegex;

    // Week
    prototype__proto.week = localeWeek;
    prototype__proto._week = defaultLocaleWeek;
    prototype__proto.firstDayOfYear = localeFirstDayOfYear;
    prototype__proto.firstDayOfWeek = localeFirstDayOfWeek;

    // Day of Week
    prototype__proto.weekdays       =        localeWeekdays;
    prototype__proto._weekdays      = defaultLocaleWeekdays;
    prototype__proto.weekdaysMin    =        localeWeekdaysMin;
    prototype__proto._weekdaysMin   = defaultLocaleWeekdaysMin;
    prototype__proto.weekdaysShort  =        localeWeekdaysShort;
    prototype__proto._weekdaysShort = defaultLocaleWeekdaysShort;
    prototype__proto.weekdaysParse  =        localeWeekdaysParse;

    prototype__proto._weekdaysRegex      = defaultWeekdaysRegex;
    prototype__proto.weekdaysRegex       =        weekdaysRegex;
    prototype__proto._weekdaysShortRegex = defaultWeekdaysShortRegex;
    prototype__proto.weekdaysShortRegex  =        weekdaysShortRegex;
    prototype__proto._weekdaysMinRegex   = defaultWeekdaysMinRegex;
    prototype__proto.weekdaysMinRegex    =        weekdaysMinRegex;

    // Hours
    prototype__proto.isPM = localeIsPM;
    prototype__proto._meridiemParse = defaultLocaleMeridiemParse;
    prototype__proto.meridiem = localeMeridiem;

    function lists__get (format, index, field, setter) {
        var locale = locale_locales__getLocale();
        var utc = create_utc__createUTC().set(setter, index);
        return locale[field](utc, format);
    }

    function listMonthsImpl (format, index, field) {
        if (typeof format === 'number') {
            index = format;
            format = undefined;
        }

        format = format || '';

        if (index != null) {
            return lists__get(format, index, field, 'month');
        }

        var i;
        var out = [];
        for (i = 0; i < 12; i++) {
            out[i] = lists__get(format, i, field, 'month');
        }
        return out;
    }

    // ()
    // (5)
    // (fmt, 5)
    // (fmt)
    // (true)
    // (true, 5)
    // (true, fmt, 5)
    // (true, fmt)
    function listWeekdaysImpl (localeSorted, format, index, field) {
        if (typeof localeSorted === 'boolean') {
            if (typeof format === 'number') {
                index = format;
                format = undefined;
            }

            format = format || '';
        } else {
            format = localeSorted;
            index = format;
            localeSorted = false;

            if (typeof format === 'number') {
                index = format;
                format = undefined;
            }

            format = format || '';
        }

        var locale = locale_locales__getLocale(),
            shift = localeSorted ? locale._week.dow : 0;

        if (index != null) {
            return lists__get(format, (index + shift) % 7, field, 'day');
        }

        var i;
        var out = [];
        for (i = 0; i < 7; i++) {
            out[i] = lists__get(format, (i + shift) % 7, field, 'day');
        }
        return out;
    }

    function lists__listMonths (format, index) {
        return listMonthsImpl(format, index, 'months');
    }

    function lists__listMonthsShort (format, index) {
        return listMonthsImpl(format, index, 'monthsShort');
    }

    function lists__listWeekdays (localeSorted, format, index) {
        return listWeekdaysImpl(localeSorted, format, index, 'weekdays');
    }

    function lists__listWeekdaysShort (localeSorted, format, index) {
        return listWeekdaysImpl(localeSorted, format, index, 'weekdaysShort');
    }

    function lists__listWeekdaysMin (localeSorted, format, index) {
        return listWeekdaysImpl(localeSorted, format, index, 'weekdaysMin');
    }

    locale_locales__getSetGlobalLocale('en', {
        ordinalParse: /\d{1,2}(th|st|nd|rd)/,
        ordinal : function (number) {
            var b = number % 10,
                output = (toInt(number % 100 / 10) === 1) ? 'th' :
                (b === 1) ? 'st' :
                (b === 2) ? 'nd' :
                (b === 3) ? 'rd' : 'th';
            return number + output;
        }
    });

    // Side effect imports
    utils_hooks__hooks.lang = deprecate('moment.lang is deprecated. Use moment.locale instead.', locale_locales__getSetGlobalLocale);
    utils_hooks__hooks.langData = deprecate('moment.langData is deprecated. Use moment.localeData instead.', locale_locales__getLocale);

    var mathAbs = Math.abs;

    function duration_abs__abs () {
        var data           = this._data;

        this._milliseconds = mathAbs(this._milliseconds);
        this._days         = mathAbs(this._days);
        this._months       = mathAbs(this._months);

        data.milliseconds  = mathAbs(data.milliseconds);
        data.seconds       = mathAbs(data.seconds);
        data.minutes       = mathAbs(data.minutes);
        data.hours         = mathAbs(data.hours);
        data.months        = mathAbs(data.months);
        data.years         = mathAbs(data.years);

        return this;
    }

    function duration_add_subtract__addSubtract (duration, input, value, direction) {
        var other = create__createDuration(input, value);

        duration._milliseconds += direction * other._milliseconds;
        duration._days         += direction * other._days;
        duration._months       += direction * other._months;

        return duration._bubble();
    }

    // supports only 2.0-style add(1, 's') or add(duration)
    function duration_add_subtract__add (input, value) {
        return duration_add_subtract__addSubtract(this, input, value, 1);
    }

    // supports only 2.0-style subtract(1, 's') or subtract(duration)
    function duration_add_subtract__subtract (input, value) {
        return duration_add_subtract__addSubtract(this, input, value, -1);
    }

    function absCeil (number) {
        if (number < 0) {
            return Math.floor(number);
        } else {
            return Math.ceil(number);
        }
    }

    function bubble () {
        var milliseconds = this._milliseconds;
        var days         = this._days;
        var months       = this._months;
        var data         = this._data;
        var seconds, minutes, hours, years, monthsFromDays;

        // if we have a mix of positive and negative values, bubble down first
        // check: https://github.com/moment/moment/issues/2166
        if (!((milliseconds >= 0 && days >= 0 && months >= 0) ||
                (milliseconds <= 0 && days <= 0 && months <= 0))) {
            milliseconds += absCeil(monthsToDays(months) + days) * 864e5;
            days = 0;
            months = 0;
        }

        // The following code bubbles up values, see the tests for
        // examples of what that means.
        data.milliseconds = milliseconds % 1000;

        seconds           = absFloor(milliseconds / 1000);
        data.seconds      = seconds % 60;

        minutes           = absFloor(seconds / 60);
        data.minutes      = minutes % 60;

        hours             = absFloor(minutes / 60);
        data.hours        = hours % 24;

        days += absFloor(hours / 24);

        // convert days to months
        monthsFromDays = absFloor(daysToMonths(days));
        months += monthsFromDays;
        days -= absCeil(monthsToDays(monthsFromDays));

        // 12 months -> 1 year
        years = absFloor(months / 12);
        months %= 12;

        data.days   = days;
        data.months = months;
        data.years  = years;

        return this;
    }

    function daysToMonths (days) {
        // 400 years have 146097 days (taking into account leap year rules)
        // 400 years have 12 months === 4800
        return days * 4800 / 146097;
    }

    function monthsToDays (months) {
        // the reverse of daysToMonths
        return months * 146097 / 4800;
    }

    function as (units) {
        var days;
        var months;
        var milliseconds = this._milliseconds;

        units = normalizeUnits(units);

        if (units === 'month' || units === 'year') {
            days   = this._days   + milliseconds / 864e5;
            months = this._months + daysToMonths(days);
            return units === 'month' ? months : months / 12;
        } else {
            // handle milliseconds separately because of floating point math errors (issue #1867)
            days = this._days + Math.round(monthsToDays(this._months));
            switch (units) {
                case 'week'   : return days / 7     + milliseconds / 6048e5;
                case 'day'    : return days         + milliseconds / 864e5;
                case 'hour'   : return days * 24    + milliseconds / 36e5;
                case 'minute' : return days * 1440  + milliseconds / 6e4;
                case 'second' : return days * 86400 + milliseconds / 1000;
                // Math.floor prevents floating point math errors here
                case 'millisecond': return Math.floor(days * 864e5) + milliseconds;
                default: throw new Error('Unknown unit ' + units);
            }
        }
    }

    // TODO: Use this.as('ms')?
    function duration_as__valueOf () {
        return (
            this._milliseconds +
            this._days * 864e5 +
            (this._months % 12) * 2592e6 +
            toInt(this._months / 12) * 31536e6
        );
    }

    function makeAs (alias) {
        return function () {
            return this.as(alias);
        };
    }

    var asMilliseconds = makeAs('ms');
    var asSeconds      = makeAs('s');
    var asMinutes      = makeAs('m');
    var asHours        = makeAs('h');
    var asDays         = makeAs('d');
    var asWeeks        = makeAs('w');
    var asMonths       = makeAs('M');
    var asYears        = makeAs('y');

    function duration_get__get (units) {
        units = normalizeUnits(units);
        return this[units + 's']();
    }

    function makeGetter(name) {
        return function () {
            return this._data[name];
        };
    }

    var milliseconds = makeGetter('milliseconds');
    var seconds      = makeGetter('seconds');
    var minutes      = makeGetter('minutes');
    var hours        = makeGetter('hours');
    var days         = makeGetter('days');
    var months       = makeGetter('months');
    var years        = makeGetter('years');

    function weeks () {
        return absFloor(this.days() / 7);
    }

    var round = Math.round;
    var thresholds = {
        s: 45,  // seconds to minute
        m: 45,  // minutes to hour
        h: 22,  // hours to day
        d: 26,  // days to month
        M: 11   // months to year
    };

    // helper function for moment.fn.from, moment.fn.fromNow, and moment.duration.fn.humanize
    function substituteTimeAgo(string, number, withoutSuffix, isFuture, locale) {
        return locale.relativeTime(number || 1, !!withoutSuffix, string, isFuture);
    }

    function duration_humanize__relativeTime (posNegDuration, withoutSuffix, locale) {
        var duration = create__createDuration(posNegDuration).abs();
        var seconds  = round(duration.as('s'));
        var minutes  = round(duration.as('m'));
        var hours    = round(duration.as('h'));
        var days     = round(duration.as('d'));
        var months   = round(duration.as('M'));
        var years    = round(duration.as('y'));

        var a = seconds < thresholds.s && ['s', seconds]  ||
                minutes <= 1           && ['m']           ||
                minutes < thresholds.m && ['mm', minutes] ||
                hours   <= 1           && ['h']           ||
                hours   < thresholds.h && ['hh', hours]   ||
                days    <= 1           && ['d']           ||
                days    < thresholds.d && ['dd', days]    ||
                months  <= 1           && ['M']           ||
                months  < thresholds.M && ['MM', months]  ||
                years   <= 1           && ['y']           || ['yy', years];

        a[2] = withoutSuffix;
        a[3] = +posNegDuration > 0;
        a[4] = locale;
        return substituteTimeAgo.apply(null, a);
    }

    // This function allows you to set a threshold for relative time strings
    function duration_humanize__getSetRelativeTimeThreshold (threshold, limit) {
        if (thresholds[threshold] === undefined) {
            return false;
        }
        if (limit === undefined) {
            return thresholds[threshold];
        }
        thresholds[threshold] = limit;
        return true;
    }

    function humanize (withSuffix) {
        var locale = this.localeData();
        var output = duration_humanize__relativeTime(this, !withSuffix, locale);

        if (withSuffix) {
            output = locale.pastFuture(+this, output);
        }

        return locale.postformat(output);
    }

    var iso_string__abs = Math.abs;

    function iso_string__toISOString() {
        // for ISO strings we do not use the normal bubbling rules:
        //  * milliseconds bubble up until they become hours
        //  * days do not bubble at all
        //  * months bubble up until they become years
        // This is because there is no context-free conversion between hours and days
        // (think of clock changes)
        // and also not between days and months (28-31 days per month)
        var seconds = iso_string__abs(this._milliseconds) / 1000;
        var days         = iso_string__abs(this._days);
        var months       = iso_string__abs(this._months);
        var minutes, hours, years;

        // 3600 seconds -> 60 minutes -> 1 hour
        minutes           = absFloor(seconds / 60);
        hours             = absFloor(minutes / 60);
        seconds %= 60;
        minutes %= 60;

        // 12 months -> 1 year
        years  = absFloor(months / 12);
        months %= 12;


        // inspired by https://github.com/dordille/moment-isoduration/blob/master/moment.isoduration.js
        var Y = years;
        var M = months;
        var D = days;
        var h = hours;
        var m = minutes;
        var s = seconds;
        var total = this.asSeconds();

        if (!total) {
            // this is the same as C#'s (Noda) and python (isodate)...
            // but not other JS (goog.date)
            return 'P0D';
        }

        return (total < 0 ? '-' : '') +
            'P' +
            (Y ? Y + 'Y' : '') +
            (M ? M + 'M' : '') +
            (D ? D + 'D' : '') +
            ((h || m || s) ? 'T' : '') +
            (h ? h + 'H' : '') +
            (m ? m + 'M' : '') +
            (s ? s + 'S' : '');
    }

    var duration_prototype__proto = Duration.prototype;

    duration_prototype__proto.abs            = duration_abs__abs;
    duration_prototype__proto.add            = duration_add_subtract__add;
    duration_prototype__proto.subtract       = duration_add_subtract__subtract;
    duration_prototype__proto.as             = as;
    duration_prototype__proto.asMilliseconds = asMilliseconds;
    duration_prototype__proto.asSeconds      = asSeconds;
    duration_prototype__proto.asMinutes      = asMinutes;
    duration_prototype__proto.asHours        = asHours;
    duration_prototype__proto.asDays         = asDays;
    duration_prototype__proto.asWeeks        = asWeeks;
    duration_prototype__proto.asMonths       = asMonths;
    duration_prototype__proto.asYears        = asYears;
    duration_prototype__proto.valueOf        = duration_as__valueOf;
    duration_prototype__proto._bubble        = bubble;
    duration_prototype__proto.get            = duration_get__get;
    duration_prototype__proto.milliseconds   = milliseconds;
    duration_prototype__proto.seconds        = seconds;
    duration_prototype__proto.minutes        = minutes;
    duration_prototype__proto.hours          = hours;
    duration_prototype__proto.days           = days;
    duration_prototype__proto.weeks          = weeks;
    duration_prototype__proto.months         = months;
    duration_prototype__proto.years          = years;
    duration_prototype__proto.humanize       = humanize;
    duration_prototype__proto.toISOString    = iso_string__toISOString;
    duration_prototype__proto.toString       = iso_string__toISOString;
    duration_prototype__proto.toJSON         = iso_string__toISOString;
    duration_prototype__proto.locale         = locale;
    duration_prototype__proto.localeData     = localeData;

    // Deprecations
    duration_prototype__proto.toIsoString = deprecate('toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)', iso_string__toISOString);
    duration_prototype__proto.lang = lang;

    // Side effect imports

    // FORMATTING

    addFormatToken('X', 0, 0, 'unix');
    addFormatToken('x', 0, 0, 'valueOf');

    // PARSING

    addRegexToken('x', matchSigned);
    addRegexToken('X', matchTimestamp);
    addParseToken('X', function (input, array, config) {
        config._d = new Date(parseFloat(input, 10) * 1000);
    });
    addParseToken('x', function (input, array, config) {
        config._d = new Date(toInt(input));
    });

    // Side effect imports


    utils_hooks__hooks.version = '2.13.0';

    setHookCallback(local__createLocal);

    utils_hooks__hooks.fn                    = momentPrototype;
    utils_hooks__hooks.min                   = min;
    utils_hooks__hooks.max                   = max;
    utils_hooks__hooks.now                   = now;
    utils_hooks__hooks.utc                   = create_utc__createUTC;
    utils_hooks__hooks.unix                  = moment__createUnix;
    utils_hooks__hooks.months                = lists__listMonths;
    utils_hooks__hooks.isDate                = isDate;
    utils_hooks__hooks.locale                = locale_locales__getSetGlobalLocale;
    utils_hooks__hooks.invalid               = valid__createInvalid;
    utils_hooks__hooks.duration              = create__createDuration;
    utils_hooks__hooks.isMoment              = isMoment;
    utils_hooks__hooks.weekdays              = lists__listWeekdays;
    utils_hooks__hooks.parseZone             = moment__createInZone;
    utils_hooks__hooks.localeData            = locale_locales__getLocale;
    utils_hooks__hooks.isDuration            = isDuration;
    utils_hooks__hooks.monthsShort           = lists__listMonthsShort;
    utils_hooks__hooks.weekdaysMin           = lists__listWeekdaysMin;
    utils_hooks__hooks.defineLocale          = defineLocale;
    utils_hooks__hooks.updateLocale          = updateLocale;
    utils_hooks__hooks.locales               = locale_locales__listLocales;
    utils_hooks__hooks.weekdaysShort         = lists__listWeekdaysShort;
    utils_hooks__hooks.normalizeUnits        = normalizeUnits;
    utils_hooks__hooks.relativeTimeThreshold = duration_humanize__getSetRelativeTimeThreshold;
    utils_hooks__hooks.prototype             = momentPrototype;

    var _moment = utils_hooks__hooks;

    return _moment;

}));
},{}],5:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}],6:[function(require,module,exports){
//     Underscore.js 1.8.3
//     http://underscorejs.org
//     (c) 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `exports` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var
    push             = ArrayProto.push,
    slice            = ArrayProto.slice,
    toString         = ObjProto.toString,
    hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind,
    nativeCreate       = Object.create;

  // Naked function reference for surrogate-prototype-swapping.
  var Ctor = function(){};

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `_` as a global object.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }

  // Current version.
  _.VERSION = '1.8.3';

  // Internal function that returns an efficient (for current engines) version
  // of the passed-in callback, to be repeatedly applied in other Underscore
  // functions.
  var optimizeCb = function(func, context, argCount) {
    if (context === void 0) return func;
    switch (argCount == null ? 3 : argCount) {
      case 1: return function(value) {
        return func.call(context, value);
      };
      case 2: return function(value, other) {
        return func.call(context, value, other);
      };
      case 3: return function(value, index, collection) {
        return func.call(context, value, index, collection);
      };
      case 4: return function(accumulator, value, index, collection) {
        return func.call(context, accumulator, value, index, collection);
      };
    }
    return function() {
      return func.apply(context, arguments);
    };
  };

  // A mostly-internal function to generate callbacks that can be applied
  // to each element in a collection, returning the desired result — either
  // identity, an arbitrary callback, a property matcher, or a property accessor.
  var cb = function(value, context, argCount) {
    if (value == null) return _.identity;
    if (_.isFunction(value)) return optimizeCb(value, context, argCount);
    if (_.isObject(value)) return _.matcher(value);
    return _.property(value);
  };
  _.iteratee = function(value, context) {
    return cb(value, context, Infinity);
  };

  // An internal function for creating assigner functions.
  var createAssigner = function(keysFunc, undefinedOnly) {
    return function(obj) {
      var length = arguments.length;
      if (length < 2 || obj == null) return obj;
      for (var index = 1; index < length; index++) {
        var source = arguments[index],
            keys = keysFunc(source),
            l = keys.length;
        for (var i = 0; i < l; i++) {
          var key = keys[i];
          if (!undefinedOnly || obj[key] === void 0) obj[key] = source[key];
        }
      }
      return obj;
    };
  };

  // An internal function for creating a new object that inherits from another.
  var baseCreate = function(prototype) {
    if (!_.isObject(prototype)) return {};
    if (nativeCreate) return nativeCreate(prototype);
    Ctor.prototype = prototype;
    var result = new Ctor;
    Ctor.prototype = null;
    return result;
  };

  var property = function(key) {
    return function(obj) {
      return obj == null ? void 0 : obj[key];
    };
  };

  // Helper for collection methods to determine whether a collection
  // should be iterated as an array or as an object
  // Related: http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
  // Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094
  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
  var getLength = property('length');
  var isArrayLike = function(collection) {
    var length = getLength(collection);
    return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
  };

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles raw objects in addition to array-likes. Treats all
  // sparse array-likes as if they were dense.
  _.each = _.forEach = function(obj, iteratee, context) {
    iteratee = optimizeCb(iteratee, context);
    var i, length;
    if (isArrayLike(obj)) {
      for (i = 0, length = obj.length; i < length; i++) {
        iteratee(obj[i], i, obj);
      }
    } else {
      var keys = _.keys(obj);
      for (i = 0, length = keys.length; i < length; i++) {
        iteratee(obj[keys[i]], keys[i], obj);
      }
    }
    return obj;
  };

  // Return the results of applying the iteratee to each element.
  _.map = _.collect = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length,
        results = Array(length);
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      results[index] = iteratee(obj[currentKey], currentKey, obj);
    }
    return results;
  };

  // Create a reducing function iterating left or right.
  function createReduce(dir) {
    // Optimized iterator function as using arguments.length
    // in the main function will deoptimize the, see #1991.
    function iterator(obj, iteratee, memo, keys, index, length) {
      for (; index >= 0 && index < length; index += dir) {
        var currentKey = keys ? keys[index] : index;
        memo = iteratee(memo, obj[currentKey], currentKey, obj);
      }
      return memo;
    }

    return function(obj, iteratee, memo, context) {
      iteratee = optimizeCb(iteratee, context, 4);
      var keys = !isArrayLike(obj) && _.keys(obj),
          length = (keys || obj).length,
          index = dir > 0 ? 0 : length - 1;
      // Determine the initial value if none is provided.
      if (arguments.length < 3) {
        memo = obj[keys ? keys[index] : index];
        index += dir;
      }
      return iterator(obj, iteratee, memo, keys, index, length);
    };
  }

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`.
  _.reduce = _.foldl = _.inject = createReduce(1);

  // The right-associative version of reduce, also known as `foldr`.
  _.reduceRight = _.foldr = createReduce(-1);

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, predicate, context) {
    var key;
    if (isArrayLike(obj)) {
      key = _.findIndex(obj, predicate, context);
    } else {
      key = _.findKey(obj, predicate, context);
    }
    if (key !== void 0 && key !== -1) return obj[key];
  };

  // Return all the elements that pass a truth test.
  // Aliased as `select`.
  _.filter = _.select = function(obj, predicate, context) {
    var results = [];
    predicate = cb(predicate, context);
    _.each(obj, function(value, index, list) {
      if (predicate(value, index, list)) results.push(value);
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, predicate, context) {
    return _.filter(obj, _.negate(cb(predicate)), context);
  };

  // Determine whether all of the elements match a truth test.
  // Aliased as `all`.
  _.every = _.all = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (!predicate(obj[currentKey], currentKey, obj)) return false;
    }
    return true;
  };

  // Determine if at least one element in the object matches a truth test.
  // Aliased as `any`.
  _.some = _.any = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (predicate(obj[currentKey], currentKey, obj)) return true;
    }
    return false;
  };

  // Determine if the array or object contains a given item (using `===`).
  // Aliased as `includes` and `include`.
  _.contains = _.includes = _.include = function(obj, item, fromIndex, guard) {
    if (!isArrayLike(obj)) obj = _.values(obj);
    if (typeof fromIndex != 'number' || guard) fromIndex = 0;
    return _.indexOf(obj, item, fromIndex) >= 0;
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    var isFunc = _.isFunction(method);
    return _.map(obj, function(value) {
      var func = isFunc ? method : value[method];
      return func == null ? func : func.apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, _.property(key));
  };

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  _.where = function(obj, attrs) {
    return _.filter(obj, _.matcher(attrs));
  };

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  _.findWhere = function(obj, attrs) {
    return _.find(obj, _.matcher(attrs));
  };

  // Return the maximum element (or element-based computation).
  _.max = function(obj, iteratee, context) {
    var result = -Infinity, lastComputed = -Infinity,
        value, computed;
    if (iteratee == null && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value > result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index, list) {
        computed = iteratee(value, index, list);
        if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
          result = value;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iteratee, context) {
    var result = Infinity, lastComputed = Infinity,
        value, computed;
    if (iteratee == null && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value < result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index, list) {
        computed = iteratee(value, index, list);
        if (computed < lastComputed || computed === Infinity && result === Infinity) {
          result = value;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Shuffle a collection, using the modern version of the
  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
  _.shuffle = function(obj) {
    var set = isArrayLike(obj) ? obj : _.values(obj);
    var length = set.length;
    var shuffled = Array(length);
    for (var index = 0, rand; index < length; index++) {
      rand = _.random(0, index);
      if (rand !== index) shuffled[index] = shuffled[rand];
      shuffled[rand] = set[index];
    }
    return shuffled;
  };

  // Sample **n** random values from a collection.
  // If **n** is not specified, returns a single random element.
  // The internal `guard` argument allows it to work with `map`.
  _.sample = function(obj, n, guard) {
    if (n == null || guard) {
      if (!isArrayLike(obj)) obj = _.values(obj);
      return obj[_.random(obj.length - 1)];
    }
    return _.shuffle(obj).slice(0, Math.max(0, n));
  };

  // Sort the object's values by a criterion produced by an iteratee.
  _.sortBy = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value: value,
        index: index,
        criteria: iteratee(value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index - right.index;
    }), 'value');
  };

  // An internal function used for aggregate "group by" operations.
  var group = function(behavior) {
    return function(obj, iteratee, context) {
      var result = {};
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index) {
        var key = iteratee(value, index, obj);
        behavior(result, value, key);
      });
      return result;
    };
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = group(function(result, value, key) {
    if (_.has(result, key)) result[key].push(value); else result[key] = [value];
  });

  // Indexes the object's values by a criterion, similar to `groupBy`, but for
  // when you know that your index values will be unique.
  _.indexBy = group(function(result, value, key) {
    result[key] = value;
  });

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  _.countBy = group(function(result, value, key) {
    if (_.has(result, key)) result[key]++; else result[key] = 1;
  });

  // Safely create a real, live array from anything iterable.
  _.toArray = function(obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (isArrayLike(obj)) return _.map(obj, _.identity);
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    if (obj == null) return 0;
    return isArrayLike(obj) ? obj.length : _.keys(obj).length;
  };

  // Split a collection into two arrays: one whose elements all satisfy the given
  // predicate, and one whose elements all do not satisfy the predicate.
  _.partition = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var pass = [], fail = [];
    _.each(obj, function(value, key, obj) {
      (predicate(value, key, obj) ? pass : fail).push(value);
    });
    return [pass, fail];
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    if (array == null) return void 0;
    if (n == null || guard) return array[0];
    return _.initial(array, array.length - n);
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array.
  _.last = function(array, n, guard) {
    if (array == null) return void 0;
    if (n == null || guard) return array[array.length - 1];
    return _.rest(array, Math.max(0, array.length - n));
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array.
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, n == null || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, _.identity);
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function(input, shallow, strict, startIndex) {
    var output = [], idx = 0;
    for (var i = startIndex || 0, length = getLength(input); i < length; i++) {
      var value = input[i];
      if (isArrayLike(value) && (_.isArray(value) || _.isArguments(value))) {
        //flatten current level of array or arguments object
        if (!shallow) value = flatten(value, shallow, strict);
        var j = 0, len = value.length;
        output.length += len;
        while (j < len) {
          output[idx++] = value[j++];
        }
      } else if (!strict) {
        output[idx++] = value;
      }
    }
    return output;
  };

  // Flatten out an array, either recursively (by default), or just one level.
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, false);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iteratee, context) {
    if (!_.isBoolean(isSorted)) {
      context = iteratee;
      iteratee = isSorted;
      isSorted = false;
    }
    if (iteratee != null) iteratee = cb(iteratee, context);
    var result = [];
    var seen = [];
    for (var i = 0, length = getLength(array); i < length; i++) {
      var value = array[i],
          computed = iteratee ? iteratee(value, i, array) : value;
      if (isSorted) {
        if (!i || seen !== computed) result.push(value);
        seen = computed;
      } else if (iteratee) {
        if (!_.contains(seen, computed)) {
          seen.push(computed);
          result.push(value);
        }
      } else if (!_.contains(result, value)) {
        result.push(value);
      }
    }
    return result;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(flatten(arguments, true, true));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersection = function(array) {
    var result = [];
    var argsLength = arguments.length;
    for (var i = 0, length = getLength(array); i < length; i++) {
      var item = array[i];
      if (_.contains(result, item)) continue;
      for (var j = 1; j < argsLength; j++) {
        if (!_.contains(arguments[j], item)) break;
      }
      if (j === argsLength) result.push(item);
    }
    return result;
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var rest = flatten(arguments, true, true, 1);
    return _.filter(array, function(value){
      return !_.contains(rest, value);
    });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    return _.unzip(arguments);
  };

  // Complement of _.zip. Unzip accepts an array of arrays and groups
  // each array's elements on shared indices
  _.unzip = function(array) {
    var length = array && _.max(array, getLength).length || 0;
    var result = Array(length);

    for (var index = 0; index < length; index++) {
      result[index] = _.pluck(array, index);
    }
    return result;
  };

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values.
  _.object = function(list, values) {
    var result = {};
    for (var i = 0, length = getLength(list); i < length; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };

  // Generator function to create the findIndex and findLastIndex functions
  function createPredicateIndexFinder(dir) {
    return function(array, predicate, context) {
      predicate = cb(predicate, context);
      var length = getLength(array);
      var index = dir > 0 ? 0 : length - 1;
      for (; index >= 0 && index < length; index += dir) {
        if (predicate(array[index], index, array)) return index;
      }
      return -1;
    };
  }

  // Returns the first index on an array-like that passes a predicate test
  _.findIndex = createPredicateIndexFinder(1);
  _.findLastIndex = createPredicateIndexFinder(-1);

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iteratee, context) {
    iteratee = cb(iteratee, context, 1);
    var value = iteratee(obj);
    var low = 0, high = getLength(array);
    while (low < high) {
      var mid = Math.floor((low + high) / 2);
      if (iteratee(array[mid]) < value) low = mid + 1; else high = mid;
    }
    return low;
  };

  // Generator function to create the indexOf and lastIndexOf functions
  function createIndexFinder(dir, predicateFind, sortedIndex) {
    return function(array, item, idx) {
      var i = 0, length = getLength(array);
      if (typeof idx == 'number') {
        if (dir > 0) {
            i = idx >= 0 ? idx : Math.max(idx + length, i);
        } else {
            length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
        }
      } else if (sortedIndex && idx && length) {
        idx = sortedIndex(array, item);
        return array[idx] === item ? idx : -1;
      }
      if (item !== item) {
        idx = predicateFind(slice.call(array, i, length), _.isNaN);
        return idx >= 0 ? idx + i : -1;
      }
      for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
        if (array[idx] === item) return idx;
      }
      return -1;
    };
  }

  // Return the position of the first occurrence of an item in an array,
  // or -1 if the item is not included in the array.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = createIndexFinder(1, _.findIndex, _.sortedIndex);
  _.lastIndexOf = createIndexFinder(-1, _.findLastIndex);

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (stop == null) {
      stop = start || 0;
      start = 0;
    }
    step = step || 1;

    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var range = Array(length);

    for (var idx = 0; idx < length; idx++, start += step) {
      range[idx] = start;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Determines whether to execute a function as a constructor
  // or a normal function with the provided arguments
  var executeBound = function(sourceFunc, boundFunc, context, callingContext, args) {
    if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
    var self = baseCreate(sourceFunc.prototype);
    var result = sourceFunc.apply(self, args);
    if (_.isObject(result)) return result;
    return self;
  };

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  _.bind = function(func, context) {
    if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    if (!_.isFunction(func)) throw new TypeError('Bind must be called on a function');
    var args = slice.call(arguments, 2);
    var bound = function() {
      return executeBound(func, bound, context, this, args.concat(slice.call(arguments)));
    };
    return bound;
  };

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context. _ acts
  // as a placeholder, allowing any combination of arguments to be pre-filled.
  _.partial = function(func) {
    var boundArgs = slice.call(arguments, 1);
    var bound = function() {
      var position = 0, length = boundArgs.length;
      var args = Array(length);
      for (var i = 0; i < length; i++) {
        args[i] = boundArgs[i] === _ ? arguments[position++] : boundArgs[i];
      }
      while (position < arguments.length) args.push(arguments[position++]);
      return executeBound(func, bound, this, this, args);
    };
    return bound;
  };

  // Bind a number of an object's methods to that object. Remaining arguments
  // are the method names to be bound. Useful for ensuring that all callbacks
  // defined on an object belong to it.
  _.bindAll = function(obj) {
    var i, length = arguments.length, key;
    if (length <= 1) throw new Error('bindAll must be passed function names');
    for (i = 1; i < length; i++) {
      key = arguments[i];
      obj[key] = _.bind(obj[key], obj);
    }
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memoize = function(key) {
      var cache = memoize.cache;
      var address = '' + (hasher ? hasher.apply(this, arguments) : key);
      if (!_.has(cache, address)) cache[address] = func.apply(this, arguments);
      return cache[address];
    };
    memoize.cache = {};
    return memoize;
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){
      return func.apply(null, args);
    }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = _.partial(_.delay, _, 1);

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time. Normally, the throttled function will run
  // as much as it can, without ever going more than once per `wait` duration;
  // but if you'd like to disable the execution on the leading edge, pass
  // `{leading: false}`. To disable execution on the trailing edge, ditto.
  _.throttle = function(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    if (!options) options = {};
    var later = function() {
      previous = options.leading === false ? 0 : _.now();
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    };
    return function() {
      var now = _.now();
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        previous = now;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function(func, wait, immediate) {
    var timeout, args, context, timestamp, result;

    var later = function() {
      var last = _.now() - timestamp;

      if (last < wait && last >= 0) {
        timeout = setTimeout(later, wait - last);
      } else {
        timeout = null;
        if (!immediate) {
          result = func.apply(context, args);
          if (!timeout) context = args = null;
        }
      }
    };

    return function() {
      context = this;
      args = arguments;
      timestamp = _.now();
      var callNow = immediate && !timeout;
      if (!timeout) timeout = setTimeout(later, wait);
      if (callNow) {
        result = func.apply(context, args);
        context = args = null;
      }

      return result;
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return _.partial(wrapper, func);
  };

  // Returns a negated version of the passed-in predicate.
  _.negate = function(predicate) {
    return function() {
      return !predicate.apply(this, arguments);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var args = arguments;
    var start = args.length - 1;
    return function() {
      var i = start;
      var result = args[start].apply(this, arguments);
      while (i--) result = args[i].call(this, result);
      return result;
    };
  };

  // Returns a function that will only be executed on and after the Nth call.
  _.after = function(times, func) {
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Returns a function that will only be executed up to (but not including) the Nth call.
  _.before = function(times, func) {
    var memo;
    return function() {
      if (--times > 0) {
        memo = func.apply(this, arguments);
      }
      if (times <= 1) func = null;
      return memo;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = _.partial(_.before, 2);

  // Object Functions
  // ----------------

  // Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
  var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');
  var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString',
                      'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];

  function collectNonEnumProps(obj, keys) {
    var nonEnumIdx = nonEnumerableProps.length;
    var constructor = obj.constructor;
    var proto = (_.isFunction(constructor) && constructor.prototype) || ObjProto;

    // Constructor is a special case.
    var prop = 'constructor';
    if (_.has(obj, prop) && !_.contains(keys, prop)) keys.push(prop);

    while (nonEnumIdx--) {
      prop = nonEnumerableProps[nonEnumIdx];
      if (prop in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop)) {
        keys.push(prop);
      }
    }
  }

  // Retrieve the names of an object's own properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = function(obj) {
    if (!_.isObject(obj)) return [];
    if (nativeKeys) return nativeKeys(obj);
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve all the property names of an object.
  _.allKeys = function(obj) {
    if (!_.isObject(obj)) return [];
    var keys = [];
    for (var key in obj) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var values = Array(length);
    for (var i = 0; i < length; i++) {
      values[i] = obj[keys[i]];
    }
    return values;
  };

  // Returns the results of applying the iteratee to each element of the object
  // In contrast to _.map it returns an object
  _.mapObject = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys =  _.keys(obj),
          length = keys.length,
          results = {},
          currentKey;
      for (var index = 0; index < length; index++) {
        currentKey = keys[index];
        results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
      }
      return results;
  };

  // Convert an object into a list of `[key, value]` pairs.
  _.pairs = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var pairs = Array(length);
    for (var i = 0; i < length; i++) {
      pairs[i] = [keys[i], obj[keys[i]]];
    }
    return pairs;
  };

  // Invert the keys and values of an object. The values must be serializable.
  _.invert = function(obj) {
    var result = {};
    var keys = _.keys(obj);
    for (var i = 0, length = keys.length; i < length; i++) {
      result[obj[keys[i]]] = keys[i];
    }
    return result;
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = createAssigner(_.allKeys);

  // Assigns a given object with all the own properties in the passed-in object(s)
  // (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
  _.extendOwn = _.assign = createAssigner(_.keys);

  // Returns the first key on an object that passes a predicate test
  _.findKey = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = _.keys(obj), key;
    for (var i = 0, length = keys.length; i < length; i++) {
      key = keys[i];
      if (predicate(obj[key], key, obj)) return key;
    }
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = function(object, oiteratee, context) {
    var result = {}, obj = object, iteratee, keys;
    if (obj == null) return result;
    if (_.isFunction(oiteratee)) {
      keys = _.allKeys(obj);
      iteratee = optimizeCb(oiteratee, context);
    } else {
      keys = flatten(arguments, false, false, 1);
      iteratee = function(value, key, obj) { return key in obj; };
      obj = Object(obj);
    }
    for (var i = 0, length = keys.length; i < length; i++) {
      var key = keys[i];
      var value = obj[key];
      if (iteratee(value, key, obj)) result[key] = value;
    }
    return result;
  };

   // Return a copy of the object without the blacklisted properties.
  _.omit = function(obj, iteratee, context) {
    if (_.isFunction(iteratee)) {
      iteratee = _.negate(iteratee);
    } else {
      var keys = _.map(flatten(arguments, false, false, 1), String);
      iteratee = function(value, key) {
        return !_.contains(keys, key);
      };
    }
    return _.pick(obj, iteratee, context);
  };

  // Fill in a given object with default properties.
  _.defaults = createAssigner(_.allKeys, true);

  // Creates an object that inherits from the given prototype object.
  // If additional properties are provided then they will be added to the
  // created object.
  _.create = function(prototype, props) {
    var result = baseCreate(prototype);
    if (props) _.extendOwn(result, props);
    return result;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Returns whether an object has a given set of `key:value` pairs.
  _.isMatch = function(object, attrs) {
    var keys = _.keys(attrs), length = keys.length;
    if (object == null) return !length;
    var obj = Object(object);
    for (var i = 0; i < length; i++) {
      var key = keys[i];
      if (attrs[key] !== obj[key] || !(key in obj)) return false;
    }
    return true;
  };


  // Internal recursive comparison function for `isEqual`.
  var eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a === 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className !== toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, regular expressions, dates, and booleans are compared by value.
      case '[object RegExp]':
      // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return '' + a === '' + b;
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive.
        // Object(NaN) is equivalent to NaN
        if (+a !== +a) return +b !== +b;
        // An `egal` comparison is performed for other numeric values.
        return +a === 0 ? 1 / +a === 1 / b : +a === +b;
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a === +b;
    }

    var areArrays = className === '[object Array]';
    if (!areArrays) {
      if (typeof a != 'object' || typeof b != 'object') return false;

      // Objects with different constructors are not equivalent, but `Object`s or `Array`s
      // from different frames are.
      var aCtor = a.constructor, bCtor = b.constructor;
      if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor &&
                               _.isFunction(bCtor) && bCtor instanceof bCtor)
                          && ('constructor' in a && 'constructor' in b)) {
        return false;
      }
    }
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.

    // Initializing stack of traversed objects.
    // It's done here since we only need them for objects and arrays comparison.
    aStack = aStack || [];
    bStack = bStack || [];
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] === a) return bStack[length] === b;
    }

    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);

    // Recursively compare objects and arrays.
    if (areArrays) {
      // Compare array lengths to determine if a deep comparison is necessary.
      length = a.length;
      if (length !== b.length) return false;
      // Deep compare the contents, ignoring non-numeric properties.
      while (length--) {
        if (!eq(a[length], b[length], aStack, bStack)) return false;
      }
    } else {
      // Deep compare objects.
      var keys = _.keys(a), key;
      length = keys.length;
      // Ensure that both objects contain the same number of properties before comparing deep equality.
      if (_.keys(b).length !== length) return false;
      while (length--) {
        // Deep compare each member
        key = keys[length];
        if (!(_.has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return true;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (isArrayLike(obj) && (_.isArray(obj) || _.isString(obj) || _.isArguments(obj))) return obj.length === 0;
    return _.keys(obj).length === 0;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) === '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp, isError.
  _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) === '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE < 9), where
  // there isn't any inspectable "Arguments" type.
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return _.has(obj, 'callee');
    };
  }

  // Optimize `isFunction` if appropriate. Work around some typeof bugs in old v8,
  // IE 11 (#1621), and in Safari 8 (#1929).
  if (typeof /./ != 'function' && typeof Int8Array != 'object') {
    _.isFunction = function(obj) {
      return typeof obj == 'function' || false;
    };
  }

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return isFinite(obj) && !isNaN(parseFloat(obj));
  };

  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
  _.isNaN = function(obj) {
    return _.isNumber(obj) && obj !== +obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  _.has = function(obj, key) {
    return obj != null && hasOwnProperty.call(obj, key);
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iteratees.
  _.identity = function(value) {
    return value;
  };

  // Predicate-generating functions. Often useful outside of Underscore.
  _.constant = function(value) {
    return function() {
      return value;
    };
  };

  _.noop = function(){};

  _.property = property;

  // Generates a function for a given object that returns a given property.
  _.propertyOf = function(obj) {
    return obj == null ? function(){} : function(key) {
      return obj[key];
    };
  };

  // Returns a predicate for checking whether an object has a given set of
  // `key:value` pairs.
  _.matcher = _.matches = function(attrs) {
    attrs = _.extendOwn({}, attrs);
    return function(obj) {
      return _.isMatch(obj, attrs);
    };
  };

  // Run a function **n** times.
  _.times = function(n, iteratee, context) {
    var accum = Array(Math.max(0, n));
    iteratee = optimizeCb(iteratee, context, 1);
    for (var i = 0; i < n; i++) accum[i] = iteratee(i);
    return accum;
  };

  // Return a random integer between min and max (inclusive).
  _.random = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  // A (possibly faster) way to get the current timestamp as an integer.
  _.now = Date.now || function() {
    return new Date().getTime();
  };

   // List of HTML entities for escaping.
  var escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;'
  };
  var unescapeMap = _.invert(escapeMap);

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  var createEscaper = function(map) {
    var escaper = function(match) {
      return map[match];
    };
    // Regexes for identifying a key that needs to be escaped
    var source = '(?:' + _.keys(map).join('|') + ')';
    var testRegexp = RegExp(source);
    var replaceRegexp = RegExp(source, 'g');
    return function(string) {
      string = string == null ? '' : '' + string;
      return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
    };
  };
  _.escape = createEscaper(escapeMap);
  _.unescape = createEscaper(unescapeMap);

  // If the value of the named `property` is a function then invoke it with the
  // `object` as context; otherwise, return it.
  _.result = function(object, property, fallback) {
    var value = object == null ? void 0 : object[property];
    if (value === void 0) {
      value = fallback;
    }
    return _.isFunction(value) ? value.call(object) : value;
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'":      "'",
    '\\':     '\\',
    '\r':     'r',
    '\n':     'n',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escaper = /\\|'|\r|\n|\u2028|\u2029/g;

  var escapeChar = function(match) {
    return '\\' + escapes[match];
  };

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  // NB: `oldSettings` only exists for backwards compatibility.
  _.template = function(text, settings, oldSettings) {
    if (!settings && oldSettings) settings = oldSettings;
    settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset).replace(escaper, escapeChar);
      index = offset + match.length;

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      } else if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      } else if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }

      // Adobe VMs need the match returned to produce the correct offest.
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + 'return __p;\n';

    try {
      var render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled source as a convenience for precompilation.
    var argument = settings.variable || 'obj';
    template.source = 'function(' + argument + '){\n' + source + '}';

    return template;
  };

  // Add a "chain" function. Start chaining a wrapped Underscore object.
  _.chain = function(obj) {
    var instance = _(obj);
    instance._chain = true;
    return instance;
  };

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // Helper function to continue chaining intermediate results.
  var result = function(instance, obj) {
    return instance._chain ? _(obj).chain() : obj;
  };

  // Add your own custom functions to the Underscore object.
  _.mixin = function(obj) {
    _.each(_.functions(obj), function(name) {
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return result(this, func.apply(_, args));
      };
    });
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  _.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name === 'shift' || name === 'splice') && obj.length === 0) delete obj[0];
      return result(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  _.each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return result(this, method.apply(this._wrapped, arguments));
    };
  });

  // Extracts the result from a wrapped and chained object.
  _.prototype.value = function() {
    return this._wrapped;
  };

  // Provide unwrapping proxy for some methods used in engine operations
  // such as arithmetic and JSON stringification.
  _.prototype.valueOf = _.prototype.toJSON = _.prototype.value;

  _.prototype.toString = function() {
    return '' + this._wrapped;
  };

  // AMD registration happens at the end for compatibility with AMD loaders
  // that may not enforce next-turn semantics on modules. Even though general
  // practice for AMD registration is to be anonymous, underscore registers
  // as a named module because, like jQuery, it is a base library that is
  // popular enough to be bundled in a third party lib, but not be part of
  // an AMD load request. Those cases could generate an error when an
  // anonymous define() is called outside of a loader request.
  if (typeof define === 'function' && define.amd) {
    define('underscore', [], function() {
      return _;
    });
  }
}.call(this));

},{}],7:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _ = require("underscore");
var Type = require("../core/Type");
var TimeSeriesData = require("../timeseries/TimeSeriesData");
var TimeGrid = require("../core/TimeGrid");
var Crosshair = require("../crosshair/Crosshair");

var _default_config = {
  width: "auto",
  intervalWidth: 7,
  paddingRight: 40,
  offset: 0,
  relativeOffset: 0,
  offsetFromEnd: false,
  scrollToEndOnLoad: true,
  scrollToEndOnResize: true,
  verticalGridLineSpacing: 50
};

/**
 * Represents a DojiChart instance.
 * <br><br>
 * Typically a Chart will consist of Panels, which in turn consist of layers.
 * @extends core.Type
 * @memberof core
 */

var Chart = function (_Type) {
  _inherits(Chart, _Type);

  /**
   * Instantiate Chart
   * @constructor
   * @param {external:HTMLElement} el
   * @param {object} config
   */

  function Chart(el, config) {
    _classCallCheck(this, Chart);

    config = _.extend({}, _default_config, config);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Chart).call(this, config));

    _this._el = el;
    _this._components = [];
    _this._data = undefined;
    if (_.isNumber(_this.width)) {
      _this._el.style.width = _this.width + "px";
    }
    _this._initCrosshair();
    _this._listenForDOMEvents();
    _this._time_grid = new TimeGrid();
    return _this;
  }

  /**
   * Initialize crosshair
   * @private
   */


  _createClass(Chart, [{
    key: "_initCrosshair",
    value: function _initCrosshair() {
      if (this.crosshair) {
        this.crosshair = _.isObject(this.crosshair) ? this.crosshair : {};
        this._crosshair = new Crosshair(this, this.crosshair);
      }
    }

    /**
     * Refresh crosshair
     * @private
     */

  }, {
    key: "_refreshCrosshair",
    value: function _refreshCrosshair() {
      if (this._crosshair === undefined) {
        this._initCrosshair();
      } else {
        this._crosshair.refresh();
      }
    }

    /**
     * Listen for DOM events, specifically window resize
     * @private
     */

  }, {
    key: "_listenForDOMEvents",
    value: function _listenForDOMEvents() {

      window.addEventListener("resize", this._handleWindowResize.bind(this));
    }

    /**
     * Handle window resize event
     * @private
     */

  }, {
    key: "_handleWindowResize",
    value: function _handleWindowResize(ev) {
      if (this.width === "auto") {
        this._refreshCrosshair();
        if (this.scrollToEndOnResize === true) {
          this._setOffset(0, true);
        }
        this._refreshCrosshair();
        this.draw();
      }
    }

    /**
     * Get underlying HTMLElement
     * @returns {external.HTMLElement}
     */

  }, {
    key: "getEl",
    value: function getEl() {
      return this._el;
    }

    /**
     * Get width
     * @returns {(number|string)} Width in pixels or "auto"
     */

  }, {
    key: "getWidth",
    value: function getWidth() {
      if (this.width === "auto") {
        return this.getEl().clientWidth;
      } else {
        return this.width;
      }
    }

    /**
     * Get right padding 
     * @returns {number} in pixels
     */

  }, {
    key: "getPaddingRight",
    value: function getPaddingRight() {
      return this.paddingRight;
    }

    /**
     * Get drawing width
     * @returns {number} This is the total width minus right padding (in pixels).
     */

  }, {
    key: "getDrawingWidth",
    value: function getDrawingWidth() {
      return this.getWidth() - this.getPaddingRight();
    }

    /**
     * Get height
     * @returns {number} Height of underlying HTMLElement in pixels.
     */

  }, {
    key: "getHeight",
    value: function getHeight() {
      return this._el.offsetHeight;
    }

    /**
     * Set interval width
     * @param {number} Size of interval in pixels.
     */

  }, {
    key: "setIntervalWidth",
    value: function setIntervalWidth(interval_width) {
      this.intervalWidth = interval_width;
    }

    /**
     * Get interval width 
     * @returns {number} Size of interval in pixels.
     */

  }, {
    key: "getIntervalWidth",
    value: function getIntervalWidth() {
      return this.intervalWidth;
    }

    /**
     * Get offset
     * @returns {number}
     */

  }, {
    key: "getOffset",
    value: function getOffset() {
      return this.offset;
    }

    /**
     * Get time grid instance that is used by Chart.
     * @returns {core.TimeGrid}
     */

  }, {
    key: "getTimeGrid",
    value: function getTimeGrid() {
      return this._time_grid;
    }

    /**
     * Get all chart components.
     * @returns {core.Component[]}
     */

  }, {
    key: "getComponents",
    value: function getComponents() {
      return this._components;
    }

    /**
     * Add component to chart.
     * @param {string} region_name
     * @param {core.Component} comp
     */

  }, {
    key: "addComponent",
    value: function addComponent(region_name, comp) {
      //Component.addComponent(region_name, comp);
      comp.setParentChart(this);
      if (comp.initLayers) {
        comp.initLayers(); // invoked after setParentChart because methods of Chart required
      }
      this._components.push(comp);
      comp.render(region_name);
      this._componentsHaveChanged();
    }

    /**
     * Remove components from chart.
     * @param {core.Component[]} exclude_components. Components to not remove.
     */

  }, {
    key: "removeComponents",
    value: function removeComponents(exclude_components) {
      exclude_components = exclude_components || [];
      for (var i = 0; i < this._components.length; i++) {
        var comp = this._components[i];
        var exclude = false;
        for (var j = 0; j < exclude_components.length; j++) {
          if (comp === exclude_components[j]) {
            exclude = true;
            break;
          }
        }
        if (exclude !== true) {
          comp.destroy();
        }
      }
      this._components = exclude_components;
      this._componentsHaveChanged();
    }

    /**
     * Load data.
     * @param {timeseries.DataPoint[]} raw_data
     * @param {string} symbol
     * @param {string} granularity
     * @param {boolean} do_draw
     */

  }, {
    key: "loadData",
    value: function loadData(raw_data, symbol, granularity, do_draw) {
      this._data = new TimeSeriesData(raw_data, this.fieldMap, symbol, granularity);
      for (var i = 0; i < this._components.length; i++) {
        var comp = this._components[i];
        if (comp.precompute) {
          comp.precompute(this._data);
        }
      }
      if (do_draw === undefined || do_draw === true) {
        if (this.scrollToEndOnLoad === true) {
          this.scroll(0, true, false);
        }
        this.draw();
      }
    }

    /**
     * Draw all components.
     */

  }, {
    key: "draw",
    value: function draw() {
      if (this._data !== undefined) {
        var interval_capacity = this._calculateIntervalCapacity();
        var indexToPixel = this.getIndexToPixelMapper();

        this._time_grid.refresh(this._data, interval_capacity, this.getOffset(), this.getDrawingWidth(), this.verticalGridLineSpacing);

        for (var i = 0; i < this._components.length; i++) {
          var comp = this._components[i];
          if (comp.draw) {
            comp.draw(this._data, interval_capacity, this.getOffset(), indexToPixel);
          }
        }

        this.emit("afterdraw");
      }
    }

    /**
     * Calculate number of elements that will fit on the chart.
     * @private
     */

  }, {
    key: "_calculateIntervalCapacity",
    value: function _calculateIntervalCapacity() {
      return Math.floor(this.getDrawingWidth() / this.intervalWidth);
    }

    /**
    * indexToPixel
    * @callback indexToPixel
    * @param {number} index
    * @returns {number} x-value expressed in unit pixels
    */

    /**
     * Get index to pixel mapper function
     * @returns {indexToPixel} function
     */

  }, {
    key: "getIndexToPixelMapper",
    value: function getIndexToPixelMapper() {
      var px_interval_width = this.getIntervalWidth();
      var offset = this.getOffset();
      var mapFunc = function mapFunc(index) {
        return (index - offset) * px_interval_width;
      };
      return mapFunc;
    }

    /**
     * Invoked after components have changed.
     * @private
     */

  }, {
    key: "_componentsHaveChanged",
    value: function _componentsHaveChanged() {
      this._refreshCrosshair();
    }

    /**
     * Scroll by specified offset.
     * @param {number} given_offset
     * @param {boolean} from_end
     * @param {boolean} do_draw
     */

  }, {
    key: "scroll",
    value: function scroll(given_offset, from_end, do_draw) {
      this._setOffset(given_offset, from_end);
      if (do_draw === undefined || do_draw === true) {
        this.draw();
      }
    }

    /**
     * Set offset
     * @param {number} given_offset
     * @param {boolean} from_end
     * @private
     */

  }, {
    key: "_setOffset",
    value: function _setOffset(given_offset, from_end) {
      this.relativeOffset = given_offset;
      this.offsetFromEnd = from_end;
      if (from_end === true && this._data !== undefined) {
        var data_length = this._data.getRawData().length;
        var interval_capacity = this._calculateIntervalCapacity();
        this.offset = data_length - interval_capacity - given_offset;
      } else {
        this.offset = given_offset;
      }
    }

    /**
     * Get offset relative to either start or end of data.
     * @returns {number}
     */

  }, {
    key: "getRelativeScrollOffset",
    value: function getRelativeScrollOffset() {
      return this.relativeOffset;
    }

    /**
     * Is scroll offset from end?
     * @returns {boolean}
     */

  }, {
    key: "isScrollOffsetFromEnd",
    value: function isScrollOffsetFromEnd() {
      return this.offsetFromEnd;
    }

    /**
     * Is data scrolled before start?
     * @returns {boolean}
     */

  }, {
    key: "isBeyondStart",
    value: function isBeyondStart() {
      return this.offset < 0;
    }
  }]);

  return Chart;
}(Type);

module.exports = Chart;

},{"../core/TimeGrid":10,"../core/Type":11,"../crosshair/Crosshair":12,"../timeseries/TimeSeriesData":40,"underscore":6}],8:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Type = require("../core/Type");
var Region = require("../core/Region");

/**
 * Chart component base class.
 * <br><br>
 * @extends core.Type
 * @memberof core
 */

var Component = function (_Type) {
  _inherits(Component, _Type);

  /**
   * Instantiate Component
   * @constructor
   * @param {object} config
   */

  function Component(config) {
    _classCallCheck(this, Component);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Component).call(this, config));

    _this.layers = [];
    return _this;
  }

  /**
   * Destroy underlying HTMLElement
   */


  _createClass(Component, [{
    key: "destroy",
    value: function destroy() {
      var el = this.getEl();
      if (el && el.parentNode) {
        el.parentNode.removeChild(el);
      }
      this.el = undefined;
    }

    /**
     * Sets parent chart
     * @param {core.Chart} chart
     */

  }, {
    key: "setParentChart",
    value: function setParentChart(parent_chart) {
      this._parent_chart = parent_chart;
    }

    /**
     * Get parent chart
     * @returns {core.Chart} chart
     */

  }, {
    key: "getParentChart",
    value: function getParentChart() {
      return this._parent_chart;
    }

    /**
     * Get underlying HTMLElement
     * @returns {external:HTMLElement}
     */

  }, {
    key: "getEl",
    value: function getEl() {
      return this.el;
    }

    /**
     * Get class name of underlying HTMLElement
     * @returns {string}
     */

  }, {
    key: "getClassName",
    value: function getClassName() {
      return "component";
    }

    /**
     * Get component height
     * @returns {number} Height in pixels
     */

  }, {
    key: "getHeight",
    value: function getHeight() {
      return this.height;
    }

    /**
     * Render
     * @param {string} region_name Name of HTMLElement, specified using data-name attribute. 
     * @returns {this}
     */

  }, {
    key: "render",
    value: function render(region_name) {
      var region = Region.getRegionsByName(this.getParentChart().getEl())[region_name];
      this.el = this.createElement();
      region.getEl().innerHTML = "";
      region.getEl().appendChild(this.el);
      return this;
    }

    /**
     * Create HTMLElement
     * <br><br>
     * Can be overridden, for example if CANVAS is used.
     * @returns {external.HTMLElement}
     */

  }, {
    key: "createElement",
    value: function createElement() {
      var div = window.document.createElement("DIV");
      div.className = this.getClassName();
      div.style.height = this.height + "px";
      return div;
    }

    /**
     * Add layer
     * @param {layer.Layer} layer
     */

  }, {
    key: "addLayer",
    value: function addLayer(layer) {
      layer.setParentComponent(this);
      this.layers.push(layer);
    }

    /**
     * Add layer
     * @returns {layer.Layer[]}
     */

  }, {
    key: "getAllLayers",
    value: function getAllLayers() {
      return this.layers;
    }

    /**
     * Remove layers
     * @param {layer.Layer[]} exclude_layers Layers to not removed
     */

  }, {
    key: "removeLayers",
    value: function removeLayers(exclude_layers) {
      exclude_layers = exclude_layers || [];
      this.layers = exclude_layers;
      this._layersHaveChanged();
    }

    /**
     * To be invoked immediately after layers have changed.
     * <br><br>
     * Intended to be implemented by subclasses.
     */

  }, {
    key: "_layersHaveChanged",
    value: function _layersHaveChanged() {}
  }]);

  return Component;
}(Type);

module.exports = Component;

},{"../core/Region":9,"../core/Type":11}],9:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Type = require("../core/Type");

/**
 * Represents an underlyting HTMLElement that can contain a component.
 * <br><br>
 * @extends core.Type
 * @memberof core
 */

var Region = function (_Type) {
  _inherits(Region, _Type);

  /**
   * Instantiate Component
   * @constructor
   * @param {external.HTMLElement} el
   */

  function Region(el) {
    _classCallCheck(this, Region);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Region).call(this, {}));

    _this.el = el;
    _this.name = _this.el.getAttribute("data-name");
    return _this;
  }

  /**
   * Get underlying HTMLElement
   * @returns {external.HTMLElement}
   */


  _createClass(Region, [{
    key: "getEl",
    value: function getEl() {
      return this.el;
    }

    /**
     * Get region name
     * @returns {string}
     */

  }, {
    key: "getName",
    value: function getName() {
      return this.name;
    }

    /**
     * Get region height
     * @returns {number} Height in pixels
     */

  }, {
    key: "getHeight",
    value: function getHeight() {
      return this.el.offsetHeight;
    }

    /**
     * @static
     * Get regions that are descendents of a specified HTMLElement.
     * @param {external.HTMLElement} el HTMLElement to search under.
     * @returns {object} Map of Regions by name
     */

  }], [{
    key: "getRegionsByName",
    value: function getRegionsByName(el) {
      var regions_by_name = {};
      var region_els = Region.getElementsByClassName(el, "region");
      for (var i = 0; i < region_els.length; i++) {
        var region_el = region_els[i];
        var region = new Region(region_el);
        regions_by_name[region.getName()] = region;
      }
      return regions_by_name;
    }

    /**
     * @static
     * Get elements that are descendents of a specified HTMLElement.
     * @param {external.HTMLElement} start_el
     * @param {string} class_name
     * @returns {HTMLElement[]}
     */

  }, {
    key: "getElementsByClassName",
    value: function getElementsByClassName(start_el, class_name) {

      var matches = [];

      function traverse(node) {
        for (var i = 0; i < node.childNodes.length; i++) {
          var child_node = node.childNodes[i];

          if (child_node.childNodes.length > 0) {
            traverse(child_node);
          }

          if (child_node.getAttribute && child_node.getAttribute("class")) {
            if (child_node.getAttribute("class").split(" ").indexOf(class_name) >= 0) {
              matches.push(child_node);
            }
          }
        }
      }

      traverse(start_el);

      return matches;
    }
  }]);

  return Region;
}(Type);

module.exports = Region;

},{"../core/Type":11}],10:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _ = require("underscore");
var Moment = require("moment");
var Type = require("../core/Type");

var GRANS = {
  "M1": { ident: "M1", hours: 1 / 60, mins: 1 },
  "M5": { ident: "M5", hours: 1 / 12, mins: 5 },
  "M10": { ident: "M10", hours: 1 / 6, mins: 10 },
  "M15": { ident: "M15", hours: 0.25, mins: 15 },
  "M30": { ident: "M30", hours: 0.5, mins: 30 },
  "H1": { ident: "H1", hours: 1, mins: 60 },
  "H4": { ident: "H4", hours: 4, mins: 60 * 4 },
  "H8": { ident: "H8", hours: 8, mins: 60 * 8 },
  "D": { ident: "D", hours: 24, mins: 60 * 24, days: 1 }, // 1 day
  "W": { ident: "W", hours: 120, mins: 60 * 24 * 5, days: 5, weeks: 1 }, // 5 days
  "M": { ident: "M", hours: 504, mins: 60 * 24 * 21, days: 21, weeks: 4, months: 1 }, // 21 days
  "Q": { ident: "Q", hours: 1512, mins: 60 * 24 * 63, days: 63, weeks: 13, months: 3 }, // 63 days
  "Y": { ident: "Y", hours: 6000, mins: 60 * 24 * 250, days: 250, weeks: 51, months: 12, years: 1 } // 250 days
};

var _default_config = {};

/**
 * Non visual time grid, used by TimeGridLayer.
 * <br><br>
 * @extends core.Type
 * @memberof core
 */

var TimeGrid = function (_Type) {
  _inherits(TimeGrid, _Type);

  /**
   * Instantiate TimeGrid
   * @constructor
   * @param {object} config
   */

  function TimeGrid(config) {
    _classCallCheck(this, TimeGrid);

    config = _.extend({}, _default_config, config);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(TimeGrid).call(this, config));

    _this.lines = {};
    _this._pixelToTimeString = function () {
      return "";
    };
    return _this;
  }

  /**
   * Refresh calculated time grid using current data in view.
   * @param {timeseries.TimeSeriesData} data
   * @param {number} count
   * @param {number} offset
   * @param {number} width
   * @param {number} line_spacing
   */


  _createClass(TimeGrid, [{
    key: "refresh",
    value: function refresh(data, count, offset, width, line_spacing) {

      this.lines = {};
      this.line_spacing = line_spacing;

      var field_map = data.getFieldMap();
      var data_arr = data.getRawData();
      var data_gran = data.getGranularity();

      var grid_gran = this.granularity;

      if (grid_gran === undefined) {
        grid_gran = TimeGrid.determineTimeGranularity(data_gran, count, width, line_spacing);
      }

      for (var i = offset >= 0 ? offset + 1 : 0 + 1; i < offset + count && i < data_arr.length; i++) {
        var dat = data_arr[i];
        var dat_prev = data_arr[i - 1];

        var time_str = dat[field_map.time];
        var prev_time_str = dat_prev[field_map.time];

        var grid_line = TimeGrid.isGridLine(grid_gran, time_str, prev_time_str);
        if (grid_line !== null) {
          this.lines["" + i + ""] = grid_line;
        }
      }

      this._pixelToTimeString = this.getPixelToTimeStringMapper(width, count, offset, data_arr, data_gran);
    }

    /**
     * Get pixel to time string map function.
     * @param {number} pixel_width
     * @param {number} interval_count
     * @param {number} offset
     * @param {timeseries.DataPoint[]} data_arr
     * @param {string} data_gran
     */

  }, {
    key: "getPixelToTimeStringMapper",
    value: function getPixelToTimeStringMapper(pixel_width, interval_count, offset, data_arr, data_gran) {
      var format = "ddd D HH:mm";
      if (data_gran === "D" || data_gran === "W") {
        format = "ddd D MMM";
      }
      var mapFunc = function mapFunc(px) {
        var index = Math.round(px / pixel_width * interval_count);
        var dat = data_arr[offset + index];
        if (dat) {
          return Moment(dat.time).format(format);
        } else {
          return "";
        }
      };
      return mapFunc;
    }

    /**
     * Get line at given index
     * @param {number} i
     * @returns {object|undefined}
     */

  }, {
    key: "lineAt",
    value: function lineAt(i) {
      return this.lines["" + i + ""];
    }

    /**
     * Get spacing between lines
     * @returns {number} Interval between vertical grid lines in unit pixels
     */

  }, {
    key: "getLineSpacing",
    value: function getLineSpacing() {
      return this.line_spacing;
    }

    /**
     * Get spacing between lines
     * @param {number} px Number of pixels from left of chart.
     * @returns {number} Index
     */

  }, {
    key: "pixelToTimeString",
    value: function pixelToTimeString(px) {
      return this._pixelToTimeString(px);
    }

    /**
     * @static
     * Determine if a grid line exists at given granulrity and time. 
     * @param {string} grid_gran
     * @param {string} time_str
     * @param {string} prev_time_str
     * @returns {object|null}
     */

  }], [{
    key: "isGridLine",
    value: function isGridLine(grid_gran, time_str, prev_time_str) {

      var gran = GRANS[grid_gran];
      var d = new Date(time_str);
      var d_prev = new Date(prev_time_str);

      // M5, M10, M15 or M30
      if (gran.mins < 60 && TimeGrid.isNMinuteChange(gran.mins, d)) {
        return { format: TimeGrid.determineMinFormat(d, d_prev) };
      }
      // H8, H4, H1
      else if (gran.hours < 24 && TimeGrid.isNHourChange(gran.hours, d)) {
          return { format: TimeGrid.determineHourFormat(d, d_prev) };
        }
        // D
        else if (gran.days !== undefined && gran.days < 5 && TimeGrid.isDayChange(d, d_prev)) {
            return { format: TimeGrid.determineDayFormat(d, d_prev) };
          }
          // W
          else if (gran.weeks !== undefined && gran.weeks === 1 && TimeGrid.isWeekChange(d, d_prev)) {
              return { format: TimeGrid.determineWeekFormat(d, d_prev) };
            }
            // M
            else if (gran.months !== undefined && gran.months === 1 && TimeGrid.isMonthChange(d, d_prev)) {
                return { format: TimeGrid.determineMonthFormat(d, d_prev) };
              }
              // Q
              else if (gran.months !== undefined && gran.months < 12 && TimeGrid.isNMonthChange(gran.months, d, d_prev)) {
                  return { format: TimeGrid.determineQuarterFormat(d, d_prev) };
                }
                // Y
                else if (TimeGrid.isYearChange(d, d_prev)) {
                    return { format: TimeGrid.determineYearFormat(d, d_prev) };
                  } else {
                    return null;
                  }
    }

    /**
     * Determine if N minute interval
     * @param {number} mins
     * @param {external:Date} d
     * @returns {boolean}
     * @static
     */

  }, {
    key: "isNMinuteChange",
    value: function isNMinuteChange(mins, d) {
      return d.getUTCMinutes() % mins === 0;
    }

    /**
     * Determine if hour interval
     * @param {external:Date} d
     * @param {external:Date} d_prev
     * @returns {boolean}
     * @static
     */

  }, {
    key: "isHourChange",
    value: function isHourChange(d, d_prev) {
      return d.getUTCHours() !== d_prev.getUTCHours();
    }

    /**
     * Determine if N hour interval
     * @param {number} hours
     * @param {external:Date} d
     * @returns {boolean}
     * @static
     */

  }, {
    key: "isNHourChange",
    value: function isNHourChange(hours, d) {
      return d.getUTCHours() % hours === 0 && d.getUTCMinutes() === 0;
    }

    /**
     * Determine if hour interval
     * @param {external:Date} d
     * @param {external:Date} d_prev
     * @returns {boolean}
     * @static
     */

  }, {
    key: "isDayChange",
    value: function isDayChange(d, d_prev) {
      return d.getUTCDate() !== d_prev.getUTCDate();
    }

    /**
     * Determine if week interval
     * @param {external:Date} d
     * @param {external:Date} d_prev
     * @returns {boolean}
     * @static
     */

  }, {
    key: "isWeekChange",
    value: function isWeekChange(d, d_prev) {
      return Moment(d).utc().weeks() !== Moment(d_prev).utc().weeks();
    }

    /**
     * Determine if month interval
     * @param {external:Date} d
     * @param {external:Date} d_prev
     * @returns {boolean}
     * @static
     */

  }, {
    key: "isMonthChange",
    value: function isMonthChange(d, d_prev) {
      return d.getUTCMonth() !== d_prev.getUTCMonth();
    }

    /**
     * Determine if N month interval
     * @param {number} months
     * @param {external:Date} d
     * @returns {boolean}
     * @static
     */

  }, {
    key: "isNMonthChange",
    value: function isNMonthChange(months, d, d_prev) {
      return d.getUTCMonth() % months === 0 && TimeGrid.isMonthChange(d, d_prev);
    }

    /**
     * Determine if year interval
     * @param {external:Date} d
     * @param {external:Date} d_prev
     * @returns {boolean}
     * @static
     */

  }, {
    key: "isYearChange",
    value: function isYearChange(d, d_prev) {
      return d.getUTCFullYear() !== d_prev.getUTCFullYear();
    }

    /**
     * Determine time stamp label format for minute interval
     * @param {external:Date} d
     * @param {external:Date} d_prev
     * @returns {string} Moment.js format
     * @static
     */

  }, {
    key: "determineMinFormat",
    value: function determineMinFormat(d, d_prev) {
      if (TimeGrid.isDayChange(d, d_prev)) {
        return "ddd D";
      } else if (TimeGrid.isHourChange(d, d_prev)) {
        return "HH:mm";
      } else {
        return "HH:mm";
      }
    }

    /**
     * Determine time stamp label format for hour interval
     * @param {external:Date} d
     * @param {external:Date} d_prev
     * @returns {string} Moment.js format
     * @static
     */

  }, {
    key: "determineHourFormat",
    value: function determineHourFormat(d, d_prev) {
      if (TimeGrid.isDayChange(d, d_prev)) {
        return "ddd D";
      } else {
        return "HH:mm";
      }
    }

    /**
     * Determine time stamp label format for day interval
     * @param {external:Date} d
     * @param {external:Date} d_prev
     * @returns {string} Moment.js format
     * @static
     */

  }, {
    key: "determineDayFormat",
    value: function determineDayFormat(d, d_prev) {
      if (TimeGrid.isMonthChange(d, d_prev)) {
        return "MMM";
      } else {
        return "D";
      }
    }

    /**
     * Determine time stamp label format for week interval
     * @param {external:Date} d
     * @param {external:Date} d_prev
     * @returns {string} Moment.js format
     * @static
     */

  }, {
    key: "determineWeekFormat",
    value: function determineWeekFormat(d, d_prev) {
      if (TimeGrid.isMonthChange(d, d_prev)) {
        return "MMM";
      } else {
        return "D";
      }
    }

    /**
     * Determine time stamp label format for month interval
     * @param {external:Date} d
     * @param {external:Date} d_prev
     * @returns {string} Moment.js format
     * @static
     */

  }, {
    key: "determineMonthFormat",
    value: function determineMonthFormat(d, d_prev) {
      if (TimeGrid.isYearChange(d, d_prev)) {
        return "YYYY";
      } else {
        return "MMM";
      }
    }

    /**
     * Determine time stamp label format for quarter interval
     * @param {external:Date} d
     * @param {external:Date} d_prev
     * @returns {string} Moment.js format
     * @static
     */

  }, {
    key: "determineQuarterFormat",
    value: function determineQuarterFormat(d, d_prev) {
      if (TimeGrid.isYearChange(d, d_prev)) {
        return "YYYY";
      } else {
        return "MMM";
      }
    }

    /**
     * Determine time stamp label format for year interval
     * @param {external:Date} d
     * @param {external:Date} d_prev
     * @returns {string} Moment.js format
     * @static
     */

  }, {
    key: "determineYearFormat",
    value: function determineYearFormat(d, d_prev) {
      return "'YY";
    }

    /**
     * Determine if a grid line exists at given granularity and time. 
     * @param {string} data_gran
     * @param {number} intervals
     * @param {number} pixel_width
     * @param {number} pixel_spacing
     * @returns {string}
     * @static
     */

  }, {
    key: "determineTimeGranularity",
    value: function determineTimeGranularity(data_gran, intervals, pixel_width, pixel_spacing) {

      // e.g. 1000 px / 50 px => 20 divisions
      var div_count = pixel_width / pixel_spacing;

      // e.g. 120 * 15 mins => 1800 minutes
      var mins = intervals * GRANS[data_gran].mins;

      // e.g. 1800 mins / 20 => 90 minutes
      var interval_t = mins / div_count;

      for (var g in GRANS) {
        if (GRANS[g].mins >= interval_t) {
          return g;
        }
      }

      return "Y";
    }
  }]);

  return TimeGrid;
}(Type);

module.exports = TimeGrid;

},{"../core/Type":11,"moment":4,"underscore":6}],11:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _ = require("underscore");
var EventEmitter = require("events").EventEmitter;

/**
 * External class
 *
 * @external Event
 * @see {@link https://developer.mozilla.org/en/docs/Web/API/Event}
 */

/**
 * External class
 *
 * @external Date
 * @see {@link https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Date}
 */

/**
 * External class
 *
 * @external HTMLElement
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement}
 */

/**
 * External class
 *
 * @external HTMLCanvasElement
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement}
 */

/**
 * External class
 *
 * @external CanvasRenderingContext2D
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D}
 */

/**
 * Base class
 * @memberof core
 */

var Type = function (_EventEmitter) {
  _inherits(Type, _EventEmitter);

  /**
   * Instantiate Type
   * @constructor
   * @param {Object} config
   */

  function Type(config) {
    _classCallCheck(this, Type);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Type).call(this));

    _this._config = config;
    _.extend(_this, config);
    return _this;
  }

  /**
   * Get config object
   * @returns {Object} config
   */


  _createClass(Type, [{
    key: "getConfig",
    value: function getConfig() {
      return this._config;
    }
  }]);

  return Type;
}(EventEmitter);

module.exports = Type;

},{"events":2,"underscore":6}],12:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _ = require("underscore");
var Type = require("../core/Type");
var CrosshairZone = require("../crosshair/CrosshairZone");

var _default_config = {
  lineColor: "#000000",
  labelHeight: 16,
  showTimeLabel: false,
  labelFont: "7pt normal normal arial;",
  labelBgColor: "#000000",
  labelColor: "#FFFFFF",
  timeLabelWidth: 70
};

/**
 * Represents a crosshair (pair of crosshairs) overlaid on chart.
 * <br><br>
 * @extends core.Type
 * @memberof crosshair
 */

var Crosshair = function (_Type) {
  _inherits(Crosshair, _Type);

  /**
   * Instantiate Crosshair
   * @constructor
   * @param {core:Chart} parent_chart
   * @param {Object} config
   */

  function Crosshair(parent_chart, config) {
    _classCallCheck(this, Crosshair);

    config = _.extend({}, _default_config, config);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Crosshair).call(this, config));

    _this._crosshair_zones = {};
    _this._parent_chart = parent_chart;
    _this.width = _this.getParentChart().getWidth();
    _this.lineWidth = _this.getParentChart().getDrawingWidth();
    _this.valueLabelWidth = _this.width - _this.lineWidth;
    _this._render();
    _this._listenForDOMEvents();
    return _this;
  }

  /**
   * Destroy underlying HTMLElements
   */


  _createClass(Crosshair, [{
    key: "destroy",
    value: function destroy() {
      for (var i in this._crosshair_zones) {
        if (this._crosshair_zones.hasOwnProperty(i)) {
          var canvas = this._crosshair_zones[i].getEl();
          if (canvas && canvas.parentNode) {
            canvas.parentNode.removeChild(canvas);
          }
        }
      }
    }

    /**
     * Get parent chart
     * @returns {core.Chart} chart
     */

  }, {
    key: "getParentChart",
    value: function getParentChart() {
      return this._parent_chart;
    }

    /**
     * Destroy and re-render.
     * @private
     */

  }, {
    key: "_render",
    value: function _render() {

      this.destroy();
      var comps = this.getParentChart().getComponents();

      for (var i = 0; i < comps.length; i++) {
        var ch_zone = new CrosshairZone(this, comps[i]);
        this._crosshair_zones["" + i + ""] = ch_zone;
        ch_zone.render(i);
      }
    }

    /**
     * Listen for mousemove and mouseout events.
     * @private
     */

  }, {
    key: "_listenForDOMEvents",
    value: function _listenForDOMEvents() {

      this.getParentChart().getEl().addEventListener("mousemove", this._handleMousemove.bind(this));
      this.getParentChart().getEl().addEventListener("mouseout", this._handleMouseout.bind(this));
    }

    /**
     * Handle mousemove event
     * @param {external:Event} ev
     * @private
     */

  }, {
    key: "_handleMousemove",
    value: function _handleMousemove(ev) {
      var zone_index = ev.target.getAttribute("ch-zone-index");
      var ch_zone = this._crosshair_zones[zone_index];
      this._draw(ev.offsetX, ev.offsetY, ch_zone, this._crosshair_zones);
    }

    /**
     * Handle mouseout event
     * @param {external:Event} ev
     * @private
     */

  }, {
    key: "_handleMouseout",
    value: function _handleMouseout(ev) {
      this.clear();
    }

    /**
     * Refresh dimensions, for example after browser window is resized.
     */

  }, {
    key: "refresh",
    value: function refresh() {

      this.width = this.getParentChart().getWidth();
      this.lineWidth = this.getParentChart().getDrawingWidth();
      this.valueLabelWidth = this.width - this.lineWidth;

      this._render();
    }

    /**
     * Handle mouseout event
     * @param {number} x
     * @param {number} y
     * @param {crosshair.CrosshairZone} ch_zone
     * @param {Object} ch_zones {crosshair.CrosshairZone} map
     * @private
     */

  }, {
    key: "_draw",
    value: function _draw(x, y, ch_zone, ch_zones) {
      if (ch_zone) {
        for (var i in ch_zones) {
          if (ch_zones.hasOwnProperty(i)) {
            var comp = ch_zones[i].getComponent();
            var canvas = ch_zones[i].getEl();
            var context = canvas.getContext("2d");

            context.clearRect(0, 0, canvas.width, canvas.height);

            // Vertical crosshair
            context.beginPath();
            context.rect(x, 0, 1, canvas.height);
            context.fillStyle = this.lineColor;
            context.fill();

            if (comp.crosshair && comp.crosshair.time && comp.crosshair.time.label) {
              // label
              context.beginPath();
              context.rect(x, 0, this.timeLabelWidth, this.labelHeight);
              context.fillStyle = this.labelBgColor;
              context.fill();

              var time_grid = this.getParentChart().getTimeGrid();
              var time_text = time_grid.pixelToTimeString(x);

              context.font = this.labelFont;
              context.textAlign = "left";
              context.textBaseline = "middle";
              context.fillStyle = this.labelColor;
              context.fillText(time_text, x + 4, this.labelHeight * 0.5);
            }

            // Horizontal crosshair
            if (ch_zones[i] === ch_zone && (comp.crosshair === undefined || comp.crosshair.value)) {
              // line
              context.beginPath();
              context.rect(0, y, this.lineWidth, 1);
              context.fillStyle = this.lineColor;
              context.fill();

              // label
              context.beginPath();
              context.rect(this.lineWidth, y - this.labelHeight * 0.5, this.valueLabelWidth, this.labelHeight);
              context.fillStyle = this.labelBgColor;
              context.fill();

              var value_text = "" + comp.pixelToValue(y).toFixed(4);

              context.font = this.labelFont;
              context.textAlign = "left";
              context.textBaseline = "middle";
              context.fillStyle = this.labelColor;
              context.fillText(value_text, this.lineWidth + 4, y);
            }
          }
        }
      }
    }

    /**
     * Clear all crosshair canvases.
     */

  }, {
    key: "clear",
    value: function clear() {
      for (var i in this._crosshair_zones) {
        if (this._crosshair_zones.hasOwnProperty(i)) {
          var canvas = this._crosshair_zones[i].getEl();
          if (canvas) {
            canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
          }
        }
      }
    }
  }]);

  return Crosshair;
}(Type);

module.exports = Crosshair;

},{"../core/Type":11,"../crosshair/CrosshairZone":13,"underscore":6}],13:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Type = require("../core/Type");

/**
 * Represents a crosshair (pair of crosshairs) overlaid on a chart component.
 * <br><br>
 * @extends core.Type
 * @memberof crosshair
 */

var CrosshairZone = function (_Type) {
  _inherits(CrosshairZone, _Type);

  /**
   * Instantiate CrosshairZone
   * @constructor
   * @param {crosshair:Crosshair} parent_crosshair
   * @param {core.Component} component
   */

  function CrosshairZone(parent_crosshair, component) {
    _classCallCheck(this, CrosshairZone);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(CrosshairZone).call(this, {}));

    _this._parent_crosshair = parent_crosshair;
    _this._underlying_component = component;
    _this.name = "crosshair-" + _this._underlying_component.getClassName().replace(/ /g, "");
    return _this;
  }

  /**
   * Render crosshair over component.
   * @param {number} zone_index
   * @returns {external:HTMLCanvasElement}
   */


  _createClass(CrosshairZone, [{
    key: "render",
    value: function render(zone_index) {
      var comp = this._underlying_component;
      var comp_el = comp.getEl();
      var region_el = comp_el.parentNode;
      var canvas = window.document.createElement("CANVAS");
      canvas.className = "crosshair " + this.name;
      canvas.setAttribute("ch-zone-index", "" + zone_index + "");
      canvas.setAttribute("width", comp.getWidth());
      canvas.setAttribute("height", comp.getHeight());
      this._el = canvas;
      region_el.appendChild(canvas);
      return canvas;
    }

    /**
     * Get underlying HTMLCanvasElement the crosshair is drawn onto.
     * @returns {external:HTMLCanvasElement}
     */

  }, {
    key: "getEl",
    value: function getEl() {
      return this._el;
    }

    /**
     * Get underlying componnet
     * @returns {core:Component}
     */

  }, {
    key: "getComponent",
    value: function getComponent() {
      return this._underlying_component;
    }
  }]);

  return CrosshairZone;
}(Type);

module.exports = CrosshairZone;

},{"../core/Type":11}],14:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Element = require("../element/Element");

/**
 * Represents an arc element.
 * <br><br>
 * @extends element.Element
 * @memberof element
 */

var Arc = function (_Element) {
  _inherits(Arc, _Element);

  /**
   * Instantiate Arc
   * @constructor
   * @param {Layer} layer
   * @param {number} index
   * @param {string} time
   * @param {number} value
   * @param {Arc} prev_arc
   */

  function Arc(layer, index, time, value, prev_arc) {
    _classCallCheck(this, Arc);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Arc).call(this, {}));

    _this.layer = layer;
    _this.index = index;
    _this.time = time;
    _this.value = value;
    _this.previous_arc = prev_arc;
    return _this;
  }

  /**
   * Draw arc on given context
   * @param {external:CanvasRenderingContext2D} context
   * @param {valueToPixel} function
   * @param {indexToPixel} function
   * @param {object} config
   */


  _createClass(Arc, [{
    key: "draw",
    value: function draw(context, valueToPixel, indexToPixel, config) {

      if (this.previous_arc) {
        var x0 = indexToPixel(this.previous_arc.getIndex());
        var y0 = valueToPixel(this.previous_arc.getValue());
        var x = indexToPixel(this.index);
        var y = valueToPixel(this.value);

        context.beginPath();
        context.moveTo(x0, y0);
        context.lineTo(x, y);
        context.strokeStyle = config.color;
        context.stroke();
      }
    }

    /**
     * Get index
     * @returns {number} index
     */

  }, {
    key: "getIndex",
    value: function getIndex() {
      return this.index;
    }

    /**
     * Get time
     * @returns {string} timestamp string
     */

  }, {
    key: "getTime",
    value: function getTime() {
      return this.time;
    }

    /**
     * Get value at arc's right vertex
     * @returns {number} value
     */

  }, {
    key: "getValue",
    value: function getValue() {
      return this.value;
    }
  }]);

  return Arc;
}(Element);

module.exports = Arc;

},{"../element/Element":16}],15:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Element = require("../element/Element");

/**
 * Represents a candle element.
 * <br><br>
 * @extends element.Element
 * @memberof element
 */

var Candle = function (_Element) {
  _inherits(Candle, _Element);

  /**
   * Instantiate Candle
   * @constructor
   * @param {Layer} layer
   * @param {number} index
   * @param {string} time
   * @param {number} open
   * @param {number} high
   * @param {number} low
   * @param {number} close
   */

  function Candle(layer, index, time, open, high, low, close) {
    _classCallCheck(this, Candle);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Candle).call(this, {}));

    _this.layer = layer;
    _this.index = index;
    _this.time = time;
    _this.open = open;
    _this.high = high;
    _this.low = low;
    _this.close = close;
    return _this;
  }

  /**
   * Draw candle on given context
   * @param {external:CanvasRenderingContext2D} context
   * @param {valueToPixel} function
   * @param {indexToPixel} function
   * @param {object} config
   */


  _createClass(Candle, [{
    key: "draw",
    value: function draw(context, valueToPixel, indexToPixel, config) {

      var body_low, body_high, body_color;

      if (this.close >= this.open) {
        body_low = this.open;
        body_high = this.close;
        body_color = config.bullBodyColor;
      } else {
        body_low = this.close;
        body_high = this.open;
        body_color = config.bearBodyColor;
      }

      // Both wicks
      var wick_x = indexToPixel(this.index);
      var wick_w = config.candleWickWidth;

      // Wick upper
      var wick_y = valueToPixel(this.high);
      var wick_h = valueToPixel(body_high) - wick_y;

      context.beginPath();
      context.rect(wick_x, wick_y, wick_w, wick_h);
      context.fillStyle = config.wickColor;
      context.fill();

      // Wick lower
      wick_y = valueToPixel(body_low);
      wick_h = valueToPixel(this.low) - wick_y;

      context.beginPath();
      context.rect(wick_x, wick_y, wick_w, wick_h);
      context.fillStyle = config.wickColor;
      context.fill();

      // Body
      var body_x = wick_x - Math.ceil((config.candleBodyWidth - 1) * 0.5);
      var body_y = valueToPixel(body_high);
      var body_w = config.candleBodyWidth;
      var body_h = valueToPixel(body_low) - body_y;

      context.beginPath();
      context.rect(body_x, body_y, body_w, body_h);
      context.fillStyle = body_color;
      context.fill();
    }

    /**
     * Get index
     * @returns {number} index
     */

  }, {
    key: "getIndex",
    value: function getIndex() {
      return this.index;
    }

    /**
     * Get time
     * @returns {string} timestamp string
     */

  }, {
    key: "getTime",
    value: function getTime() {
      return this.time;
    }

    /**
     * Get open price value
     * @returns {number} open price value
     */

  }, {
    key: "getOpen",
    value: function getOpen() {
      return this.open;
    }

    /**
     * Get high price value
     * @returns {number} high price value
     */

  }, {
    key: "getHigh",
    value: function getHigh() {
      return this.high;
    }

    /**
     * Get low price value
     * @returns {number} low price value
     */

  }, {
    key: "getLow",
    value: function getLow() {
      return this.low;
    }

    /**
     * Get close price value
     * @returns {number} low price value
     */

  }, {
    key: "getClose",
    value: function getClose() {
      return this.close;
    }
  }]);

  return Candle;
}(Element);

module.exports = Candle;

},{"../element/Element":16}],16:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Type = require("../core/Type");

/**
 * Represents a visual chart element.
 * <br><br>
 * @extends core.Type
 * @memberof element
 */

var Element = function (_Type) {
  _inherits(Element, _Type);

  /**
   * Instantiate Element
   * @constructor
   * @param {object} config
   */

  function Element(config) {
    _classCallCheck(this, Element);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Element).call(this, config));
  }

  return Element;
}(Type);

module.exports = Element;

},{"../core/Type":11}],17:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Element = require("../element/Element");

/**
 * Represents an histogram bar element.
 * <br><br>
 * @extends element.Element
 * @memberof element
 */

var HistogramBar = function (_Element) {
  _inherits(HistogramBar, _Element);

  /**
   * Instantiate HistogramBar
   * @constructor
   * @param {Layer} layer
   * @param {number} index
   * @param {string} time
   * @param {number} value
   */

  function HistogramBar(layer, index, time, value) {
    _classCallCheck(this, HistogramBar);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(HistogramBar).call(this, {}));

    _this.layer = layer;
    _this.index = index;
    _this.time = time;
    _this.value = value;
    return _this;
  }

  /**
   * Draw histogram bar on given context
   * @param {external:CanvasRenderingContext2D} context
   * @param {valueToPixel} function
   * @param {indexToPixel} function
   * @param {object} config
   */


  _createClass(HistogramBar, [{
    key: "draw",
    value: function draw(context, valueToPixel, indexToPixel, config) {

      var x = indexToPixel(this.index) - Math.ceil((config.barWidth - 1) * 0.5);
      var y = valueToPixel(this.value);
      var w = config.barWidth;
      var h = valueToPixel(0) - y;

      context.beginPath();
      context.rect(x, y, w, h);
      context.fillStyle = config.barColor;
      context.fill();
    }

    /**
     * Get index
     * @returns {number} index
     */

  }, {
    key: "getIndex",
    value: function getIndex() {
      return this.index;
    }

    /**
     * Get time
     * @returns {string} timestamp string
     */

  }, {
    key: "getTime",
    value: function getTime() {
      return this.time;
    }

    /**
     * Get value at arc's right vertex
     * @returns {number} value
     */

  }, {
    key: "getValue",
    value: function getValue() {
      return this.value;
    }
  }]);

  return HistogramBar;
}(Element);

module.exports = HistogramBar;

},{"../element/Element":16}],18:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Element = require("../element/Element");

/**
 * Represents a horizontal line.
 * <br><br>
 * @extends element.Element
 * @memberof element
 */

var HorizontalLine = function (_Element) {
  _inherits(HorizontalLine, _Element);

  /**
   * Instantiate HorizontalLine
   * @constructor
   * @param {Layer} layer
   * @param {number} value
   * @param {number} start
   * @param {number} end
   */

  function HorizontalLine(layer, value, start, end) {
    _classCallCheck(this, HorizontalLine);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(HorizontalLine).call(this, {}));

    _this.layer = layer;
    _this.value = value;
    _this.start = start;
    _this.end = end;
    return _this;
  }

  /**
   * Draw horizontal line on given context
   * @param {external:CanvasRenderingContext2D} context
   * @param {valueToPixel} function
   * @param {indexToPixel} function
   * @param {object} config
   */


  _createClass(HorizontalLine, [{
    key: "draw",
    value: function draw(context, valueToPixel, indexToPixel, config) {

      var y = valueToPixel(this.value);

      context.beginPath();
      context.moveTo(this.start, y);
      context.lineTo(this.end, y);
      context.strokeStyle = config.lineColor;
      context.stroke();
    }

    /**
     * Get value
     * @returns {number}
     */

  }, {
    key: "getValue",
    value: function getValue() {
      return this.value;
    }

    /**
     * Get start
     * @returns {number} Start of line in unit pixels from left edge.
     */

  }, {
    key: "getStart",
    value: function getStart() {
      return this.start;
    }

    /**
     * Get end
     * @returns {number} End of line in unit pixels from left edge.
     */

  }, {
    key: "getEnd",
    value: function getEnd() {
      return this.end;
    }
  }]);

  return HorizontalLine;
}(Element);

module.exports = HorizontalLine;

},{"../element/Element":16}],19:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Element = require("../element/Element");

/**
 * Represents a OHLC bar element.
 * <br><br>
 * @extends element.Element
 * @memberof element
 */

var OHLCBar = function (_Element) {
  _inherits(OHLCBar, _Element);

  /**
   * Instantiate OHLCBar
   * @constructor
   * @param {Layer} layer
   * @param {number} index
   * @param {string} time
   * @param {number} open
   * @param {number} high
   * @param {number} low
   * @param {number} close
   */

  function OHLCBar(layer, index, time, open, high, low, close) {
    _classCallCheck(this, OHLCBar);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(OHLCBar).call(this, {}));

    _this.layer = layer;
    _this.index = index;
    _this.time = time;
    _this.open = open;
    _this.high = high;
    _this.low = low;
    _this.close = close;
    return _this;
  }

  /**
   * Draw OHLC bar on given context
   * @param {external:CanvasRenderingContext2D} context
   * @param {valueToPixel} function
   * @param {indexToPixel} function
   * @param {object} config
   */


  _createClass(OHLCBar, [{
    key: "draw",
    value: function draw(context, valueToPixel, indexToPixel, config) {

      var body_color;

      if (this.close >= this.open) {
        body_color = config.bullBodyColor;
      } else {
        body_color = config.bearBodyColor;
      }

      // Vertical bar
      var vert_x = indexToPixel(this.index);
      var vert_w = Math.floor(config.candleBodyWidth * 0.5) || 1;
      var vert_y = valueToPixel(this.high);
      var vert_h = valueToPixel(this.low) - valueToPixel(this.high);

      context.beginPath();
      context.rect(vert_x, vert_y, vert_w, vert_h);
      context.fillStyle = body_color;
      context.fill();

      // Open horizontal
      var open_x = vert_x - config.candleBodyWidth + 1;
      var open_y = valueToPixel(this.open);
      var open_w = config.candleBodyWidth;
      var open_h = 1;

      context.beginPath();
      context.rect(open_x, open_y, open_w, open_h);
      context.fillStyle = body_color;
      context.fill();

      // Close horizontal
      var close_x = vert_x;
      var close_y = valueToPixel(this.close);
      var close_w = config.candleBodyWidth;
      var close_h = 1;

      context.beginPath();
      context.rect(close_x, close_y, close_w, close_h);
      context.fillStyle = body_color;
      context.fill();
    }

    /**
     * Get index
     * @returns {number} index
     */

  }, {
    key: "getIndex",
    value: function getIndex() {
      return this.index;
    }

    /**
     * Get time
     * @returns {string} timestamp string
     */

  }, {
    key: "getTime",
    value: function getTime() {
      return this.time;
    }

    /**
     * Get open price value
     * @returns {number} open price value
     */

  }, {
    key: "getOpen",
    value: function getOpen() {
      return this.open;
    }

    /**
     * Get high price value
     * @returns {number} high price value
     */

  }, {
    key: "getHigh",
    value: function getHigh() {
      return this.high;
    }

    /**
     * Get low price value
     * @returns {number} low price value
     */

  }, {
    key: "getLow",
    value: function getLow() {
      return this.low;
    }

    /**
     * Get close price value
     * @returns {number} low price value
     */

  }, {
    key: "getClose",
    value: function getClose() {
      return this.close;
    }
  }]);

  return OHLCBar;
}(Element);

module.exports = OHLCBar;

},{"../element/Element":16}],20:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Moment = require("moment");
var Element = require("../element/Element");

/**
 * Represents a label associated with the time axis (x).
 * <br><br>
 * @extends element.Element
 * @memberof element
 */

var TimeLabel = function (_Element) {
  _inherits(TimeLabel, _Element);

  /**
   * Instantiate TimeLabel
   * @constructor
   * @param {Layer} layer
   * @param {number} index
   * @param {string} time
   * @param {string} format
   */

  function TimeLabel(layer, index, time, format) {
    _classCallCheck(this, TimeLabel);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(TimeLabel).call(this, {}));

    _this.layer = layer;
    _this.index = index;
    _this.time = time;
    _this.format = format;
    return _this;
  }

  /**
   * Draw time label on given context
   * @param {external:CanvasRenderingContext2D} context
   * @param {indexToPixel} function
   * @param {object} config
   */


  _createClass(TimeLabel, [{
    key: "draw",
    value: function draw(context, indexToPixel, config) {

      var x = indexToPixel(this.index);

      context.font = config.labelFont;
      context.textAlign = "left";
      context.textBaseline = "middle";
      context.fillStyle = config.labelColor;
      context.fillText(TimeLabel.formatTimestamp(this.time, this.format), x, config.labelY);
    }

    /**
     * Get index
     * @returns {number} index
     */

  }, {
    key: "getIndex",
    value: function getIndex() {
      return this.index;
    }

    /**
     * Get time
     * @returns {string} timestamp string
     */

  }, {
    key: "getTime",
    value: function getTime() {
      return this.time;
    }

    /**
     * @static
     * Format a timestamp string using supplied Moment.js format
     * @param {string} time_str timestamp string
     * @param {string} format
     * @returns {string} timestamp string
     */

  }], [{
    key: "formatTimestamp",
    value: function formatTimestamp(time_str, format) {

      var moment = Moment(time_str);

      return moment.format(format);
    }
  }]);

  return TimeLabel;
}(Element);

module.exports = TimeLabel;

},{"../element/Element":16,"moment":4}],21:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Element = require("../element/Element");

/**
 * Represents a label associated with the value axis (y).
 * <br><br>
 * @extends element.Element
 * @memberof element
 */

var ValueLabel = function (_Element) {
  _inherits(ValueLabel, _Element);

  /**
   * Instantiate ValueLabel
   * @constructor
   * @param {Layer} layer
   * @param {number} value
   * @param {number} x
   */

  function ValueLabel(layer, value, x) {
    _classCallCheck(this, ValueLabel);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ValueLabel).call(this, {}));

    _this.layer = layer;
    _this.value = value;
    _this.x = x;
    return _this;
  }

  /**
   * Draw value label on given context
   * @param {external:CanvasRenderingContext2D} context
   * @param {valueToPixel} function
   * @param {indexToPixel} function
   * @param {object} config
   */


  _createClass(ValueLabel, [{
    key: "draw",
    value: function draw(context, valueToPixel, indexToPixel, config) {

      var x = this.x + config.labelPaddingLeft;
      var y = valueToPixel(this.value);

      var label_text = "" + this.value + "";

      context.font = config.labelFont;
      context.textBaseline = "middle";
      context.fillStyle = config.labelColor;
      context.fillText(label_text, x, y);
    }

    /**
     * Get value
     * @returns {number}
     */

  }, {
    key: "getValue",
    value: function getValue() {
      return this.value;
    }
  }]);

  return ValueLabel;
}(Element);

module.exports = ValueLabel;

},{"../element/Element":16}],22:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Element = require("../element/Element");

/**
 * Represents a vertical line.
 * <br><br>
 * @extends element.Element
 * @memberof element
 */

var VerticalLine = function (_Element) {
  _inherits(VerticalLine, _Element);

  /**
   * Instantiate VerticalLine
   * @constructor
   * @param {Layer} layer
   * @param {number} index
   * @param {number} start
   * @param {number} end
   */

  function VerticalLine(layer, index, start, end) {
    _classCallCheck(this, VerticalLine);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(VerticalLine).call(this, {}));

    _this.layer = layer;
    _this.index = index;
    _this.start = start;
    _this.end = end;
    return _this;
  }

  /**
   * Draw vertical line on given context
   * @param {external:CanvasRenderingContext2D} context
   * @param {valueToPixel} function
   * @param {indexToPixel} function
   * @param {object} config
   */


  _createClass(VerticalLine, [{
    key: "draw",
    value: function draw(context, valueToPixel, indexToPixel, config) {

      var x = indexToPixel(this.index);

      context.beginPath();
      context.moveTo(x, this.start);
      context.lineTo(x, this.end);
      context.strokeStyle = config.lineColor;
      context.stroke();
    }

    /**
     * Get index
     * @returns {number}
     */

  }, {
    key: "getIndex",
    value: function getIndex() {
      return this.index;
    }

    /**
     * Get start
     * @returns {number} Start of line in unit pixels from top edge.
     */

  }, {
    key: "getStart",
    value: function getStart() {
      return this.start;
    }

    /**
     * Get end
     * @returns {number} End of line in unit pixels in from top edge.
     */

  }, {
    key: "getEnd",
    value: function getEnd() {
      return this.end;
    }
  }]);

  return VerticalLine;
}(Element);

module.exports = VerticalLine;

},{"../element/Element":16}],23:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _ = require("underscore");
var Layer = require("../layer/Layer");
var Candle = require("../element/Candle");

var _default_config = {
  bearBodyColor: "red",
  bullBodyColor: "green",
  wickColor: "black",
  candleBodyWidth: 5,
  candleWickWidth: 1,
  minField: "low",
  maxField: "high"
};

/**
 * Represents a candlestick chart layer.
 * <br><br>
 * @extends layer.Layer
 * @memberof layer
 */

var CandleLayer = function (_Layer) {
  _inherits(CandleLayer, _Layer);

  /**
   * Instantiate CandleLayer
   * @constructor
   * @param {object} config
   */

  function CandleLayer(config) {
    _classCallCheck(this, CandleLayer);

    config = _.extend({}, _default_config, config);
    return _possibleConstructorReturn(this, Object.getPrototypeOf(CandleLayer).call(this, config || {}));
  }

  /**
   * Set candle body width
   * @param {number} width in pixels
   */


  _createClass(CandleLayer, [{
    key: "setCandleBodyWidth",
    value: function setCandleBodyWidth(candle_body_size) {
      this.candleBodyWidth = candle_body_size;
    }

    /**
     * Get width of candle body
     * @returns {number} width in pixels
     */

  }, {
    key: "getCandleBodyWidth",
    value: function getCandleBodyWidth() {
      return this.candleBodyWidth;
    }

    /**
     * Set candle body color for candles where close price is lower than open price.
     * @param {string} a CSS compatible color value, e.g. "red", "#FF0000", "rgb(255, 0, 0)"
     */

  }, {
    key: "setBearBodyColor",
    value: function setBearBodyColor(color) {
      this.bearBodyColor = color;
    }

    /**
     * Get candle body color for candles where close price is lower than open price.
     * @returns {number} width in pixels
     */

  }, {
    key: "getBearBodyColor",
    value: function getBearBodyColor() {
      return this.bearBodyColor;
    }

    /**
     * Set candle body color for candles where close price is higher than open price.
     * @param {string} a CSS compatible color value, e.g. "red", "#FF0000", "rgb(255, 0, 0)"
     */

  }, {
    key: "setBullBodyColor",
    value: function setBullBodyColor(color) {
      this.bullBodyColor = color;
    }

    /**
     * Get candle body color for candles where close price is higher than open price.
     * @returns {number} width in pixels
     */

  }, {
    key: "getBullBodyColor",
    value: function getBullBodyColor() {
      return this.bullBodyColor;
    }

    /**
     * Render layer onto canvas
     * @param {object} data
     * @param {number} count
     * @param {number} offset
     * @param {valueToPixel} function
     * @param {indexToPixel} function
     */

  }, {
    key: "draw",
    value: function draw(data, count, offset, valueToPixel, indexToPixel) {

      var context = this._getContext();
      var field_map = data.getFieldMap();
      var data_arr = data.getRawData();
      this.elements = [];

      for (var i = offset >= 0 ? offset : 0; i < offset + count && i < data_arr.length; i++) {
        var dat = data_arr[i];
        var candle = new Candle(this, i, dat[field_map.time], dat[field_map.open], dat[field_map.high], dat[field_map.low], dat[field_map.close]);
        candle.draw(context, valueToPixel, indexToPixel, this);
        this.elements.push(candle);
      }
    }
  }]);

  return CandleLayer;
}(Layer);

module.exports = CandleLayer;

},{"../element/Candle":15,"../layer/Layer":24,"underscore":6}],24:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _ = require("underscore");
var Type = require("../core/Type");

var _default_config = {};

/**
 * Represents a layer.
 * <br><br>
 * @extends core.Type
 * @memberof layer
 */

var Layer = function (_Type) {
  _inherits(Layer, _Type);

  /**
   * Instantiate Layer
   * @constructor
   * @param {object} config
   */

  function Layer(config) {
    _classCallCheck(this, Layer);

    config = _.extend({}, _default_config, config);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Layer).call(this, config));

    _this.elements = [];
    return _this;
  }

  /**
   * Sets parent component
   * @param {core.Component} comp
   */


  _createClass(Layer, [{
    key: "setParentComponent",
    value: function setParentComponent(comp) {
      this._parent_component = comp;
    }

    /**
     * Get parent component
     * @returns {core.Component} parent component
     */

  }, {
    key: "getParentComponent",
    value: function getParentComponent() {
      return this._parent_component;
    }

    /**
     * Get canvas context
     * @returns {CanvasRenderingContext2D} canvas context
     */

  }, {
    key: "_getContext",
    value: function _getContext() {
      return this.getParentComponent().getContext();
    }

    /**
     * Get layer width
     * @returns {number} layer width expressed in pixels
     */

  }, {
    key: "getWidth",
    value: function getWidth() {
      return this.getParentComponent().getWidth();
    }

    /**
     * Get layer drawing width, equal to width minus padding
     * @returns {number} drawing width expressed in pixels
     */

  }, {
    key: "getDrawingWidth",
    value: function getDrawingWidth() {
      return this.getParentComponent().getDrawingWidth();
    }

    /**
     * Get layer height
     * @returns {number} layer height expressed in pixels
     */

  }, {
    key: "getHeight",
    value: function getHeight() {
      return this.getParentComponent().getHeight();
    }

    /**
     * Get minimum field
     * <br><br>
     * Returns the name of the field with the lowest value for a given data point.
     * @returns {string|undefined} field name
     */

  }, {
    key: "getMinField",
    value: function getMinField() {
      return this.minField;
    }

    /**
     * Get maximum field
     * <br><br>
     * Returns the name of the field with the highest value for a given data point.
     * @returns {string|undefined} field name
     */

  }, {
    key: "getMaxField",
    value: function getMaxField() {
      return this.maxField;
    }

    /**
     * Get minimum value
     * <br><br>
     * Returns the value corresponding to the bottom edge of the layer
     * @returns {string|undefined} field name
     */

  }, {
    key: "getMinValue",
    value: function getMinValue() {
      return this.minValue;
    }

    /**
     * Get maximum value
     * <br><br>
     * Returns the value corresponding to the top edge of the layer
     * @returns {string|undefined} field name
     */

  }, {
    key: "getMaxValue",
    value: function getMaxValue() {
      return this.maxValue;
    }
  }]);

  return Layer;
}(Type);

module.exports = Layer;

},{"../core/Type":11,"underscore":6}],25:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _ = require("underscore");
var Layer = require("../layer/Layer");
var OHLCBar = require("../element/OHLCBar");

var _default_config = {
  bearBodyColor: "red",
  bullBodyColor: "green",
  wickColor: "black",
  candleBodyWidth: 3,
  candleWickWidth: 1,
  minField: "low",
  maxField: "high"
};

/**
 * Represents an OHLC bar chart layer.
 * <br><br>
 * @extends layer.Layer
 * @memberof layer
 */

var OHLCLayer = function (_Layer) {
  _inherits(OHLCLayer, _Layer);

  /**
   * Instantiate OHLCLayer
   * @constructor
   * @param {object} config
   */

  function OHLCLayer(config) {
    _classCallCheck(this, OHLCLayer);

    config = _.extend({}, _default_config, config);
    return _possibleConstructorReturn(this, Object.getPrototypeOf(OHLCLayer).call(this, config || {}));
  }

  /**
   * Set OHLC body width
   * @param {number} size width in pixels
   */


  _createClass(OHLCLayer, [{
    key: "setCandleBodyWidth",
    value: function setCandleBodyWidth(size) {
      this.candleBodyWidth = size;
    }

    /**
     * Get width of OHLC bar body
     * @returns {number} width in pixels
     */

  }, {
    key: "getCandleBodyWidth",
    value: function getCandleBodyWidth() {
      return this.candleBodyWidth;
    }

    /**
     * Set bar color for OHLC bars where close price is lower than open price.
     * @param {number} color
     */

  }, {
    key: "setBearBodyColor",
    value: function setBearBodyColor(color) {
      this.bearBodyColor = color;
    }

    /**
     * Get bar color for OHLC bars where close price is lower than open price.
     * @returns {number} width in pixels
     */

  }, {
    key: "getBearBodyColor",
    value: function getBearBodyColor() {
      return this.bearBodyColor;
    }

    /**
     * Set bar color for OHLC bars where close price is higher than open price.
     * @param {number} color
     */

  }, {
    key: "setBullBodyColor",
    value: function setBullBodyColor(color) {
      this.bullBodyColor = color;
    }

    /**
     * Get bar color for OHLC bars where close price is higher than open price.
     * @returns {number} width in pixels
     */

  }, {
    key: "getBullBodyColor",
    value: function getBullBodyColor() {
      return this.bullBodyColor;
    }

    /**
     * Render layer onto canvas
     * @param {object} data
     * @param {number} count
     * @param {number} offset
     * @param {valueToPixel} function
     * @param {indexToPixel} function
     */

  }, {
    key: "draw",
    value: function draw(data, count, offset, valueToPixel, indexToPixel) {

      var context = this._getContext();
      var field_map = data.getFieldMap();
      var data_arr = data.getRawData();
      this.elements = [];

      for (var i = offset >= 0 ? offset : 0; i < offset + count && i < data_arr.length; i++) {
        var dat = data_arr[i];
        var bar = new OHLCBar(this, i, dat[field_map.time], dat[field_map.open], dat[field_map.high], dat[field_map.low], dat[field_map.close]);
        bar.draw(context, valueToPixel, indexToPixel, this);
        this.elements.push(bar);
      }
    }
  }]);

  return OHLCLayer;
}(Layer);

module.exports = OHLCLayer;

},{"../element/OHLCBar":19,"../layer/Layer":24,"underscore":6}],26:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _ = require("underscore");
var Layer = require("../layer/Layer");
var VerticalLine = require("../element/VerticalLine");

var _default_config = {
  lineColor: "#BBBBBB",
  showLabels: true,
  labelColor: "#555555",
  labelFont: "7pt normal normal arial;"
};

/**
 * Represents time grid layer, consisting of vertical lines.
 * <br><br>
 * @extends layer.Layer
 * @memberof layer
 */

var TimeGridLayer = function (_Layer) {
  _inherits(TimeGridLayer, _Layer);

  /**
   * Instantiate TimeGridLayer
   * @constructor
   * @param {object} config
   */

  function TimeGridLayer(config) {
    _classCallCheck(this, TimeGridLayer);

    config = _.extend({}, _default_config, config);
    return _possibleConstructorReturn(this, Object.getPrototypeOf(TimeGridLayer).call(this, config));
  }

  /**
   * Get start of vertical line in unit pixels
   * @returns {number} in pixels
   */


  _createClass(TimeGridLayer, [{
    key: "getLineStart",
    value: function getLineStart() {
      return 0;
    }

    /**
     * Get end of vertical line in unit pixels
     * @returns {number} in pixels
     */

  }, {
    key: "getLineEnd",
    value: function getLineEnd() {
      return this.getHeight();
    }

    /**
     * Render layer onto canvas
     * @param {object} data
     * @param {number} count
     * @param {number} offset
     * @param {valueToPixel} function
     * @param {indexToPixel} function
     * @param {object} valueBounds
     */

  }, {
    key: "draw",
    value: function draw(data, count, offset, valueToPixel, indexToPixel, valueBounds) {

      var context = this._getContext();
      var data_arr = data.getRawData();
      this.elements = [];

      for (var i = offset >= 0 ? offset : 0; i < offset + count && i < data_arr.length; i++) {
        if (this.timeGrid.lineAt(i) !== undefined) {
          var line = new VerticalLine(this, i, // index
          this.getLineStart(), this.getLineEnd());
          this.elements.push(line);
          line.draw(context, valueToPixel, indexToPixel, this);
        }
      }
    }
  }]);

  return TimeGridLayer;
}(Layer);

module.exports = TimeGridLayer;

},{"../element/VerticalLine":22,"../layer/Layer":24,"underscore":6}],27:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _ = require("underscore");
var Layer = require("../layer/Layer");
var TimeLabel = require("../element/TimeLabel");

var _default_config = {
  labelColor: "#444444",
  labelFont: "7pt normal normal arial;",
  labelY: 8
};

/**
 * Represents time labels layer.
 * <br><br>
 * @extends layer.Layer
 * @memberof layer
 */

var TimeLabelsLayer = function (_Layer) {
  _inherits(TimeLabelsLayer, _Layer);

  /**
   * Instantiate TimeLabelsLayer
   * @constructor
   * @param {object} config
   */

  function TimeLabelsLayer(config) {
    _classCallCheck(this, TimeLabelsLayer);

    config = _.extend({}, _default_config, config);
    return _possibleConstructorReturn(this, Object.getPrototypeOf(TimeLabelsLayer).call(this, config));
  }

  /**
   * Render layer onto canvas
   * @param {object} data
   * @param {number} count
   * @param {number} offset
   * @param {valueToPixel} function
   * @param {indexToPixel} function
   * @param {object} valueBounds
   */


  _createClass(TimeLabelsLayer, [{
    key: "draw",
    value: function draw(data, count, offset, valueToPixel, indexToPixel, valueBounds) {

      var context = this._getContext();
      var field_map = data.getFieldMap();
      var data_arr = data.getRawData();
      this.elements = [];
      var line_spacing = this.timeGrid.getLineSpacing();
      var label;
      var labels = [];

      for (var i = offset >= 0 ? offset : 0; i < offset + count && i < data_arr.length; i++) {
        var dat = data_arr[i];
        var time_str = dat[field_map.time];

        var grid_line = this.timeGrid.lineAt(i);
        if (grid_line !== undefined) {
          label = new TimeLabel(this, i, // index
          time_str, grid_line.format);

          labels.push(label);
        }
      }

      // look ahead
      for (i = 0; i < labels.length - 1; i++) {
        label = labels[i];
        var next_label = labels[i + 1];
        var x = indexToPixel(label.getIndex());
        var next_x = indexToPixel(next_label.getIndex());
        if (next_x - x >= 0.6 * line_spacing) {
          label.draw(context, indexToPixel, this);
          this.elements.push(label);
        }
      }
    }
  }]);

  return TimeLabelsLayer;
}(Layer);

module.exports = TimeLabelsLayer;

},{"../element/TimeLabel":20,"../layer/Layer":24,"underscore":6}],28:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _ = require("underscore");
var Layer = require("../layer/Layer");
var HorizontalLine = require("../element/HorizontalLine");
var ValueLabel = require("../element/ValueLabel");

var _default_config = {
  lineSpacing: 50,
  lineColor: "#BBBBBB",
  showLabels: true,
  labelColor: "#555555",
  labelFont: "7pt normal normal arial;",
  labelPaddingLeft: 4
};

/**
 * Represents value grid layer, consisting of horizontal lines.
 * <br><br>
 * @extends layer.Layer
 * @memberof layer
 */

var ValueGridLayer = function (_Layer) {
  _inherits(ValueGridLayer, _Layer);

  /**
   * Instantiate ValueGridLayer
   * @constructor
   * @param {object} config
   */

  function ValueGridLayer(config) {
    _classCallCheck(this, ValueGridLayer);

    config = _.extend({}, _default_config, config);
    return _possibleConstructorReturn(this, Object.getPrototypeOf(ValueGridLayer).call(this, config || {}));
  }

  /**
   * Get width of labels (on right-hand side of chart)
   * @returns {number} in pixels
   */


  _createClass(ValueGridLayer, [{
    key: "getLabelWidth",
    value: function getLabelWidth() {
      return this.labelWidth;
    }

    /**
     * Get start of horizontal line in unit pixels
     * @returns {number} in pixels
     */

  }, {
    key: "getLineStart",
    value: function getLineStart() {
      return 0;
    }

    /**
     * Get end of horizontal line in unit pixels
     * @returns {number} in pixels
     */

  }, {
    key: "getLineEnd",
    value: function getLineEnd() {
      return this.getWidth() - this.getLabelWidth();
    }

    /**
     * Render layer onto canvas
     * @param {object} data
     * @param {number} count
     * @param {number} offset
     * @param {valueToPixel} function
     * @param {indexToPixel} function
     * @param {object} valueBounds
     */

  }, {
    key: "draw",
    value: function draw(data, count, offset, valueToPixel, indexToPixel, valueBounds) {

      var context = this._getContext();
      this.elements = [];
      this.label_elements = [];
      var min = valueBounds.min,
          max = valueBounds.max;
      var derived_lines;
      var dec_places;

      if (this.lines === undefined) {
        derived_lines = [];

        var denom = this.granularity;

        if (denom === undefined) {
          denom = ValueGridLayer.determineValueGranularity(min, max, this.getHeight(), this.lineSpacing);
        }

        // e.g. var p = (Math.round(price_min * 400.0) / 400.0); // where denom = 0.0025
        var value = Math.round(min * 1.0 / denom) / (1.0 / denom);
        dec_places = ValueGridLayer.decimalPlaces(denom);

        var i = 0;
        while (value <= max) {
          value = ValueGridLayer.decimalAdjust("round", value, -7);
          derived_lines.push(value);

          value += denom;
          i++;
        }
      } else {
        derived_lines = this.lines;
      }

      for (var l = 0; l < derived_lines.length; l++) {
        var val = derived_lines[l];

        var line = new HorizontalLine(this, val, this.getLineStart(), this.getLineEnd());
        this.elements.push(line);
        line.draw(context, valueToPixel, indexToPixel, this);

        if (this.showLabels === true) {
          var label = new ValueLabel(l, val.toFixed(dec_places || 2), this.getLineEnd());
          this.label_elements.push(label);
          label.draw(context, valueToPixel, indexToPixel, this);
        }
      }
    }

    /**
     * @static
     * Determine grid line interval
     * @param {number} min
     * @param {number} max
     * @param {number} pixel_height
     * @param {number} pixel_spacing
     * @returns {number} number representing interval between horizontal grid lines
     */

  }], [{
    key: "determineValueGranularity",
    value: function determineValueGranularity(min, max, pixel_height, pixel_spacing) {

      var range = max - min; // e.g. 1815-1762 or 1.4172-1.4069
      var divisions = pixel_height / pixel_spacing; // e.g. 300/20
      var seg = range / divisions;

      var gran = 0.00001;
      var prev_gran = 0.000005;
      var gran_factors = [2.5, 2, 2]; // 1*2.5=2.5, 2.5*2=5, 5*2=10, 10*2.5=25, ...
      //var grans = [10000,5000,2500,1000,500,250,100,50,25,10,5,2.5,1,0.5,0.25,0.1,0.05,0.025,0.01,0.005,0.0025,0.0001,0.00005,0.000025,0.00001];
      var nextGran = function nextGran(current_value, i) {
        return current_value * gran_factors[i % 3];
      };

      for (var i = 0;; i++) {
        if (gran >= seg) {
          return prev_gran;
        }

        prev_gran = gran;
        gran = nextGran(gran, i);
      }

      return 1000;
    }

    /**
     * @static
     *
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/round
     *
     * Decimal adjustment of a number.
     * @param {string} type The type of adjustment.
     * @param {number} value The number.
     * @param {number} exp The exponent (the 10 logarithm of the adjustment base).
     * @returns {number} The adjusted value.
    */

  }, {
    key: "decimalAdjust",
    value: function decimalAdjust(type, value, exp) {
      // If the exp is undefined or zero...
      if (typeof exp === "undefined" || +exp === 0) {
        return Math[type](value);
      }
      value = +value;
      exp = +exp;
      // If the value is not a number or the exp is not an integer...
      if (isNaN(value) || !(typeof exp === "number" && exp % 1 === 0)) {
        return NaN;
      }
      // Shift
      value = value.toString().split("e");
      value = Math[type](+(value[0] + "e" + (value[1] ? +value[1] - exp : -exp)));
      // Shift back
      value = value.toString().split("e");
      return +(value[0] + "e" + (value[1] ? +value[1] + exp : exp));
    }

    // http://stackoverflow.com/questions/10454518/javascript-how-to-retrieve-the-number-of-decimals-of-a-string-number

  }, {
    key: "decimalPlaces",
    value: function decimalPlaces(num) {
      var match = ("" + num).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
      if (!match) {
        return 0;
      }
      return Math.max(0,
      // Number of digits right of decimal point. // Adjust for scientific notation.
      (match[1] ? match[1].length : 0) - (match[2] ? +match[2] : 0));
    }
  }]);

  return ValueGridLayer;
}(Layer);

module.exports = ValueGridLayer;

},{"../element/HorizontalLine":18,"../element/ValueLabel":21,"../layer/Layer":24,"underscore":6}],29:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _ = require("underscore");
var Stats = require("fast-stats").Stats;
var Layer = require("../../layer/Layer");
var Arc = require("../../element/Arc");

var _default_config = {
  input: "close",
  upperBandOutputPrefix: "_bb_upper",
  midOutputPrefix: "_bb_mid",
  lowerBandOutputPrefix: "_bb_lower",
  period: 20,
  multiplier: 2,
  bandColor: "rgba(0, 0, 0, 0.3)",
  midColor: "rgba(0, 0, 0, 0.3)"
};

/**
 * Represents a Bollinger Bands chart layer.
 * <br><br>
 * @extends layer.Layer
 * @memberof layer.indicator
 */

var BollingerBandsLayer = function (_Layer) {
  _inherits(BollingerBandsLayer, _Layer);

  /**
   * Instantiate BollingerBandsLayer
   * @constructor
   * @param {object} config
   */

  function BollingerBandsLayer(config) {
    _classCallCheck(this, BollingerBandsLayer);

    config = _.extend({}, _default_config, config);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(BollingerBandsLayer).call(this, config));

    _this.upperBandOutput = _this.upperBandOutputPrefix + "" + _this.period + "x" + _this.multiplier;
    _this.midOutput = _this.midOutputPrefix + "" + _this.period + "x" + _this.multiplier;
    _this.lowerBandOutput = _this.lowerBandOutputPrefix + "" + _this.period + "x" + _this.multiplier;
    _this.minField = _this.lowerBandOutput;
    _this.maxField = _this.upperBandOutput;
    return _this;
  }

  /**
   * Precompute indicator fields using time series OHLCV data.
   * <br><br>
   * This is invoked before draw().
   * @param {timeseries.TimeSeriesData} data
   */


  _createClass(BollingerBandsLayer, [{
    key: "precompute",
    value: function precompute(data) {
      var data_arr = data.getRawData();
      var field_map = data.getFieldMap();
      var input_field = field_map[this.input];
      var upper_band_field = this.upperBandOutput;
      var mid_field = this.midOutput;
      var lower_band_field = this.lowerBandOutput;
      var period = this.period;

      var mean = new Stats();
      var sd = new Stats();

      for (var i = 0; i < data_arr.length; i++) {
        var dat = data_arr[i];

        mean.push(dat[input_field]);
        sd.push(dat[input_field]);

        if (sd.length === period) {
          var ma = mean.amean();
          var std_dev = sd.stddev();
          dat[upper_band_field] = ma + 2 * std_dev;
          dat[mid_field] = ma;
          dat[lower_band_field] = ma - 2 * std_dev;
          if (isNaN(dat[upper_band_field])) {
            dat[upper_band_field] = 0.0;
          }
          if (isNaN(dat[lower_band_field])) {
            dat[lower_band_field] = 0.0;
          }
          sd.shift();
          mean.shift();
        }
      }
    }

    /**
     * Render layer onto canvas
     * @param {timeseries.TimeSeriesData} data
     * @param {number} count
     * @param {number} offset
     * @param {valueToPixel} valueToPixel
     * @param {indexToPixel} indexToPixel
     */

  }, {
    key: "draw",
    value: function draw(data, count, offset, valueToPixel, indexToPixel) {

      var context = this._getContext();
      var field_map = data.getFieldMap();
      var data_arr = data.getRawData();
      this.elements = [], this.elements_upper = [], this.elements_lower = [];
      var prev_arc_upper = null,
          prev_arc_mid = null,
          prev_arc_lower = null;

      for (var i = offset >= 0 ? offset : 0; i < offset + count && i < data_arr.length; i++) {
        var dat = data_arr[i];

        // upper
        var arc_upper = new Arc(this, i, dat[field_map.time], dat[this.upperBandOutput], prev_arc_upper);
        this.elements_upper.push(arc_upper);
        arc_upper.draw(context, valueToPixel, indexToPixel, { color: this.bandColor });

        // mid (simple moving average)
        var arc_mid = new Arc(this, i, dat[field_map.time], dat[this.midOutput], prev_arc_mid);
        this.elements.push(arc_mid);
        arc_mid.draw(context, valueToPixel, indexToPixel, { color: this.midColor });

        // lower
        var arc_lower = new Arc(this, i, dat[field_map.time], dat[this.lowerBandOutput], prev_arc_lower);
        this.elements_lower.push(arc_lower);
        arc_lower.draw(context, valueToPixel, indexToPixel, { color: this.bandColor });

        prev_arc_upper = arc_upper;
        prev_arc_mid = arc_mid;
        prev_arc_lower = arc_lower;
      }
    }
  }]);

  return BollingerBandsLayer;
}(Layer);

module.exports = BollingerBandsLayer;

},{"../../element/Arc":14,"../../layer/Layer":24,"fast-stats":3,"underscore":6}],30:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _ = require("underscore");
var Layer = require("../../layer/Layer");
var Arc = require("../../element/Arc");

var _default_config = {
  input: "close",
  outputPrefix: "_sma",
  period: 50,
  color: "orange"
};

/**
 * Represents an EMA chart layer.
 * <br><br>
 * @extends layer.Layer
 * @memberof layer.indicator
 */

var ExponentialMovingAverageLayer = function (_Layer) {
  _inherits(ExponentialMovingAverageLayer, _Layer);

  /**
   * Instantiate ExponentialMovingAverageLayer
   * @constructor
   * @param {object} config
   */

  function ExponentialMovingAverageLayer(config) {
    _classCallCheck(this, ExponentialMovingAverageLayer);

    config = _.extend({}, _default_config, config);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ExponentialMovingAverageLayer).call(this, config));

    _this.output = _this.outputPrefix + "" + _this.period; // e.g. _sma50, _sma200, etc
    _this.minField = _this.output;
    _this.maxField = _this.output;
    return _this;
  }

  /**
   * Precompute indicator fields using time series OHLCV data.
   * <br><br>
   * This is invoked before draw().
   * @param {timeseries.TimeSeriesData} data
   */


  _createClass(ExponentialMovingAverageLayer, [{
    key: "precompute",
    value: function precompute(data) {
      var data_arr = data.getRawData();
      var field_map = data.getFieldMap();
      var output_field = this.output;
      var input_field = field_map[this.input];
      var period = this.period;
      var multiplier = 2.0 / (period + 1.0);
      var queue = [],
          sum = 0.0;
      var prev_ema;
      for (var i = 0; i < data_arr.length; i++) {
        var dat = data_arr[i];
        if (prev_ema) {
          var ema = (dat[input_field] || 1.0) * multiplier + prev_ema * (1.0 - multiplier);
          dat[output_field] = ema;
          prev_ema = ema;
        } else if (queue.length === period) {
          var ma = sum / period;
          prev_ema = ma;
        } else {
          // Build up array to calculate initial ema values
          queue.push(dat[input_field] || 1.0);
          sum += dat[input_field] || 1.0;
        }
      }
    }

    /**
     * Render layer onto canvas
     * @param {timeseries.TimeSeriesData} data
     * @param {number} count
     * @param {number} offset
     * @param {valueToPixel} valueToPixel
     * @param {indexToPixel} indexToPixel
     */

  }, {
    key: "draw",
    value: function draw(data, count, offset, valueToPixel, indexToPixel) {

      var context = this._getContext();
      var field_map = data.getFieldMap();
      var data_arr = data.getRawData();
      this.elements = [];
      var prev_arc = null;

      for (var i = offset >= 0 ? offset : 0; i < offset + count && i < data_arr.length; i++) {
        var dat = data_arr[i];

        var arc = new Arc(this, i, dat[field_map.time], dat[this.output], prev_arc);
        this.elements.push(arc);
        arc.draw(context, valueToPixel, indexToPixel, this);

        prev_arc = arc;
      }
    }
  }]);

  return ExponentialMovingAverageLayer;
}(Layer);

module.exports = ExponentialMovingAverageLayer;

},{"../../element/Arc":14,"../../layer/Layer":24,"underscore":6}],31:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _ = require("underscore");
var Layer = require("../../layer/Layer");
var Arc = require("../../element/Arc");

var _default_config = {
  input: "close",
  output: "_rsi",
  period: 14,
  color: "red",
  minValue: 0.0,
  maxValue: 100.0
};

/**
 * Represents a RSI chart layer.
 * <br><br>
 * @extends layer.Layer
 * @memberof layer.indicator
 */

var RSILayer = function (_Layer) {
  _inherits(RSILayer, _Layer);

  /**
   * Instantiate RSILayer
   * @constructor
   * @param {Object} config
   */

  function RSILayer(config) {
    _classCallCheck(this, RSILayer);

    config = _.extend({}, _default_config, config);
    return _possibleConstructorReturn(this, Object.getPrototypeOf(RSILayer).call(this, config));
  }

  /**
   * Precompute indicator fields using time series OHLCV data.
   * <br><br>
   * This is invoked before draw().
   * @param {timeseries.TimeSeriesData} data
   */


  _createClass(RSILayer, [{
    key: "precompute",
    value: function precompute(data) {

      var data_arr = data.getRawData();
      var field_map = data.getFieldMap();
      var input_field = field_map[this.input]; // i.e. close
      var output_field = this.output;
      var period = this.period;
      var queue = [],
          gain_queue = [],
          loss_queue = [];
      var prev_close, prev_avg_gain, prev_avg_loss;
      var loss_sum = 0.0,
          gain_sum = 0.0;

      for (var i = 1; i < data_arr.length; i++) {
        var dat = data_arr[i];
        var dat_prev = data_arr[i - 1];

        var change = dat[input_field] - dat_prev[input_field];
        var abs_change = Math.abs(change);
        var current_gain = 0.0;
        var current_loss = 0.0;
        var avg_gain = 0.0;
        var avg_loss = 0.0;
        var rs;

        if (change >= 0.0) {
          current_gain = abs_change;
        } else {
          current_loss = abs_change;
        }

        if (queue.length < period) {
          queue.push(change);
          if (change >= 0.0) {
            gain_queue.push(abs_change);
            gain_sum += abs_change;
          } else {
            loss_queue.push(abs_change);
            loss_sum += abs_change;
          }
        } else if (queue.length === period) {
          rs = gain_sum / loss_sum;
          dat[output_field] = 100.0 - 100.0 / (1.0 + rs);
          if (isNaN(dat[output_field])) {
            dat[output_field] = 0.0;
          }
          queue.push(change); // length=(data.periods + 1)
        } else {
          avg_gain = (prev_avg_gain * (period - 1) + current_gain) / period;
          avg_loss = (prev_avg_loss * (period - 1) + current_loss) / period;

          rs = avg_gain / avg_loss;
          dat[output_field] = 100.0 - 100.0 / (1.0 + rs);

          if (isNaN(dat[output_field])) {
            dat[output_field] = 0.0;
          }
        }

        prev_avg_gain = avg_gain;
        prev_avg_loss = avg_loss;
        prev_close = dat[output_field];
      }
    }

    /**
     * Render layer onto canvas
     * @param {timeseries.TimeSeriesData} data
     * @param {number} count
     * @param {number} offset
     * @param {valueToPixel} valueToPixel
     * @param {indexToPixel} indexToPixel
     */

  }, {
    key: "draw",
    value: function draw(data, count, offset, valueToPixel, indexToPixel) {

      var context = this._getContext();
      var field_map = data.getFieldMap();
      var data_arr = data.getRawData();
      this.elements = [];
      var prev_arc = null;

      for (var i = offset >= 0 ? offset : 0; i < offset + count && i < data_arr.length; i++) {
        var dat = data_arr[i];

        var arc = new Arc(this, i, dat[field_map.time], dat[this.output], prev_arc);
        this.elements.push(arc);
        arc.draw(context, valueToPixel, indexToPixel, this);

        prev_arc = arc;
      }
    }
  }]);

  return RSILayer;
}(Layer);

module.exports = RSILayer;

},{"../../element/Arc":14,"../../layer/Layer":24,"underscore":6}],32:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _ = require("underscore");
var Layer = require("../../layer/Layer");
var Arc = require("../../element/Arc");

var _default_config = {
  input: "close",
  outputPrefix: "_sma",
  period: 50,
  color: "orange"
};

/**
 * Represents a SMA chart layer.
 * <br><br>
 * @extends layer.Layer
 * @memberof layer.indicator
 */

var SimpleMovingAverageLayer = function (_Layer) {
  _inherits(SimpleMovingAverageLayer, _Layer);

  /**
   * Instantiate SimpleMovingAverageLayer
   * @constructor
   * @param {object} config
   */

  function SimpleMovingAverageLayer(config) {
    _classCallCheck(this, SimpleMovingAverageLayer);

    config = _.extend({}, _default_config, config);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(SimpleMovingAverageLayer).call(this, config));

    _this.output = _this.outputPrefix + "" + _this.period; // e.g. _sma50, _sma200, etc
    _this.minField = _this.output;
    _this.maxField = _this.output;
    return _this;
  }

  /**
   * Precompute indicator fields using time series OHLCV data.
   * <br><br>
   * This is invoked before draw().
   * @param {timeseries.TimeSeriesData} data
   */


  _createClass(SimpleMovingAverageLayer, [{
    key: "precompute",
    value: function precompute(data) {
      var data_arr = data.getRawData();
      var field_map = data.getFieldMap();
      var output_field = this.output;
      var input_field = field_map[this.input];
      var period = this.period;
      var queue = [],
          sum = 0.0;
      for (var i = 0; i < data_arr.length; i++) {
        var dat = data_arr[i];
        queue.push(dat[input_field]);
        sum += dat[input_field];
        if (queue.length === period + 1) {
          sum -= queue.shift();
          dat[output_field] = sum / period;
        }
      }
    }

    /**
     * Render layer onto canvas
     * @param {timeseries.TimeSeriesData} data
     * @param {number} count
     * @param {number} offset
     * @param {valueToPixel} valueToPixel
     * @param {indexToPixel} indexToPixel
     */

  }, {
    key: "draw",
    value: function draw(data, count, offset, valueToPixel, indexToPixel) {

      var context = this._getContext();
      var field_map = data.getFieldMap();
      var data_arr = data.getRawData();
      this.elements = [];
      var prev_arc = null;

      for (var i = offset >= 0 ? offset : 0; i < offset + count && i < data_arr.length; i++) {
        var dat = data_arr[i];

        var arc = new Arc(this, i, dat[field_map.time], dat[this.output], prev_arc);
        this.elements.push(arc);
        arc.draw(context, valueToPixel, indexToPixel, this);

        prev_arc = arc;
      }
    }
  }]);

  return SimpleMovingAverageLayer;
}(Layer);

module.exports = SimpleMovingAverageLayer;

},{"../../element/Arc":14,"../../layer/Layer":24,"underscore":6}],33:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _ = require("underscore");
var Layer = require("../../layer/Layer");
var Arc = require("../../element/Arc");

var _default_config = {
  lowInput: "low",
  highInput: "high",
  closeInput: "close",
  kOutput: "_stoch14_k",
  dOutput: "_stoch14_d",
  period: 14,
  kMa: 3,
  dMa: 5,
  kColor: "orange",
  dColor: "lime",
  minValue: 0.0,
  maxValue: 100.0
};

/**
 * Represents a Stochastic chart layer.
 * <br><br>
 * @extends layer.Layer
 * @memberof layer.indicator
 */

var StochasticLayer = function (_Layer) {
  _inherits(StochasticLayer, _Layer);

  /**
   * Instantiate StochasticLayer
   * @constructor
   * @param {Object} config
   */

  function StochasticLayer(config) {
    _classCallCheck(this, StochasticLayer);

    config = _.extend({}, _default_config, config);
    return _possibleConstructorReturn(this, Object.getPrototypeOf(StochasticLayer).call(this, config));
  }

  /**
   * Precompute indicator fields using time series OHLCV data.
   * <br><br>
   * This is invoked before draw().
   * @param {timeseries.TimeSeriesData} data
   */


  _createClass(StochasticLayer, [{
    key: "precompute",
    value: function precompute(data) {

      var data_arr = data.getRawData();
      var field_map = data.getFieldMap();
      var k_field = this.kOutput;
      var d_field = this.dOutput;
      var low_input = field_map[this.lowInput];
      var high_input = field_map[this.highInput];
      var close_input = field_map[this.closeInput];
      var period = this.period,
          k_ma = this.kMa,
          d_ma = this.dMa;
      var low_queue = [],
          high_queue = [],
          k_queue = [],
          k_sum = 0.0,
          d_queue = [],
          d_sum = 0.0;
      var low, high;
      for (var i = 0; i < data_arr.length; i++) {
        var dat = data_arr[i];
        // Low
        low_queue.push(dat[low_input]); // e.g. low
        if (low_queue.length === period) // e.g. 14
          {
            low = Math.min.apply(Math, low_queue);
            low_queue.shift(); // remove first
          }
        // High
        high_queue.push(dat[high_input]); // e.g. high
        if (high_queue.length === period) // e.g. 14
          {
            high = Math.max.apply(Math, high_queue);
            high_queue.shift(); // remove first
          }
        // k and d
        if (low !== undefined && high !== undefined) {
          var k = (dat[close_input] - low) / (high - low) * 100.0;

          if (isNaN(k)) {
            k = 0.0;
          }

          // Stochastic %K applied with SMA(3)
          k_queue.push(k);
          k_sum += k;

          if (k_queue.length === k_ma + 1) {
            k_sum -= k_queue.shift();
            dat[k_field] = k_sum / k_ma;
          }

          if (dat[k_field] !== undefined) {
            // MA3 of %K
            d_queue.push(dat[k_field]);
            d_sum += dat[k_field];

            if (d_queue.length === d_ma + 1) {
              d_sum -= d_queue.shift();
              dat[d_field] = d_sum / d_ma;
            }
          }
        }
      }
    }

    /**
     * Render layer onto canvas
     * @param {timeseries.TimeSeriesData} data
     * @param {number} count
     * @param {number} offset
     * @param {valueToPixel} valueToPixel
     * @param {indexToPixel} indexToPixel
     */

  }, {
    key: "draw",
    value: function draw(data, count, offset, valueToPixel, indexToPixel) {

      var context = this._getContext();
      var field_map = data.getFieldMap();
      var data_arr = data.getRawData();
      this.elements = [];
      this.d_elements = [];
      var prev_k_arc = null,
          prev_d_arc = null;

      for (var i = offset >= 0 ? offset : 0; i < offset + count && i < data_arr.length; i++) {
        var dat = data_arr[i];

        // d
        var d_arc = new Arc(this, i, dat[field_map.time], dat[this.dOutput], prev_d_arc);
        this.d_elements.push(d_arc);
        d_arc.draw(context, valueToPixel, indexToPixel, { color: this.dColor });

        // k
        var k_arc = new Arc(this, i, dat[field_map.time], dat[this.kOutput], prev_k_arc);
        this.elements.push(k_arc);
        k_arc.draw(context, valueToPixel, indexToPixel, { color: this.kColor });

        prev_k_arc = k_arc;
        prev_d_arc = d_arc;
      }
    }
  }]);

  return StochasticLayer;
}(Layer);

module.exports = StochasticLayer;

},{"../../element/Arc":14,"../../layer/Layer":24,"underscore":6}],34:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _ = require("underscore");
var Layer = require("../../layer/Layer");
var HistogramBar = require("../../element/HistogramBar");

var _default_config = {
  barColor: "blue",
  barWidth: 3,
  minValue: 0,
  maxField: "volume"
};

/**
 * Represents a volume histogram chart layer.
 * <br><br>
 * @extends layer.Layer
 * @memberof layer.indicator
 */

var VolumeLayer = function (_Layer) {
  _inherits(VolumeLayer, _Layer);

  /**
   * Instantiate VolumeLayer
   * @constructor
   * @param {Object} config
   */

  function VolumeLayer(config) {
    _classCallCheck(this, VolumeLayer);

    config = _.extend({}, _default_config, config);
    return _possibleConstructorReturn(this, Object.getPrototypeOf(VolumeLayer).call(this, config));
  }

  /**
   * Set width of each volume bar
   * @param {number} Width in pixels.
   */


  _createClass(VolumeLayer, [{
    key: "setBarWidth",
    value: function setBarWidth(bar_width) {
      this.barWidth = bar_width;
    }

    /**
     * Get volume bar width
     * @returns {number} Width in pixels.
     */

  }, {
    key: "getBarWidth",
    value: function getBarWidth() {
      return this.barWidth;
    }

    /**
     * Render layer onto canvas
     * @param {timeseries.TimeSeriesData} data
     * @param {number} count
     * @param {number} offset
     * @param {valueToPixel} valueToPixel
     * @param {indexToPixel} indexToPixel
     */

  }, {
    key: "draw",
    value: function draw(data, count, offset, valueToPixel, indexToPixel) {

      var context = this._getContext();
      var field_map = data.getFieldMap();
      var data_arr = data.getRawData();
      this.elements = [];

      for (var i = offset >= 0 ? offset : 0; i < offset + count && i < data_arr.length; i++) {
        var dat = data_arr[i];
        var bar = new HistogramBar(this, i, dat[field_map.time], dat[field_map.volume]);
        bar.draw(context, valueToPixel, indexToPixel, this);
        this.elements.push(bar);
      }
    }
  }]);

  return VolumeLayer;
}(Layer);

module.exports = VolumeLayer;

},{"../../element/HistogramBar":17,"../../layer/Layer":24,"underscore":6}],35:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _ = require("underscore");
var Layer = require("../../layer/Layer");

var _default_config = {
  highInput: "high",
  lowInput: "low",
  volumeInput: "volume",
  relativeWidth: 0.3333,
  vertexCount: 120,
  color: "rgba(153, 180, 255, 0.7)"
};

/**
 * Represents a volume profile chart layer.
 * <br><br>
 * @extends layer.Layer
 * @memberof layer.indicator
 */

var VolumeProfileLayer = function (_Layer) {
  _inherits(VolumeProfileLayer, _Layer);

  /**
   * Instantiate VolumeProfileLayer
   * @constructor
   * @param {Object} config
   */

  function VolumeProfileLayer(config) {
    _classCallCheck(this, VolumeProfileLayer);

    config = _.extend({}, _default_config, config);
    return _possibleConstructorReturn(this, Object.getPrototypeOf(VolumeProfileLayer).call(this, config));
  }

  /**
   * Render layer onto canvas
   * @param {timeseries.TimeSeriesData} data
   * @param {number} count
   * @param {number} offset
   * @param {valueToPixel} valueToPixel
   * @param {indexToPixel} indexToPixel
   * @param {timeseries.ValueBounds} value_bounds
   */


  _createClass(VolumeProfileLayer, [{
    key: "draw",
    value: function draw(data, count, offset, valueToPixel, indexToPixel, value_bounds) {

      var context = this._getContext();
      var field_map = data.getFieldMap();
      var data_arr = data.getRawData();
      this.elements = [];

      var vertex_count = this.vertexCount;
      var min = value_bounds.min;
      var max = value_bounds.max;
      var range = max - min;
      var pixel_width = this.profileWidth || this.getDrawingWidth() * this.relativeWidth;
      var pixel_height = this.getHeight();
      var bar_width = pixel_height / vertex_count;
      var half_bar_width = bar_width * 0.5;
      var hist = [];
      var high_field = field_map[this.highInput];
      var low_field = field_map[this.lowInput];
      var volume_field = field_map[this.volumeInput];

      var max_value = 0;

      for (var i = 0; i < vertex_count; i++) {
        hist[i] = 0;
      }

      for (i = offset >= 0 ? offset : 0; i < offset + count && i < data_arr.length; i++) {
        var dat = data_arr[i];
        var high = dat[high_field],
            low = dat[low_field],
            vol = dat[volume_field];

        var hist_index_low = Math.floor((low - min) / range * vertex_count); // e.g. (4475 - 4450) / 2000 * 20 = floor(0.25) = 0
        var hist_index_high = Math.floor((high - min) / range * vertex_count);

        var vol_fract = 1 / (hist_index_high - hist_index_low + 1);

        for (var h = hist_index_low; h <= hist_index_high; h++) {
          hist[h] += Math.round(vol * vol_fract);
        }
      }

      for (var j = 0; j < vertex_count; j++) {
        if (hist[j] > max_value) {
          max_value = hist[j];
        }
      }

      context.fillStyle = this.color;
      context.beginPath();
      context.moveTo(0, pixel_height);

      for (j = 0; j < vertex_count; j++) {
        var val = hist[j];

        var x = val / max_value * pixel_width;
        var y = pixel_height - (j + 1) / vertex_count * pixel_height * 1.0; // index + 1 because we flip y

        context.lineTo(x, y + half_bar_width);
        context.lineTo(x, y - half_bar_width);
      }

      context.lineTo(0, 0);
      context.closePath();
      context.fill();
    }
  }]);

  return VolumeProfileLayer;
}(Layer);

module.exports = VolumeProfileLayer;

},{"../../layer/Layer":24,"underscore":6}],36:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Component = require("../core/Component");

/**
 * Represents a chart panel.
 * <br><br>
 * @extends core.Component
 * @memberof panel
 */

var Panel = function (_Component) {
  _inherits(Panel, _Component);

  /**
   * Instantiate Panel
   * @constructor
   * @param {object} config
   */

  function Panel(config) {
    _classCallCheck(this, Panel);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Panel).call(this, config));
  }

  /**
   * Get class name of underlying HTMLElement
   * @returns {string}
   */


  _createClass(Panel, [{
    key: "getClassName",
    value: function getClassName() {
      return _get(Object.getPrototypeOf(Panel.prototype), "getClassName", this).call(this) + " panel";
    }

    /**
     * Get panel width
     * @returns {number} Width in pixels
     */

  }, {
    key: "getWidth",
    value: function getWidth() {
      return this.getParentChart().getWidth();
    }

    /**
     * Get panel drawing width
     * @returns {number} Drawing width in pixels
     */

  }, {
    key: "getDrawingWidth",
    value: function getDrawingWidth() {
      return this.getParentChart().getDrawingWidth();
    }
  }]);

  return Panel;
}(Component);

module.exports = Panel;

},{"../core/Component":8}],37:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _ = require("underscore");
var TimePanel = require("../panel/TimePanel");
var TimeLabelsLayer = require("../layer/TimeLabelsLayer");

var _default_config = {
  height: 16,
  crosshair: {
    value: false,
    time: {
      label: true
    }
  }
};

/**
 * Represents a panel, for displaying for the display of time labels.
 * <br><br>
 * @extends panel.TimePanel
 * @memberof panel
 */

var TimeLabelsPanel = function (_TimePanel) {
  _inherits(TimeLabelsPanel, _TimePanel);

  /**
   * Instantiate TimeLabelsPanel
   * @constructor
   * @param {Object} config
   */

  function TimeLabelsPanel(config) {
    _classCallCheck(this, TimeLabelsPanel);

    config = _.extend({}, _default_config, config);
    return _possibleConstructorReturn(this, Object.getPrototypeOf(TimeLabelsPanel).call(this, config));
  }

  /**
   * Initialize layers
   * <br><br>
   * This must be invoked.
   */


  _createClass(TimeLabelsPanel, [{
    key: "initLayers",
    value: function initLayers() {

      this.primaryLayer = this.primaryLayer || new TimeLabelsLayer({
        timeGrid: this.getParentChart().getTimeGrid()
      });
      this.primaryLayer.setParentComponent(this);
    }

    /**
     * Get class name of underlying HTMLElement
     * @returns {string}
     */

  }, {
    key: "getClassName",
    value: function getClassName() {
      return _get(Object.getPrototypeOf(TimeLabelsPanel.prototype), "getClassName", this).call(this) + " timelabelspanel";
    }
  }]);

  return TimeLabelsPanel;
}(TimePanel);

module.exports = TimeLabelsPanel;

},{"../layer/TimeLabelsLayer":27,"../panel/TimePanel":38,"underscore":6}],38:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _ = require("underscore");
var Panel = require("../panel/Panel");
var TimeGridLayer = require("../layer/TimeGridLayer");

var _default_config = {};

/**
 * Represents a panel with time axis.
 * <br><br>
 * @extends panel.Panel
 * @memberof panel
 */

var TimePanel = function (_Panel) {
  _inherits(TimePanel, _Panel);

  /**
   * Instantiate TimePanel
   * @constructor
   * @param {Object} config
   */

  function TimePanel(config) {
    _classCallCheck(this, TimePanel);

    config = _.extend({}, _default_config, config);
    return _possibleConstructorReturn(this, Object.getPrototypeOf(TimePanel).call(this, config));
  }

  /**
   * Set primary layer
   * <br><br>
   * This must be invoked before initLayers.
   * @param {layer.Layer} layer
   */


  _createClass(TimePanel, [{
    key: "setPrimaryLayer",
    value: function setPrimaryLayer(layer) {
      this.primaryLayer = layer;
      this.primaryLayer.setParentComponent(this);
    }

    /**
     * Initialize layers
     * <br><br>
     * This must be invoked.
     */

  }, {
    key: "initLayers",
    value: function initLayers() {

      if (this.grid) {
        // time grid
        this.time_grid_layer = this.time_grid_layer || new TimeGridLayer({
          timeGrid: this.getParentChart().getTimeGrid()
        });
        this.time_grid_layer.setParentComponent(this);
      }

      this.primaryLayer.setParentComponent(this);
    }

    /**
     * Get class name of underlying HTMLElement
     * @returns {string}
     */

  }, {
    key: "getClassName",
    value: function getClassName() {
      return _get(Object.getPrototypeOf(TimePanel.prototype), "getClassName", this).call(this) + " timepanel";
    }

    /**
     * Create HTMLElement
     * <br><br>
     * Overrides method of super.
     * @returns {external.HTMLCanvasElement}
     */

  }, {
    key: "createElement",
    value: function createElement() {
      var canvas = window.document.createElement("CANVAS");
      canvas.className = this.getClassName();
      canvas.setAttribute("width", this.getWidth());
      canvas.setAttribute("height", this.getHeight());
      return canvas;
    }

    /**
     * Refresh canvas width and height
     * @private
     */

  }, {
    key: "_refresh",
    value: function _refresh() {
      var canvas = this.getEl();
      canvas.setAttribute("width", this.getWidth());
      canvas.setAttribute("height", this.getHeight());
    }

    /**
     * Get canvas context
     * @returns {CanvasRenderingContext2D}
     */

  }, {
    key: "getContext",
    value: function getContext() {
      return this.getEl().getContext("2d");
    }

    /**
     * Precompute all layers.
     * <br><br>
     * This is invoked before draw().
     * @param {timeseries.TimeSeriesData}
     */

  }, {
    key: "precompute",
    value: function precompute(data) {

      if (this.primaryLayer.precompute) {
        this.primaryLayer.precompute(data);
      }

      var layers = this.getAllLayers();
      for (var i = 0; i < layers.length; i++) {
        var layer = layers[i];
        if (layer.precompute) {
          layer.precompute(data);
        }
      }
    }

    /**
     * Draw all layers.
     * @param {timeseries.TimeSeriesData} data
     * @param {number} count
     * @param {number} offset
     * @param {indexToPixel} indexToPixel
     */

  }, {
    key: "draw",
    value: function draw(data, count, offset, indexToPixel) {
      var layers = this.getAllLayers();
      this._refresh();

      // Draw grid
      if (this.grid) {
        // time grid
        this.time_grid_layer = this.time_grid_layer || new TimeGridLayer({});

        this.time_grid_layer.draw(data, count, offset, null, indexToPixel, null);
      }

      for (var i = 0; i < layers.length; i++) {
        var layer = layers[i];
        if (layer.draw) {
          layer.draw(data, count, offset, null, indexToPixel, null);
        }
      }

      // Draw primary layer
      this.primaryLayer.draw(data, count, offset, null, indexToPixel, null);
    }
  }]);

  return TimePanel;
}(Panel);

module.exports = TimePanel;

},{"../layer/TimeGridLayer":26,"../panel/Panel":36,"underscore":6}],39:[function(require,module,exports){
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _ = require("underscore");
var TimePanel = require("../panel/TimePanel");
var TimeGridLayer = require("../layer/TimeGridLayer");
var ValueGridLayer = require("../layer/ValueGridLayer");

var _default_config = {
  paddingTop: 10,
  paddingBottom: 10,
  primaryAtBack: false
};

/**
 * Represents a panel with time and value axis.
 * <br><br>
 * @extends panel.TimePanel
 * @memberof panel
 */

var TimeValuePanel = function (_TimePanel) {
  _inherits(TimeValuePanel, _TimePanel);

  /**
   * Instantiate TimeValuePanel
   * @constructor
   * @param {Object} config
   */

  function TimeValuePanel(config) {
    _classCallCheck(this, TimeValuePanel);

    config = _.extend({}, _default_config, config);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(TimeValuePanel).call(this, config));

    _this._pixelToValue = function () {
      return 0.0;
    };
    _this.drawingHeight = Math.round(_this.getHeight() - (_this.paddingTop + _this.paddingBottom));
    return _this;
  }

  /**
   * Initialize layers
   * <br><br>
   * This must be invoked.
   */


  _createClass(TimeValuePanel, [{
    key: "initLayers",
    value: function initLayers() {

      if (this.grid) {
        var value_lines;
        if (_typeof(this.grid) === "object" && this.grid.value) {
          value_lines = this.grid.value.lines;
        }

        // value grid
        this.value_grid_layer = this.value_grid_layer || new ValueGridLayer({
          labelWidth: this.getParentChart().getPaddingRight(),
          lines: value_lines
        });
        this.value_grid_layer.setParentComponent(this);

        // time grid
        this.time_grid_layer = this.time_grid_layer || new TimeGridLayer({
          timeGrid: this.getParentChart().getTimeGrid()
        });
        this.time_grid_layer.setParentComponent(this);
      }

      this.primaryLayer.setParentComponent(this);
    }

    /**
     * Get class name of underlying HTMLElement
     * @returns {string}
     */

  }, {
    key: "getClassName",
    value: function getClassName() {
      return _get(Object.getPrototypeOf(TimeValuePanel.prototype), "getClassName", this).call(this) + " timevaluepanel";
    }

    /**
     * Get drawing height
     * @returns {number}
     */

  }, {
    key: "getDrawingHeight",
    value: function getDrawingHeight() {
      return this.drawingHeight;
    }

    /**
     * Draw all layers.
     * @param {timeseries.TimeSeriesData} data
     * @param {number} count
     * @param {number} offset
     * @param {indexToPixel} indexToPixel
     */

  }, {
    key: "draw",
    value: function draw(data, count, offset, indexToPixel) {
      var value_bounds = data.findValueBounds(count, offset, this.getMinAndMaxFields(), this.getMinAndMaxValues());
      var valueToPixel = this.getValueToPixelMapper(value_bounds, true);
      this._pixelToValue = this.getPixelToValueMapper(value_bounds, true);
      var layers = this.getAllLayers();
      this._refresh();

      // Draw grid
      if (this.grid) {
        if (this.value_grid_layer) {
          this.value_grid_layer.draw(data, count, offset, valueToPixel, indexToPixel, value_bounds);
        }
        if (this.time_grid_layer) {
          this.time_grid_layer.draw(data, count, offset, valueToPixel, indexToPixel, value_bounds);
        }
      }

      if (this.primaryAtBack === true) {
        // Draw primary layer
        this.primaryLayer.draw(data, count, offset, valueToPixel, indexToPixel, value_bounds);
      }

      // Draw overlays
      for (var i = 0; i < layers.length; i++) {
        var layer = layers[i];
        if (layer.draw) {
          layer.draw(data, count, offset, valueToPixel, indexToPixel, value_bounds);
        }
      }

      if (this.primaryAtBack === undefined || this.primaryAtBack !== true) {
        // Draw primary layer
        this.primaryLayer.draw(data, count, offset, valueToPixel, indexToPixel, value_bounds);
      }
    }

    /**
     * Get minimum and maximum fields for this panel.
     * @returns {timeseries.MinAndMaxFields}
     */

  }, {
    key: "getMinAndMaxFields",
    value: function getMinAndMaxFields() {
      return {
        min: this.primaryLayer.getMinField(),
        max: this.primaryLayer.getMaxField()
      };
    }

    /**
     * Get minimum and maximum values for this panel.
     * @returns {timeseries.MinAndMaxValues}
     */

  }, {
    key: "getMinAndMaxValues",
    value: function getMinAndMaxValues() {
      return {
        min: this.primaryLayer.getMinValue(),
        max: this.primaryLayer.getMaxValue()
      };
    }

    /**
    * valueToPixel
    * @callback valueToPixel
    * @param {number} value
    * @returns {number} y-value expressed in unit pixels
    */

    /**
     * Get value to pixel mapper function
     * @param {timeseries.ValueBounds} value_bounds
     * @param {boolean} flip
     * @returns {valueToPixel} function
     */

  }, {
    key: "getValueToPixelMapper",
    value: function getValueToPixelMapper(value_bounds, flip) {
      var val_min = value_bounds.min;
      var val_max = value_bounds.max;
      var val_range = val_max - val_min;
      var px_height = this.getDrawingHeight();
      var px_padding_offset = this.paddingTop;
      var mapFunc;
      if (flip === true) {
        mapFunc = function mapFunc(val) {
          return px_height - (val - val_min) / val_range * px_height + px_padding_offset;
        };
      } else {
        mapFunc = function mapFunc(val) {
          return (val - val_min) / val_range * px_height - px_padding_offset;
        };
      }
      return mapFunc;
    }

    /**
    * pixelToValue
    * @callback pixelToValue
    * @param {number} y-value expressed in unit pixels
    * @returns {number} value corresponding to time series data
    */

    /**
     * Get pixel to vallue mapper function
     * @param {timeseries.ValueBounds} value_bounds
     * @param {boolean} flip
     * @returns {pixelToValue}
     */

  }, {
    key: "getPixelToValueMapper",
    value: function getPixelToValueMapper(value_bounds, flip) {
      var val_min = value_bounds.min;
      var val_max = value_bounds.max;
      var val_range = val_max - val_min;
      var px_height = this.getDrawingHeight();
      var px_padding_offset = this.paddingTop;
      var mapFunc;
      if (flip === true) {
        mapFunc = function mapFunc(px) {
          return (px_height - (px - px_padding_offset)) / px_height * val_range + val_min;
        };
      } else {
        mapFunc = function mapFunc(px) {
          return (px + px_padding_offset) / px_height * val_range + val_min;
        };
      }
      return mapFunc;
    }
  }, {
    key: "pixelToValue",
    value: function pixelToValue(px) {
      return this._pixelToValue(px);
    }
  }]);

  return TimeValuePanel;
}(TimePanel);

module.exports = TimeValuePanel;

},{"../layer/TimeGridLayer":26,"../layer/ValueGridLayer":28,"../panel/TimePanel":38,"underscore":6}],40:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _ = require("underscore");
var Type = require("../core/Type");

var _default_config = {};

/**
 * Represents a time series data point, where properties will be for price and volume.
 * @typedef {Object} DataPoint
 * @memberof timeseries
 */

/**
 * Used to map OHLCV data point properties.
 * @typedef {Object} FieldMap
 * @property {string} time Name of time field.
 * @property {string} open Name of open field.
 * @property {string} high Name of high field.
 * @property {string} low Name of low field.
 * @property {string} close Name of close field.
 * @property {string} volume Name of volume field.
 * @memberof timeseries
 */

/**
 * @typedef {Object} ValueBounds
 * @property {number} min
 * @property {number} max
 * @memberof timeseries
 */

/**
 * @typedef {Object} MinAndMaxFields
 * @property {(string|undefined)} min
 * @property {(string|undefined)} max
 * @memberof timeseries
 */

/**
 * @typedef {Object} MinAndMaxValues
 * @property {number|undefined} min
 * @property {number|undefined} max
 * @memberof timeseries
 */

/**
 * The time series data that is represented graphically in the chart panels.
 * <br><br>
 * @extends core.Type
 * @memberof timeseries
 */

var TimeSeriesData = function (_Type) {
  _inherits(TimeSeriesData, _Type);

  /**
   * Instantiate TimeSeriesData
   * @constructor
   * @param {timeseries.DataPoint[]} raw_data
   * @param {timeseries.FieldMap} field_map
   * @param {string} symbol
   * @param {string} gran
   * @param {Object} config
   */

  function TimeSeriesData(raw_data, field_map, symbol, gran, config) {
    _classCallCheck(this, TimeSeriesData);

    config = _.extend({}, _default_config, config);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(TimeSeriesData).call(this, config));

    _this._raw_data = raw_data;
    _this._field_map = field_map;
    _this._symbol = symbol;
    _this._granularity = gran;
    _this._initTimeToIndexMap();
    return _this;
  }

  /**
   * Initialize time-to-index map.
   * @private
   */


  _createClass(TimeSeriesData, [{
    key: "_initTimeToIndexMap",
    value: function _initTimeToIndexMap() {
      this._time_to_index_map = {};
      for (var i = 0; i < this._raw_data.length; i++) {
        var dat = this._raw_data[i];
        var time = dat[this._field_map.time];
        this._time_to_index_map[time] = i;
      }
    }

    /**
     * Get data array, that was originally provided in the constructor.
     * @returns {timeseries.DataPoint[]}
     */

  }, {
    key: "getRawData",
    value: function getRawData() {
      return this._raw_data;
    }

    /**
     * Get field map, that was originally provided in the constructor.
     * @returns {timeseries.FieldMap}
     */

  }, {
    key: "getFieldMap",
    value: function getFieldMap() {
      return this._field_map;
    }

    /**
     * Get symbol
     * @returns {string}
     */

  }, {
    key: "getSymbol",
    value: function getSymbol() {
      return this._symbol;
    }

    /**
     * Get granularity
     * @returns {string}
     */

  }, {
    key: "getGranularity",
    value: function getGranularity() {
      return this._granularity;
    }

    /**
     * Deduce minimum and maximum values of in range data.
     * <br><br>
     * Minimum and maximum values can be explicity given, otherwise field names.
     * Where no minimum is provided, zero will be assumed.
     * @param {number} count
     * @param {number} offset
     * @param {timeseries.MinAndMaxFields} min_and_max_fields
     * @param {timeseries.MinAndMaxValues} min_and_max_values
     * @returns {timeseries.ValueBounds}
     */

  }, {
    key: "findValueBounds",
    value: function findValueBounds(count, offset, min_and_max_fields, min_and_max_values) {

      var data_arr = this._raw_data;
      var index_start = offset;
      var index_end = count + offset - 1;

      if (index_start < 0) {
        index_start = 0;
      }
      if (index_end >= data_arr.length) {
        index_end = data_arr.length - 1;
      }

      var min_field = min_and_max_fields.min;
      var max_field = min_and_max_fields.max;
      var min_value = min_and_max_values.min;
      var max_value = min_and_max_values.max;
      var minimum = 99999999,
          maximum = -99999999;
      var i, dat;

      // Deduce minimum value
      if (min_value !== undefined) {
        minimum = min_value;
      } else if (min_field !== undefined) {
        var min_field_name = this._field_map[min_field];
        for (i = index_start; i <= index_end; i++) {
          dat = data_arr[i];
          var min = dat[min_field_name]; // e.g. low
          if (min < minimum) {
            minimum = min;
          }
        }
      } else {
        minimum = 0;
      }

      // Deduce maximum value
      if (max_value !== undefined) {
        maximum = max_value;
      } else if (max_field !== undefined) {
        var max_field_name = this._field_map[max_field];
        for (i = index_start; i <= index_end; i++) {
          dat = data_arr[i];
          var max = dat[max_field_name]; // e.g. low
          if (max > maximum) {
            maximum = max;
          }
        }
      }

      return {
        min: minimum,
        max: maximum
      };
    }
  }]);

  return TimeSeriesData;
}(Type);

module.exports = TimeSeriesData;

},{"../core/Type":11,"underscore":6}]},{},[1])