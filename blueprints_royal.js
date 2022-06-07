//Version: royal

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
    `
	},
	{
		name: "corseque",
		raw = `
    
    
    
    
   x   
   x
  dAd 
   A  
 eeAee
   A  
   C  
   C  
   C  
   C  
   B  
   B  
   B  
   B  
    
A.height + C.height = 20
C.height = 4x
A.height = 4x (a multiple of 4)
d travels with A
e travels with A
d.width < e.width and > 0
e.width is prime

notes on intentions
- the blueprint does not display the actual length of the polearm, that is encoded in the sizing rules
- add as many "pointy" sections as you want, but the whole polearm cannot become too long
- the pointy bits hanging off of "A" get duplicated when "A" does
		`
	},
	{
		name: "sickle",
		raw: ` 
    
 xax   
 e  
 xax  
   x  
   x  
  bbb   
   c   
    
a.width >= 0
b.height = c.height
c.height >= 1
e.height = a.width

notes on intentions
- the hook-around part can be 2 units wide, or as much wider as you want (keep increasing the length of "a")
- the "hilt" and "cross guard" can be stretched out chonky long
- if I could pattern it to grow into a larger and larger spiral, that'd be awesome geometrically
		`
	},
	{
		name: "padded armor",
		raw: `
    
  xxxxaxaxaxxxx 
  xxxxaxaxaxxxx
  bb xaxaxax bb
  bb xaxaxax bb
     xaxaxax  
     xaxaxax  
     xaxaxax  



a is all one type of material
a.width = 1..N
b.height >= 2
		`
	},
];

