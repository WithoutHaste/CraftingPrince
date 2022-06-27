//Version: slumbers
//estimate weights in pounds/lbs

const effects = [
	'IRON: weight +2',
	'STEEL: weight +1',
	'SILVER: weight +1',
	'GEMS: weight +0.2',
	'GLASS: weight +0.5',
	'CERAMIC: weight +2',
	'BONE: weight +0.5',
	'LEATHER: weight +1',
	'CLOTH: weight +0.5',
	'REEDS: weight +0.3',
	'PAPER: weight +0.7',
	'WOOD: weight +1',

	'IRON: attack +2',
	'STEEL: attack +4',
	'GLASS: attack +1',
	'BONE: attack +1',
	'WOOD: attack +2',

	'IRON: defense +1',
	'STEEL: defense +2 progressive +1',
	'CERAMIC: defense +3',
	'LEATHER: defense +2 progessive +0.5',
	'CLOTH: defense +0.3',
	'PAPER: defense +0.3 progressive +0.3',
	'WOOD: defense +1',
	
	`
S
x
S

S is SILVER
x is not SILVER
stacks
can rotate 90 degrees
each S can be counted only once

effect: attack +1 poison against dark creatures
	`,
	`
Gx
GG

G is GEMS
X is not GEMS
stacks
can rotate 90 180 270 degrees
each G can be counted only once

effect: all magical effects +1
	`,
	`
 Gxx
 xGx
 xxG

G is GLASS
x is not GLASS
stacks
can rotate 90 degrees

effect: attack +1 lightning
	`,
	`
BxB
xBx

B is BONE
x is not BONE
x is all one material
stacks
each B can be counted only once
	
effect: attack +1 life drain
	`,
	`
BBBBBBBBBB
BxxxxxxxxB
BxxxxxxxxB
BBBBBBBBBB
BxxxxxxxxB
BxxxxxxxxB
BBBBBBBBBB

B is BONE
can rotate 90 degrees
	
effect: defense blocks life drain
notes: big because intended for clothing/armor
	`,
];
