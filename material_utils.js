const materialNames = ['IRON', 'STEEL', 'SILVER', 'GEMS', 'GLASS', 'CERAMIC', 'BONE', 'LEATHER', 'CLOTH', 'REEDS', 'PAPER', 'WOOD'];

const MATERIAL_TYPES = generateMaterialTypes();

function generateMaterialTypes() {
	var result = {};
	for(let i = 0; i < materialNames.length; i++) {
		result[materialNames[i]] = `${i + 1}`;
	}
	return result;
}
