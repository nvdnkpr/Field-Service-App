var ACS = require('acs').ACS,
	settings = require('../../lib/settings').load();

var _transform = function(data, _cb) {
	var results = [],
		dataCount = data.length,
		i = 0;

	if (dataCount > 0) {
		for (i = 0; i < dataCount; i++) {
			//if( data[i]["[CUSTOM_assignments]assignment_id"][0] && (assignment === data[i]["[CUSTOM_assignments]assignment_id"][0].id) ){
			results.push({
				id: data[i].id,
				aid: data[i].aid,
				type: data[i].type,
				cost: data[i].cost,
				notes: data[i].notes
			});
			//}// end if
		} // end for

		_cb && _cb(results);
	} else {
		_cb && _cb(results);
	}

};

var API = {

	adapterType: "ACS",

	get: function(req, res) {
		console.log("ACS_EXPENSES_get ");

		if (req.params.assignment === 'undefined') {
			res.json({
				success: false,
				message: "This API endpoint requires an Assignment ID."
			});
		} else {
			//console.log('[ assignment ] ' + req.params.assignment );
			ACS.Objects.query({
				classname: 'expenses',
				// page: 1,
				// per_page: 50,
				where: '{"aid":' + req.params.assignment + '}'
				// where: {
				// "[CUSTOM_assignments]assignment_id":req.params.assignment
				// }
			}, function(e) {
				//console.log( '[expenses refresh result] ' + JSON.stringify(e) );
				if (e.success && e.meta.total_results > 0) {
					_transform(e.expenses, function(results) {
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
						data: e.expenses,
						page: e.meta.page,
						count: e.meta.total_results
					});
				}
			});
		}

	},

	create: function(req, res) {
		console.log("ACS_EXPENSES_create");

		res.write("create is working!");
		res.end();
	},

	update: function(req, res) {
		console.log("ACS_EXPENSES_update");

		res.write("update is working!");
		res.end();
	},

	del: function(req, res) {
		console.log("ACS_EXPENSES_del");

		res.write("del is working!");
		res.end();
	}

};

module.exports = API;
