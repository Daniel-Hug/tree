

/*========================================*\
  actionable helpers
\*========================================*/

// addEventListener wrapper:
function on(target, type, callback) {
	target.addEventListener(type, callback, false);
}

function selectContents(el) {
	var range = document.createRange();
	range.selectNodeContents(el);
	var sel = window.getSelection();
	sel.removeAllRanges();
	sel.addRange(range);
}




/*========================================*\
  returning helpers
\*========================================*/

// Get element(s) by CSS selector
function qsa(selector, scopeEl) {
	return (scopeEl || document).querySelectorAll(selector);
}
function qs(selector, scopeEl) {
	return (scopeEl || document).querySelector(selector);
}

function getMatching(elCollection, selector) {
	var numChildren = elCollection.length;
	for (var i = 0; i < numChildren; i++) {
		if (elCollection[i].matches(selector)) return elCollection[i];
	}
}

function getElIndex(el) {
	for (var i = 0; (el = el.previousElementSibling); i++);
	return i;
}



// Returns position of list item in nested list as an array of indices:
//
// example:
//
// ul
//   ...
//   li#anscestor
//     ul
//       li
//         ul
//           li
//           li#descendant
//           li
//       li
//
// getElPos($('#anscestor'), $('#descendant'))
// => [0, 1]
//
function getElPos(anscestor, descendant) {
	if (!anscestor.contains(descendant)) return null;
	var elPos = [];
	var parent = descendant;
	var tagName = descendant.tagName;
	do {
		for (var i = 0; i < 3 && parent.tagName !== tagName; i++) parent = parent.parentNode;
		elPos.unshift(getElIndex(parent));
		parent = parent.parentNode;
	}
	while (parent !== anscestor);
	return elPos;
}