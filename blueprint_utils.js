const RULE_TYPES = {
	NONE: "NONE",
	LESS: "LESS",
	LESS_OR_EQUAL: "LESS OR EQUAL",
	EQUAL: "EQUAL",
	GREATER_OR_EQUAL: "GREATER OR EQUAL",
	EMPTY_TILE: "EMPTY TILE",
	IS_ODD: "ODD",
	IS_EVEN: "EVEN",
	IS_MULTIPLE: "MULTIPLE",
	IS_PRIME: "PRIME",
	IS_CENTER: "CENTER",
	TRAVELS_WITH: "TRAVELS WITH",
};
const CALC_TYPES = {
	NONE: "NONE",
	CONSTANT: "CONSTANT",
	METRIC: "METRIC",
	ADD: "ADD",
	SUBTRACT: "SUBTRACT",
	MULTIPLY: "MULTIPLY",
	DIVIDE: "DIVIDE",
};
const isWhitespace = /^\s*$/;
const isId = /[a-wy-zA-WY-Z]/;
const isIdMetric = /^([a-wy-zA-WY-Z])\.(width|height)/;
const isLess = /^([a-zA-Z])\.(height|width) < (.*)$/;
const isLessOrEqual = /^([a-zA-Z])\.(height|width) <= (.*)$/;
const isEqual = /^([a-zA-Z])\.(height|width) = (.*)$/;
const isGreaterOrEqual = /^([a-zA-Z])\.(height|width) >= (.*)$/;
const isEmptyTile = /^([a-zA-Z]) is empty$/;
const isOdd = /^([a-zA-Z])\.(height|width) is odd$/;
const isEven = /^([a-zA-Z])\.(height|width) is even$/;
const isMultiple = /^([a-zA-Z])\.(height|width) is multiple of (\d+)$/;
const isPrime = /^([a-zA-Z])\.(height|width) is prime$/;
const isConstant = /^(\d+)$/;
const isAddition = /^(.*) \+ (.*)$/;
const isMultiplied = /^(\d*)([a-zA-Z])\.(height|width)$/;
const isDivided = /^(.*) \/ (.*)$/;
const isCenter = /^([a-zA-Z]) is center$/;
const isTravelsWith = /^([a-zA-Z]) travels with ([a-zA-Z])$/;

const numbersPrime = [
	2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97,
 	101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199,
 	211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293,
	307, 311, 313, 317, 331, 337, 347, 349, 353, 359, 367, 373, 379, 383, 389, 397,
 	401, 409, 419, 421, 431, 433, 439, 443, 449, 457, 461, 463, 467, 479, 487, 491, 499
]; //up to 500

function fillOutBlueprints() {
	for(let i = 0; i < blueprints.length; i++) {
		const blueprint = blueprints[i];
		blueprint.isValidMetric = isValidMetric;
		blueprint.propagateMetricChange = propagateMetricChange;
		blueprint.runRuleRightSideCalculation = runRuleRightSideCalculation;
		blueprint.getCenterId = getCenterId;
		blueprint.getTravelers = getTravelers;
	}	
}

/////////////////////////////////////////
//EXPECTS TO BE INSIDE A BLUEPRINT OBJECT
function isValidMetric(id, metric, value) {
	if(value < 0)
		return false;
	for(let i = 0; i < this.rules.length; i++) {
		const rule = this.rules[i];
		if(rule.type == RULE_TYPES.IS_ODD) {
			if(rule.id != id)
				continue;
			if(rule.metric != metric)
				continue;
			if(value % 2 != 1)
				return false;
		}
		if(rule.type == RULE_TYPES.IS_EVEN) {
			if(rule.id != id)
				continue;
			if(rule.metric != metric)
				continue;
			if(value % 2 != 0)
				return false;
		}
		if(rule.type == RULE_TYPES.IS_MULTIPLE) {
			if(rule.id != id)
				continue;
			if(rule.metric != metric)
				continue;
			if(value % rule.multiple != 0)
				return false;
		}
		if(rule.type == RULE_TYPES.IS_PRIME) {
			if(rule.id != id)
				continue;
			if(rule.metric != metric)
				continue;
			if(!numbersPrime.includes(value))
				return false;
		}

		if(!("left" in rule))
			continue;
		if(rule.left.id != id)
			continue;
		if(rule.left.metric != metric)
			continue;
		let rightSideValue = this.runRuleRightSideCalculation(rule.right);
		if(rule.type == RULE_TYPES.LESS) {
			if(!(value < rightSideValue))
				return false;
		}
		else if(rule.type == RULE_TYPES.LESS_OR_EQUAL) {
			if(!(value <= rightSideValue))
				return false;
		}
		else if(rule.type == RULE_TYPES.EQUAL) {
			if(value != rightSideValue)
				return false;
		}
		else if(rule.type == RULE_TYPES.GREATER_OR_EQUAL) {
			if(!(value >= rightSideValue))
				return false;
		}
	}
	return true;
}

function propagateMetricChange(id, metric) {
	for(let i = 0; i < this.rules.length; i++) {
		const rule = this.rules[i];
		if(rule.type != RULE_TYPES.EQUAL)
			continue;
		if(!ruleIsBasedOnIdMetric(rule.right, id, metric))
			continue;
		this.metrics[rule.left.id][rule.left.metric] = this.runRuleRightSideCalculation(rule.right);
	}
}

//returns true if id.metric is involved in this calculation
function ruleIsBasedOnIdMetric(rightSide, id, metric) {
	if(rightSide.type == CALC_TYPES.METRIC) {
		return (rightSide.id == id && rightSide.metric == metric);
	}
	if("left" in rightSide) {
		let result = ruleIsBasedOnIdMetric(rightSide.left, id, metric);
		if(result == true)
			return result;
	}
	if("right" in rightSide) {
		let result = ruleIsBasedOnIdMetric(rightSide.right, id, metric);
		if(result == true)
			return result;
	}
	return false;
}

function runRuleRightSideCalculation(rightSide) {
	switch(rightSide.type) {
		case CALC_TYPES.CONSTANT: return rightSide.constant;
		case CALC_TYPES.METRIC: return this.metrics[rightSide.id][rightSide.metric];
	}
	const left = this.runRuleRightSideCalculation(rightSide.left);
	const right = this.runRuleRightSideCalculation(rightSide.right);
	switch(rightSide.type) {
		case CALC_TYPES.ADD: return left + right;
		case CALC_TYPES.SUBTRACT: return left - right;
		case CALC_TYPES.MULTIPLY: return left * right;
		case CALC_TYPES.DIVIDE: return Math.floor(left / right);
	}
}

//limit - one center per blueprint
function getCenterId() {
	for(let i = 0; i < this.rules.length; i++) {
		let rule = this.rules[i];
		if(rule.type == RULE_TYPES.IS_CENTER) {
			return rule.id;
		}
	}
	return null;
}

//returns an array of ids
function getTravelers(withId) {
	var result = [];
	for(let i = 0; i < this.rules.length; i++) {
		var rule = this.rules[i];
		if(rule.type != RULE_TYPES.TRAVELS_WITH)
			continue;
		if(rule.withId != withId)
			continue;
		result.push(rule.id);
	}
	return result;
}
//END INSIDE BLUEPRINT OBJECT
/////////////////////////////

function parseBlueprint(blueprint) {
	let pattern = "";
	let lines = blueprint.raw.split("\n");
	let startedPattern = false;
	let i = 0;
	for(i=0; i<lines.length; i++)
	{
		if(isWhitespace.test(lines[i])) {
			if(startedPattern) {
				//we've reached the end
				break;
			}
			//haven't found anything yet
			continue;
		}
		//within the pattern section
		startedPattern = true;
		pattern = pattern + '\n' + lines[i].replace('\t',' ');
	}
	blueprint.pattern = pattern
	initializeMetricValues(blueprint);
	blueprint.emptyIds = [' '];
	
	let rules = [];
	let startedRules = false;
	for(i=i; i<lines.length; i++)
	{
		if(isWhitespace.test(lines[i])) {
			if(startedRules) {
				//we've reached the end
				break;
			}
			//haven't found anything yet
			continue;
		}
		//within the rules section
		startedRules = true;
		let rule = parseRule(lines[i]);
		rules.push(rule);
		if(rule.type == RULE_TYPES.EMPTY_TILE) {
			blueprint.emptyIds.push(rule.id);
		}
	}
	blueprint.rules = rules
}

function initializeMetricValues(blueprint) {
	const ids = [];
	for(let i = 0; i < blueprint.pattern.length; i++) {
		if(isNewId(ids, blueprint.pattern[i])) {
			ids.push(blueprint.pattern[i]);
		}
	}
	blueprint.ids = ids;
	blueprint.metrics = {};
	for(let i = 0; i < ids.length; i++) {
		blueprint.metrics[ids[i]] = { 
			width: null,
			height: null, 
		};
	}
	
	function isNewId(ids, candidate) {
		if(!isId.test(candidate))
			return false;
		if(ids.includes(candidate))
			return false;
		return true;
	}
}

//take in one line of raw rule-text
//return rule object
function parseRule(raw) {
	raw = raw.trim();
	let rule = {
		raw: raw,
		type: RULE_TYPES.NONE,
	};

	let matches = raw.match(isLess);
	if(matches != null) {
		rule.type = RULE_TYPES.LESS;
		rule.left = {
			id: matches[1],
			metric: matches[2],
		};
		rule.right = parseRuleRightSide(matches[3]);
		return rule;
	}

	matches = raw.match(isLessOrEqual);
	if(matches != null) {
		rule.type = RULE_TYPES.LESS_OR_EQUAL;
		rule.left = {
			id: matches[1],
			metric: matches[2],
		};
		rule.right = parseRuleRightSide(matches[3]);
		return rule;
	}

	matches = raw.match(isEqual);
	if(matches != null) {
		rule.type = RULE_TYPES.EQUAL;
		rule.left = {
			id: matches[1],
			metric: matches[2],
		};
		rule.right = parseRuleRightSide(matches[3]);
		return rule;
	}

	matches = raw.match(isGreaterOrEqual);
	if(matches != null) {
		rule.type = RULE_TYPES.GREATER_OR_EQUAL;
		rule.left = {
			id: matches[1],
			metric: matches[2],
		};
		rule.right = parseRuleRightSide(matches[3]);
		return rule;
	}

	matches = raw.match(isEmptyTile);
	if(matches != null) {
		rule.type = RULE_TYPES.EMPTY_TILE;
		rule.id = matches[1];
		return rule;
	}

	matches = raw.match(isOdd);
	if(matches != null) {
		rule.type = RULE_TYPES.IS_ODD;
		rule.id = matches[1];
		rule.metric = matches[2];
		return rule;
	}

	matches = raw.match(isEven);
	if(matches != null) {
		rule.type = RULE_TYPES.IS_EVEN;
		rule.id = matches[1];
		rule.metric = matches[2];
		return rule;
	}

	matches = raw.match(isMultiple);
	if(matches != null) {
		rule.type = RULE_TYPES.IS_MULTIPLE;
		rule.id = matches[1];
		rule.metric = matches[2];
		rule.multiple = parseInt(matches[3]);
		return rule;
	}

	matches = raw.match(isPrime);
	if(matches != null) {
		rule.type = RULE_TYPES.IS_PRIME;
		rule.id = matches[1];
		rule.metric = matches[2];
		return rule;
	}

	matches = raw.match(isCenter);
	if(matches != null) {
		rule.type = RULE_TYPES.IS_CENTER;
		rule.id = matches[1];
		return rule;
	}

	matches = raw.match(isTravelsWith);
	if(matches != null) {
		rule.type = RULE_TYPES.TRAVELS_WITH;
		rule.id = matches[1];
		rule.withId = matches[2];
		return rule;
	}

	return rule;
}

//make this more complicated only as needed
function parseRuleRightSide(raw) {
	raw = raw.trim();
	//let matches = raw.match(isInParentheses);
	//if(matches != null) {
	//	raw = matches[1].trim();
	//}
	let rightSide = {
		raw: raw,
		type: CALC_TYPES.NONE,
	};
	
	let stack = [];
	stack.push(rightSide);
	for(let i = 0; i < raw.length; i++) {
		if(raw[i] == ' ') {
			continue;
		}
		if(raw[i] == '(') {
			let nested = { type: CALC_TYPES.NONE };
			let currentParent = stack[stack.length - 1];
			if(currentParent.type == CALC_TYPES.NONE) {
				currentParent.left = nested;
			}
			else {
				currentParent.right = nested;
			}
			stack.push(nested);
			continue;
		}
		if(raw[i] == ')') {
			stack.pop();
			continue;
		}
		if(raw[i] == '+' || raw[i] == '-' || raw[i] == '*' || raw[i] == '/') {
			let previous = stack[stack.length - 1];
			if(previous.type != CALC_TYPES.NONE && "left" in previous && "right" in previous) {
				let replacement = {
					type: previous.type,
					left: previous.left,
					right: previous.right,
				};
				previous.left = replacement;
				previous.type = CALC_TYPES.NONE;
				previous.right = null;
			}
		}
		if(raw[i] == '+') {
			stack[stack.length - 1].type = CALC_TYPES.ADD;
			continue;
		}
		if(raw[i] == '-') {
			stack[stack.length - 1].type = CALC_TYPES.SUBTRACT;
			continue;
		}
		if(raw[i] == '*') {
			stack[stack.length - 1].type = CALC_TYPES.MULTIPLY;
			continue;
		}
		if(raw[i] == '/') {
			stack[stack.length - 1].type = CALC_TYPES.DIVIDE;
			continue;
		}
		let digits = '';
		while(i < raw.length && raw[i] >= '0' && raw[i] <= '9') {
			digits += raw[i];
			i++;
		}
		if(digits != '') {
			let nested = { 
				type: CALC_TYPES.CONSTANT,
				constant: parseInt(digits),
			};
			let currentParent = stack[stack.length - 1];
			if(currentParent.type == CALC_TYPES.NONE) {
				currentParent.left = nested;
			}
			else {
				currentParent.right = nested;
			}
			continue;
		}
		let substring = raw.substring(i, i + 8); //A.width* or A.height
		let substringMatches = substring.match(isIdMetric);
		if(substringMatches != null) {
			let nested = { 
				type: CALC_TYPES.METRIC,
				id: substringMatches[1],
				metric: substringMatches[2],
			};
			let currentParent = stack[stack.length - 1];
			if(currentParent.type == CALC_TYPES.NONE) {
				currentParent.left = nested;
			}
			else {
				currentParent.right = nested;
			}
			i += 2 + substringMatches[2].length - 1;
			continue;
		}
	}
	
	//unwind
	for(let i = stack.length - 1; i >= 0; i--) {
		let current = stack[i];
		if("left" in current && !("right" in current)) {
			if(i == 0) {
				current.left.raw = rightSide.raw;
				rightSide = current.left;
				break;
			}
			let previous = stack[i - 1];
			if(previous.left === current) {
				previous.left = current.left;
				continue;
			}
			if(previous.right === current) {
				previous.right = current.left;
				continue;
			}
		}
	}
	
	return rightSide;
}
