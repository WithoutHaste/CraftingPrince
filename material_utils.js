const materialNames = ['IRON', 'STEEL', 'SILVER', 'GEMS', 'GLASS', 'CERAMIC', 'BONE', 'LEATHER', 'CLOTH', 'REEDS', 'PAPER', 'WOOD'];
const materials = {
	"IRON": { abbr: 'Ir', categories: ['metal'] },
	"STEEL": { abbr: 'St', categories: ['metal'] },
	"SILVER": { abbr: 'Si', categories: ['metal', 'magic'] },
	"GEMS": { abbr: 'Ge', categories: ['earth', 'magic'] },
	"GLASS": { abbr: 'Gl', categories: ['earth'] },
	"CERAMIC": { abbr: 'Ce', categories: ['earth'] },
	"BONE": { abbr: 'Bo', categories: ['animal', 'magic'] },
	"LEATHER": { abbr: 'Le', categories: ['animal'] },
	"CLOTH": { abbr: 'Cl', categories: ['animal', 'plant'] },
	"REEDS": { abbr: 'Re', categories: ['plant'] },
	"PAPER": { abbr: 'Pa', categories: ['plant'] },
	"WOOD": { abbr: 'Wo', categories: ['plant'] },
};

const MATERIAL_TYPES = generateMaterialTypes();

function generateMaterialTypes() {
	var result = {};
	for(let i = 0; i < materialNames.length; i++) {
		result[materialNames[i]] = materialNames[i];
	}
	return result;
}

//returns a new mapping of MATERIAL to integer, initialized to 0
function generateMaterialCounter() {
	var result = {};
	for(let i = 0; i < materialNames.length; i++) {
		result[materialNames[i]] = 0;
	}
	return result;
}
