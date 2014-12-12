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

	// Build li DOM & set event on
	var collapseBtn = DOM.buildNode({ el: 'button', kid: 'collapse', _disabled: !hasChildren, _className: 'collapse-btn', on_click: function() {
		li.classList.add('collapsed');
		data.collapsed = true;
		updateStore();
	} });
	var li = DOM.buildNode({ el: 'li', kids: [
		collapseBtn,
		{ el: 'button', kid: 'expand', _className: 'expand-btn', on_click: function() {
			li.classList.remove('collapsed');
			data.collapsed = false;
			updateStore();
		} },
		{ el: 'span', _contentEditable: true, kid: data.text, on_input: function() {
			data.text = this.textContent;
			updateStore();
		} },
		{ el: 'button', _className: 'btn add-child-btn', kid: 'Add Child', on_click: function() {
			if (!data.children) data.children = [];
			if (!this.nextElementSibling.nextElementSibling) childrenList = li.appendChild(renderList());
			addChild(childrenList, data.children);
			collapseBtn.disabled = false;
			li.classList.add('has-children');
		} },
		{ el: 'button', _className: 'btn remove-btn', kid: 'Delete item', on_click: function() {
			// remove from model
			var index = parentArray.indexOf(data);
			parentArray.splice(index, 1);
			updateStore();

			// update view
			if (!parentArray.length) li.parentNode.parentNode.classList.remove('has-children');
			li.parentNode.removeChild(li);
		} }
	].concat(childrenList ? [childrenList] : []) });

	if (hasChildren) li.classList.add('has-children');
	if (data.collapsed) li.classList.add('collapsed');

	return li;
}

roots.forEach(function(rootData, i, array) {
	var rootEl = renderTreeNode(rootData, i, array);
	treeList.appendChild(rootEl);
});

on(qs('#add-root-btn'), 'click', function() {
	addChild(treeList, roots);
});

/*
{
	'root 1': {
		'child 1 of root 1': {}
	},
	'root 2': {}
}

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