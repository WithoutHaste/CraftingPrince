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
	//
	//if segments are currently centered on each other, they are marked to stay centered
	//if a segment is currently justified (ex: align to top), it is marked to stay justified
	//if a segment is currently indexed (ex: align to 2nd 'A'), it is marked to stay indexed
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
