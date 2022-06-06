window.addEventListener("load", run);

const isInteger = /^\d+$/;

var appContainer = null;
var blueprintContainer = null;
var ruleContainer = null;

var selectedBlueprint = null;

function run() {
	appContainer = document.getElementById('app');
	appContainer.innerHTML = "";
	
	selectedBlueprint = blueprints[0];

	blueprintContainer = document.createElement('div');
	displayBlueprint(blueprintContainer, selectedBlueprint);
	appContainer.appendChild(blueprintContainer);
	
	ruleContainer = document.createElement('div');
	displayRules(ruleContainer, selectedBlueprint);
	appContainer.appendChild(ruleContainer);
}

function displayBlueprint(blueprintContainer, blueprint) {
	blueprintContainer.innerHTML = "";
	blueprintContainer.style.display = "inline-block";
	const table = generateDefaultBlueprintDisplay(blueprint);
	blueprintContainer.appendChild(table);
	const lines = blueprint.pattern.split('\n');

	//TODO redo this logic with findSegment
	//initialize metric values
	for(let i = 0; i < blueprint.ids.length; i++) {
		const id = blueprint.ids[i];
		let yMin = -1;
		let yMax = -1;
		for(let l = 0; l < lines.length; l++) {
			const line = lines[l];
			let x = line.indexOf(id);
			if(x == -1)
				continue;
			if(yMin == -1)
				yMin = l;
			yMax = l;
			let width = 1;
			while(x + width < line.length && line[x + width] == id) {
				width++;
			}
			blueprint.metrics[id].width = width;
		}
		if(yMin != -1 && yMax != -1) {
			blueprint.metrics[id].height = yMax - yMin + 1;
		}
	}
}

//going to try drawing the basic first, then use edit-in-place
function updateBlueprintDisplay() {
	const table = generateDefaultBlueprintDisplay(selectedBlueprint);

	for(let i = 0; i < selectedBlueprint.ids.length; i++) {
		const id = selectedBlueprint.ids[i];
		const targetWidth = selectedBlueprint.metrics[id].width;
		const targetHeight = selectedBlueprint.metrics[id].height;
		const upperLeft = findSegment(table, id);
		if(upperLeft == null)
			continue; //shouldn't hit this
		const currentSize = calcSegmentSize(table, id, upperLeft);
		if(targetWidth == 0 || targetHeight == 0) {
			//TODO remove segment
			continue;
		}
		while(currentSize.width < targetWidth) {
			for(let r = upperLeft.row; r < upperLeft.row + currentSize.height; r++) {
				const row = table.children[r];
				const modelCell = row.children[upperLeft.col];
				const newCell = modelCell.cloneNode(deep=true);
				row.insertBefore(newCell, modelCell);
			}
			currentSize.width++;
		}
		while(currentSize.width > targetWidth) {
			//TODO decrease by 1
			currentSize.width--;
		}
		while(currentSize.height < targetHeight) {
			//TODO cloning the whole row is not right, there could be unrelated cells there - I really want to push-down the existing cells in their "column"
			//and for that, I'll need connection points so I know what to move with what
			const modelRow = table.children[upperLeft.row];
			const newRow = modelRow.cloneNode(deep=true);
			table.insertBefore(newRow, modelRow);
			currentSize.height++;
		}
		while(currentSize.height > targetHeight) {
			//TODO decrease by 1
			currentSize.height--;
		}
	}
	
	blueprintContainer.innerHTML = "";
	blueprintContainer.appendChild(table);
}

//returns container element
function generateDefaultBlueprintDisplay(blueprint) {
	const table = document.createElement('table');
	const lines = blueprint.pattern.split('\n');
	for(let r = 0; r < lines.length; r++) {
		const row = document.createElement('tr');
		for(let c = 0; c < lines[r].length; c++) {
			const cell = document.createElement('td');
			cell.innerHTML = lines[r][c];
			cell.dataset.id = lines[r][c];
			row.appendChild(cell);
		}
		table.appendChild(row);
	}
	return table;
}

//return {row,col} coordinate of upper-left corner of selected segment
//TODO return array b/c there can be multiple matching segments
function findSegment(table, id) {
	for(let r = 0; r < table.children.length; r++) {
		const row = table.children[r];
		for(let c = 0; c < row.children.length; c++) {
			const cell = row.children[c];
			if(cell.dataset.id == id) {
				return {
					row: r,
					col: c,
				};
			}
		}
	}
	return null;
}

//upperLeft should be the result of findSegment
//all segments should be rectangular
function calcSegmentSize(table, id, upperLeft) {
	const size = {
		width: 1,
		height: 1,
	};
	while(upperLeft.row + size.height < table.children.length && table.children[upperLeft.row + size.height].children[upperLeft.col].dataset.id == id) {
		size.height++;
	}
	const row = table.children[upperLeft.row];
	while(upperLeft.col + size.width < row.children.length && row.children[upperLeft.col + size.width].dataset.id == id) {
		size.width++;
	}
	return size;
}

function displayRules(ruleContainer, blueprint) {
	ruleContainer.innerHTML = "";
	ruleContainer.style.display = "inline-block";
	for(let i = 0; i < blueprint.rules.length; i++) {
		const div = document.createElement('div');
		displayRule(div, blueprint.rules[i], blueprint.metrics);
		ruleContainer.appendChild(div);
	}
}

function displayRule(container, rule, metrics) {
	container.innerHTML = rule.raw;
	if("right" in rule) {
		if("variable" in rule.right) {
			let span = document.createElement('span');
			span.innerHTML = " | " + rule.right.variable.id + "." + rule.right.variable.metric + ":";
			container.appendChild(span);
			let input = document.createElement('input');
			input.dataset.id = rule.right.variable.id;
			input.dataset.metric = rule.right.variable.metric;
			input.value = metrics[rule.right.variable.id][rule.right.variable.metric];
			input.addEventListener('input', metricOnChange);
			input.addEventListener('blur', metricOnBlur);
			container.appendChild(input);
		}
	}
}

function metricOnChange(event) {
	const input = event.target;
	const id = input.dataset.id;
	const metric = input.dataset.metric;
	if(isInteger.test(input.value)) {
		const value = parseInt(input.value);
		if(selectedBlueprint.isValidMetric(id, metric, value)) {
			selectedBlueprint.metrics[id][metric] = value;
			selectedBlueprint.propagateMetricChange(id, metric);
			updateBlueprintDisplay();
		}
	}
}

function metricOnBlur(event) {
	const input = event.target;
	const id = input.dataset.id;
	const metric = input.dataset.metric;
	input.value = selectedBlueprint.metrics[id][metric];
}
