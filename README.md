Promises/A Plus
===============

Promises/A Plus Implementation

*It fulfill Promises/A Plus pattern completely, and it's rather simple and with high performance.*

```
	var Promise = require('promises-pattern').Promises;
	
	var p = new Promise(function (rejectedReason) {
		console.log('You rejected me with: ' + rejectedReason);
	}, function (function (fulfillValue)) {
		console.log('You fulfill me with: ' + fulfillValue);
	});
	p.then(onRejected, onResolved).then(...)...;
	
	p.resolve('Good guy!');
	//or
	p.reject('Oh...');

```

It's very simple to use. 

see the Promises/A Plus Spec here: http://promises-aplus.github.io/promises-spec/

It also provide a lite version with extramely high performance, just about thirty lines of code.

```
	var PromiseLite = require('promises-pattern').PromisesLite;
```
