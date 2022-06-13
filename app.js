window.addEventListener("load", run);

const isInteger = /^\d+$/;

var appContainer = null;
var blueprintSelector = null;
var blueprintContainer = null;
var ruleContainer = null;

var selectedBlueprint = null;

function run() {
	appContainer = document.getElementById('app');
	appContainer.innerHTML = "";
	
	let selectorContainer = document.createElement('div');
	selectorContainer.style.marginBottom = '1em';
	blueprintSelector = document.createElement('select');
	fillBlueprintSelector();
	blueprintSelector.addEventListener('change', resetSelectedBlueprint);
	selectorContainer.appendChild(blueprintSelector);
	appContainer.appendChild(selectorContainer);
	
	fillOutBlueprints(blueprints);
	setSelectedBlueprint();
	parseBlueprint(selectedBlueprint);

	blueprintContainer = document.createElement('div');
	blueprintContainer.style.fontFamily = 'Courier';
	displayBlueprint(blueprintContainer, selectedBlueprint);
	appContainer.appendChild(blueprintContainer);
	
	ruleContainer = document.createElement('div');
	ruleContainer.style.fontFamily = 'Courier';
	ruleContainer.style.marginLeft = '2em';
	displayRules(ruleContainer, selectedBlueprint);
	appContainer.appendChild(ruleContainer);
}

function fillBlueprintSelector() {
	for(let i = 0; i < blueprints.length; i++) {
		let blueprint = blueprints[i];
		let optionElement = document.createElement('option');
		optionElement.value = blueprint.name;
		optionElement.innerHTML = blueprint.name;
		blueprintSelector.appendChild(optionElement);
	}
}

function setSelectedBlueprint() {
	let name = blueprintSelector.value;
	for(let i = 0; i < blueprints.length; i++) {
		let blueprint = blueprints[i];
		if(blueprint.name == name) {
			selectedBlueprint = blueprint;
			return;
		}
	}
	selectedBlueprint = null;
}

function resetSelectedBlueprint() {
	setSelectedBlueprint();
	parseBlueprint(selectedBlueprint);

	blueprintContainer.innerHTML = "";
	displayBlueprint(blueprintContainer, selectedBlueprint);

	ruleContainer.innerHTML = "";
	displayRules(ruleContainer, selectedBlueprint);
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
	table.style.borderCollapse = "collapse";
	const lines = blueprint.pattern.split('\n');
	for(let r = 0; r < lines.length; r++) {
		const row = document.createElement('tr');
		for(let c = 0; c < lines[r].length; c++) {
			const id = lines[r][c];
			const cell = document.createElement('td');
			cell.innerHTML = id;
			cell.dataset.id = id;
			if(blueprint.emptyIds.includes(id)) {
				cell.style.backgroundColor = '#ccc';
			}
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
	let editableMetrics = [];
	for(let i = 0; i < blueprint.rules.length; i++) {
		const rule = blueprint.rules[i];
		const div = document.createElement('div');
		div.innerHTML = rule.raw;
		ruleContainer.appendChild(div);
		
		addEditableMetrics(rule.right);
	}

	for(let i = 0; i < editableMetrics.length; i++) {
		const idMetric = editableMetrics[i];
		let div = document.createElement('div');
		let span = document.createElement('span');
		span.innerHTML = idMetric.id + "." + idMetric.metric + ":";
		div.appendChild(span);
		let input = document.createElement('input');
		input.dataset.id = idMetric.id;
		input.dataset.metric = idMetric.metric;
		input.value = blueprint.metrics[idMetric.id][idMetric.metric];
		input.addEventListener('input', metricOnChange);
		input.addEventListener('blur', metricOnBlur);
		div.appendChild(input);
		ruleContainer.appendChild(div);
	}
	
	function addEditableMetrics(rule) {
		if(rule == undefined)
			return;
		if(rule.type == CALC_TYPES.METRIC) {
			if(!duplicateEditableMetric(rule.id, rule.metric)) {
				editableMetrics.push({ id: rule.id, metric: rule.metric });
			}
		}
		if("left" in rule) {
			addEditableMetrics(rule.left);
		}
		if("right" in rule) {
			addEditableMetrics(rule.right);
		}
	}
	
	function duplicateEditableMetric(id, metric) {
		for(let i = 0; i < editableMetrics.length; i++) {
			const idMetric = editableMetrics[i];
			if(idMetric.id == id && idMetric.metric == metric) {
				return true;
			}
		}
		return false;
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
