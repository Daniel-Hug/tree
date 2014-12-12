// Loop helpers:
function each(arr, fn, scope) {
	for (var i = 0, l = arr.length; i < l; i++) {
		fn.call(scope, arr[i], i, arr);
	}
}

function map(arr, fn, scope) {
	var newArr = [];
	for (var i = 0, l = arr.length; i < l; i++) {
		newArr.push(fn.call(scope, arr[i], i, arr));
	}
	return newArr;
}


// localStorage wrapper:
var storage = {
	get: function(prop) {
		return JSON.parse(localStorage.getItem(prop));
	},
	set: function(prop, val) {
		localStorage.setItem(prop, JSON.stringify(val));
	},
	has: function(prop) {
		return localStorage.hasOwnProperty(prop);
	},
	remove: function(prop) {
		localStorage.removeItem(prop);
	},
	clear: function() {
		localStorage.clear();
	}
};


// Get elements by CSS selector
function qsa(selector, scopeEl) {
	return (scopeEl || document).querySelectorAll(selector);
}
function qs(selector, scopeEl) {
	return (scopeEl || document).querySelector(selector);
}

// addEventListener wrapper:
function on(target, type, callback) {
	target.addEventListener(type, callback, false);
}

var el = document.createElement.bind(document);