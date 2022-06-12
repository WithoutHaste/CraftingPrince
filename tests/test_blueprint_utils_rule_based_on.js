QUnit.test("rule based on id.metric: CONSTANT", function( assert ) {
	let id = 'A';
	let metric = 'width';
	let rule = parseRule(`B.height = 5`);

	let result = ruleIsBasedOnIdMetric(rule.right, id, metric);

	assert.false(result, "single-level");
	
	//--------------------------

	rule = parseRule(`B.height = 5 + 2`);

	result = ruleIsBasedOnIdMetric(rule.right, id, metric);

	assert.false(result, "multi-level");
});

QUnit.test("rule based on id.metric: MISMATCH", function( assert ) {
	let id = 'A';
	let metric = 'width';
	let rule = parseRule(`B.height = C.${metric}`);

	let result = ruleIsBasedOnIdMetric(rule.right, id, metric);

	assert.false(result, "wrong id");
	
	//--------------------------

	rule = parseRule(`B.height = ${id}.height`);

	result = ruleIsBasedOnIdMetric(rule.right, id, metric);

	assert.false(result, "wrong metric");
});

QUnit.test("rule based on id.metric: SINGLE LEVEL MATCH", function( assert ) {
	let id = 'A';
	let metric = 'width';
	let rule = parseRule(`B.height = ${id}.${metric}`);

	let result = ruleIsBasedOnIdMetric(rule.right, id, metric);

	assert.true(result, "equal");
	
	//--------------------------

	rule = parseRule(`B.height >= ${id}.${metric}`);

	result = ruleIsBasedOnIdMetric(rule.right, id, metric);

	assert.true(result, "greater or equal");
});

QUnit.test("rule based on id.metric: SECOND LEVEL MATCH", function( assert ) {
	let id = 'A';
	let metric = 'width';
	let rule = parseRule(`B.height = 2 / ${id}.${metric}`);

	let result = ruleIsBasedOnIdMetric(rule.right, id, metric);

	assert.true(result, "on right");
	
	//--------------------------

	rule = parseRule(`B.height >= ${id}.${metric} + 3`);

	result = ruleIsBasedOnIdMetric(rule.right, id, metric);

	assert.true(result, "on left");
});

QUnit.test("rule based on id.metric: THIRD LEVEL MATCH", function( assert ) {
	let id = 'A';
	let metric = 'width';
	let rule = parseRule(`B.height = D.width + (2 / ${id}.${metric})`);

	let result = ruleIsBasedOnIdMetric(rule.right, id, metric);

	assert.true(result, "on right.right");
	
	//--------------------------

	rule = parseRule(`B.height >= D.width - (${id}.${metric} + 3)`);

	result = ruleIsBasedOnIdMetric(rule.right, id, metric);

	assert.true(result, "on right.left");
});
