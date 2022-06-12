QUnit.test("is valid metric: NEGATIVE", function( assert ) {
	let blueprint = {
		rules: [],
		isValidMetric: isValidMetric,
	};

	let result = blueprint.isValidMetric('A', 'width', -1);

	assert.false(result, "");
});

QUnit.test("is valid metric: NO RULES", function( assert ) {
	let blueprint = {
		rules: [],
		isValidMetric: isValidMetric,
	};

	let result = blueprint.isValidMetric('A', 'width', 0);

	assert.true(result, "");
});

QUnit.test("is valid metric: NO APPLICABLE RULES", function( assert ) {
	let id = 'A';
	let metric = 'width';
	let blueprint = {
		rules: [
			parseRule(`${id} is empty`), //display issue only
			parseRule(`B.${metric} >= 5`), //wrong id
			parseRule(`${id}.height >= 5`), //wrong metric
			//only checking for single-level constants
			parseRule(`${id}.${metric} = 5 + 1`),
			parseRule(`${id}.${metric} >= 5 + 1`),
			parseRule(`${id}.${metric} = B.height`),
			parseRule(`${id}.${metric} >= B.height`),
		],
		isValidMetric: isValidMetric,
	};

	let result = blueprint.isValidMetric(id, metric, 0);

	assert.true(result, "");
});

QUnit.test("is valid metric: IS ODD", function( assert ) {
	let id = 'A';
	let metric = 'width';
	let blueprint = {
		rules: [
			parseRule(`${id}.${metric} is odd`),
		],
		isValidMetric: isValidMetric,
	};

	let result = blueprint.isValidMetric(id, metric, 3);

	assert.true(result, "true");
	
	//----------------------------

	result = blueprint.isValidMetric(id, metric, 4);

	assert.false(result, "false");
});

QUnit.test("is valid metric: IS EVEN", function( assert ) {
	let id = 'A';
	let metric = 'width';
	let blueprint = {
		rules: [
			parseRule(`${id}.${metric} is even`),
		],
		isValidMetric: isValidMetric,
	};

	let result = blueprint.isValidMetric(id, metric, 4);

	assert.true(result, "true");
	
	//----------------------------

	result = blueprint.isValidMetric(id, metric, 3);

	assert.false(result, "false");
});

QUnit.test("is valid metric: EQUAL CONSTANT", function( assert ) {
	let id = 'A';
	let metric = 'width';
	let value = 1;
	let blueprint = {
		rules: [
			parseRule(`${id}.${metric} = ${value}`),
		],
		isValidMetric: isValidMetric,
	};

	let result = blueprint.isValidMetric(id, metric, value);

	assert.true(result, "true");
	
	//----------------------------

	blueprint = {
		rules: [
			parseRule(`${id}.${metric} = ${value + 1}`),
		],
		isValidMetric: isValidMetric,
	};

	result = blueprint.isValidMetric(id, metric, value);

	assert.false(result, "false");
});

QUnit.test("is valid metric: GREATER OR EQUAL CONSTANT", function( assert ) {
	let id = 'A';
	let metric = 'width';
	let value = 1;
	let blueprint = {
		rules: [
			parseRule(`${id}.${metric} >= ${value}`),
		],
		isValidMetric: isValidMetric,
	};

	let result = blueprint.isValidMetric(id, metric, value);

	assert.true(result, "true equal");
	
	//----------------------------

	blueprint = {
		rules: [
			parseRule(`${id}.${metric} >= ${value - 1}`),
		],
		isValidMetric: isValidMetric,
	};

	result = blueprint.isValidMetric(id, metric, value);

	assert.true(result, "true greater");
	
	//----------------------------

	blueprint = {
		rules: [
			parseRule(`${id}.${metric} >= ${value + 1}`),
		],
		isValidMetric: isValidMetric,
	};

	result = blueprint.isValidMetric(id, metric, value);

	assert.false(result, "false less than");
});

QUnit.test("is valid metric: CHECKS ALL RULES", function( assert ) {
	let id = 'A';
	let metric = 'width';
	let blueprint = {
		rules: [
			parseRule(`${id}.${metric} >= 0`),
			parseRule(`${id}.${metric} is even`),
		],
		isValidMetric: isValidMetric,
	};

	let result = blueprint.isValidMetric(id, metric, 4);

	assert.true(result, "true");
	
	//----------------------------

	result = blueprint.isValidMetric(id, metric, 3);

	assert.false(result, "false");
});
