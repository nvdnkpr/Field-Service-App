var ACS = require('acs').ACS;

var _transform = function(data, _cb) {
	var results = [],
		dataCount = data.length,
		i = 0;

	if (dataCount > 0) {
		for (i = 0; i < dataCount; i++) {

			results.push({
				id: data[i].id,
				aid: data[i].aid,
				cid: data[i].cid,
				quantity: data[i].quantity,
				productName: (data[i]["[CUSTOM_catalog]catalog_id"] && data[i]["[CUSTOM_catalog]catalog_id"][0]) ? data[i]["[CUSTOM_catalog]catalog_id"][0].name : 'No Product Name',
				productDescription: (data[i]["[CUSTOM_catalog]catalog_id"] && data[i]["[CUSTOM_catalog]catalog_id"][0]) ? data[i]["[CUSTOM_catalog]catalog_id"][0].description : 'No Product Description',
				productStatus: (data[i]["[CUSTOM_catalog]catalog_id"] && data[i]["[CUSTOM_catalog]catalog_id"][0]) ? data[i]["[CUSTOM_catalog]catalog_id"][0].status : 'No Product Status',
				productCID: (data[i]["[CUSTOM_catalog]catalog_id"] && data[i]["[CUSTOM_catalog]catalog_id"][0]) ? data[i]["[CUSTOM_catalog]catalog_id"][0].cid : 'No Product Catalog ID'
				// notes: data.products[i].notes,
				// duration: data.products[i].duration,
				// type: data.products[i].type
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
		console.log("inventory_get  " + req.params.assignment);

		ACS.Objects.query({
			classname: 'products',
			// page: 1,
			// per_page: 50,
			where: '{"aid":' + req.params.assignment + '}'
			//where: '{"custom_fields":{"assignment_id":"' + req.params.assignment + '"}}'
		}, function(e) {
			//console.log( '[inventory result] ' + JSON.stringify(e) );
			if (e.success && e.meta.total_results > 0) {
				_transform(e.products, function(results) {
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
					data: e.products,
					page: e.meta.page,
					count: e.meta.total_results
				});
			}

		});
	},

	create: function(req, res) {
		console.log("inventory_create");

		res.write("create is working!");
		res.end();
	},

	update: function(req, res) {
		console.log("inventory_update");

		res.write("update is working!");
		res.end();
	},

	del: function(req, res) {
		console.log("inventory_del");

		res.write("del is working!");
		res.end();
	}

};

module.exports = API;
