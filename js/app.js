var roots = storage.get('tree_roots') || [];
var treeList = qs('#tree');

function updateStore() {
	storage.set('tree_roots', roots);
}

function renderList(items) {
	return DOM.buildNode({ el: 'ol', kids: items || [] });
}

function addChild(children) {
	// setup data
	var childrenList = this.nextElementSibling || this.parentNode.appendChild(renderList());
	var numListItems = childrenList ? childrenList.childElementCount : 0;
	var name = this.parentNode === document.body ? 'Root' : 'Child';
	var text = name + ' ' + (numListItems + 1);
	var childData = { text: text };

	children.push(childData);
	updateStore();
	childrenList.appendChild(renderTreeNode(childData));
}

function renderTreeNode(data) {
	var childrenList = data.children ? [renderList(data.children.map(renderTreeNode))] : [];
	var hasChildren = data.children && data.children.length;

	// Build li DOM & set event on 
	var collapseBtn = DOM.buildNode({ el: 'button', kid: 'collapse', _disabled: !hasChildren, _className: 'collapse-btn', on_click: function() {
		li.classList.add('collapsed');
	} });
	var li = DOM.buildNode({ el: 'li', kids: [
		collapseBtn,
		{ el: 'button', kid: 'expand', _className: 'expand-btn', on_click: function() {
			li.classList.remove('collapsed');
		} },
		{ el: 'span', _contentEditable: true, kid: data.text, on_input: function() {
			data.text = this.textContent;
			updateStore();
		} },
		{ el: 'button', _className: 'btn add-child-btn', kid: 'Add Child', on_click: function() {
			if (!data.children) data.children = [];
			addChild.call(this, data.children);
			collapseBtn.disabled = false;
			li.classList.add('has-children');
		} }
	].concat(childrenList) });

	if (hasChildren) li.classList.add('has-children');

	return li;
}

roots.forEach(function(rootData) {
	var rootEl = renderTreeNode(rootData);
	treeList.appendChild(rootEl);
});

on(qs('#add-root-btn'), 'click', function() {
	addChild.call(this, roots);
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