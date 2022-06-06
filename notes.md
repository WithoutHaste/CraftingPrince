# notes

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

blueprint collections are named with Nouns

magical rules are named with verbs

and pricing is named with an object (in the sentence grammar sense)

so the combination of the three forms a sentence

this implies all edits are major edits, which yeah they are when they part of a complex puzzle


