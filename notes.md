# notes

note: blueprints should default to a valid layout
note: all segments in a blueprint must be rectangular (segment: contiguous collection of same-id squares)
- there can be multiple non-contiguous segments with the same id - they must have duplicate dimensions (except for "x" and "X" which are not resizable and therefore can have different initial dimensions)
note: assumes entire blueprint is contiguous (ids marked "empty" count here)

Matt said, since the final item size is not being changed, then you are changing the resolution within the item

crafting system inspired by "The King's Avatar" manga
- how could a crafting system support the sort of creativity hinted at in the manga?

"Prince Crafting System" because the manga says "King"

todo - pull out the tech notes from old blog-type post

test of the system all in javascript
- runs on client's machine with no installation
- code is public anyway

players of the craft-test system are in "creative mode"
- they can select the exact materials they want
- the total cost of those materials (based on rarity) will be shown with the item's stats

rule ideas
- if the number of tiles in the item is odd, all fire-effects are nullified
- if the number of tiles in the item is sphenic, 10% weight reduction, or -50% damage on attacks
- if such-and-such pattern appears in the item, it bears curse:sleep/fear/whatever (affecting the bearer)
- if the item includes a tile of each of the 12 material types, it gains <effect>
- if the item is made up entirely of 1 material type, it gains <effect>
- an item built from exactly 3 materials, in this ratio 1/4, 1/4, 1/2 - gest +2% chance of a Critical Hit
- if all tiles of material A are north of all tiles of material B in the design, gain +10 lightning resistance

rule idea
- patterns of material
RRxxx
xxxRR
- let's say this is the pattern of RED tiles, anywhere it appears in your design provides +5 Fire Damage on Attacks
- the center vertical "x" part can have width >= 1
- an R tile counted into one instance of "+5 Fire Damage" cannot be counted into another instance of it
  - user does not decide, game will have a deterministic calculation, try to maximize the effect


# blueprints folder

all the "blueprints" for items that you can craft
- layout
- rules for size changes
- requirements for materials

layouts only vaguely match the physical appearance of the item
- that isn't the goal
- it is more important that they vary from each other

"x" is just x
- otherwise
- lowercase means each character is replaced with alterations
  - lowercase means treat each single character as a unit
- uppercase means the contiguous unit of this uppercase character act as a whole
  - uppercase means treat all the contiguous matching characters as a unit
- specifying width vs height on the variable sections
- if a measurement range is not specified, then it cannot be altered from the original blueprint

TODO how to encode the anchor material type and location?

# versioning

support versioning of blueprint collections, pricing/availability of parts, and the magical rules (bonuses/nerfs encoded into the items)

blueprint collections are named with Adjectives

magical rules are named with Nouns

and pricing is named with Verbs

so the combination of the three forms a sentence

this implies all edits are major edits, which yeah they are when they part of a complex puzzle

# materials

since i can't remember the original wheel entirely
and since my old post and my notes don't seem to contain it
let's recreate it, or get close enough
i'm looking for a well balance number (easily divisible) - already at 9 so let's get to 12
so far i have 3 metals, 2 sands, 3 for clothing/weaving, 2 wooden

IRON for sure 			| metal
STEEL					| metal
SILVER or gold			| metal, precious
GEMS					| earth(crystal), precious, mystic
GLASS for sure			| earth(sand)
CERAMIC nice addition	| earth(clay)
BONE					| from animals, mystic
LEATHER for sure		| from animals, clothing
CLOTH yes				| from plants or animals, woven, clothing
REEDS still like it		| from plants, woven
PAPER yes				| from plants
WOOD for sure			| from plants
loops back to top

items, for inspiration: sword, padded armor, plate mail, umbrella, cloak, boots, tea pot, cooking pot, saddle, bottle

old notes indicate another overlapping wheel of material types, but let's leave that out for now

we've sort of got four sections - metal, earth, animal, plant
