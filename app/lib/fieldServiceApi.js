var _http = require("http");

var fieldServiceApi = (function() {
	// +-----------------------+
	// | Private members.      |
	// +-----------------------+

	var urlRoot = '[REPLACE WITH YOUR NODE.ACS ENDPOINT]';
	var responseType = 'json';
	var logLevel = 'debug';
	var publicMethods = {};

	var API = {
		getOutlets: {
			url: '/api/outlets',
			type: 'GET'
		},
		getAssignmentDetails: {
			url: '/api/assignments/detail/{id}',
			type: 'GET'
		},
		getAssignments: {
			url: '/api/assignments/{id}',
			type: 'GET'
		}
	};
	var log = {
		info: function(params) {
			if(logLevel == 'info') {
				Ti.API.info(params);
			} else if(logLevel == 'debug') {
				Ti.API.debug(params);
			}
		},
		debug: function(params) {
			if(logLevel == 'info') {
				Ti.API.info(params);
			} else if(logLevel == 'debug') {
				Ti.API.debug(params);
			}

		},
		error: function(params) {
			if(logLevel == 'info') {
				Ti.API.info(params);
			} else if(logLevel == 'debug') {
				Ti.API.error(params);
			}

		}
	};

	var fetch = function(params) {

		if(Ti.App.Properties.hasProperty('ti.fieldService.auth')) {
			/*
			 *  _params.timeout  	: int Timeout request
			 *  _params.type		: string GET/POST
			 *  _params.format		: string json, etc.
			 *  _params.data		: mixed The data to pass
			 *  _params.url			: string The url source to call
			 *  _params.failure		: funtion A function to execute when there is an XHR error
			 *  _params.success		: function when successful
			 *  _params.passthrough : Any passthrough params
			 *  _params.headers     : Array of request headers
			 */
			//var url_params = "?"+params.url_params || "";
			var url = encodeURI(urlRoot + params.url);
			var body = params.body || null;
			var type = params.type ? params.type : "GET";
			var onload = params.onload || null;
			var onerror = params.onerror || null;
			var headers = params.headers || null;
			var passthrough = params.passthrough || null;
			log.info("NODE CALL: " + url);
			_http.request({
				url: url,
				type: type,
				success: onload,
				failure: onerror,
				format: responseType,
				data: body,
				passthrough: passthrough,
				headers: headers
			});

		} else {
			log.error("Login Required.");
		}
	};

	// +-----------------------+
	// | Public members.       |
	// +-----------------------+

	publicMethods.setAuth = function(params) {
		if(params && params != "clear") {
			if(params.userID) {
				Ti.App.Properties.setString('ti.fieldService.auth', Titanium.Utils.base64encode(params.userID));
				log.debug("ACS ID Set");
			}
			if(params.user) {
				Ti.App.Properties.setString('ti.fieldService.user', Titanium.Utils.base64encode(JSON.stringify(params.user)));
			}
		} else if(params == "clear") {
			Ti.App.Properties.removeProperty('ti.fieldService.auth');
		}
	};
	publicMethods.getUser = function() {
		if(Ti.App.Properties.hasProperty('ti.fieldService.user')) {
			return JSON.parse(Titanium.Utils.base64decode(Ti.App.Properties.getString('ti.fieldService.user')));
		}

	}

	publicMethods.getAuth = function() {
		if(!Ti.App.Properties.hasProperty('ti.fieldService.auth')) {
			return false;
		} else {
			return Titanium.Utils.base64decode(Ti.App.Properties.getString('ti.fieldService.auth'));
		}
	};
	publicMethods.setLogLevel = function(params) {
		if(params && params == 'debug') {
			logLevel = 'debug';
		} else if(params && params == 'info') {
			logLevel = 'info'
		}
	};
	publicMethods.setResponseType = function(params) {
		if(params && params == "json") {
			responseType = "json"
		} else if(params && params == "xml") {
			responseType = "xml"
		} else {
			log.error("MODULE ti.fieldService responseType accepts 'json' or 'xml' only.");
		}
	};

	//Generate public API methods
	for(var method in API) {
		createMethod(method)
	}

	/* Ti.FieldService API Set.
	 *  params:{
	 *          id:         The primary id of the object request
	 *          alt_id:     Some API's require a second ID
	 *          body:       JSON body to pass with "POST" or "PUT" sample format: '{"todo-list":{"name":"Test","private":true,"pinned":true,"tracked":true,"description":"Test"}}'
	 *          onload:     The onload callback, returns single parameter as parsed JSON
	 *          onerror:    The onerror callback, returns single parameter as error response
	 *  }
	 */

	function createMethod(_method) {
		if(API[_method].url.indexOf("{id}") != -1 && API[_method].url.indexOf("{alt_id}") != -1) {

			publicMethods[_method] = function(params) {
				if(params && params.id && params.alt_id) {
					params.url = API[_method].url.replace('{id}', params.id).replace('{alt_id}', params.alt_id);
					params.type = API[_method].type;
					fetch(params);
				} else if(params && !params.id) {
					log.error("MODULE ti.fieldService: Missing required parameter 'alt_id' for " + _method);
				} else if(params && !params.alt_id) {
					log.error("MODULE ti.fieldService: Missing required parameter 'id' for " + _method);
				} else {
					log.error("MODULE ti.fieldService: Missing parameters for " + _method);
				}
			};

		} else if(API[_method].url.indexOf("{id}") != -1) {

			publicMethods[_method] = function(params) {
				if(params && params.id) {
					params.url = API[_method].url.replace('{id}', params.id);
					params.type = API[_method].type;
					fetch(params);
				} else if(params && !params.id) {
					log.error("MODULE ti.fieldService: Missing required parameter 'id' for " + _method);
				} else {
					log.error("MODULE ti.fieldService: Missing parameters for " + _method);
				}
			};

		} else {

			publicMethods[_method] = function(params) {
				params.url = API[_method].url;
				params.type = API[_method].type;
				fetch(params);
			};

		}
	};

	//Direct ACS post calls as temp workaround until API's are up
	var Cloud = require("ti.cloud");
	publicMethods.setAssignmentStatus = function(params) {
		Alloy.Globals.apm.leaveBreadcrumb("{source:'setAssignmentStatus', event:'click', status:'" + params.status + "'}");
		if(params.status == "Active") {
			Cloud.Objects.query({
				classname: 'assignment',
				page: 1,
				per_page: 1,
				where: {
					status: "Active",
					//"userID": "516ac702f0b326085e030a53"//Titanium.Utils.base64decode(Ti.App.Properties.getString('ti.fieldService.auth')).toString()
				}
			}, function(e) {
				if(e.success) {
					//alert(JSON.stringify(e)+ Titanium.Utils.base64decode(Ti.App.Properties.getString('ti.fieldService.auth')))
					if(e.assignment.length > 0) {
						updateAssignment(e.assignment[0].id, "Inactive");
					} else {
						getAssignmentId();
					}

				} else {
					params.onerror(e);
				}
			});
		} else {
			getAssignmentId();
		}

		function getAssignmentId() {
			Cloud.Objects.query({
				classname: 'assignment',
				page: 1,
				per_page: 1,
				where: {
					aid: params.aid
				}
			}, function(e) {
				if(e.success) {
					updateAssignment(e.assignment[0].id);

				} else {
					params.onerror(e);
				}
			});
		}

		function updateAssignment(id, status) {

			Cloud.Objects.update({
				classname: 'assignment',
				id: id,
				fields: {
					status: status || params.status
				}
			}, function(e) {
				if(e.success) {
					if(status) {
						getAssignmentId();
					} else {
						if(params.onload) {
							params.onload()
						}
					}

				} else {
					params.onerror(e);
				}
			});
		}
	}

	publicMethods.createTask = function(params) {
		if(params && params.type && params.duration && params.aid && params.notes && params.status) {
			Cloud.Objects.create({
				classname: 'tasks',
				fields: {
					type: params.type,
					duration: params.duration,
					aid: params.aid,
					notes: params.notes,
					status: params.status
				}
			}, function(e) {
				if(e.success) {
					if(params.onload) {
						params.onload(e.tasks[0])
					}
				} else {
					if(params.onerror) {
						params.onerror(JSON.stringify(e))
					}
				}
			});
		}
	}

	publicMethods.updateTask = function(params) {
		if(params && params.type && params.duration && params.id && params.notes && params.status) {
			Cloud.Objects.update({
				classname: 'tasks',
				id: params.id,
				fields: {
					type: params.type,
					duration: params.duration,
					notes: params.notes,
					status: params.status
				}
			}, function(e) {
				if(e.success) {
					if(params.onload) {
						params.onload(e)
					}
				} else {
					if(params.onerror) {
						params.onerror(JSON.stringify(e))
					}
				}
			});
		}
	}

	publicMethods.deleteTask = function(params) {
		if(params && params.id) {
			Cloud.Objects.remove({
				classname: 'tasks',
				id: params.id
			}, function(e) {
				if(e.success) {
					if(params.onload) {
						params.onload(e);
					}
				} else {
					if(params.onerror) {
						params.onerror(JSON.stringify(e));
					}
				}
			});
		}
	}

	publicMethods.updateExpense = function(params) {
		if(params && params.type && params.cost && params.id && params.notes) {
			Cloud.Objects.update({
				classname: 'expenses',
				id: params.id,
				fields: {
					type: params.type,
					cost: params.cost,
					notes: params.notes
				}
			}, function(e) {
				if(e.success) {
					if(params.onload) {
						params.onload(e)
					}
				} else {
					if(params.onerror) {
						params.onerror(JSON.stringify(e))
					}
				}
			});
		}
	}

	publicMethods.createExpense = function(params) {
		if(params && params.type && params.cost && params.aid && params.notes) {
			Cloud.Objects.create({
				classname: 'expenses',
				fields: {
					type: params.type,
					cost: params.cost,
					aid: params.aid,
					notes: params.notes
				}
			}, function(e) {
				if(e.success) {
					if(params.onload) {
						params.onload(e.expenses[0])
					}
				} else {
					if(params.onerror) {
						params.onerror(JSON.stringify(e))
					}
				}
			});
		}
	}

	publicMethods.deleteExpense = function(params) {
		if(params && params.id) {
			Cloud.Objects.remove({
				classname: 'expenses',
				id: params.id
			}, function(e) {
				if(e.success) {
					if(params.onload) {
						params.onload(e)
					}
				} else {
					if(params.onerror) {
						params.onerror(JSON.stringify(e))
					}
				}
			});
		}
	}

	publicMethods.updateProduct = function(params) {
		if(params && params.productName && params.productDescription && params.id && params.productStatus && params.quantity > 0) {
			Cloud.Objects.update({
				classname: 'products',
				id: params.id,
				fields: {
					productName: params.productName,
					productDescription: params.productDescription,
					productStatus: params.productStatus,
					quantity: params.quantity
				}
			}, function(e) {
				if(e.success) {
					if(params.onload) {
						params.onload(e)
					}
				} else {
					if(params.onerror) {
						params.onerror(JSON.stringify(e))
					}
				}
			});
		}
	}

	publicMethods.createProduct = function(params) {
		if(params && params.aid && params.cid && params.id && params.quantity > 0) {
			Cloud.Objects.create({
				classname: 'products',
				fields: {
					aid: params.aid,
					quantity: params.quantity,
					cid: params.cid,
					"[CUSTOM_catalog]catalog_id": params.id
				}
			}, function(e) {
				if(e.success) {
					if(params.onload) {
						params.onload(e.products[0])
					}
				} else {
					if(params.onerror) {
						params.onerror(JSON.stringify(e))
					}
				}
			});
		}
	}

	publicMethods.deleteProduct = function(params) {
		if(params && params.id) {
			Cloud.Objects.remove({
				classname: 'products',
				id: params.id
			}, function(e) {
				if(e.success) {
					if(params.onload) {
						params.onload(e)
					}
				} else {
					if(params.onerror) {
						params.onerror(JSON.stringify(e))
					}
				}
			});
		}
	}

	publicMethods.createDocument = function(params) {
		if(params && params.file && params.name && params.description && params.aid) {
			Cloud.Photos.create({
				photo: params.file,
				custom_fields: {
					description: params.description,
					name: params.name,
					aid: params.aid
				}
			}, function(e) {
				if(e.success) {
					if(params.onload) {
						params.onload(e)
					}
				} else {
					if(params.onerror) {
						params.onerror(JSON.stringify(e))
					}
				}
			});
		} else {
			alert("Missing data to submit document");
		}
	}

	publicMethods.updateDocument = function(params) {
		if(params && params.type && params.name && params.description && params.aid) {
			if(params.type === "PHOTO") {
				Cloud.Photos.update({
					photo_id: params.id,
					custom_fields: {
						description: params.description,
						name: params.name,
						aid: params.aid
					}
				}, function(e) {
					if(e.success) {
						if(params.onload) {
							params.onload(e)
						}
					} else {
						if(params.onerror) {
							params.onerror(JSON.stringify(e))
						}
					}
				});
			} else {
				Cloud.Files.update({
					file_id: params.id,
					name: params.name,
					custom_fields: {
						description: params.description,
						aid: params.aid
					}
				}, function(e) {
					if(e.success) {
						if(params.onload) {
							params.onload(e)
						}
					} else {
						if(params.onerror) {
							params.onerror(JSON.stringify(e))
						}
					}
				});
			}
		}
	}

	publicMethods.deleteDocument = function(params) {
		if(params && params.id && params.type) {
			if(params.type === "PHOTO") {
				Cloud.Photos.remove({
					photo_id: params.id
				}, function(e) {
					if(e.success) {
						if(params.onload) {
							params.onload(e);
						}
					} else {
						if(params.onerror) {
							params.onerror(JSON.stringify(e));
						}
					}
				});
			} else {
				Cloud.Files.remove({
					file_id: params.id
				}, function(e) {
					if(e.success) {
						if(params.onload) {
							params.onload(e);
						}
					} else {
						if(params.onerror) {
							params.onerror(JSON.stringify(e));
						}
					}
				});
			}
		}
	}

	publicMethods.getCatalog = function(params) {
		_http.request({
			url: urlRoot + "catalog",
			timeout: 20000,
			type: "GET",
			format: "json",
			success: function(_data) {
				if(params.onload) {
					params.onload(_data);
				}
			},
			failure: function(_error) {
				if(params.onerror) {
					params.onerror(_error);
				}
			}
		});
	}

	return publicMethods;

})();

module.exports = fieldServiceApi;