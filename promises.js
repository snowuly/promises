module.exports = {Promises: Promises, PromisesLite: PromisesLite};

function Promises (err, done) {
	this.err  = err;
	this.done = done;
	this.nexts = [];
}
Promises.prototype = {
	constructor: Promises,
	state: '', // reject or resolve
	value: null,
	then: function (err, done) {
		var next = new Promises(err, done);
		this.nexts.push(next);
		return next;
	},
	resolve: function (o) {
		process.nextTick(function () { this._do(this.done, 'resolve', o); }.bind(this));
	},
	reject: function (o) {
		process.nextTick(function () { this._do(this.err, 'reject', o); }.bind(this)); 
	},
	isResolved: function () {
		return this.state !== '' && this.state === 'resolve';
	},
	isRejected: function () {
		return this.state !== '' && this.state === 'reject';
	},
	_do: function (fn, type, o) {
		if (this.state) return this.value;

		if (o instanceof Promises) {
			if (o.state) {
				this._do(fn, o.state, o.value);
			} else {
				o.nexts.push(this);
			}
		} else if (o && typeof o.then === 'function') { 
			var p = new Promises();
			p.nexts.push(this);
			o.then(p.resolve, p.rejected);
		} else {
			type = 'resolve';
			if (typeof fn === 'function') {
				try {
					fn = fn(o);
				} catch (e) {
					type = 'reject';
					fn = e;
				}
			}
			
			this.state = type;
			this.value = fn;
			this._notify(type, fn);
		} 
	},
	_notify: function (type, value) {
		var next, nexts = this.nexts;
		while (next = nexts.shift()) {
			next[type](value);
		}
	}
};


function PromisesLite (err, done) {
	this.err  = err;
	this.done = done;
}
PromisesLite.prototype = {
	constructor: PromisesLite,
	then: function (err, done) {
		this.next = new PromisesLite(err, done);
		return this.next;
	},
	resolve: function () {
		process.nextTick(function () {
			this._do.call(this, this.done, 'resolve', arguments).bind(this);
		});
	},
	reject: function () {
		process.nextTick(function () {
			this._do.call(this, this.err, 'reject', arguments).bind(this);
		});
		
	},
	_do: function (fn, type, args) {
		if (args[0] instanceof Promises) {
			args[0].next = this;
		} else {
			if (typeof fn === 'function') {
				try {
					fn = fn.apply(null, args);
				} catch (e) {
					this.next && this.next['reject'](e);
					return;
				}
				
			}
			this.next && this.next['resolve'](fn);
		}
	}
};