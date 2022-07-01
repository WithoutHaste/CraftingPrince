//Version: slumbers
//estimate weights in pounds/lbs

const effects_raw = [
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

	'IRON: attack +2 progressive +1 on odd', //+2+2+3+3+4+4+5
	'STEEL: attack +4 on odd progressive +1', //+4+0+5+0+6+0+7
	'GLASS: attack +1 progressive +0.3',
	'BONE: attack +1',
	'WOOD: attack +2',

	'IRON: defense +1',
	'STEEL: defense +2 progressive +1',
	'CERAMIC: defense +3',
	'LEATHER: defense +2 progessive +0.5',
	'REEDS: defense -1 progressive -0.5', //starts bad and gets worse
	'PAPER: defense -3 progressive +1', //starts bad can build to great
	'WOOD: defense +1 progressive +0.1 progressive +0.1', //+1+1.1+1.3+1.6+2+2.5+3.1+3.8+4.6
	
	'IRON: count sphenic -25% attack',
	'STEEL: count sphenic -50% attack',
	'SILVER: count even -25% attack',
	'GEMS: count lucky +100% attack',
	'GLASS: count happy -50% magic attack',
	'CERAMIC: count > 0 and < leather -25% defense',
	'item is all BONE +300% magic defense',
	'LEATHER: count > metal +25% defense',
	'CLOTH: count multiple of 3 +10% defense',
	'REEDS: count > 0 +10% mental defense',
	'PAPER.count > 0 and == REEDS.count weight -90%',
	'WOOD: count prime -25% attack',

	'GEMS: contiguous +10% magic defense',
	'LEATHER: not contiguous +10% fire attack', //any tile not contiguous with other leather in item
	'PAPER: none contiguous -1 per mana use', //each paper tile touching no other paper tile

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
	`
CCxCCyCCxCC

C is CLOTH
x and y are different materials
stacks
each C can be counted only once
	
effect: defense +0.2
	`,
	`
Cxyyy
xCxyy
yxxxy
yyxCx
yyyxC

C is CLOTH
x is not CLOTH
stacks
each C can be counted only once
	
effect: defense +1 against magic
	`,
	`
CCxCCyCCxCC

C is CLOTH
x and y are different materials
stacks
each C can be counted only once
	
effect: defense +0.2
	`,
	`
RR
xR

R is REEDS
stacks
can rotate 180 degrees
each R can be counted only once
	
effect: weight -0.1
	`,
	`
xxRRR
RxxxR
RxxxR
RRRxx

R is REEDS
x is not REEDS
stacks
can rotate 90 degrees
each R can be counted only once
	
effect: effect cooldown time -0.3
	`,
	//'PAPER: weight +0.7',
	//'WOOD: weight +1',

];
