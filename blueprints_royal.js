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
 cCc    
  B  
  B  
  B  


A.height = 3 * B.height
A.width >= 1
A.width is odd
B.height >= 3
C.width = A.width
C is center
    `
	},
	{
		name: "corseque",
		raw: `
    
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
   C  
   C  
   C  
   C  
   C  
   C  
   C  
   C  
   C  
   C  
   C  
   C  
   x  
   x  
   x  
   x  
    
A.height = 20 - C.height
C.height is multiple of 4
C.height <= 20
d travels with A
e travels with A
d.width < e.width
d.width >= 1
e.width is prime
A is center

notes on intentions
- add as many "pointy" sections as you want, but the whole polearm cannot become too long
- when you edit A.height or C.height, the other auto-updates such that rule #1 is still true
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

