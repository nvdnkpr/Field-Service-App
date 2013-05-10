function callAdapter(func, req, res) {
	// Determine what API we are using? ACS OR SALESFORCE
	ACS.KeyValues.get({
		name: "API"
	}, function(e) {
		if (e.success) {
			var adapterUrl = adapter_url.replace("{adapter}", e.keyvalues[0].value.toLowerCase());
			console.log(JSON.stringify(arguments));

			var API = require(adapterUrl);
			API && API[func](req, res);
		} else {
			res.write("{success: false, error: 'FAILURE GETTING API'}");
			res.end();
		}
	})
}
