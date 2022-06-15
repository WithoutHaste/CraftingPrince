# notes

note: blueprints should default to a valid layout
note: all segments in a blueprint must be rectangular (segment: contiguous collection of same-id squares)
note: assumes entire blueprint is contiguous (ids marked "empty" count here)

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
- if such-and-such pattern appears in the item, it bears curse:sleep/fear/whatever (affecting the bearer)
- if the item includes a tile of each of the 12 material types, it gains <effect>
- if the item is made up entirely of 1 material type, it gains <effect>

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


