//utils.loadFile("blueprints/longsword.txt");

const RULE_TYPES = {
	NONE: "0",
	EQUAL: "1",
	GREATER_OR_EQUAL: "2",
};
const CALC_TYPES = {
	NONE: "0",
	CONSTANT: "1",
	ADD: "2",
	SUBTRACT: "3",
	MULTIPLY: "4",
	DIVIDE: "5",
};
const isId = /[a-wy-zA-WY-Z]/;
const isIdMetric = /^([a-wy-zA-WY-Z])\.(width|height)/;
//const isInParentheses = /^\((.*)\)$/;
const isEqual = /^([a-zA-Z])\.(height|width) = (.*)$/;
const isGreaterOrEqual = /^([a-zA-Z])\.(height|width) >= (.*)$/;
const isConstant = /^(\d+)$/;
const isAddition = /^(.*) \+ (.*)$/;
const isMultiplied = /^(\d*)([a-zA-Z])\.(height|width)$/;
const isDivided = /^(.*) \/ (.*)$/;

const blueprints = [
	{
		name: "longsword",
		raw: `
    
  A   
  A   
  A   
  A   
  A   
  A   
  A   
  A   
  A   
 xCx    
 dBd  
 dBd  
 dBd  


A.height = 3 * B.height
B.height >= 3
C.width = A.width
A.width >= 1
A.width is odd
d is empty
d.height = B.height
d.width = (A.width + 1) / 2
    `,
		isValidMetric: function(id, metric, value) {
			for(let i = 0; i < this.rules.length; i++) {
				const rule = this.rules[i];
				if(rule.left.id != id)
					continue;
				if(rule.left.metric != metric)
					continue;
				if(rule.type == RULE_TYPES.EQUAL) {
					if(rule.right.type == CALC_TYPES.CONSTANT) {
						return value == rule.right.constant;
					}
				}
				if(rule.type == RULE_TYPES.GREATER_OR_EQUAL) {
					if(rule.right.type == CALC_TYPES.CONSTANT) {
						return value >= rule.right.constant;
					}
				}
			}
			return true;
		},
		propagateMetricChange: function(id, metric) {
			for(let i = 0; i < this.rules.length; i++) {
				const rule = this.rules[i];
				if(rule.type != RULE_TYPES.EQUAL)
					continue;
				if(rule.right.type == CALC_TYPES.MULTIPLY) {
					if(rule.right.variable.id == id && rule.right.variable.metric == metric) {
						this.metrics[rule.left.id][rule.left.metric] = rule.right.constant * this.metrics[id][metric];
					}
				}
			}
		}
	}
];

parseBlueprint(blueprints[0]);

function parseBlueprint(blueprint) {
	let pattern = "";
	let lines = blueprint.raw.split("\n");
	let startedPattern = false;
	const isWhitespace = new RegExp("^\w*$");
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
		pattern = pattern + '\n' + lines[i];
	}
	blueprint.pattern = pattern
	initializeMetricValues(blueprint);
	
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
		rules.push(parseRule(lines[i]));
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

	let matches = raw.match(isEqual);
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
	
	//TODO matching on + inside parentheses before / outside them
	//TODO for long term support, will need a general purpose parser - linear, handles any valid parentheses
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
		let substring = raw.substring(i, 8); //A.width* or A.height
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
	console.log(rightSide);
	for(let i = stack.length - 1; i >= 0; i--) {
		let current = stack[i];
		if("left" in current && !("right" in current)) {
			console.log("attempt unwind");
			if(i == 0) {
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
	
	/*
	matches = raw.match(isConstant);
	if(matches != null) {
		rightSide.type = CALC_TYPES.CONSTANT;
		if(matches[1] == null || matches[1] == '') {
			rightSide.constant = 1;
		}
		else {
			rightSide.constant = parseInt(matches[1]);
		}
		return rightSide;
	}
	
	matches = raw.match(isAddition);
	if(matches != null) {
		rightSide.type = CALC_TYPES.ADD;
		rightSide.left = parseRuleRightSide(matches[1]);
		rightSide.right = parseRuleRightSide(matches[2]);
		return rightSide;
	}
	
	matches = raw.match(isMultiplied);
	if(matches != null) {
		rightSide.type = CALC_TYPES.MULTIPLY;
		if(matches[1] == null || matches[1] == '') {
			rightSide.constant = 1;
		}
		else {
			rightSide.constant = parseInt(matches[1]);
		}
		rightSide.variable = {
			id: matches[2],
			metric: matches[3],
		};
		return rightSide;
	}
	
	matches = raw.match(isDivided);
	if(matches != null) {
		rightSide.type = CALC_TYPES.DIVIDE;
		rightSide.left = parseRuleRightSide(matches[1]);
		rightSide.right = parseRuleRightSide(matches[2]);
		return rightSide;
	}
	*/
	
	return rightSide;
}
