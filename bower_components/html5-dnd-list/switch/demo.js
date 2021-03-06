/*global DragList */
(function() {
	'use strict';

	var colsDragList = new DragList({
		itemEls: document.querySelector('.switch1').children,
		handleSelector: ':scope > header',
		ondrop: function(srcEl) {
			// Set number of times the column has been moved.
			var newCount = parseInt(srcEl.getAttribute('data-col-moves')) + 1;
			srcEl.setAttribute('data-col-moves', newCount);
			srcEl.lastChild.data = 'moves: ' + newCount;
		},
		action: 'switch'
	});
})();