const utils = {
	loadFile: function(filename) {
		var client = new XMLHttpRequest();
		client.open('GET', '/'+filename);
		client.onreadystatechange = function() {
			console.log(client.responseText);
		}
		client.send();
	}
};