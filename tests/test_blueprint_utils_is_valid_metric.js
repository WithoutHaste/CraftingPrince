QUnit.test("is valid metric: NEGATIVE", function( assert ) {
	let blueprint = {
		rules: [],
		isValidMetric: isValidMetric,
		runRuleRightSideCalculation: runRuleRightSideCalculation,
	};

	let result = blueprint.isValidMetric('A', 'width', -1);

	assert.false(result, "");
});

QUnit.test("is valid metric: NO RULES", function( assert ) {
	let blueprint = {
		rules: [],
		isValidMetric: isValidMetric,
		runRuleRightSideCalculation: runRuleRightSideCalculation,
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
			parseRule(`${id} travels vertically with B`), //movement rule
			parseRule(`${id} is center`), //movement rule
			parseRule(`B.${metric} >= 5`), //wrong id
			parseRule(`${id}.height >= 5`), //wrong metric
		],
		isValidMetric: isValidMetric,
		runRuleRightSideCalculation: runRuleRightSideCalculation,
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
		runRuleRightSideCalculation: runRuleRightSideCalculation,
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
		runRuleRightSideCalculation: runRuleRightSideCalculation,
	};

	let result = blueprint.isValidMetric(id, metric, 4);

	assert.true(result, "true");
	
	//----------------------------

	result = blueprint.isValidMetric(id, metric, 3);

	assert.false(result, "false");
});

QUnit.test("is valid metric: IS MULTIPLE", function( assert ) {
	let id = 'A';
	let metric = 'width';
	let multiple = 3;
	let blueprint = {
		rules: [
			parseRule(`${id}.${metric} is multiple of ${multiple}`),
		],
		isValidMetric: isValidMetric,
		runRuleRightSideCalculation: runRuleRightSideCalculation,
	};

	let result = blueprint.isValidMetric(id, metric, 3);

	assert.true(result, "1x");
	
	//----------------------------

	result = blueprint.isValidMetric(id, metric, 6);
	assert.true(result, "2x");
	
	//----------------------------

	result = blueprint.isValidMetric(id, metric, 4);
	assert.false(result, "+1");
});

QUnit.test("is valid metric: IS PRIME", function( assert ) {
	let id = 'A';
	let metric = 'width';
	let blueprint = {
		rules: [
			parseRule(`${id}.${metric} is prime`),
		],
		isValidMetric: isValidMetric,
		runRuleRightSideCalculation: runRuleRightSideCalculation,
	};

	let result = blueprint.isValidMetric(id, metric, 1);

	assert.false(result, "1");
	
	//----------------------------

	result = blueprint.isValidMetric(id, metric, 2);
	assert.true(result, "2");
	
	//----------------------------

	result = blueprint.isValidMetric(id, metric, 3);
	assert.true(result, "3");
	
	//----------------------------

	result = blueprint.isValidMetric(id, metric, 4);
	assert.false(result, "4");
	
	//----------------------------

	result = blueprint.isValidMetric(id, metric, 5);
	assert.true(result, "5");
	
	//----------------------------

	result = blueprint.isValidMetric(id, metric, 6);
	assert.false(result, "6");
	
	//----------------------------

	result = blueprint.isValidMetric(id, metric, 7);
	assert.true(result, "7");
	
	//----------------------------

	result = blueprint.isValidMetric(id, metric, 8);
	assert.false(result, "8");
	
	//----------------------------

	result = blueprint.isValidMetric(id, metric, 9);
	assert.false(result, "9");
	
	//----------------------------

	result = blueprint.isValidMetric(id, metric, 10);
	assert.false(result, "10");
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
		runRuleRightSideCalculation: runRuleRightSideCalculation,
	};

	let result = blueprint.isValidMetric(id, metric, value);

	assert.true(result, "true");
	
	//----------------------------

	blueprint = {
		rules: [
			parseRule(`${id}.${metric} = ${value + 1}`),
		],
		isValidMetric: isValidMetric,
		runRuleRightSideCalculation: runRuleRightSideCalculation,
	};

	result = blueprint.isValidMetric(id, metric, value);

	assert.false(result, "false");
});

QUnit.test("is valid metric: LESS OR EQUAL CONSTANT", function( assert ) {
	let id = 'A';
	let metric = 'width';
	let value = 1;
	let blueprint = {
		rules: [
			parseRule(`${id}.${metric} <= ${value}`),
		],
		isValidMetric: isValidMetric,
		runRuleRightSideCalculation: runRuleRightSideCalculation,
	};

	let result = blueprint.isValidMetric(id, metric, value);

	assert.true(result, "true equal");
	
	//----------------------------

	blueprint = {
		rules: [
			parseRule(`${id}.${metric} <= ${value + 1}`),
		],
		isValidMetric: isValidMetric,
		runRuleRightSideCalculation: runRuleRightSideCalculation,
	};

	result = blueprint.isValidMetric(id, metric, value);

	assert.true(result, "true less");
	
	//----------------------------

	blueprint = {
		rules: [
			parseRule(`${id}.${metric} <= ${value - 1}`),
		],
		isValidMetric: isValidMetric,
		runRuleRightSideCalculation: runRuleRightSideCalculation,
	};

	result = blueprint.isValidMetric(id, metric, value);

	assert.false(result, "false greater than");
});

QUnit.test("is valid metric: LESS CONSTANT", function( assert ) {
	let id = 'A';
	let metric = 'width';
	let value = 1;
	let blueprint = {
		rules: [
			parseRule(`${id}.${metric} < ${value + 1}`),
		],
		isValidMetric: isValidMetric,
		runRuleRightSideCalculation: runRuleRightSideCalculation,
	};

	let result = blueprint.isValidMetric(id, metric, value);

	assert.true(result, "true less");
	
	//----------------------------

	blueprint = {
		rules: [
			parseRule(`${id}.${metric} < ${value}`),
		],
		isValidMetric: isValidMetric,
		runRuleRightSideCalculation: runRuleRightSideCalculation,
	};

	result = blueprint.isValidMetric(id, metric, value);

	assert.false(result, "false equal");
});

QUnit.test("is valid metric: LESS METRIC", function( assert ) {
	let id = 'A';
	let metric = 'width';
	let value = 1;
	let blueprint = {
		rules: [
			parseRule(`${id}.${metric} < B.height`),
		],
		metrics: {
			B: {
				height: value + 1
			}
		},
		isValidMetric: isValidMetric,
		runRuleRightSideCalculation: runRuleRightSideCalculation,
	};

	let result = blueprint.isValidMetric(id, metric, value);

	assert.true(result, "true less");
	
	//----------------------------

	blueprint = {
		rules: [
			parseRule(`${id}.${metric} < B.height`),
		],
		metrics: {
			B: {
				height: value
			}
		},
		isValidMetric: isValidMetric,
		runRuleRightSideCalculation: runRuleRightSideCalculation,
	};

	result = blueprint.isValidMetric(id, metric, value);

	assert.false(result, "false equal");
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
		runRuleRightSideCalculation: runRuleRightSideCalculation,
	};

	let result = blueprint.isValidMetric(id, metric, value);

	assert.true(result, "true equal");
	
	//----------------------------

	blueprint = {
		rules: [
			parseRule(`${id}.${metric} >= ${value - 1}`),
		],
		isValidMetric: isValidMetric,
		runRuleRightSideCalculation: runRuleRightSideCalculation,
	};

	result = blueprint.isValidMetric(id, metric, value);

	assert.true(result, "true greater");
	
	//----------------------------

	blueprint = {
		rules: [
			parseRule(`${id}.${metric} >= ${value + 1}`),
		],
		isValidMetric: isValidMetric,
		runRuleRightSideCalculation: runRuleRightSideCalculation,
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
		runRuleRightSideCalculation: runRuleRightSideCalculation,
	};

	let result = blueprint.isValidMetric(id, metric, 4);

	assert.true(result, "true");
	
	//----------------------------

	result = blueprint.isValidMetric(id, metric, 3);

	assert.false(result, "false");
});
