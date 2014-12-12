var roots = storage.get('tree_roots') || [];
var treeList = qs('#tree');

function addNode() {
	var	isRoot = this.parentNode === document.body;
	var name = isRoot ? 'Root' : 'Child';

	// Build li DOM
	var newNode = el('li');
	var span = el('span');
	var btn = el('button');
	span.textContent = name + ' ' + (treeList.childElementCount + 1);
	span.contentEditable = true;
	btn.textContent = 'Add Child';
	newNode.appendChild(span);
	newNode.appendChild(btn);
	treeList.appendChild(newNode);

	// setup events
	on(btn, 'click', addNode);
}

each(qsa('button'), function(btn) {
	on(btn, 'click', addNode);
});