
// feature flags

var featureFlags = queryObj().ff;
featureFlags = featureFlags ? featureFlags.split(',') : [];

var ff = {};
featureFlags.forEach(function(name) {
	ff[name] = true;
	document.documentElement.classList.add('ff-' + name);
});



function atPos(arr, pos, cb) {
	var depth = pos.length;
	for (var i = 1; i < depth; i++) {
		arr = arr[pos[i]].children;
	}
	cb(arr, pos[i]);
}

var roots = storage.get('tree_roots') || [];
var treeList = qs('#tree');
var dragList = new DragList({
	ondrop: function(li, oldParentList, oldI) {
		// remove object from current place in roots
		if (oldParentList === tree) {
			roots.splice(oldI, 1);
		} else {
			var oldPos = getElPos(treeList, oldParentList.parentNode).concat[oldI];
			atPos(roots, oldPos, function(arr, i) {
				arr.splice(i, 1);
			});
		}

		// move object to new place in roots
		var newPos = getElPos(treeList, li);
		atPos(roots, newPos, function(arr, i) {
			arrInsert(arr, elAndObjMap[li.id], i);
		});
		//updateStore();
	}
});

function updateStore() {
	storage.set('tree_roots', roots);
}

function renderList(items) {
	return DOM.buildNode({ el: 'ol', kids: items || [] });
}

var elAndObjMap = {};
function addChild(list, children) {
	// setup data
	var numListItems = children.length;
	var name = list.parentNode === document.body ? 'Root' : 'Child';
	var text = name + ' ' + (children.length + 1);
	var childData = { text: text };

	// update model
	children.push(childData);
	updateStore();

	// create and append li
	var li = renderTreeNode(childData, children.length - 1, children);
	list.appendChild(li);

	// select item title
	var titleEl = getMatching(li.children, '.title');
	selectContents(titleEl);
}


function renderTreeNode(data, i, parentArray) {
	var childrenList = data.children ? renderList(data.children.map(renderTreeNode)) : null;
	var hasChildren = data.children && data.children.length;

	var id = uid();
	elAndObjMap[id] = data;

	// Build li DOM & set up events
	var li = DOM.buildNode({ el: 'li', id: id, kids: [
		{ el: 'button', _className: 'mini-btn collapse-btn', kid: 'collapse', on_click: collapse },
		{ el: 'button', _className: 'mini-btn expand-btn', kid: 'expand', on_click: expand },
		{ _className: 'dl-handle' },
		{ el: 'span', _className: 'item-title', _contentEditable: true, kid: data.text, on_input: textEdit },
		{ el: 'button', _className: 'btn mini-btn add-child-btn', kid: 'Add child', on_click: addClick },
		{ el: 'button', _className: 'btn mini-btn remove-btn', kid: 'Delete item', on_click: removeClick }
	].concat(childrenList ? [childrenList] : []) });

	if (hasChildren) li.classList.add('has-children');
	if (data.collapsed) li.classList.add('collapsed');

	// event handlers
	function collapse() {
		li.classList.add('collapsed');
		data.collapsed = true;
		updateStore();
	}

	function expand() {
		li.classList.remove('collapsed');
		data.collapsed = false;
		updateStore();
	}

	function textEdit() {
		data.text = this.textContent;
		updateStore();
	}

	function addClick() {
		if (!data.children) data.children = [];
		if (!this.nextElementSibling.nextElementSibling) childrenList = li.appendChild(renderList());
		addChild(childrenList, data.children);
		li.classList.add('has-children');
	}

	function removeClick() {
		// remove from model
		var index = parentArray.indexOf(data);
		parentArray.splice(index, 1);
		updateStore();

		// update view
		if (!parentArray.length) li.parentNode.parentNode.classList.remove('has-children');
		li.parentNode.removeChild(li);
	}

	dragList.addItem(li);

	return li;
}

roots.forEach(function(rootData, i, array) {
	var rootEl = renderTreeNode(rootData, i, array);
	treeList.appendChild(rootEl);
});

on(qs('#add-root-btn'), 'click', function() {
	addChild(treeList, roots);
});