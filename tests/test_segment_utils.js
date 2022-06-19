QUnit.test("segment: IS ABOVE", function( assert ) {
	let primary = {
		top: 1,
		bottom: 2,
		left: 1,
		right: 3,
	};
	let secondary = {
		top: primary.bottom + 1,
		bottom: primary.bottom + 2,
		left: primary.left,
		right: primary.right,
	};

	let result = segmentIsAbove(primary, secondary);
	
	assert.true(result, "perfect match");
	
	//----------------------------
	
	secondary.left = primary.left - 1;
	secondary.right = primary.right + 1;

	result = segmentIsAbove(primary, secondary);
	
	assert.true(result, "secondary centered overrun");
	
	//----------------------------
	
	secondary.left = primary.left + 1;
	secondary.right = primary.right - 1;

	result = segmentIsAbove(primary, secondary);
	
	assert.true(result, "secondary centered underrun");
	
	//----------------------------
	
	secondary.left = primary.left;
	secondary.right = primary.left;

	result = segmentIsAbove(primary, secondary);
	
	assert.true(result, "secondary left justified");
	
	//----------------------------
	
	secondary.left = primary.left - 1;
	secondary.right = primary.left;

	result = segmentIsAbove(primary, secondary);
	
	assert.true(result, "secondary left runover");
	
	//----------------------------
	
	secondary.left = primary.right;
	secondary.right = primary.right;

	result = segmentIsAbove(primary, secondary);
	
	assert.true(result, "secondary right justified");
	
	//----------------------------
	
	secondary.left = primary.left;
	secondary.right = primary.right + 1;

	result = segmentIsAbove(primary, secondary);
	
	assert.true(result, "secondary right runover");
});

QUnit.test("segment: IS BELOW", function( assert ) {
	let primary = {
		top: 1,
		bottom: 2,
		left: 1,
		right: 3,
	};
	let secondary = {
		top: primary.top - 2,
		bottom: primary.top - 1,
		left: primary.left,
		right: primary.right,
	};

	let result = segmentIsBelow(primary, secondary);
	
	assert.true(result, "perfect match");
	
	//----------------------------
	
	secondary.left = primary.left - 1;
	secondary.right = primary.right + 1;

	result = segmentIsBelow(primary, secondary);
	
	assert.true(result, "secondary centered overrun");
	
	//----------------------------
	
	secondary.left = primary.left + 1;
	secondary.right = primary.right - 1;

	result = segmentIsBelow(primary, secondary);
	
	assert.true(result, "secondary centered underrun");
	
	//----------------------------
	
	secondary.left = primary.left;
	secondary.right = primary.left;

	result = segmentIsBelow(primary, secondary);
	
	assert.true(result, "secondary left justified");
	
	//----------------------------
	
	secondary.left = primary.left - 1;
	secondary.right = primary.left;

	result = segmentIsBelow(primary, secondary);
	
	assert.true(result, "secondary left runover");
	
	//----------------------------
	
	secondary.left = primary.right;
	secondary.right = primary.right;

	result = segmentIsBelow(primary, secondary);
	
	assert.true(result, "secondary right justified");
	
	//----------------------------
	
	secondary.left = primary.left;
	secondary.right = primary.right + 1;

	result = segmentIsBelow(primary, secondary);
	
	assert.true(result, "secondary right runover");
});

QUnit.test("segment: IS LEFT OF", function( assert ) {
	let primary = {
		top: 1,
		bottom: 3,
		left: 1,
		right: 2,
	};
	let secondary = {
		top: primary.top,
		bottom: primary.bottom,
		left: primary.right + 1,
		right: primary.right + 2,
	};

	let result = segmentIsLeftOf(primary, secondary);
	
	assert.true(result, "perfect match");
	
	//----------------------------
	
	secondary.top = primary.top - 1;
	secondary.bottom = primary.bottom + 1;

	result = segmentIsLeftOf(primary, secondary);
	
	assert.true(result, "secondary centered overrun");
	
	//----------------------------
	
	secondary.top = primary.top + 1;
	secondary.bottom = primary.bottom - 1;

	result = segmentIsLeftOf(primary, secondary);
	
	assert.true(result, "secondary centered underrun");
	
	//----------------------------
	
	secondary.top = primary.top;
	secondary.bottom = primary.top;

	result = segmentIsLeftOf(primary, secondary);
	
	assert.true(result, "secondary top justified");
	
	//----------------------------
	
	secondary.top = primary.top - 1;
	secondary.bottom = primary.top;

	result = segmentIsLeftOf(primary, secondary);
	
	assert.true(result, "secondary top runover");
	
	//----------------------------
	
	secondary.top = primary.bottom;
	secondary.bottom = primary.bottom;

	result = segmentIsLeftOf(primary, secondary);
	
	assert.true(result, "secondary bottom justified");
	
	//----------------------------
	
	secondary.top = primary.top;
	secondary.bottom = primary.bottom + 1;

	result = segmentIsLeftOf(primary, secondary);
	
	assert.true(result, "secondary bottom runover");
});

QUnit.test("segment: IS RIGHT OF", function( assert ) {
	let primary = {
		top: 1,
		bottom: 3,
		left: 1,
		right: 2,
	};
	let secondary = {
		top: primary.top,
		bottom: primary.bottom,
		left: primary.left - 2,
		right: primary.left - 1,
	};

	let result = segmentIsRightOf(primary, secondary);
	
	assert.true(result, "perfect match");
	
	//----------------------------
	
	secondary.top = primary.top - 1;
	secondary.bottom = primary.bottom + 1;

	result = segmentIsRightOf(primary, secondary);
	
	assert.true(result, "secondary centered overrun");
	
	//----------------------------
	
	secondary.top = primary.top + 1;
	secondary.bottom = primary.bottom - 1;

	result = segmentIsRightOf(primary, secondary);
	
	assert.true(result, "secondary centered underrun");
	
	//----------------------------
	
	secondary.top = primary.top;
	secondary.bottom = primary.top;

	result = segmentIsRightOf(primary, secondary);
	
	assert.true(result, "secondary top justified");
	
	//----------------------------
	
	secondary.top = primary.top - 1;
	secondary.bottom = primary.top;

	result = segmentIsRightOf(primary, secondary);
	
	assert.true(result, "secondary top runover");
	
	//----------------------------
	
	secondary.top = primary.bottom;
	secondary.bottom = primary.bottom;

	result = segmentIsRightOf(primary, secondary);
	
	assert.true(result, "secondary bottom justified");
	
	//----------------------------
	
	secondary.top = primary.top;
	secondary.bottom = primary.bottom + 1;

	result = segmentIsRightOf(primary, secondary);
	
	assert.true(result, "secondary bottom runover");
});


