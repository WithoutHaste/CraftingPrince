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
