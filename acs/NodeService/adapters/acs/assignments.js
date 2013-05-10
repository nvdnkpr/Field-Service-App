var ACS = require('acs').ACS,
	when = require('when'),
	outletData;

var _transform = function(userid, data, _cb) {
	var results = [],
		dataCount = data.length,
		i = 0;

	if (dataCount > 0) {
		for (i = 0; i < dataCount; i++) {
			if (userid === data[i].userID) { //data[i]["[ACS_User]user_id"][0].id
				outletData = data[i];
				console.log('[outletdata 1st] ' + JSON.stringify(outletData));

				outletData = {
					status: outletData.status,
					dateM: outletData.updatd_at,
					dateC: outletData.created_at,
					aid: outletData.aid,
					dateA: outletData.dateA,
					outlet: {
						name: outletData["[CUSTOM_outlets]outlet_id"][0].name,
						address: outletData["[CUSTOM_outlets]outlet_id"][0].address_1,
						city: outletData["[CUSTOM_outlets]outlet_id"][0].City,
						state: outletData["[CUSTOM_outlets]outlet_id"][0].State,
						zip: outletData["[CUSTOM_outlets]outlet_id"][0].zip,
						latitude: outletData["[CUSTOM_outlets]outlet_id"][0].latitude,
						longitude: outletData["[CUSTOM_outlets]outlet_id"][0].longitude,
						contactName: outletData["[CUSTOM_outlets]outlet_id"][0].contactName,
						contactPhone: outletData["[CUSTOM_outlets]outlet_id"][0].contactPhone,
						contactEmail: outletData["[CUSTOM_outlets]outlet_id"][0].contactEmail,
						oid: outletData["[CUSTOM_outlets]outlet_id"][0].oid,
						aid: outletData.aid,
						id: outletData["[CUSTOM_outlets]outlet_id"][0].id
					}
				};

				ACS.Objects.query({
					classname: 'tasks',
					where: '{"aid":' + outletData.aid + '}'
				}, function(e) {

					console.log('[outletdata tasks] ' + JSON.stringify(data[i]));
					//outletData["tasksCount"] = e.meta.total_results;

					//results.push(outletData);
					// results.push({
					// status: outletData.status,
					// dateM: outletData.dateM,
					// dateC: outletData.dateC,
					// aid: outletData.aid,
					// dateA: outletData.dateA,
					// tasksCount: e.meta.total_results,
					// outlet: {
					// name: outletData["[CUSTOM_outlets]outlet_id"][0].name,
					// address: outletData["[CUSTOM_outlets]outlet_id"][0].address_1,
					// city: outletData["[CUSTOM_outlets]outlet_id"][0].City,
					// state: outletData["[CUSTOM_outlets]outlet_id"][0].State,
					// zip: outletData["[CUSTOM_outlets]outlet_id"][0].zip,
					// latitude: outletData["[CUSTOM_outlets]outlet_id"][0].latitude,
					// longitude: outletData["[CUSTOM_outlets]outlet_id"][0].longitude,
					// contactName: outletData["[CUSTOM_outlets]outlet_id"][0].contactName,
					// contactPhone: outletData["[CUSTOM_outlets]outlet_id"][0].contactPhone,
					// oid: outletData["[CUSTOM_outlets]outlet_id"][0].oid,
					// id: outletData["[CUSTOM_outlets]outlet_id"][0].id
					// }
					// });	

					outletData = null;

				});

			} // end if
		} // end for

		_cb && _cb(results);
	} else {
		_cb && _cb(results);
	}

};

var _transformMulti = function(type, data, _cb) {
	var results;

	switch (type) {
		case 'assignment':
			results = {
				status: data.status,
				dateM: data.updated_at,
				dateC: data.created_at,
				aid: data.aid,
				dateA: data.dateA,
				outlet: {
					name: data["[CUSTOM_outlets]outlet_id"][0].name,
					address: data["[CUSTOM_outlets]outlet_id"][0].address_1,
					city: data["[CUSTOM_outlets]outlet_id"][0].City,
					state: data["[CUSTOM_outlets]outlet_id"][0].State,
					zip: data["[CUSTOM_outlets]outlet_id"][0].zip,
					latitude: data["[CUSTOM_outlets]outlet_id"][0].latitude,
					aid: data.aid,
					longitude: data["[CUSTOM_outlets]outlet_id"][0].longitude,
					contactName: data["[CUSTOM_outlets]outlet_id"][0].contactName,
					contactPhone: data["[CUSTOM_outlets]outlet_id"][0].contactPhone,
					contactEmail: data["[CUSTOM_outlets]outlet_id"][0].contactEmail,
					oid: data["[CUSTOM_outlets]outlet_id"][0].oid,
					id: data["[CUSTOM_outlets]outlet_id"][0].id
				}
			};

			break;
		case 'outlet':
			results = {
				status: data[0].status,
				dateM: data[0].updated_at,
				dateC: data[0].created_at,
				aid: data[0].aid,
				dateA: data[0].dateA,
				outlet: {
					name: data[0]["[CUSTOM_outlets]outlet_id"][0].name,
					address: data[0]["[CUSTOM_outlets]outlet_id"][0].address_1,
					city: data[0]["[CUSTOM_outlets]outlet_id"][0].City,
					state: data[0]["[CUSTOM_outlets]outlet_id"][0].State,
					zip: data[0]["[CUSTOM_outlets]outlet_id"][0].zip,
					latitude: data[0]["[CUSTOM_outlets]outlet_id"][0].latitude,
					longitude: data[0]["[CUSTOM_outlets]outlet_id"][0].longitude,
					contactName: data[0]["[CUSTOM_outlets]outlet_id"][0].contactName,
					contactPhone: data[0]["[CUSTOM_outlets]outlet_id"][0].contactPhone,
					contactEmail: data[0]["[CUSTOM_outlets]outlet_id"][0].contactEmail,
					oid: data[0]["[CUSTOM_outlets]outlet_id"][0].oid,
					id: data[0]["[CUSTOM_outlets]outlet_id"][0].id
				}
			};
			break;
		case 'tasks':

			results = [];
			if (data.success && data.meta.total_results > 0) {
				for (var i = 0; i < data.tasks.length; i++) {
					results.push({
						id: data.tasks[i].id,
						aid: data.tasks[i].aid,
						notes: data.tasks[i].notes,
						status: data.tasks[i].status,
						duration: data.tasks[i].duration,
						type: data.tasks[i].type
					});
				}
			}

			break;
		case 'products':
			results = [];
			if (data.success && data.meta.total_results > 0) {
				//console.log('product 1: ' + JSON.stringify(data.products[0]));
				for (var i = 0; i < data.products.length; i++) {
					results.push({
						id: data.products[i].id,
						aid: data.products[i].aid,
						cid: data.products[i].cid,
						quantity: data.products[i].quantity,
						productName: (data.products[i]["[CUSTOM_catalog]catalog_id"] && data.products[i]["[CUSTOM_catalog]catalog_id"][0]) ? data.products[i]["[CUSTOM_catalog]catalog_id"][0].name : 'No Product Name',
						productDescription: (data.products[i]["[CUSTOM_catalog]catalog_id"] && data.products[i]["[CUSTOM_catalog]catalog_id"][0]) ? data.products[i]["[CUSTOM_catalog]catalog_id"][0].description : 'No Product Description',
						productStatus: (data.products[i]["[CUSTOM_catalog]catalog_id"] && data.products[i]["[CUSTOM_catalog]catalog_id"][0]) ? data.products[i]["[CUSTOM_catalog]catalog_id"][0].status : 'No Product Status',
						productCID: (data.products[i]["[CUSTOM_catalog]catalog_id"] && data.products[i]["[CUSTOM_catalog]catalog_id"][0]) ? data.products[i]["[CUSTOM_catalog]catalog_id"][0].cid : 'No Product Catalog ID'
						// notes: data.products[i].notes,
						// duration: data.products[i].duration,
						// type: data.products[i].type
					});
				}
			}
			break;
		case 'expenses':
			results = [];
			if (data.success && data.meta.total_results > 0) {
				for (var i = 0; i < data.expenses.length; i++) {
					results.push({
						id: data.expenses[i].id,
						cost: data.expenses[i].cost,
						aid: data.expenses[i].aid,
						type: data.expenses[i].type,
						notes: data.expenses[i].notes
						// notes: data.products[i].notes,
						// duration: data.products[i].duration,
						// type: data.products[i].type
					});
				}
			}
			break;
		case 'files':
			results = [];
			if (data.success && data.meta.total_results > 0) {
				for (var i = 0; i < data.files.length; i++) {
					results.push({
						type: 'FILE',
						id: data.files[i].id,
						name: data.files[i].name,
						url: data.files[i].url,
						description: data.files[i].custom_fields.description,
						aid: data.files[i].custom_fields.aid
						//notes: data.files[i].notes
						// notes: data.products[i].notes,
						// duration: data.products[i].duration,
						// type: data.products[i].type
					});
				}
			}
			break;
		case 'photos':
			results = [];
			if (data.success && data.meta.total_results > 0) {
				for (var i = 0; i < data.photos.length; i++) {
					results.push({
						type: 'PHOTO',
						id: data.photos[i].id,
						name: data.photos[i].filename,
						urls: data.photos[i].urls,
						description: data.photos[i].custom_fields.description,
						aid: data.photos[i].custom_fields.aid
					});
				}
			}
			break;
	} // end switch

	_cb && _cb(results);

};

var _calculateTasks = function(aid, results, _cb) {
	var tasksCount = 0;

	ACS.Objects.query({
		classname: 'tasks',
		where: '{"aid":' + aid + '}'
	}, function(e) {
		//console.log('[ tasks count ] ' + JSON.stringify(e.tasks.length) );

		if (e.success) {
			tasksCount = e.tasks.length;
		}
		results["tasksCount"] = tasksCount;

		_cb && _cb(results);
		//return tasksCount;

	});

};

var API = {

	adapterType: "ACS",

	get: function(req, res) {
		//console.log("ACS_ASSIGNMENTS_get " + req.params.userid);
		var detailResults = {}, detailTasks = [];

		ACS.Objects.query({
			classname: 'assignment',
			where: '{"assigneduser":"' + req.params.userid + '"}'
		}, function(e) {
			//console.log( '[assignments result] ' + JSON.stringify(e) );

			if (e.success && e.meta.total_results > 0) {
				for (var i = 0; i < e.assignment.length; i++) {
					//if( req.params.userid === e.assignment[i].userID ){ 
					detailResults = {};
					//console.log('[MATCH IS] : ' + JSON.stringify(e.assignment[i]) );
					_transformMulti('assignment', e.assignment[i], function(results) {

						detailResults = results;

						_calculateTasks(results.aid, results, function(newResults) {
							//setTimeout( function(){
							detailTasks.push(newResults);
							//}, 2000);

						});
						// var assignmentTasks = _calculateTasks;
						// 							
						// when(assignmentTasks).then(function(tCount){
						// console.log('[inside when] ' + tCount );
						// detailResults["tasksCount"] = tCount;
						// 								
						// }, function(){
						// 								
						// });
					});
					//}// end if

					//console.log('[dump] ' + JSON.stringify(detailTasks));

				} // end for
				//console.log('[dump] ' + JSON.stringify(detailTasks));
				//console.log( detailTasks );
				setTimeout(function() {
					res.json({
						result: e.success,
						data: detailTasks,
						page: e.meta.page
						//count: results.length
					});
				}, 4000);

			} else {
				res.json({
					result: e.success,
					data: e.assignment,
					//page:  e.meta.page,
					//count: e.assignment.length
				});
			}

		});
	},

	getdetail: function(req, res) {
		//console.log("ACS_ASSIGNMENTS_getdetail " + req.params.aid);
		var detailResults = {};

		ACS.Objects.query({
			classname: 'assignment',
			// page: 1,
			// per_page: 50,
			where: '{"aid":' + req.params.aid + '}'
		}, function(e) {
			//console.log('[assignment getDetail] ' + JSON.stringify(e) );

			if (e.success && e.meta.total_results > 0) {
				_transformMulti('outlet', e.assignment, function(results) {
					detailResults["outlet"] = results;

					ACS.Objects.query({
						classname: 'tasks',
						where: '{"aid":' + req.params.aid + '}'
					}, function(e) {

						_transformMulti('tasks', e, function(results) {
							detailResults["tasks"] = results;
							ACS.Objects.query({
								classname: 'products',
								where: '{"aid":' + req.params.aid + '}'
							}, function(e) {
								//console.log('[product results] ' + JSON.stringify(e) );							
								_transformMulti('products', e, function(results) {
									detailResults["products"] = results;
									ACS.Objects.query({
										classname: 'expenses',
										where: '{"aid":' + req.params.aid + '}'
									}, function(e) {

										_transformMulti('expenses', e, function(results) {
											detailResults["expenses"] = results;
											ACS.Files.query({
												page: 1,
												per_page: 50,
												//where:'{"custom_fields":{"aid":"'+ req.params.aid +'"}}'
											}, function(e) {
												//console.log('[files details] ' + JSON.stringify(e));											
												_transformMulti('files', e, function(results) {
													detailResults["documents"] = results;
													ACS.Photos.query({
														//where:'{"custom_fields":{"aid":"'+ req.params.aid +'"}}'
														where: '{"aid":' + req.params.aid + '}',
														response_json_depth: 1
													}, function(e) {

														console.log('[photos details] ' + JSON.stringify(e));
														_transformMulti('photos', e, function(results) {
															detailResults["documents"] = detailResults["documents"].concat(results);
															setTimeout(function() {
																res.json({
																	result: true,
																	data: detailResults
																});
															}, 2000);
														}); // end tranformMulti

													}); // end ACS Photos

												}); // end tranformMulti

											}); // end ACS Files

										}); // end tranformMulti							

									}); // end ACS.query('expenses);
								});

							});

						}); // end _transformMulti('tasks');

					});

				});

			} else {
				res.json({
					result: e.success,
					data: [],
					message: 'No Outlet Summary exists for this Assignment',
					page: e.meta.page,
					count: e.meta.total_results
				});
			}

		});
	},

	getstatus: function(req, res) {
		console.log("ACS_ASSIGNMENTS_getstatus " + req.params.userid + '  status: ' + req.params.status);
		var detailResults = {}, detailTasks = [];

		ACS.Objects.query({
			classname: 'assignment',
			where: '{"assigneduser":"' + req.params.userid + '","status":"' + req.params.status + '"}'
		}, function(e) {
			//console.log( '[assignments result] ' + JSON.stringify(e) );

			if (e.success && e.meta.total_results > 0) {
				for (var i = 0; i < e.assignment.length; i++) {
					//if( req.params.userid === e.assignment[i].userID ){ 
					detailResults = {};
					//console.log('[MATCH IS] : ' + JSON.stringify(e.assignment[i]) );
					_transformMulti('assignment', e.assignment[i], function(results) {

						detailResults = results;
						detailResults["tasksCount"] = 0;
						detailTasks.push(detailResults);

						// _calculateTasks(results.aid,results,function(newResults){
						// setTimeout( function(){
						// 									
						// }, 2000);
						// 								
						// });
						// var assignmentTasks = _calculateTasks;
						// 							
						// when(assignmentTasks).then(function(tCount){
						// console.log('[inside when] ' + tCount );
						// detailResults["tasksCount"] = tCount;
						// 								
						// }, function(){
						// 								
						// });

					});
					//}// end if

					//console.log('[dump] ' + JSON.stringify(detailTasks));

				} // end for
				//console.log('[dump] ' + JSON.stringify(detailTasks));
				console.log(detailTasks);
				setTimeout(function() {
					res.json({
						result: e.success,
						data: detailTasks,
						page: e.meta.page
						//count: results.length
					});
				}, 2000);

			} else {
				res.json({
					result: e.success,
					data: e.assignment,
					//page:  e.meta.page,
					//count: e.assignment.length
				});
			}

		});
	},

	create: function(req, res) {
		console.log("ACS_ASSIGNMENTS_create");
		res.write("create is working!");
		res.end();
	},

	update: function(req, res) {
		console.log("ACS_ASSIGNMENTS_update");
		res.write("update is working!");
		res.end();
	},

	del: function(req, res) {
		console.log("ACS_ASSIGNMENTS_del");
		res.write("del is working!");
		res.end();
	}

};

module.exports = API;
