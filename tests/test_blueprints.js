
// TEST RULE PARSING ///////////////////////////////////////

QUnit.test("rule parsing: EQUAL CONSTANT", function( assert ) {
	let raw = "A.width = 1";
	let expected = {
		raw: raw,
		type: RULE_TYPES.EQUAL,
		left: {
			id: "A",
			metric: "width",
		},
		right: {
			raw: "1",
			type: CALC_TYPES.CONSTANT,
			constant: 1,
		},
	};

	let rule = parseRule(raw);

	assert.deepEqual(rule, expected, "rule deep equal");

	//------------------------------------

	raw = "A.height = 2";
	expected = {
		raw: raw,
		type: RULE_TYPES.EQUAL,
		left: {
			id: "A",
			metric: "height",
		},
		right: {
			raw: "2",
			type: CALC_TYPES.CONSTANT,
			constant: 2,
		},
	};

	rule = parseRule(raw);

	assert.deepEqual(rule, expected, "rule deep equal");
});

QUnit.test("rule parsing: EQUAL METRIC OR MULTIPLY", function( assert ) {
	let raw = "A.width = B.width";
	let expected = {
		raw: raw,
		type: RULE_TYPES.EQUAL,
		left: {
			id: "A",
			metric: "width",
		},
		right: {
			raw: "B.width",
			type: CALC_TYPES.MULTIPLY,
			constant: 1,
			variable: {
				id: "B",
				metric: "width",
			},
		},
	};

	let rule = parseRule(raw);

	assert.deepEqual(rule, expected, "rule deep equal");

	//------------------------------------

	raw = "A.width = 3B.height";
	expected = {
		raw: raw,
		type: RULE_TYPES.EQUAL,
		left: {
			id: "A",
			metric: "width",
		},
		right: {
			raw: "3B.height",
			type: CALC_TYPES.MULTIPLY,
			constant: 3,
			variable: {
				id: "B",
				metric: "height",
			},
		},
	};

	rule = parseRule(raw);

	assert.deepEqual(rule, expected, "rule deep equal");
});

QUnit.test("rule parsing: GREATER OR EQUAL CONSTANT", function( assert ) {
	let raw = "A.width >= 1";
	let expected = {
		raw: raw,
		type: RULE_TYPES.GREATER_OR_EQUAL,
		left: {
			id: "A",
			metric: "width",
		},
		right: {
			raw: "1",
			type: CALC_TYPES.CONSTANT,
			constant: 1,
		},
	};

	let rule = parseRule(raw);

	assert.deepEqual(rule, expected, "rule deep equal");
});

QUnit.test("rule parsing: EQUAL ADDITION CONST CONST", function( assert ) {
	let raw = "A.width = 1 + 2";
	let expected = {
		raw: raw,
		type: RULE_TYPES.EQUAL,
		left: {
			id: "A",
			metric: "width",
		},
		right: {
			raw: "1 + 2",
			type: CALC_TYPES.ADD,
			left: {
				raw: "1",
				type: CALC_TYPES.CONSTANT,
				constant: 1,
			},
			right: {
				raw: "2",
				type: CALC_TYPES.CONSTANT,
				constant: 2,
			},
		},
	};
	
	let rule = parseRule(raw);
	
	assert.deepEqual(rule, expected, "rule deep equal");
});




