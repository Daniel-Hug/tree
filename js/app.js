/* roots data structure:
[
	{
		text: 'root 1',
		children: [{
			text: 'child 1 of root 1'
		}]
	}, {
		text: 'root 2'
	}
]
*/

var roots = storage.get('tree_roots') || [];
var treeList = qs('#tree');

function updateStore() {
	storage.set('tree_roots', roots);
}

function renderList(items) {
	return DOM.buildNode({ el: 'ol', kids: items || [] });
}

function addChild(list, children) {
	// setup data
	var numListItems = children.length;
	var name = list.parentNode === document.body ? 'Root' : 'Child';
	var text = name + ' ' + (children.length + 1);
	var childData = { text: text };

	children.push(childData);
	updateStore();
	list.appendChild(renderTreeNode(childData, children.length - 1, children));
}


function renderTreeNode(data, i, parentArray) {
	var childrenList = data.children ? renderList(data.children.map(renderTreeNode)) : null;
	var hasChildren = data.children && data.children.length;

	// Build li DOM & set up events
	var li = DOM.buildNode({ el: 'li', kids: [
		{ el: 'button', _className: 'mini-btn collapse-btn', kid: 'collapse', on_click: collapse },
		{ el: 'button', _className: 'mini-btn expand-btn', kid: 'expand', on_click: expand },
		{ el: 'span', _contentEditable: true, kid: data.text, on_input: textEdit },
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

	return li;
}

roots.forEach(function(rootData, i, array) {
	var rootEl = renderTreeNode(rootData, i, array);
	treeList.appendChild(rootEl);
});

on(qs('#add-root-btn'), 'click', function() {
	addChild(treeList, roots);
});