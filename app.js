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
			for(let r = upperLeft.row; r < upperLeft.row + currentSize.height; r++) {
				const row = table.children[r];
				row.removeChild(row.children[upperLeft.col]);
			}
			currentSize.width--;
		}
		while(currentSize.height < targetHeight) {
			for(let c = upperLeft.col; c < upperLeft.col + currentSize.width; c++) {
				const modelCell = table.children[upperLeft.row].children[c];
				shiftCellsDown(upperLeft.row, c, modelCell.cloneNode(deep=true));
			}
			currentSize.height++;
		}
		while(currentSize.height > targetHeight) {
			//TODO deleting the whole row is not right, there could be unrelated cells there - I really want to pull-in the existing cells in their "column"
			table.removeChild(table.children[upperLeft.row]);
			currentSize.height--;
		}
	}
	
	blueprintContainer.innerHTML = "";
	blueprintContainer.appendChild(table);
	
	//starting with r-th row, replace the c-th cell with `insertCell`, shifting the current cell down to the same position in the next row
	function shiftCellsDown(r, c, insertCell) {
		if(table.children.length <= r) {
			//last one
			const row = document.createElement('tr');
			for(let i = 0; i < c; i++) {
				row.appendChild(document.createElement('td'));
			}
			row.appendChild(insertCell);
			table.appendChild(row);
			return;
		}
		const row = table.children[r];
		if(row.children.length <= c) {
			//last one
			for(let i = row.children.length; i < c; i++) {
				row.appendChild(document.createElement('td'));
			}
			row.appendChild(insertCell);
			return;
		}
		const moveCell = row.children[c];
			//check for travelers
			//does not support traveler segments more than 1 cell wide yet
			//does not support chained-travelers yet
			var travelers = selectedBlueprint.getTravelersVertical(moveCell.dataset.id);
			if(travelers.length > 0) {
				//check left
				if(c-1 >= 0 && travelers.includes(row.children[c-1].dataset.id)) {
					shiftCellsDown(r, c-1, generateEmptyBlueprintCell());
				}				
				//check right
				if(c+1 < row.children.length && travelers.includes(row.children[c+1].dataset.id)) {
					shiftCellsDown(r, c+1, generateEmptyBlueprintCell());
				}				
			}
		row.insertBefore(insertCell, moveCell);
		row.removeChild(moveCell);
		shiftCellsDown(r + 1, c, moveCell);
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
	
	//console.log(convertBlueprintToSegmentGraph(blueprint));
	
	return table;
}

function generateEmptyBlueprintCell() {
	const cell = document.createElement('td');
	cell.classList.add('blueprint');
	cell.classList.add('empty');
	return cell;
}

/*
//TODO follow up with convertSegmentGraphToDisplayTable
//TODO unit tests
function convertBlueprintToSegmentGraph(blueprint) {
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
		};
		segments.push(segment);
	}
	
	//relate the segments to each other "below" "right of" etc
	//the first segment discovered becomes the root of the tree, no loops are recorded
	//gradually transfers segments from array 'segments' to array 'connectedSegments'
	let connectedSegments = [ segments.shift() ];
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
*/

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
