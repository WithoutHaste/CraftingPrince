QUnit.test("run rule calculation: CONSTANT", function( assert ) {
	let rule = parseRule(`A.width = 5`);
	let blueprint = {
		metrics: {
		},
		runRuleRightSideCalculation: runRuleRightSideCalculation,
	};

	let result = blueprint.runRuleRightSideCalculation(rule.right);

	assert.equal(result, 5, "");
});

QUnit.test("run rule calculation: CONSTANT + CONSTANT", function( assert ) {
	let rule = parseRule(`A.width = 5 + 2`);
	let blueprint = {
		metrics: {
		},
		runRuleRightSideCalculation: runRuleRightSideCalculation,
	};

	let result = blueprint.runRuleRightSideCalculation(rule.right);

	assert.equal(result, 7, "");
});

QUnit.test("run rule calculation: CONSTANT - CONSTANT", function( assert ) {
	let rule = parseRule(`A.width = 5 - 3`);
	let blueprint = {
		metrics: {
		},
		runRuleRightSideCalculation: runRuleRightSideCalculation,
	};

	let result = blueprint.runRuleRightSideCalculation(rule.right);

	assert.equal(result, 2, "");
});

QUnit.test("run rule calculation: CONSTANT * CONSTANT", function( assert ) {
	let rule = parseRule(`A.width = 5 * 3`);
	let blueprint = {
		metrics: {
		},
		runRuleRightSideCalculation: runRuleRightSideCalculation,
	};

	let result = blueprint.runRuleRightSideCalculation(rule.right);

	assert.equal(result, 15, "");
});

QUnit.test("run rule calculation: CONSTANT / CONSTANT", function( assert ) {
	let rule = parseRule(`A.width = 15 / 3`);
	let blueprint = {
		metrics: {
		},
		runRuleRightSideCalculation: runRuleRightSideCalculation,
	};

	let result = blueprint.runRuleRightSideCalculation(rule.right);

	assert.equal(result, 5, "exact");
	
	//------------------------------

	rule = parseRule(`A.width = 16 / 3`);

	result = blueprint.runRuleRightSideCalculation(rule.right);

	assert.equal(result, 5, "floor to integer");
});

QUnit.test("run rule calculation: METRIC", function( assert ) {
	let rule = parseRule(`A.width = B.height`);
	let blueprint = {
		metrics: {
			B: {
				height: 4
			}
		},
		runRuleRightSideCalculation: runRuleRightSideCalculation,
	};

	let result = blueprint.runRuleRightSideCalculation(rule.right);

	assert.equal(result, 4, "");
});

QUnit.test("run rule calculation: METRIC + CONSTANT", function( assert ) {
	let rule = parseRule(`A.width = B.height + 2`);
	let blueprint = {
		metrics: {
			B: {
				height: 4,
			}
		},
		runRuleRightSideCalculation: runRuleRightSideCalculation,
	};

	let result = blueprint.runRuleRightSideCalculation(rule.right);

	assert.equal(result, 6, "");
});

QUnit.test("run rule calculation: METRIC + METRIC", function( assert ) {
	let rule = parseRule(`A.width = B.height + B.width`);
	let blueprint = {
		metrics: {
			B: {
				width: 2,
				height: 4,
			}
		},
		runRuleRightSideCalculation: runRuleRightSideCalculation,
	};

	let result = blueprint.runRuleRightSideCalculation(rule.right);

	assert.equal(result, 6, "");
});
