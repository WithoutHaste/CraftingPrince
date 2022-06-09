
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
			raw: "B.width",
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
			raw: "B.height",
			type: CALC_TYPES.METRIC,
			id: "B",
			metric: "height",
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

QUnit.test("rule parsing: EQUAL MULTIPLY CONST CONST", function( assert ) {
	let raw = "A.width = 3 * 1";
	let expected = {
		raw: raw,
		type: RULE_TYPES.EQUAL,
		left: {
			id: "A",
			metric: "width",
		},
		right: {
			raw: "3 * 1",
			type: CALC_TYPES.MULTIPLY,
			left: {
				type: CALC_TYPES.CONSTANT,
				constant: 3,
			},
			right: {
				type: CALC_TYPES.CONSTANT,
				constant: 1,
			},
		},
	};

	let rule = parseRule(raw);

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
			raw: "3 * B.height",
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

QUnit.test("rule parsing: EQUAL MULTIPLY METRIC CONST", function( assert ) {
	let raw = "A.width = B.height * 3";
	let expected = {
		raw: raw,
		type: RULE_TYPES.EQUAL,
		left: {
			id: "A",
			metric: "width",
		},
		right: {
			raw: "B.height * 3",
			type: CALC_TYPES.MULTIPLY,
			left: {
				type: CALC_TYPES.METRIC,
				id: "B",
				metric: "height",
			},
			right: {
				type: CALC_TYPES.CONSTANT,
				constant: 3,
			},
		},
	};

	let rule = parseRule(raw);

	assert.deepEqual(rule, expected, "rule deep equal");
});

QUnit.test("rule parsing: EQUAL MULTIPLY METRIC METRIC", function( assert ) {
	let raw = "A.width = B.height * c.width";
	let expected = {
		raw: raw,
		type: RULE_TYPES.EQUAL,
		left: {
			id: "A",
			metric: "width",
		},
		right: {
			raw: "B.height * c.width",
			type: CALC_TYPES.MULTIPLY,
			left: {
				type: CALC_TYPES.METRIC,
				id: "B",
				metric: "height",
			},
			right: {
				type: CALC_TYPES.METRIC,
				id: "c",
				metric: "width",
			},
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
				type: CALC_TYPES.CONSTANT,
				constant: 1,
			},
			right: {
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
				type: CALC_TYPES.METRIC,
				id: "B",
				metric: "height",
			},
			right: {
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
				type: CALC_TYPES.CONSTANT,
				constant: 2,
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

QUnit.test("rule parsing: EQUAL ADDITION METRIC METRIC", function( assert ) {
	let raw = "A.width = B.height + c.width";
	let expected = {
		raw: raw,
		type: RULE_TYPES.EQUAL,
		left: {
			id: "A",
			metric: "width",
		},
		right: {
			raw: "B.height + c.width",
			type: CALC_TYPES.ADD,
			left: {
				type: CALC_TYPES.METRIC,
				id: "B",
				metric: "height",
			},
			right: {
				type: CALC_TYPES.METRIC,
				id: "c",
				metric: "width",
			},
		},
	};
	
	let rule = parseRule(raw);
	
	assert.deepEqual(rule, expected, "rule deep equal");
});

QUnit.test("rule parsing: EQUAL DIVISION CONST CONST", function( assert ) {
	let raw = "A.width = 4 / 2";
	let expected = {
		raw: raw,
		type: RULE_TYPES.EQUAL,
		left: {
			id: "A",
			metric: "width",
		},
		right: {
			raw: "4 / 2",
			type: CALC_TYPES.DIVIDE,
			left: {
				type: CALC_TYPES.CONSTANT,
				constant: 4,
			},
			right: {
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
				type: CALC_TYPES.METRIC,
				id: "B",
				metric: "height",
			},
			right: {
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
				type: CALC_TYPES.CONSTANT,
				constant: 2,
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

QUnit.test("rule parsing: EQUAL DIVISION METRIC METRIC", function( assert ) {
	let raw = "A.width = B.height / c.width";
	let expected = {
		raw: raw,
		type: RULE_TYPES.EQUAL,
		left: {
			id: "A",
			metric: "width",
		},
		right: {
			raw: "B.height / c.width",
			type: CALC_TYPES.DIVIDE,
			left: {
				type: CALC_TYPES.METRIC,
				id: "B",
				metric: "height",
			},
			right: {
				type: CALC_TYPES.METRIC,
				id: "c",
				metric: "width",
			},
		},
	};
	
	let rule = parseRule(raw);
	
	assert.deepEqual(rule, expected, "rule deep equal");
});

QUnit.test("rule parsing: EQUAL SUBTRACT CONST CONST", function( assert ) {
	let raw = "A.width = 4 - 2";
	let expected = {
		raw: raw,
		type: RULE_TYPES.EQUAL,
		left: {
			id: "A",
			metric: "width",
		},
		right: {
			raw: "4 - 2",
			type: CALC_TYPES.SUBTRACT,
			left: {
				type: CALC_TYPES.CONSTANT,
				constant: 4,
			},
			right: {
				type: CALC_TYPES.CONSTANT,
				constant: 2,
			},
		},
	};
	
	let rule = parseRule(raw);
	
	assert.deepEqual(rule, expected, "rule deep equal");
});

QUnit.test("rule parsing: EQUAL SUBTRACT METRIC CONST", function( assert ) {
	let raw = "A.width = B.height - 2";
	let expected = {
		raw: raw,
		type: RULE_TYPES.EQUAL,
		left: {
			id: "A",
			metric: "width",
		},
		right: {
			raw: "B.height - 2",
			type: CALC_TYPES.SUBTRACT,
			left: {
				type: CALC_TYPES.METRIC,
				id: "B",
				metric: "height",
			},
			right: {
				type: CALC_TYPES.CONSTANT,
				constant: 2,
			},
		},
	};
	
	let rule = parseRule(raw);
	
	assert.deepEqual(rule, expected, "rule deep equal");
});

QUnit.test("rule parsing: EQUAL SUBTRACT CONST METRIC", function( assert ) {
	let raw = "A.width = 2 - B.height";
	let expected = {
		raw: raw,
		type: RULE_TYPES.EQUAL,
		left: {
			id: "A",
			metric: "width",
		},
		right: {
			raw: "2 - B.height",
			type: CALC_TYPES.SUBTRACT,
			left: {
				type: CALC_TYPES.CONSTANT,
				constant: 2,
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

QUnit.test("rule parsing: EQUAL SUBTRACT METRIC METRIC", function( assert ) {
	let raw = "A.width = B.height - c.width";
	let expected = {
		raw: raw,
		type: RULE_TYPES.EQUAL,
		left: {
			id: "A",
			metric: "width",
		},
		right: {
			raw: "B.height - c.width",
			type: CALC_TYPES.SUBTRACT,
			left: {
				type: CALC_TYPES.METRIC,
				id: "B",
				metric: "height",
			},
			right: {
				type: CALC_TYPES.METRIC,
				id: "c",
				metric: "width",
			},
		},
	};
	
	let rule = parseRule(raw);
	
	assert.deepEqual(rule, expected, "rule deep equal");
});

QUnit.test("rule parsing: EQUAL SUBCALC (A + B) / C", function( assert ) {
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
				type: CALC_TYPES.ADD,
				left: {
					type: CALC_TYPES.METRIC,
					id: "B",
					metric: "height",
				},
				right: {
					type: CALC_TYPES.CONSTANT,
					constant: 3,
				},
			},
			right: {
				type: CALC_TYPES.CONSTANT,
				constant: 2,
			},
		},
	};
	
	let rule = parseRule(raw);
	
	assert.deepEqual(rule, expected, "rule deep equal");
});

QUnit.test("rule parsing: EQUAL SUBCALC A + (B / C)", function( assert ) {
	let raw = "A.width = B.height + (3 / 2)";
	let expected = {
		raw: raw,
		type: RULE_TYPES.EQUAL,
		left: {
			id: "A",
			metric: "width",
		},
		right: {
			raw: "B.height + (3 / 2)",
			type: CALC_TYPES.ADD,
			left: {
				type: CALC_TYPES.METRIC,
				id: "B",
				metric: "height",
			},
			right: {
				type: CALC_TYPES.DIVIDE,
				left: {
					type: CALC_TYPES.CONSTANT,
					constant: 3,
				},
				right: {
					type: CALC_TYPES.CONSTANT,
					constant: 2,
				},
			},
		},
	};
	
	let rule = parseRule(raw);
	
	assert.deepEqual(rule, expected, "rule deep equal");
});

QUnit.test("rule parsing: EQUAL SUBCALC (A * B) - (C + D)", function( assert ) {
	let raw = "A.width = (B.height * c.width) - (3 + D.height)";
	let expected = {
		raw: raw,
		type: RULE_TYPES.EQUAL,
		left: {
			id: "A",
			metric: "width",
		},
		right: {
			raw: "(B.height * c.width) - (3 + D.height)",
			type: CALC_TYPES.SUBTRACT,
			left: {
				type: CALC_TYPES.MULTIPLY,
				left: {
					type: CALC_TYPES.METRIC,
					id: "B",
					metric: "height",
				},
				right: {
					type: CALC_TYPES.METRIC,
					id: "c",
					metric: "width",
				},
			},
			right: {
				type: CALC_TYPES.ADD,
				left: {
					type: CALC_TYPES.CONSTANT,
					constant: 3,
				},
				right: {
					type: CALC_TYPES.METRIC,
					id: "D",
					metric: "height",
				},
			},
		},
	};
	
	let rule = parseRule(raw);
	
	assert.deepEqual(rule, expected, "rule deep equal");
});

QUnit.test("rule parsing: EQUAL SUBCALC ((A * B) - C) + D", function( assert ) {
	let raw = "A.width = ((B.height * c.width) - 3) + D.height";
	let expected = {
		raw: raw,
		type: RULE_TYPES.EQUAL,
		left: {
			id: "A",
			metric: "width",
		},
		right: {
			raw: "((B.height * c.width) - 3) + D.height",
			type: CALC_TYPES.ADD,
			left: {
				type: CALC_TYPES.SUBTRACT,
				left: {
					type: CALC_TYPES.MULTIPLY,
					left: {
						type: CALC_TYPES.METRIC,
						id: "B",
						metric: "height",
					},
					right: {
						type: CALC_TYPES.METRIC,
						id: "c",
						metric: "width",
					},
				},
				right: {
					type: CALC_TYPES.CONSTANT,
					constant: 3,
				},
			},
			right: {
				type: CALC_TYPES.METRIC,
				id: "D",
				metric: "height",
			},
		},
	};
	
	let rule = parseRule(raw);
	
	assert.deepEqual(rule, expected, "rule deep equal");
});

QUnit.test("rule parsing: EQUAL SUBCALC A * B - C + D acts like ((A * B) - C) + D", function( assert ) {
	let raw = "A.width = B.height * c.width - 3 + D.height";
	let expected = {
		raw: raw,
		type: RULE_TYPES.EQUAL,
		left: {
			id: "A",
			metric: "width",
		},
		right: {
			raw: "B.height * c.width - 3 + D.height",
			type: CALC_TYPES.ADD,
			left: {
				type: CALC_TYPES.SUBTRACT,
				left: {
					type: CALC_TYPES.MULTIPLY,
					left: {
						type: CALC_TYPES.METRIC,
						id: "B",
						metric: "height",
					},
					right: {
						type: CALC_TYPES.METRIC,
						id: "c",
						metric: "width",
					},
				},
				right: {
					type: CALC_TYPES.CONSTANT,
					constant: 3,
				},
			},
			right: {
				type: CALC_TYPES.METRIC,
				id: "D",
				metric: "height",
			},
		},
	};
	
	let rule = parseRule(raw);
	
	assert.deepEqual(rule, expected, "rule deep equal");
});

QUnit.test("rule parsing: EQUAL SUBCALC A * (B - (C + D))", function( assert ) {
	let raw = "A.width = B.height * (c.width - (3 + D.height))";
	let expected = {
		raw: raw,
		type: RULE_TYPES.EQUAL,
		left: {
			id: "A",
			metric: "width",
		},
		right: {
			raw: "B.height * (c.width - (3 + D.height))",
			type: CALC_TYPES.MULTIPLY,
			left: {
				type: CALC_TYPES.METRIC,
				id: "B",
				metric: "height",
			},
			right: {
				type: CALC_TYPES.SUBTRACT,
				left: {
					type: CALC_TYPES.METRIC,
					id: "c",
					metric: "width",
				},
				right: {
					type: CALC_TYPES.ADD,
					left: {
						type: CALC_TYPES.CONSTANT,
						constant: 3,
					},
					right: {
						type: CALC_TYPES.METRIC,
						id: "D",
						metric: "height",
					},
				},
			},
		},
	};
	
	let rule = parseRule(raw);
	
	assert.deepEqual(rule, expected, "rule deep equal");
});

QUnit.test("rule parsing: EQUAL SUBCALC A * (B - C) / D", function( assert ) {
	let raw = "A.width = B.height * (c.width - 3) / D.height";
	let expected = {
		raw: raw,
		type: RULE_TYPES.EQUAL,
		left: {
			id: "A",
			metric: "width",
		},
		right: {
			raw: "B.height * (c.width - 3) / D.height",
			type: CALC_TYPES.MULTIPLY,
			left: {
				type: CALC_TYPES.METRIC,
				id: "B",
				metric: "height",
			},
			right: {
				type: CALC_TYPES.DIVIDE,
				left: {
					type: CALC_TYPES.SUBTRACT,
					left: {
						type: CALC_TYPES.METRIC,
						id: "c",
						metric: "width",
					},
					right: {
						type: CALC_TYPES.CONSTANT,
						constant: 3,
					},
				},
				right: {
					type: CALC_TYPES.METRIC,
					id: "D",
					metric: "height",
				},
			},
		},
	};
	
	let rule = parseRule(raw);
	
	assert.deepEqual(rule, expected, "rule deep equal");
});

