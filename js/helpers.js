

// Array helpers:

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

function arrFindAll(arr, queryObj) {
	var matchingObjects = [];
	var numObjects = arr.length;
	for (var i = 0; i < numObjects; i++) {
		if (objMatches(arr[i], queryObj)) matchingObjects.push(arr[i]);
	}
	return matchingObjects;
}

function arrFind(arr, queryObj) {
	var numObjects = arr.length;
	search:
	for (var i = 0; i < numObjects; i++) {
		if (objMatches(arr[i], queryObj)) return arr[i];
		continue search;
	}
}

function arrInsert(arr, item, i) {
	arr.splice(i, 0, item);
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


function objMatches(obj, queryObj) {
	for (var key in queryObj) {
		if (queryObj[key] !== obj[key]) return false;
	}
	return true;
}