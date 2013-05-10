var ACS = require('acs').ACS;

var _transform = function(data, _cb) {
	var results = [],
		dataCount = data.length,
		i = 0;

	if (dataCount > 0) {
		for (i = 0; i < dataCount; i++) {

			results.push({
				id: data[i].id,
				cid: data[i].cid,
				sku: data[i].sku,
				name: data[i].name,
				description: data[i].description,
				status: data[i].status
			});

		} // end for

		_cb && _cb(results);
	} else {
		_cb && _cb(results);
	}

};

var API = {

	adapterType: "ACS",

	get: function(req, res) {
		console.log("ACS_CATALOG_get");

		ACS.Objects.query({
			classname: 'catalog',
			page: 1,
			per_page: 50
			// where: {
			// "[ACS_USER]user_id":req.params.userid
			// }
		}, function(e) {
			//console.log( '[assignments result] ' + JSON.stringify(e.assignment) );

			if (e.success && e.meta.total_results > 0) {
				_transform(e.catalog, function(results) {
					res.json({
						result: e.success,
						data: results,
						page: e.meta.page,
						count: results.length
					});

				});

			} else {
				res.json({
					result: e.success,
					data: e.catalog,
					page: e.meta.page,
					count: e.meta.total_results
				});
			}

		});
	},

	create: function(req, res) {
		console.log("ACS_CATALOG_create");

		res.write("create is working!");
		res.end();
	},

	update: function(req, res) {
		console.log("ACS_CATALOG_update");

		res.write("update is working!");
		res.end();
	},

	del: function(req, res) {
		console.log("ACS_CATALOG_del");

		res.write("del is working!");
		res.end();
	}

};

module.exports = API;
