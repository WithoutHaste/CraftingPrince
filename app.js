window.addEventListener("load", run);

const isInteger = /^\d+$/;

var blueprintSelector = null;
var blueprintContainer = null;
var ruleContainer = null;
var workbenchContainer = null;
var materialContainer = null;

var selectedBlueprint = null;

function run() {
	let selectorContainer = document.getElementById('blueprint-selector');
	blueprintSelector = document.createElement('select');
	fillBlueprintSelector();
	blueprintSelector.addEventListener('change', resetSelectedBlueprint);
	selectorContainer.innerHTML = "";
	selectorContainer.appendChild(blueprintSelector);
	
	fillOutBlueprints(blueprints);
	setSelectedBlueprint();
	parseBlueprint(selectedBlueprint);

	blueprintContainer = document.getElementById('blueprint-container');
	workbenchContainer = document.getElementById('workbench-container');
	displayBlueprint();
	
	ruleContainer = document.getElementById('rule-container');
	displayRules(ruleContainer, selectedBlueprint);

	materialContainer = document.getElementById('material-container');
}

function displayBlueprint() {
	//initialize metric values
	const segmentTree = convertBlueprintToSegmentTree(selectedBlueprint);
	for(let i = 0; i < segmentTree.length; i++) {
		let segment = segmentTree[i];
		if(segment.id == 'x' || segment.id == 'X')
			continue;
		selectedBlueprint.metrics[segment.id].width = segment.size.width;
		selectedBlueprint.metrics[segment.id].height = segment.size.height;
	}

	updateBlueprintDisplay();
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
	workbenchContainer.innerHTML = "";
	displayBlueprint(blueprintContainer, selectedBlueprint);

	ruleContainer.innerHTML = "";
	displayRules(ruleContainer, selectedBlueprint);
}

function updateBlueprintDisplay() {
	const blueprintTable = generateUpdatedBlueprintTable(selectedBlueprint);
	blueprintContainer.innerHTML = "";
	blueprintContainer.appendChild(blueprintTable);
	
	const workbenchTable = document.createElement('table');
	workbenchTable.classList.add('workbench');
	for(let r = 0; r < blueprintTable.children.length; r++) {
		const templateRow = blueprintTable.children[r];
		const row = document.createElement('tr');
		for(let c = 0; c < templateRow.children.length; c++) {
			const templateCell = templateRow.children[c];
			const cell = document.createElement('td');
			cell.classList.add('workbench');
			if(templateCell.classList.contains('empty')) {
				cell.classList.add('empty');
			}
			else {
				cell.classList.add('tile');
			}
			row.appendChild(cell);
		}
		workbenchTable.appendChild(row);
	}
	workbenchContainer.innerHTML = "";
	workbenchContainer.appendChild(workbenchTable);
	
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
			cell.classList.add('blueprint');
			if(blueprint.emptyIds.includes(id)) {
				cell.classList.add('empty');
			}
			row.appendChild(cell);
		}
		table.appendChild(row);
	}
	
	return table;
}

function generateEmptyBlueprintCell() {
	const cell = document.createElement('td');
	cell.classList.add('blueprint');
	cell.classList.add('empty');
	return cell;
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
		
		addEditableMetricsRule(rule);
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
		ruleContainer.prepend(div);
	}
	
	function addEditableMetricsRule(rule) {
		const comparisonRuleTypes = [
			RULE_TYPES.LESS,
			RULE_TYPES.LESS_OR_EQUAL,
			RULE_TYPES.GREATER_OR_EQUAL,
		];
		if(comparisonRuleTypes.includes(rule.type)) {
			if(rule.right.type == CALC_TYPES.CONSTANT) {
				if(!duplicateEditableMetric(rule.left.id, rule.left.metric)) {
					editableMetrics.push({ id: rule.left.id, metric: rule.left.metric });
				}
			}
		}		
		
		addEditableMetricsRightSide(rule.right);
	}
	
	function addEditableMetricsRightSide(rule) {
		if(rule == undefined)
			return;
		if(rule.type == CALC_TYPES.METRIC) {
			if(!duplicateEditableMetric(rule.id, rule.metric)) {
				editableMetrics.push({ id: rule.id, metric: rule.metric });
			}
		}
		if("left" in rule) {
			addEditableMetricsRightSide(rule.left);
		}
		if("right" in rule) {
			addEditableMetricsRightSide(rule.right);
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
