
// feature flags

var featureFlags = queryObj().ff;
featureFlags = featureFlags ? featureFlags.split(',') : [];

var ff = {};
featureFlags.forEach(function(name) {
	ff[name] = true;
	document.documentElement.classList.add('ff-' + name);
});


// get roots array from localStorage
var roots = storage.get('tree_roots') || [];

// grab list
var treeList = qs('#tree');

// render all the roots
renderMultiple(treeList, roots, renderTreeNode);

// make all items sortable
$(treeList).sortable({
	group: 'tree',
	handle: '.handle'
});

// Make the "add root" button work
on(qs('#add-root-btn'), 'click', function() {
	var newRootData = { text: 'Root ' + (roots.length + 1) };
	addChild(treeList, roots, newRootData);
});