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
	const segmentTree = convertBlueprintToSegmentTree(selectedBlueprint);
	
	//update dimensions
	for(let i = 0; i < selectedBlueprint.ids.length; i++) {
		const id = selectedBlueprint.ids[i];
		let segment = null;
		for(let s = 0; s < segmentTree.length; s++) {
			if(segmentTree[s].id == id) {
				segment = segmentTree[s];
				break;
			}
		}
		if(segment == null)
			continue; //shouldn't hit this
		segment.size.width = selectedBlueprint.metrics[id].width;
		segment.size.height = selectedBlueprint.metrics[id].height;
	}
	//update locations
	const segmentRoot = segmentTree[0];
	updateLocations(segmentRoot);
	//bring everything into positive coordinate space
	let minRow = getMinRow(segmentRoot);
	let minCol = getMinCol(segmentRoot);
	if(minRow < 0) {
		shiftDown(segmentRoot, -1 * minRow);
	}
	if(minCol < 0) {
		shiftRight(segmentRoot, -1 * minCol);
	}	
	//convert into a table
	let maxRow = getMaxRow(segmentRoot);
	let maxCol = getMaxCol(segmentRoot);
	var table = document.createElement('table');
	for(let r = 0; r <= maxRow; r++) {
		var row = document.createElement('tr');
		for(let c = 0; c <= maxCol; c++) {
			var col = document.createElement('td');
			row.appendChild(col);
		}
		table.appendChild(row);
	}
	applyToTable(table, segmentRoot);
	blueprintContainer.innerHTML = "";
	blueprintContainer.appendChild(table);
	
	function updateLocations(root) {
		//everything is centered on its root
		//assumes there are no loops in the tree
		root.bottom = root.top + root.size.height - 1; //needed just for first root
		root.right = root.left + root.size.width - 1; //needed just for first root
		for(let i = 0; i < root.isAbove.length; i++) {
			let child = root.isAbove[i];
			child.top = root.bottom + 1;
			child.bottom = child.top + child.size.height - 1;
			centerVertically(root, child);
			updateLocations(child);
		}
		for(let i = 0; i < root.isBelow.length; i++) {
			let child = root.isBelow[i];
			child.bottom = root.top - 1;
			child.top = child.bottom - child.size.height + 1;
			centerVertically(root, child);
			updateLocations(child);
		}
		for(let i = 0; i < root.isLeftOf.length; i++) {
			let child = root.isLeftOf[i];
			child.left = root.right + 1;
			child.right = child.left + child.size.width - 1;
			centerHorizontally(root, child);
			updateLocations(child);
		}
		for(let i = 0; i < root.isRightOf.length; i++) {
			let child = root.isRightOf[i];
			child.right = root.left - 1;
			child.left = child.right - child.size.width + 1;
			centerHorizontally(root, child);
			updateLocations(child);
		}
	}
	
	function centerVertically(primary, secondary) {
		let center = primary.left + Math.floor(primary.size.width / 2);
		secondary.left = center - Math.floor(secondary.size.width / 2);
		secondary.right = secondary.left + secondary.size.width - 1;
	}

	function centerHorizontally(primary, secondary) {
		let center = primary.top + Math.floor(primary.size.height / 2);
		secondary.top = center - Math.floor(secondary.size.height / 2);
		secondary.bottom = secondary.top + secondary.size.height - 1;
	}
	
	function getMinRow(root) {
		let minRow = root.top;
		let children = root.getChildren();
		for(let i = 0; i < children.length; i++) {
			minRow = Math.min(minRow, getMinRow(children[i]));
		}
		return minRow;
	}
	
	function getMinCol(root) {
		let minCol = root.left;
		let children = root.getChildren();
		for(let i = 0; i < children.length; i++) {
			minCol = Math.min(minCol, getMinCol(children[i]));
		}
		return minCol;
	}
	
	function getMaxRow(root) {
		let maxRow = root.bottom;
		let children = root.getChildren();
		for(let i = 0; i < children.length; i++) {
			maxRow = Math.max(maxRow, getMaxRow(children[i]));
		}
		return maxRow;
	}
	
	function getMaxCol(root) {
		let maxCol = root.right;
		let children = root.getChildren();
		for(let i = 0; i < children.length; i++) {
			maxCol = Math.max(maxCol, getMaxCol(children[i]));
		}
		return maxCol;
	}
	
	function shiftDown(root, distance) {
		root.top += distance;
		root.bottom += distance;
		let children = root.getChildren();
		for(let i = 0; i < children.length; i++) {
			shiftDown(children[i], distance);
		}
	}
	
	function shiftRight(root, distance) {
		root.left += distance;
		root.right += distance;
		let children = root.getChildren();
		for(let i = 0; i < children.length; i++) {
			shiftRight(children[i], distance);
		}
	}
	
	function applyToTable(table, root) {
		for(let r = root.top; r <= root.bottom; r++) {
			for(let c = root.left; c <= root.right; c++) {
				var cell = table.children[r].children[c];
				cell.innerHTML = root.id;
			}
		}

		let children = root.getChildren();
		for(let i = 0; i < children.length; i++) {
			applyToTable(table, children[i]);
		}
	}
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

function convertBlueprintToSegmentTree(blueprint) {
	//scan linearly to find all the segments
    //get a collection of coords based on ids and contiguousness
	//supports multiple disconnected segments with the same id
	var cellSets = []; //each element is a set, each set has an id and an array of contiguous "cells" (row/col coords), ids are not unique
	const lines = blueprint.pattern.split('\n');
	for(let r = 0; r < lines.length; r++) {
		for(let c = 0; c < lines[r].length; c++) {
			const id = lines[r][c];
			if(id == ' ')
				continue;
			var cellSet = {
				id: id,
				cells: [ { row: r, col: c } ],
				minRow: r,
				minCol: c,
				maxRow: r,
				maxCol: c,
			};
			addCellSet(cellSet);
		}
	}
	
	//simplify it to upperLeft corner, width, height
	//segments are assumed to be rectangular
	var segments = [];
	for(let i = 0; i < cellSets.length; i++) {
		var cellSet = cellSets[i];
		var segment = {
			id: cellSet.id,
			top: cellSet.minRow,
			bottom: cellSet.maxRow,
			left: cellSet.minCol,
			right: cellSet.maxCol,
			size: {
				width: cellSet.maxCol - cellSet.minCol + 1,
				height: cellSet.maxRow - cellSet.minRow + 1,
			},
			isAbove: [],
			isBelow: [],
			isLeftOf: [],
			isRightOf: [],
			getChildren: function() {
				var result = this.isAbove.concat(this.isBelow);
				result = result.concat(this.isLeftOf);
				result = result.concat(this.isRightOf);
				return result;
			},
		};
		segments.push(segment);
	}
	
	//relate the segments to each other "below" "right of" etc
	//the first segment discovered becomes the root of the tree, no loops are recorded
	//gradually transfers segments from array 'segments' to array 'connectedSegments'
	let connectedSegments = [];
	const centerId = blueprint.getCenterId();
	for(let j = 0; j < segments.length; j++) {
		let segment = segments[j];
		if(segment.id == centerId) {
			connectedSegments.push(segment);
			segments.splice(j, 1);
			break;
		}
	}
	if(connectedSegments.length == 0) {
		connectedSegments.push(segments.shift()); //if there is no identified center, start anywhere
	}
	let p = 0;
	while(p < connectedSegments.length) {
		let primary = connectedSegments[p];
		for(let s = 0; s < segments.length; s++) {
			let secondary = segments[s];
			let foundConnection = false;
			if(segmentIsAbove(primary, secondary)) {
				primary.isAbove.push(secondary);
				foundConnection = true;
			}
			else if(segmentIsBelow(primary, secondary)) {
				primary.isBelow.push(secondary);
				foundConnection = true;
			}
			else if(segmentIsLeftOf(primary, secondary)) {
				primary.isLeftOf.push(secondary);
				foundConnection = true;
			}
			else if(segmentIsRightOf(primary, secondary)) {
				primary.isRightOf.push(secondary);
				foundConnection = true;
			}
			if(foundConnection) {
				connectedSegments.push(secondary);
				segments.splice(s, 1);
				s--;
			}
		}
		p++;
	}
	
	return connectedSegments;
	
	function segmentIsAbove(primary, secondary) {
		if(primary.bottom + 1 != secondary.top)
			return false;
		if(primary.left > secondary.right)
			return false;
		if(primary.right < secondary.left)
			return false;
		return true;
	}
	
	function segmentIsBelow(primary, secondary) {
		if(primary.top - 1 != secondary.bottom)
			return false;
		if(primary.left > secondary.right)
			return false;
		if(primary.right < secondary.left)
			return false;
		return true;
	}
	
	function segmentIsLeftOf(primary, secondary) {
		if(primary.right + 1 != secondary.left)
			return false;
		if(primary.bottom > secondary.top)
			return false;
		if(primary.top < secondary.bottom)
			return false;
		return true;
	}
	
	function segmentIsRightOf(primary, secondary) {
		if(primary.left - 1 != secondary.right)
			return false;
		if(primary.bottom > secondary.top)
			return false;
		if(primary.top < secondary.bottom)
			return false;
		return true;
	}
	
	//insert a cellSet into collection cellSets, based on contiguous-ness rules
	//does not assume segments will be rectangular
	function addCellSet(newCellSet) {
		for(let i = 0; i < cellSets.length; i++) {
			var cellSet = cellSets[i];
			if(cellSetsMatch(newCellSet, cellSet)) {
				mergeCellSets(toHere=newCellSet, fromHere=cellSet);
				cellSets.splice(i, 1); //remove i-th from array
				i--;
			}
		}
		cellSets.push(newCellSet);
	}
	
	//merge cellSet fromHere into cellSet toHere
	function mergeCellSets(toHere, fromHere) {
		toHere.cells = toHere.cells.concat(fromHere.cells);
		toHere.minRow = Math.min(toHere.minRow, fromHere.minRow);
		toHere.minCol = Math.min(toHere.minCol, fromHere.minCol);
		toHere.maxRow = Math.max(toHere.maxRow, fromHere.maxRow);
		toHere.maxCol = Math.max(toHere.maxCol, fromHere.maxCol);
	}

	//returns true if these cellSets should be merged together
	function cellSetsMatch(setA, setB) {
		if(setA.id != setB.id)
			return false;
		for(let a = 0; a < setA.cells.length; a++) {
			for(let b = 0; b < setB.cells.length; b++) {
				if(cellsAreAdjacent(setA.cells[a], setB.cells[b]))
					return true;
			}
		}
		return false;
	}
	
	//return true if cells are adjacent vertically or horizontally
	function cellsAreAdjacent(cellA, cellB) {
		if(cellA.row == cellB.row) {
			if(cellA.col == cellB.col - 1)
				return true;
			if(cellA.col == cellB.col + 1)
				return true;
		}
		if(cellA.col == cellB.col) {
			if(cellA.row == cellB.row - 1)
				return true;
			if(cellA.row == cellB.row + 1)
				return true;
		}
		return false;
	}
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
	while(upperLeft.row + size.height < table.children.length 
		&& upperLeft.col < table.children[upperLeft.row + size.height].children.length 
		&& table.children[upperLeft.row + size.height].children[upperLeft.col].dataset.id == id) {
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
