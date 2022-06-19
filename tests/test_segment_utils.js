QUnit.test("segment: IS ABOVE true", function( assert ) {
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

QUnit.test("segment: IS ABOVE false", function( assert ) {
	let primary = {
		top: 1,
		bottom: 2,
		left: 1,
		right: 3,
	};
	let secondary = {
		top: primary.bottom + 2,
		bottom: primary.bottom + 3,
		left: primary.left,
		right: primary.right,
	};

	let result = segmentIsAbove(primary, secondary);
	
	assert.false(result, "vertical gap");
	
	//----------------------------
	
	secondary.top = primary.bottom;
	secondary.bottom = primary.bottom + 1;

	result = segmentIsAbove(primary, secondary);
	
	assert.false(result, "vertical overlap");
	
	//----------------------------
	
	secondary.top = primary.top - 2;
	secondary.bottom = primary.top - 1;

	result = segmentIsAbove(primary, secondary);
	
	assert.false(result, "secondary is above");
	
	//----------------------------
	//RESET
	secondary.top = primary.bottom + 1;
	secondary.bottom = primary.bottom + 2;
	//----------------------------
	
	secondary.left = primary.left - 2;
	secondary.right = primary.left - 1;

	result = segmentIsAbove(primary, secondary);
	
	assert.false(result, "horizontal gap left");

	//----------------------------
	
	secondary.left = primary.right + 1;
	secondary.right = primary.right + 2;

	result = segmentIsAbove(primary, secondary);
	
	assert.false(result, "horizontal gap right");
});

QUnit.test("segment: IS BELOW true", function( assert ) {
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

QUnit.test("segment: IS BELOW false", function( assert ) {
	let primary = {
		top: 1,
		bottom: 2,
		left: 1,
		right: 3,
	};
	let secondary = {
		top: primary.top - 3,
		bottom: primary.top - 2,
		left: primary.left,
		right: primary.right,
	};

	let result = segmentIsBelow(primary, secondary);
	
	assert.false(result, "vertical gap");
	
	//----------------------------
	
	secondary.top = primary.top - 1;
	secondary.bottom = primary.top;

	result = segmentIsBelow(primary, secondary);
	
	assert.false(result, "vertical overlap");
	
	//----------------------------
	
	secondary.top = primary.bottom + 1;
	secondary.bottom = primary.bottom + 2;

	result = segmentIsBelow(primary, secondary);
	
	assert.false(result, "secondary is below");
	
	//----------------------------
	//RESET
	secondary.top = primary.top - 2;
	secondary.bottom = primary.top - 1;
	//----------------------------
	
	secondary.left = primary.left - 2;
	secondary.right = primary.left - 1;

	result = segmentIsBelow(primary, secondary);
	
	assert.false(result, "horizontal gap left");

	//----------------------------
	
	secondary.left = primary.right + 1;
	secondary.right = primary.right + 2;

	result = segmentIsBelow(primary, secondary);
	
	assert.false(result, "horizontal gap right");
});

QUnit.test("segment: IS LEFT OF true", function( assert ) {
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

QUnit.test("segment: IS LEFT OF false", function( assert ) {
	let primary = {
		top: 1,
		bottom: 2,
		left: 1,
		right: 3,
	};
	let secondary = {
		top: primary.top,
		bottom: primary.bottom,
		left: primary.right + 2,
		right: primary.right + 3,
	};

	let result = segmentIsLeftOf(primary, secondary);
	
	assert.false(result, "horizontal gap");
	
	//----------------------------
	
	secondary.left = primary.right;
	secondary.right = primary.right + 1;

	result = segmentIsLeftOf(primary, secondary);
	
	assert.false(result, "horizontal overlap");
	
	//----------------------------
	
	secondary.left = primary.left - 2;
	secondary.right = primary.left - 1;

	result = segmentIsLeftOf(primary, secondary);
	
	assert.false(result, "secondary is left of");
	
	//----------------------------
	//RESET
	secondary.left = primary.right + 1;
	secondary.right = primary.right + 2;
	//----------------------------
	
	secondary.top = primary.top - 2;
	secondary.bottom = primary.top - 1;

	result = segmentIsLeftOf(primary, secondary);
	
	assert.false(result, "vertical gap top");

	//----------------------------
	
	secondary.top = primary.bottom + 1;
	secondary.bottom = primary.bottom + 2;

	result = segmentIsLeftOf(primary, secondary);
	
	assert.false(result, "vertical gap bottom");
});

QUnit.test("segment: IS RIGHT OF true", function( assert ) {
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

QUnit.test("segment: IS RIGHT OF false", function( assert ) {
	let primary = {
		top: 1,
		bottom: 2,
		left: 1,
		right: 3,
	};
	let secondary = {
		top: primary.top,
		bottom: primary.bottom,
		left: primary.left - 3,
		right: primary.left - 2,
	};

	let result = segmentIsRightOf(primary, secondary);
	
	assert.false(result, "horizontal gap");
	
	//----------------------------
	
	secondary.left = primary.left - 1;
	secondary.right = primary.left;

	result = segmentIsRightOf(primary, secondary);
	
	assert.false(result, "horizontal overlap");
	
	//----------------------------
	
	secondary.left = primary.right + 1;
	secondary.right = primary.right + 2;

	result = segmentIsRightOf(primary, secondary);
	
	assert.false(result, "secondary is right of");
	
	//----------------------------
	//RESET
	secondary.left = primary.left - 2;
	secondary.right = primary.left - 1;
	//----------------------------
	
	secondary.top = primary.top - 2;
	secondary.bottom = primary.top - 1;

	result = segmentIsRightOf(primary, secondary);
	
	assert.false(result, "vertical gap top");

	//----------------------------
	
	secondary.top = primary.bottom + 1;
	secondary.bottom = primary.bottom + 2;

	result = segmentIsRightOf(primary, secondary);
	
	assert.false(result, "vertical gap bottom");
});

QUnit.test("segment: IS CENTERED VERTICALLY", function( assert ) {
	let primary = {
		left: 1,
		right: 3,
	};
	let secondary = {
		left: primary.left,
		right: primary.right,
	};

	let result = segmentIsCenteredVertically(primary, secondary);
	
	assert.true(result, "perfect match");
	
	//----------------------------
	
	secondary.left = primary.left - 2;
	secondary.right = primary.right + 2;

	result = segmentIsCenteredVertically(primary, secondary);
	
	assert.true(result, "secondary overrun");
	
	//----------------------------
	
	secondary.left = primary.left + 1;
	secondary.right = primary.right - 1;

	result = segmentIsCenteredVertically(primary, secondary);
	
	assert.true(result, "secondary underrun");
	
	//----------------------------
	
	secondary.left = primary.left;
	secondary.right = primary.right - 1;

	result = segmentIsCenteredVertically(primary, secondary);
	
	assert.false(result, "secondary leans left");
	
	//----------------------------
	
	secondary.left = primary.left + 1;
	secondary.right = primary.right;

	result = segmentIsCenteredVertically(primary, secondary);
	
	assert.false(result, "secondary leans right");
	
});

QUnit.test("segment: IS CENTERED HORIZONTALLY", function( assert ) {
	let primary = {
		top: 1,
		bottom: 3,
	};
	let secondary = {
		top: primary.top,
		bottom: primary.bottom,
	};

	let result = segmentIsCenteredHorizontally(primary, secondary);
	
	assert.true(result, "perfect match");
	
	//----------------------------
	
	secondary.top = primary.top - 2;
	secondary.bottom = primary.bottom + 2;

	result = segmentIsCenteredHorizontally(primary, secondary);
	
	assert.true(result, "secondary overrun");
	
	//----------------------------
	
	secondary.top = primary.top + 1;
	secondary.bottom = primary.bottom - 1;

	result = segmentIsCenteredHorizontally(primary, secondary);
	
	assert.true(result, "secondary underrun");
	
	//----------------------------
	
	secondary.top = primary.top;
	secondary.bottom = primary.bottom - 1;

	result = segmentIsCenteredHorizontally(primary, secondary);
	
	assert.false(result, "secondary leans left");
	
	//----------------------------
	
	secondary.top = primary.top + 1;
	secondary.bottom = primary.bottom;

	result = segmentIsCenteredHorizontally(primary, secondary);
	
	assert.false(result, "secondary leans right");
	
});

QUnit.test("segment: IS JUSTIFIED TOP", function( assert ) {
	let primary = {
		top: 1,
		bottom: 3,
	};
	let secondary = {
		top: primary.top,
		bottom: primary.bottom - 1,
	};

	let result = segmentIsJustifiedTop(primary, secondary);
	
	assert.true(result, "");
	
	//----------------------------

	secondary.top = primary.top - 1;
	result = segmentIsJustifiedTop(primary, secondary);
	assert.false(result, "too high");
	
	//----------------------------

	secondary.top = primary.top + 1;
	result = segmentIsJustifiedTop(primary, secondary);
	assert.false(result, "too low");
	
	//----------------------------

	secondary.top = primary.top;
	secondary.bottom = primary.bottom;
	result = segmentIsJustifiedTop(primary, secondary);
	assert.false(result, "centered");
});

QUnit.test("segment: IS JUSTIFIED BOTTOM", function( assert ) {
	let primary = {
		top: 1,
		bottom: 3,
	};
	let secondary = {
		top: primary.top + 1,
		bottom: primary.bottom,
	};

	let result = segmentIsJustifiedBottom(primary, secondary);
	
	assert.true(result, "");
	
	//----------------------------

	secondary.bottom = primary.bottom + 1;
	result = segmentIsJustifiedBottom(primary, secondary);
	assert.false(result, "too low");
	
	//----------------------------

	secondary.bottom = primary.bottom - 1;
	result = segmentIsJustifiedBottom(primary, secondary);
	assert.false(result, "too high");
	
	//----------------------------

	secondary.top = primary.top;
	secondary.bottom = primary.bottom;
	result = segmentIsJustifiedBottom(primary, secondary);
	assert.false(result, "centered");
});

QUnit.test("segment: IS JUSTIFIED LEFT", function( assert ) {
	let primary = {
		left: 1,
		right: 3,
	};
	let secondary = {
		left: primary.left,
		right: primary.right - 1,
	};

	let result = segmentIsJustifiedLeft(primary, secondary);
	
	assert.true(result, "");
	
	//----------------------------

	secondary.left = primary.left - 1;
	result = segmentIsJustifiedLeft(primary, secondary);
	assert.false(result, "too left");
	
	//----------------------------

	secondary.left = primary.left + 1;
	result = segmentIsJustifiedLeft(primary, secondary);
	assert.false(result, "too right");
	
	//----------------------------

	secondary.left = primary.left;
	secondary.right = primary.right;
	result = segmentIsJustifiedLeft(primary, secondary);
	assert.false(result, "centered");
});

QUnit.test("segment: IS JUSTIFIED RIGHT", function( assert ) {
	let primary = {
		left: 1,
		right: 3,
	};
	let secondary = {
		left: primary.left + 1,
		right: primary.right,
	};

	let result = segmentIsJustifiedRight(primary, secondary);
	
	assert.true(result, "");
	
	//----------------------------

	secondary.right = primary.right + 1;
	result = segmentIsJustifiedRight(primary, secondary);
	assert.false(result, "too left");
	
	//----------------------------

	secondary.right = primary.right - 1;
	result = segmentIsJustifiedRight(primary, secondary);
	assert.false(result, "too right");
	
	//----------------------------

	secondary.left = primary.left;
	secondary.right = primary.right;
	result = segmentIsJustifiedRight(primary, secondary);
	assert.false(result, "centered");
});
