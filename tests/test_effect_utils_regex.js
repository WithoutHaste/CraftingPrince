QUnit.test("regex: IS WEIGHT", function( assert ) {
	let result = false;
	
	result = isWeight.test(""); assert.false(result, "empty");
	result = isWeight.test(" IRON: weight +1 "); assert.false(result, "not trimmed");
	result = isWeight.test("IRON| weight +1"); assert.false(result, "wrong separator");
	result = isWeight.test("IRON: height +1"); assert.false(result, "wrong keyword");
	result = isWeight.test("IRON: weight %1"); assert.false(result, "wrong operator");
	result = isWeight.test("IRON: weight +1."); assert.false(result, "1.");
	result = isWeight.test("IRON: weight +.1"); assert.false(result, ".1");
	result = isWeight.test("IRON: weight +1"); assert.true(result, "basic +1");
	result = isWeight.test("IRON: weight -1"); assert.true(result, "basic -1");
	result = isWeight.test("IRON: weight +1.5"); assert.true(result, "basic +1.5");
	result = isWeight.test("IRON: weight +10.05"); assert.true(result, "basic +10.05");
});

QUnit.test("regex: IS ATTACK", function( assert ) {
	let result = false;
	
	result = isAttack.test(""); assert.false(result, "empty");
	result = isAttack.test(" IRON: attack +1 "); assert.false(result, "not trimmed");
	result = isAttack.test("IRON| attack +1"); assert.false(result, "wrong separator");
	result = isAttack.test("IRON: weight +1"); assert.false(result, "wrong keyword");
	result = isAttack.test("IRON: attack %1"); assert.false(result, "wrong operator");
	result = isAttack.test("IRON: attack +1."); assert.false(result, "1.");
	result = isAttack.test("IRON: attack +.1"); assert.false(result, ".1");
	result = isAttack.test("IRON: attack +1"); assert.true(result, "basic +1");
	result = isAttack.test("IRON: attack -1"); assert.true(result, "basic -1");
	result = isAttack.test("IRON: attack +1.5"); assert.true(result, "basic +1.5");
	result = isAttack.test("IRON: attack +10.05"); assert.true(result, "basic +10.05");
});
