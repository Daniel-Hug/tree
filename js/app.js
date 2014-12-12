var roots = storage.get('tree_roots') || [];

function addNode() {
	var
	list = qs('ul', this.parentNode) || this.parentNode.appendChild(el('ul')),
	isRoot = this.parentNode === document.body,
	name = isRoot ? 'Root' : 'Child',
	newNode = el('li'),
	span = el('span'),
	btn = el('button');
	span.textContent = name + ' ' + (list.childElementCount + 1);
	span.contentEditable = true;
	btn.textContent = 'Add Child';
	newNode.appendChild(span);
	newNode.appendChild(btn);
	list.appendChild(newNode);
	on(btn, 'click', addNode);
	on(btn, 'click', addNode);
}
addNode.call(qs('button'));
each(qsa('button'), function(btn) {
	on(btn, 'click', addNode);
});