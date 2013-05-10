var ACS = require('acs').ACS;

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
				duration: data[i].duration,
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
		console.log("ACS_TASKS_get");

		ACS.Objects.query({
			classname: 'tasks',
			where: '{"aid":' + req.params.assignment + '}'
		}, function(e) {
			//console.log( '[tasks refresh result] ' + JSON.stringify(e.tasks) );

			if (e.success && e.meta.total_results > 0) {
				_transform(e.tasks, function(results) {
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
					data: e.tasks,
					page: e.meta.page,
					count: e.meta.total_results
				});
			}

		});
	},

	create: function(req, res) {
		console.log("ACS_TASKS_create");

		res.write("create is working!");
		res.end();
	},

	update: function(req, res) {
		console.log("ACS_TASKS_update");

		res.write("update is working!");
		res.end();
	},

	del: function(req, res) {
		console.log("ACS_TASKS_del");

		res.write("del is working!");
		res.end();
	}

};

module.exports = API;
