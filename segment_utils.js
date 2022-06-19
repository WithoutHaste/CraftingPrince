const SEGMENT_PLACEMENTS = {
	CENTERED: "0",
	JUSTIFIED_TOP: "1",
	JUSTIFIED_BOTTOM: "2",
	JUSTIFIED_LEFT: "3",
	JUSTIFIED_RIGHT: "4",
	INDEXED: "5",
};

function generateUpdatedBlueprintTable(blueprint) {
	const segmentTree = convertBlueprintToSegmentTree(blueprint);
	
	//update dimensions
	for(let i = 0; i < blueprint.ids.length; i++) {
		const id = blueprint.ids[i];
		let segment = null;
		for(let s = 0; s < segmentTree.length; s++) {
			if(segmentTree[s].id == id) {
				segment = segmentTree[s];
				break;
			}
		}
		if(segment == null)
			continue; //shouldn't hit this
		segment.size.width = blueprint.metrics[id].width;
		segment.size.height = blueprint.metrics[id].height;
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
	return table;
	
	function updateLocations(root) {
		//assumes there are no loops in the tree
		root.bottom = root.top + root.size.height - 1; //needed just for first root
		root.right = root.left + root.size.width - 1; //needed just for first root
		for(let i = 0; i < root.isAbove.length; i++) {
			let child = root.isAbove[i];
			child.top = root.bottom + 1;
			child.bottom = child.top + child.size.height - 1;
			if(child.segmentPlacement == SEGMENT_PLACEMENTS.CENTERED) {
				centerVertically(root, child);
			}
			else if(child.segmentPlacement == SEGMENT_PLACEMENTS.JUSTIFIED_LEFT) {
				justifyLeft(root, child);
			}
			else if(child.segmentPlacement == SEGMENT_PLACEMENTS.JUSTIFIED_RIGHT) {
				justifyRight(root, child);
			}
			updateLocations(child);
		}
		for(let i = 0; i < root.isBelow.length; i++) {
			let child = root.isBelow[i];
			child.bottom = root.top - 1;
			child.top = child.bottom - child.size.height + 1;
			if(child.segmentPlacement == SEGMENT_PLACEMENTS.CENTERED) {
				centerVertically(root, child);
			}
			else if(child.segmentPlacement == SEGMENT_PLACEMENTS.JUSTIFIED_LEFT) {
				justifyLeft(root, child);
			}
			else if(child.segmentPlacement == SEGMENT_PLACEMENTS.JUSTIFIED_RIGHT) {
				justifyRight(root, child);
			}
			updateLocations(child);
		}
		for(let i = 0; i < root.isLeftOf.length; i++) {
			let child = root.isLeftOf[i];
			child.left = root.right + 1;
			child.right = child.left + child.size.width - 1;
			if(child.segmentPlacement == SEGMENT_PLACEMENTS.CENTERED) {
				centerHorizontally(root, child);
			}
			else if(child.segmentPlacement == SEGMENT_PLACEMENTS.JUSTIFIED_TOP) {
				justifyTop(root, child);
			}
			else if(child.segmentPlacement == SEGMENT_PLACEMENTS.JUSTIFIED_BOTTOM) {
				justifyBottom(root, child);
			}
			updateLocations(child);
		}
		for(let i = 0; i < root.isRightOf.length; i++) {
			let child = root.isRightOf[i];
			child.right = root.left - 1;
			child.left = child.right - child.size.width + 1;
			if(child.segmentPlacement == SEGMENT_PLACEMENTS.CENTERED) {
				centerHorizontally(root, child);
			}
			else if(child.segmentPlacement == SEGMENT_PLACEMENTS.JUSTIFIED_TOP) {
				justifyTop(root, child);
			}
			else if(child.segmentPlacement == SEGMENT_PLACEMENTS.JUSTIFIED_BOTTOM) {
				justifyBottom(root, child);
			}
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
	
	function justifyTop(primary, secondary) {
		secondary.top = primary.top;
		secondary.bottom = secondary.top + secondary.size.height - 1;
	}
	
	function justifyBottom(primary, secondary) {
		secondary.bottom = primary.bottom;
		secondary.top = secondary.bottom - secondary.size.height + 1;
	}
	
	function justifyLeft(primary, secondary) {
		secondary.left = primary.left;
		secondary.right = secondary.left + secondary.size.width - 1;
	}
	
	function justifyRight(primary, secondary) {
		secondary.right = primary.right;
		secondary.left = secondary.right - secondary.size.width + 1;
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
				if(segmentIsCenteredVertically(primary, secondary)) {
					secondary.segmentPlacement = SEGMENT_PLACEMENTS.CENTERED;
				}
				else if(segmentIsJustifiedLeft(primary, secondary)) {
					secondary.segmentPlacement = SEGMENT_PLACEMENTS.JUSTIFIED_LEFT;
				}
				else if(segmentIsJustifiedRight(primary, secondary)) {
					secondary.segmentPlacement = SEGMENT_PLACEMENTS.JUSTIFIED_RIGHT;
				}
				foundConnection = true;
			}
			else if(segmentIsBelow(primary, secondary)) {
				primary.isBelow.push(secondary);
				if(segmentIsCenteredVertically(primary, secondary)) {
					secondary.segmentPlacement = SEGMENT_PLACEMENTS.CENTERED;
				}
				else if(segmentIsJustifiedLeft(primary, secondary)) {
					secondary.segmentPlacement = SEGMENT_PLACEMENTS.JUSTIFIED_LEFT;
				}
				else if(segmentIsJustifiedRight(primary, secondary)) {
					secondary.segmentPlacement = SEGMENT_PLACEMENTS.JUSTIFIED_RIGHT;
				}
				foundConnection = true;
			}
			else if(segmentIsLeftOf(primary, secondary)) {
				primary.isLeftOf.push(secondary);
				if(segmentIsCenteredHorizontally(primary, secondary)) {
					secondary.segmentPlacement = SEGMENT_PLACEMENTS.CENTERED;
				}
				else if(segmentIsJustifiedTop(primary, secondary)) {
					secondary.segmentPlacement = SEGMENT_PLACEMENTS.JUSTIFIED_TOP;
				}
				else if(segmentIsJustifiedBottom(primary, secondary)) {
					secondary.segmentPlacement = SEGMENT_PLACEMENTS.JUSTIFIED_BOTTOM;
				}
				foundConnection = true;
			}
			else if(segmentIsRightOf(primary, secondary)) {
				primary.isRightOf.push(secondary);
				if(segmentIsCenteredHorizontally(primary, secondary)) {
					secondary.segmentPlacement = SEGMENT_PLACEMENTS.CENTERED;
				}
				else if(segmentIsJustifiedTop(primary, secondary)) {
					secondary.segmentPlacement = SEGMENT_PLACEMENTS.JUSTIFIED_TOP;
				}
				else if(segmentIsJustifiedBottom(primary, secondary)) {
					secondary.segmentPlacement = SEGMENT_PLACEMENTS.JUSTIFIED_BOTTOM;
				}
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
	if(primary.top > secondary.bottom)
		return false;
	if(primary.bottom < secondary.top)
		return false;
	return true;
}

function segmentIsRightOf(primary, secondary) {
	if(primary.left - 1 != secondary.right)
		return false;
	if(primary.top > secondary.bottom)
		return false;
	if(primary.bottom < secondary.top)
		return false;
	return true;
}

function segmentIsCenteredVertically(primary, secondary) {
	return (primary.left - secondary.left == secondary.right - primary.right);
}

function segmentIsCenteredHorizontally(primary, secondary) {
	return (primary.top - secondary.top == secondary.bottom - primary.bottom);
}

function segmentIsJustifiedTop(primary, secondary) {
	return (primary.top == secondary.top && primary.bottom != secondary.bottom);
}

function segmentIsJustifiedBottom(primary, secondary) {
	return (primary.bottom == secondary.bottom && primary.top != secondary.top);
}

function segmentIsJustifiedLeft(primary, secondary) {
	return (primary.left == secondary.left && primary.right != secondary.right);
}

function segmentIsJustifiedRight(primary, secondary) {
	return (primary.right == secondary.right && primary.left != secondary.left);
}
