var ACS = require('acs').ACS;

var _transform = function(data, _cb) {
	var results = [],
		dataCount = data.length,
		i = 0;

	if (dataCount > 0) {
		for (i = 0; i < dataCount; i++) {
			results.push({
				name: data[i].name,
				orgid: data[i].orgID,
				address: data[i].address_1,
				city: data[i].City,
				state: data[i].State,
				zip: data[i].zip,
				latitude: data[i].latitude,
				longitude: data[i].longitude,
				contactName: data[i].contactName,
				contactPhone: data[i].contactPhone,
				contactEmail: data[i].contactEmail,
				oid: data[i].oid,
				id: data[i].id
			});
		}

		_cb && _cb(results);
	} else {
		_cb && _cb(results);
	}

};

var _transformSingle = function(data, _cb) {
	var results = {},
	dataCount = data.length,
		i = 0;

	if (dataCount > 0) {
		for (i = 0; i < dataCount; i++) {
			results = {
				name: data[i].name,
				orgid: data[i].orgID,
				address: data[i].address_1,
				city: data[i].City,
				state: data[i].State,
				zip: data[i].zip,
				latitude: data[i].latitude,
				longitude: data[i].longitude,
				contactName: data[i].contactName,
				contactPhone: data[i].contactPhone,
				oid: data[i].oid,
				id: data[i].id
			};
		}

		_cb && _cb(results);
	} else {
		_cb && _cb(results);
	}

};

var API = {

	adapterType: "ACS",

	get: function(req, res) {
		console.log("ACS_OUTLETS_get");

		ACS.Objects.query({
			classname: 'outlets',
			page: 1,
			per_page: 50
			// where: {
			// "[ACS_USER]user_id":req.params.userid
			// }
		}, function(e) {
			//console.log( '[assignments result] ' + JSON.stringify(e) );

			if (e.success && e.meta.total_results > 0) {
				_transform(e.outlets, function(results) {
					res.json({
						result: e.success,
						data: results,
						page: e.meta.page,
						count: e.meta.total_results
					});
				});
			} else {
				res.json({
					result: e.success,
					data: e.outlets,
					page: e.meta.page,
					count: e.meta.total_results
				});
			}

		});
	},

	getdetail: function(req, res) {
		console.log("ACS_OUTLETS_getdetail " + req.params.oid);
		var objectResults = {};

		ACS.Objects.query({
			classname: 'outlets',
			//page: 1,
			where: '{"oid":' + req.params.oid + '}'
			//where:"{\"oid\":\""+req.params.oid+"\"}"
		}, function(e) {
			//console.log( '[outlets result] ' + JSON.stringify(e) );

			if (e.success && e.meta.total_results > 0) {
				_transformSingle(e.outlets, function(results) {
					objectResults["outlet"] = results;

					// res.json({
					// result: e.success,
					// data: results,
					// page: e.meta.page,
					// count: e.meta.total_results
					// });							
				});
			} else {
				res.json({
					result: e.success,
					data: e.outlets,
					page: e.meta.page,
					count: e.meta.total_results
				});
			}

		});
	},

	create: function(req, res) {
		console.log("ACS_OUTLETS_create");

		//ACS.Objects.query();

		res.write("create is working!");
		res.end();
	},

	update: function(req, res) {
		console.log("ACS_OUTLETS_update");

		//ACS.Objects.query();

		res.write("update is working!");
		res.end();
	},

	del: function(req, res) {
		console.log("ACS_OUTLETS_del");
		res.write("del is working!");
		res.end();
	}

};

module.exports = API;
