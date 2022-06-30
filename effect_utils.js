const EFFECT_TYPES = {
	NONE: "NONE",
	WEIGHT: "WEIGHT",
	ATTACK: "ATTACK",
	DEFENSE: "DEFENSE",
	PATTERN: "PATTERN",
};
const isWeight = /^(\w+)\: weight ([\+\-])((\d+\.)?\d+)$/;
const isAttack = /^(\w+)\: attack ([\+\-])((\d+\.)?\d+)$/;
//const isDefense = /^(\w+)\: defense ([\+\-])((\d+\.)?\d+)(.*)$/;

var effects = [];

function sumEffects(type, material) {
	let weightEffects = getEffectsByTypeAndMaterial(type, material);
	let total = 0;
	for(let i = 0; i < weightEffects.length; i++) {
		let effect = weightEffects[i];
		if(effect.isPlus) {
			total += effect.amount;
		}
		else {
			total -= effect.amount;
		}
	}
	return total;
}

function getEffectsByTypeAndMaterial(type, material) {
	var result = [];
	for(let i = 0; i < effects.length; i++) {
		let effect = effects[i];
		if(effect.type != type)
			continue;
		if(effect.material != material)
			continue;
		result.push(effect);
	}
	return result;
}

function parseEffects(effects_raw) {
	for(let i = 0; i < effects_raw.length; i++) {
		let effect = parseEffect(effects_raw[i]);
		if(effect == null)
			continue;
		effects.push(effect);
	}
}

//take in one line/multiline of raw effect-text
//return effect object
function parseEffect(raw) {
	raw = raw.trim();
	let effect = {
		raw: raw,
		type: EFFECT_TYPES.NONE,
	};

	let matches = raw.match(isWeight);
	if(matches != null) {
		effect.type = EFFECT_TYPES.WEIGHT;
		effect.material = matches[1];
		effect.isPlus = (matches[2] == '+');
		effect.amount = parseFloat(matches[3]);
		return effect;
	}

	matches = raw.match(isAttack);
	if(matches != null) {
		effect.type = EFFECT_TYPES.ATTACK;
		effect.material = matches[1];
		effect.isPlus = (matches[2] == '+');
		effect.amount = parseFloat(matches[3]);
		return effect;
	}

	return null;
}

