var ACS = require('acs').ACS;

var API = {

	adapterType: "ACS",

	get: function(req, res) {
		console.log("ACS_FILES_get  " + req.params.assignment);

		ACS.Files.query({
			classname: 'files',
			page: 1,
			per_page: 50,
			where: '{"custom_fields":{"assignment_id":' + req.params.assignment + '}}'
		}, function(e) {
			//console.log( '[files result] ' + JSON.stringify(e) );
			res.json({
				result: e.success,
				data: e.files,
				page: e.meta.page,
				count: e.meta.total_results
			});
		});
	},

	create: function(req, res) {
		console.log("ACS_FILES_create");

		res.write("create is working!");
		res.end();
	},

	update: function(req, res) {
		console.log("ACS_FILES_update");

		res.write("update is working!");
		res.end();
	},

	del: function(req, res) {
		console.log("ACS_FILES_del");

		res.write("del is working!");
		res.end();
	}

};

module.exports = API;
