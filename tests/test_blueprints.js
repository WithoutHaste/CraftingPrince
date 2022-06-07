
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
			type: CALC_TYPES.CONSTANT,
			constant: 2,
		},
	};

	rule = parseRule(raw);

	assert.deepEqual(rule, expected, "rule deep equal");
});

QUnit.test("rule parsing: EQUAL METRIC", function( assert ) {
	let raw = "A.width = B.width";
	let expected = {
		raw: raw,
		type: RULE_TYPES.EQUAL,
		left: {
			id: "A",
			metric: "width",
		},
		right: {
			type: CALC_TYPES.METRIC,
			id: "B",
			metric: "width",
		},
	};

	let rule = parseRule(raw);

	assert.deepEqual(rule, expected, "rule deep equal");

	//------------------------------------

	raw = "A.width = B.height";
	expected = {
		raw: raw,
		type: RULE_TYPES.EQUAL,
		left: {
			id: "A",
			metric: "width",
		},
		right: {
			type: CALC_TYPES.METRIC,
			id: "B",
			metric: "height",
		},
	};

	rule = parseRule(raw);

	assert.deepEqual(rule, expected, "rule deep equal");
});

QUnit.test("rule parsing: EQUAL MULTIPLY CONST METRIC", function( assert ) {
	let raw = "A.width = 3 * B.height";
	let expected = {
		raw: raw,
		type: RULE_TYPES.EQUAL,
		left: {
			id: "A",
			metric: "width",
		},
		right: {
			type: CALC_TYPES.MULTIPLY,
			left: {
				type: CALC_TYPES.CONSTANT,
				constant: 3,
			},
			right: {
				type: CALC_TYPES.METRIC,
				id: "B",
				metric: "height",
			},
		},
	};

	let rule = parseRule(raw);

	assert.deepEqual(rule, expected, "rule deep equal");
});
//TODO the other multiply variations
/*
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

QUnit.test("rule parsing: EQUAL ADDITION METRIC CONST", function( assert ) {
	let raw = "A.width = B.height + 2";
	let expected = {
		raw: raw,
		type: RULE_TYPES.EQUAL,
		left: {
			id: "A",
			metric: "width",
		},
		right: {
			raw: "B.height + 2",
			type: CALC_TYPES.ADD,
			left: {
				raw: "B.height",
				type: CALC_TYPES.MULTIPLY,
				constant: 1,
				variable: {
					id: "B",
					metric: "height",
				},
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

QUnit.test("rule parsing: EQUAL ADDITION CONST METRIC", function( assert ) {
	let raw = "A.width = 2 + B.height";
	let expected = {
		raw: raw,
		type: RULE_TYPES.EQUAL,
		left: {
			id: "A",
			metric: "width",
		},
		right: {
			raw: "2 + B.height",
			type: CALC_TYPES.ADD,
			left: {
				raw: "2",
				type: CALC_TYPES.CONSTANT,
				constant: 2,
			},
			right: {
				raw: "B.height",
				type: CALC_TYPES.MULTIPLY,
				constant: 1,
				variable: {
					id: "B",
					metric: "height",
				},
			},
		},
	};
	
	let rule = parseRule(raw);
	
	assert.deepEqual(rule, expected, "rule deep equal");
});

QUnit.test("rule parsing: EQUAL ADDITION METRIC METRIC", function( assert ) {
	let raw = "A.width = B.height + 2c.width";
	let expected = {
		raw: raw,
		type: RULE_TYPES.EQUAL,
		left: {
			id: "A",
			metric: "width",
		},
		right: {
			raw: "B.height + 2c.width",
			type: CALC_TYPES.ADD,
			left: {
				raw: "B.height",
				type: CALC_TYPES.MULTIPLY,
				constant: 1,
				variable: {
					id: "B",
					metric: "height",
				},
			},
			right: {
				raw: "2c.width",
				type: CALC_TYPES.MULTIPLY,
				constant: 2,
				variable: {
					id: "c",
					metric: "width",
				},
			},
		},
	};
	
	let rule = parseRule(raw);
	
	assert.deepEqual(rule, expected, "rule deep equal");
});

QUnit.test("rule parsing: EQUAL DIVISION CONST CONST", function( assert ) {
	let raw = "A.width = 1 / 2";
	let expected = {
		raw: raw,
		type: RULE_TYPES.EQUAL,
		left: {
			id: "A",
			metric: "width",
		},
		right: {
			raw: "1 / 2",
			type: CALC_TYPES.DIVIDE,
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

QUnit.test("rule parsing: EQUAL DIVISION METRIC CONST", function( assert ) {
	let raw = "A.width = B.height / 2";
	let expected = {
		raw: raw,
		type: RULE_TYPES.EQUAL,
		left: {
			id: "A",
			metric: "width",
		},
		right: {
			raw: "B.height / 2",
			type: CALC_TYPES.DIVIDE,
			left: {
				raw: "B.height",
				type: CALC_TYPES.MULTIPLY,
				constant: 1,
				variable: {
					id: "B",
					metric: "height",
				},
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

QUnit.test("rule parsing: EQUAL DIVISION CONST METRIC", function( assert ) {
	let raw = "A.width = 2 / B.height";
	let expected = {
		raw: raw,
		type: RULE_TYPES.EQUAL,
		left: {
			id: "A",
			metric: "width",
		},
		right: {
			raw: "2 / B.height",
			type: CALC_TYPES.DIVIDE,
			left: {
				raw: "2",
				type: CALC_TYPES.CONSTANT,
				constant: 2,
			},
			right: {
				raw: "B.height",
				type: CALC_TYPES.MULTIPLY,
				constant: 1,
				variable: {
					id: "B",
					metric: "height",
				},
			},
		},
	};
	
	let rule = parseRule(raw);
	
	assert.deepEqual(rule, expected, "rule deep equal");
});

QUnit.test("rule parsing: EQUAL DIVISION METRIC METRIC", function( assert ) {
	let raw = "A.width = B.height / 2c.width";
	let expected = {
		raw: raw,
		type: RULE_TYPES.EQUAL,
		left: {
			id: "A",
			metric: "width",
		},
		right: {
			raw: "B.height / 2c.width",
			type: CALC_TYPES.DIVIDE,
			left: {
				raw: "B.height",
				type: CALC_TYPES.MULTIPLY,
				constant: 1,
				variable: {
					id: "B",
					metric: "height",
				},
			},
			right: {
				raw: "2c.width",
				type: CALC_TYPES.MULTIPLY,
				constant: 2,
				variable: {
					id: "c",
					metric: "width",
				},
			},
		},
	};
	
	let rule = parseRule(raw);
	
	assert.deepEqual(rule, expected, "rule deep equal");
});

QUnit.test("rule parsing: EQUAL SUBCALC DIVISION ADDITION", function( assert ) {
	let raw = "A.width = (B.height + 3) / 2";
	let expected = {
		raw: raw,
		type: RULE_TYPES.EQUAL,
		left: {
			id: "A",
			metric: "width",
		},
		right: {
			raw: "(B.height + 3) / 2",
			type: CALC_TYPES.DIVIDE,
			left: {
				raw: "B.height + 3",
				type: CALC_TYPES.ADD,
				left: {
					raw: "B.height",
					type: CALC_TYPES.MULTIPLY,
					constant: 1,
					variable: {
						id: "B",
						metric: "height",
					},
				},
				right: {
					raw: "3",
					type: CALC_TYPES.CONSTANT,
					constant: 3,
				},
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



*/