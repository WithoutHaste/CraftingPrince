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
IxI
xxx
IxI

I is IRON
x is not IRON
stacks
each I can be counted only once

effect: attack +1 fire
	`,
	`
Sxx
xSx
SxS

S is STEEL
x is not STEEL
stacks
each S can be counted only once

effect: attack +1 divine fire
	`,
	`
Ixx
III
xxI

I is IRON
x is not IRON
stacks

effect: defense +1
	`,
	`
Sxx
xSx
SxS

S is STEEL
x is not STEEL
stacks
each S can be counted only once

effect: attack +1 divine fire
	`,
	`
SxSS
SxSx
SSSx

S is STEEL
x is not STEEL

effect: defense +(1 * length of repeating pattern horizontal) 
	`,
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
xxSS
xxxS
Sxxx

S is SILVER
x is not SILVER
stacks
can rotate 90 180 270 degrees
each S can be counted only once

effect: defense +1 elemental magic
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
GG

G is GLASS
stacks
can rotate 90 degrees

effect: defense -2
	`,
	`
Cxx
CxC
CCC

C is CERAMIC
stacks
can rotate 180 degrees
each C can be counted only once

effect: defense +1
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
	`
xLx
xLx
LLL
LLL
xLx
xLx

L is LEATHER
x is all one material
stacks
each L can be counted only once
	
effect: attack +0.5
	`,
	`
LLxLLxLLxLL

L is LEATHER
x is not LEATHER
x is all one material
can rotate 90 degrees
stacks
each L can be counted only once
	
effect: defense +2
	`,
	//'CLOTH: weight +0.5',
	//'REEDS: weight +0.3',
	//'PAPER: weight +0.7',
	//'WOOD: weight +1',

];
