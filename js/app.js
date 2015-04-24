function updateStore() {
	storage.set('tree_roots', roots);
}

// Accepts a list element (ul or ol)
// and a list of objects for the existing children
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
	var titleEl = getMatching(li.children, '.title-wrap').firstChild;
	selectContents(titleEl);
}


function renderTreeNode(data, i, parentArray) {
	// Build li DOM & set up events
	var childList = DOM.buildNode({ el: 'ol', kids: (data.children || []).map(renderTreeNode) });
	var li = DOM.buildNode({ el: 'li', kids: [
		{ el: 'button', _className: 'mini-btn collapse-btn', kid: 'collapse', on_click: collapse },
		{ el: 'button', _className: 'mini-btn expand-btn', kid: 'expand', on_click: expand },
		{ _className: 'handle' },
		{ _className: 'title-wrap', kid:
			{ el: 'span', _className: 'title', _contentEditable: true, kid: data.text, on_input: textEdit },
		},
		{ el: 'button', _className: 'btn mini-btn add-child-btn', kid: 'Add child', on_click: addClick },
		{ el: 'button', _className: 'btn mini-btn remove-btn', kid: 'Delete item', on_click: removeClick },
		childList
	]});

	if (data.children && data.children.length) li.classList.add('has-children');
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
		addChild(childList, data.children);
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