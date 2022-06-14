QUnit.test("regex: IS WHITESPACE", function( assert ) {
	let result = isWhitespace.test("");
	assert.true(result, "empty");
	
	//----------------------------

	result = isWhitespace.test("\n");
	assert.true(result, "endline");
	
	//----------------------------

	result = isWhitespace.test(" ");
	assert.true(result, "space");
	
	//----------------------------

	result = isWhitespace.test("  ");
	assert.true(result, "space space");
	
	//----------------------------

	result = isWhitespace.test(" \n");
	assert.true(result, "space endline");
	
	//----------------------------

	result = isWhitespace.test("\t");
	assert.true(result, "tab");
	
	//----------------------------

	result = isWhitespace.test("\t\n");
	assert.true(result, "tab endline");
});

QUnit.test("regex: IS MULTIPLE", function( assert ) {
	let result = isMultiple.test("A.height is multiple of 0");
	assert.true(result, "A.height 0");
	
	//----------------------------

	result = isMultiple.test("A.width is multiple of 0");
	assert.true(result, "A.width 0");
	
	//----------------------------

	result = isMultiple.test("a.height is multiple of 0");
	assert.true(result, "a.height 0");
	
	//----------------------------

	result = isMultiple.test("a.width is multiple of 0");
	assert.true(result, "a.width 0");
	
	//----------------------------

	result = isMultiple.test("A.height is multiple of 3");
	assert.true(result, "A.height 3");

	//----------------------------

	result = isMultiple.test("A.height is multiple of 30");
	assert.true(result, "A.height 30");

	//----------------------------

	result = isMultiple.test("A.height is multiple of -3");
	assert.false(result, "A.height -3");

	//----------------------------

	result = isMultiple.test("A is multiple of 3");
	assert.false(result, "A 3");
});
