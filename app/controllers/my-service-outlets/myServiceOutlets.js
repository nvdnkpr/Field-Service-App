var _args = arguments[0] || {},
Animation = require("alloy/animation"),
	api = require("fieldServiceApi"),
	moment = require("alloy/moment"),
	loading = null,
	assignmentCollection = Alloy.Collections.assignments,
	outlets = {
		placards: [],
		annotations: [],
		currentData: []
	};

//Set module log level to 'info' for easier debuging
//api.setLogLevel('info');

//Get remote assignments on load of controller
getAssignments({
	showLoading: false
});

//Set the refresh button to re-load assginments	
$.topNav.btnRefresh.addEventListener("click", function() {
	getAssignments({
		showLoading: true
	});
});

//Global loading indicator (Opens its own window)
function showLoading(message) {

	loading = Ti.UI.createActivityIndicator({
		message: message || "  Retrieving Latest Assignments...",
		backgroundColor: "#000000",
		color: "#ffffff",
		style: Titanium.UI.iPhone.ActivityIndicatorStyle.BIG,
		height: Ti.UI.FILL,
		width: Ti.UI.FILL,
		borderRadius: 8,
		opacity: 0.8,
		font: {
			fontSize: 24,
			fontWeight: "bold"
		}
	});
	$.container.add(loading);
	loading.show();
}
//Hide and remove global loading indicator
function hideLoading() {

	if(loading) {
		$.container.remove(loading);
		loading = null;
	}
}

//Load remote assignments
function getAssignments(params) {

	//Show loading indicator if called for (not used on first load)
	if((params && params.showLoading) || !params) {
		showLoading();
	}

	//Get current assignments and fire 'createOutlets' onload
	api.getAssignments({
		id: api.getAuth(),
		onload: function(e) {
			createOutlets(e);
			if(params && params.callback) {
				params.callback();
			}
		},
		onerror: function() {
			var results = {
				data: assignmentCollection.toJSON()
			}
			createOutlets(results, "update");
			hideLoading();
			var alertDialog = Ti.UI.createAlertDialog({
				title: "No Assignments Available",
				message: "Remote outlet information is currently unavailable.  Any local assignments have been loaded.",
				buttonNames: ["Try Again", "Ok"]
			});
			alertDialog.addEventListener("click", function(evt) {
				if(evt.index == 0) {
					getAssignments();
				}
			});
			alertDialog.show();

		}
	});
}

//The login animation transition which removes the login widget and opens My Service Outlets
function loginTransition() {
	Alloy.Globals.MyOutlets.getView().applyProperties({
		opacity: 0.0,
		transform: Ti.UI.create2DMatrix({
			scale: 0.5
		})
	});
	Alloy.Globals.MainWindow.add(Alloy.Globals.MyOutlets.getView());
	Alloy.Globals.Login.getView().animate({
		transform: Ti.UI.create2DMatrix({
			scale: 3
		}),
		opacity: 0.0,
		duration: 500
	}, function() {
		Alloy.Globals.MainWindow.remove(Alloy.Globals.Login.getView());
		Alloy.Globals.Login.close();
		Alloy.Globals.Login = null;
	});
	setTimeout(function() {
		Alloy.Globals.MyOutlets.getView().animate({
			transform: Ti.UI.create2DMatrix({
				scale: 1.0
			}),
			opacity: 1.0,
			duration: 500
		});
	}, 250);
}

//Create Outlet placards and store to 'assignments' model
function createOutlets(results, type) {
	if(Alloy.Globals.Login) {
		loginTransition();
	}
	if($.outletContainer.children[1]) {
		if($.outletContainer.children[1].id == "noResults") {
			$.outletContainer.remove($.outletContainer.children[1]);
		}
	}
	//Hide scrollView to re-populate
	$.scrollView.animate({
		opacity: 0.0,
		duration: 250
	});
	$.activeOutletContainer.animate({
		opacity: 0.0,
		duration: 250
	});
	var activeSet = null;
	if(results.data.length > 0) {
		//Clear outlets object arrays to re-populate
		outlets.placards = [];
		outlets.annotations = [];

		//Remove old placards from scrollView if they exist
		if($.scrollView.children.length > 0) {
			for(var i = $.scrollView.children.length - 1; i >= 0; i--) {
				if($.scrollView.children[i] != null && $.scrollView.children[i] != undefined) {
					$.scrollView.remove($.scrollView.children[i]);
				}
			}
		}

		$.scrollView.add(Ti.UI.createView({
			height: 20
		})); // #FIX: add small spacer above inactive outlets

		//loop through results and create placards, annotations & models
		for(var i in results.data) {
			if(results.data[i].status && results.data[i].outlet && !results.data[i].outlet.status) {
				results.data[i].outlet.status = results.data[i].status;
				results.data[i].outlet.dateM = results.data[i].dateM;
				results.data[i].outlet.dateC = results.data[i].dateC;
				results.data[i].outlet.dateA = results.data[i].dateA;
				results.data[i].outlet.aid = results.data[i].aid;
				results.data[i].outlet.tasksCount = results.data[i].tasksCount;
				results.data[i].outlet.search = results.data[i].outlet.name.toLowerCase() + results.data[i].outlet.city.toLowerCase() + results.data[i].outlet.contactName.toLowerCase() + results.data[i].outlet.address.toLowerCase();
			}
			//Assign a placard count to non-active placards for reference
			results.data[i].count = i;

			//Set active assignment in the ActiveOutlet placard
			if(results.data[i].outlet.status == "Active") {
				activeSet = true;
				$.myActiveOutlet.populateOutlet(results.data[i].outlet, getAssignments);
				Alloy.Globals.activeAid = results.data[i].aid;
			} else {

				//Create assignment placard
				if(Alloy.CFG.theme == "appc-red") {
					outlets.placards[i] = Alloy.createController("/my-service-outlets/placard", results.data[i]);
				} else if(Alloy.CFG.theme == "appc-blue") {
					outlets.placards[i] = Alloy.createController("/my-service-outlets/activeOutlet", results.data[i].outlet);
				}

				//Add placard to the scrollView
				$.scrollView.add(outlets.placards[i].getView());

				if(Alloy.CFG.theme == "appc-blue") {
					$.scrollView.add(Ti.UI.createView({
						height: 10
					})); // #FIX: add small spacer below inactive outlets
				}
			}
			//Create the assignment map annotation
			outlets.annotations[i] = Alloy.createController("/common/mapAnnotation", results.data[i].outlet).getView();

			//Save the assignment to the assignments model if it is not just a filter or sort function
			// if(!type || type != "update"){
			var assignmentModel = Alloy.createModel('assignments', results.data[i].outlet);
			assignmentModel.save();
			assignmentCollection.add(assignmentModel);
			// }
			if($.toolbar.touchEnabled == false) {
				$.toolbar.animate({
					opacity: 1.0,
					duration: 250
				});
				$.toolbar.touchEnabled = true;
			}
			if(Alloy.Globals.Map) {
				Alloy.Globals.Map.setAnnotations(outlets.annotations);
			}

		}

		if(activeSet) {
			if($.myOutletsContainer.top != 248) {
				$.myOutletsContainer.animate({
					top: 248,
					duration: 250
				}, function() {
					$.myOutletsContainer.top = 248;
					$.activeOutletContainer.animate({
						opacity: 1.0,
						duration: 250
					});
				});
			} else {
				$.activeOutletContainer.animate({
					opacity: 1.0,
					duration: 250
				});
			}
			//we have to update this becau the content does not always show up completely
			$.scrollView.contentHeight = Alloy.CFG.theme == "appc-red" ? (Math.ceil(results.data.length / 3) * 277) + 35 : (Math.ceil(results.data.length) * 188) + 35;
		} else {
			$.myOutletsContainer.animate({
				top: 60,
				duration: 250
			}, function() {
				$.myOutletsContainer.top = 60;
			});
			//we have to update this coz the content does not always show up completely
			$.scrollView.contentHeight = Alloy.CFG.theme == "appc-red" ? (Math.ceil(results.data.length / 3) * 277) + 35 : (Math.ceil(results.data.length) * 188) + 35;
		}

		//Re-display the assignment placards
		$.scrollView.animate({
			opacity: 1.0,
			duration: 250
		});

		//Hide global loading if it is showing
		hideLoading();
	} else {
		if(!type || type != "update") {
			$.toolbar.animate({
				opacity: 0.4,
				duration: 250
			});
			$.toolbar.touchEnabled = false;
		}
		$.myOutletsContainer.animate({
			top: 60,
			duration: 250
		}, function() {
			$.myOutletsContainer.top = 60;
		});

		var noResultsView = Ti.UI.createLabel({
			id: "noResults",
			text: "No Results...",
			color: "#ffffff",
			backgroundColor: "#000000",
			opacity: 0.0,
			height: Ti.UI.FILL,
			width: Ti.UI.FILL,
			borderRadius: 5,
			textAlign: "center",
			font: {
				fontSize: 24,
				fontWeight: "bold"
			}
		});
		$.outletContainer.add(noResultsView);
		noResultsView.animate({
			opacity: 0.5,
			duration: 250
		});
		noResultsView.addEventListener("touchstart", removeNoResults);

		function removeNoResults() {
			noResultsView.animate({
				opacity: 0.0,
				duration: 250
			}, function() {
				$.outletContainer.remove(noResultsView);
				noResults = null;
			});
			$.scrollView.animate({
				opacity: 1.0,
				duration: 250
			});
			if(activeSet) {
				if($.myOutletsContainer.top != 248) {
					$.myOutletsContainer.animate({
						top: 248,
						duration: 250
					}, function() {
						$.myOutletsContainer.top = 248;
						$.activeOutletContainer.animate({
							opacity: 1.0,
							duration: 250
						});
					});
				} else {
					$.activeOutletContainer.animate({
						opacity: 1.0,
						duration: 250
					});
				}
			}
		}
		//Hide global loading if it is showing
		hideLoading();

	}

}

/*Open the detailsView controller for a particular outlet 
 *(currently receiving e from the click event and passing navData to navigate to a certain window)
 */
function openDetails(e, navData) {

	if(Alloy.Globals.DetailsView == null) {

		var _data = null;
		if(e.clicksource && e.clicksource == 'rightButton') {
			_data = e.annotation;

		} else {
			_data = e.source;
		}
		if(_data && _data.aid) {
			console.log("openDetails");
			showLoading("  Loading Outlet Details...");

			Alloy.Globals.DetailsView = Alloy.createController("/service-outlet-detail/detailsView", {
				source: _data,
				callback: closeDetails,
				navData: navData || null
			});
			Alloy.Globals.DetailsView.loadDetails(function(e) {
				if(e && e.success == false) {
					hideLoading();
				} else {
					Alloy.Globals.DetailsView.getView().applyProperties({
						transform: Ti.UI.create2DMatrix({
							scale: 0.5
						}),
						opacity: 0.0
					});
					Alloy.Globals.MainWindow.add(Alloy.Globals.DetailsView.getView());
					Alloy.Globals.MyOutlets.getView().animate({
						transform: Ti.UI.create2DMatrix({
							scale: 3
						}),
						opacity: 0.0,
						duration: 1000
					});
					setTimeout(function() {
						Alloy.Globals.DetailsView.getView().animate({
							transform: Ti.UI.create2DMatrix({
								scale: 1.0
							}),
							opacity: 1.0,
							duration: 1000
						}, function() {
							hideLoading();
						});
					}, 250);
				}
			});
		}
	}
}

//Close the detailsView controller
function closeDetails() {
	console.log("closeDetails");
	$.myActiveOutlet.timer.checkStatus();
	Alloy.Globals.DetailsView.getView().animate({
		transform: Ti.UI.create2DMatrix({
			scale: 0.5
		}),
		opacity: 0.0,
		duration: 1000
	}, function() {
		Alloy.Globals.MainWindow.remove(Alloy.Globals.DetailsView.getView());
		Alloy.Globals.returnView = null;
		Alloy.Globals.DetailsView.destroy();
		Alloy.Globals.DetailsView = null;
	});

	setTimeout(function() {
		Alloy.Globals.MyOutlets.getView().animate({
			transform: Ti.UI.create2DMatrix({
				scale: 1.0
			}),
			opacity: 1.0,
			duration: 1000
		});
	}, 500);
}

/**Open map from all of the different map icon clicks
 * @param {Array} annotationData Annotation data to add to the map.
 * @param {Object} [mapData] Map properties to pass to the map implementation.
 */
function openMap(params) {
	if(outlets.annotations.length) {

		if(params.source.oid) {
			var annotation = _.find(outlets.annotations, function(data) {
				return data.oid == params.source.oid;
			});
		}
		var annotationData = annotation ? [annotation] : outlets.annotations;
		var mapData = {
			container: (params.source.viewType == "placard") ? outlets.placards[params.source.count] : $.outletContainer,
			style: params.source.viewType,
			annotations: annotationData,
			region: {
				latitude: annotationData[0].latitude,
				latitudeDelta: (params.source.count) ? 0.005 : 0.1,
				longitude: annotationData[0].longitude,
				longitudeDelta: (params.source.count) ? 0.005 : 0.1
			}
		};

		if(!Alloy.Globals.Map) {
			Alloy.Globals.Map = Alloy.createController("/common/mapView", mapData);
		} else {
			Alloy.Globals.Map.show(mapData);
		}

		if(params.source.id == "mapBtn") {
			//Change button displays
			$.listBtn.backgroundImage = "/my-service-outlets/view-list-inactive.png";
			$.mapBtn.backgroundImage = "/my-service-outlets/view-map-active.png";
			$.mapBtn.applyProperties({
				backgroundImage: "/my-service-outlets/view-map-active.png",
				touchEnabled: false
			});
		}
	} else {
		alert("There are no outlets to display.")
	}
}

//Click event on ScrollView for Placard events
function placardClick(e) {
	if(e.source.id == "btnLocation") {
		console.log("LOCATION_INFO_CLICKED");
		openMap(e);
	} else if(e.source.id == "btnContact") {
		console.log("CONTACT_INFO_CLICKED");
		showContactPopOver(e);
	} else if(e.source.id == "statusView") {
		console.log("Status View Clicked");
		showStatusPopOver(e);

	} else if(e.source.aid || e.source.oid) {
		console.log("PLACARD_CLICKED");
		openDetails(e);
	}
}

//Use click location to show assignment status popover
function showStatusPopOver(e) {
	if(OS_IOS) {
		var convertedPoint = e.source.convertPointToView({
			x: e.x,
			y: e.y
		}, Alloy.Globals.MainWindow);
		var popoverArgs = {
			arrowPosition: "top",
			view: createStatusPopOverView(e.source),
			containerLayout: {}
		};

		var point_outletContainer = e.source.convertPointToView({
			x: e.x,
			y: e.y
		}, $.outletContainer);

		popoverArgs.containerLayout.left = convertedPoint.x - 140;
		if(point_outletContainer.y < 185) {
			popoverArgs.arrowPosition = "top";
			popoverArgs.containerLayout.top = convertedPoint.y;
		} else {
			popoverArgs.arrowPosition = "bottom";
			popoverArgs.containerLayout.top = convertedPoint.y - 260;
		}
		var popover = Alloy.createController("/common/popover", popoverArgs);
	} else if(OS_ANDROID) {
		var opts = {
			options: ["Active", "On Hold", "Inactive", "Complete"],
			title: "Select Outlet Status",
			callbackArray: [activeClick, holdClick, inactiveClick, completeClick],
			source: e.source
		};
		Alloy.createController("/common/optionDialog", opts);
	}
}

//Use click location to show outlet contact options popover
function showContactPopOver(e) {
	if(OS_IOS) {
		var convertedPoint = e.source.convertPointToView({
			x: e.x,
			y: e.y
		}, Alloy.Globals.MainWindow);
		var popoverArgs = {
			arrowPosition: "top",
			view: createContactPopOverView(e.source),
			containerLayout: {},
			type: "exception"
		};

		var point_outletContainer = e.source.convertPointToView({
			x: e.x,
			y: e.y
		}, $.outletContainer);

		if(point_outletContainer.x > 150) {
			popoverArgs.containerLayout.left = convertedPoint.x - 140;
			if(point_outletContainer.y < 230) {
				popoverArgs.arrowPosition = "top";
				popoverArgs.containerLayout.top = convertedPoint.y;
			} else {
				popoverArgs.arrowPosition = "bottom";
				popoverArgs.containerLayout.top = convertedPoint.y - 211;
			}
		} else {
			if(point_outletContainer.y < 330) {
				popoverArgs.arrowPosition = "left";
				popoverArgs.containerLayout.left = convertedPoint.x + 5;
				popoverArgs.containerLayout.top = convertedPoint.y - 112;
			} else {
				popoverArgs.arrowPosition = "bottomLeft";
				popoverArgs.containerLayout.top = convertedPoint.y - 215;
				popoverArgs.containerLayout.left = convertedPoint.x - 40;
			}
		}
		var popover = Alloy.createController("/common/popover", popoverArgs);
	} else if(OS_ANDROID) {
		var opts = {
			options: ["Email", "Add to Contacts"],
			title: "Select an option",
			callbackArray: [sendEmail, addToContacts],
			source: e.source
		};
		Alloy.createController("/common/optionDialog", opts);
	}
}

//Generate the buttons used in the popovers
function createPopOverButton(title, top) {
	var btn = Ti.UI.createButton({
		backgroundImage: "/common/btn-light-flex.png",
		backgroundSelectedImage: "/common/btn-light-touch-flex.png",
		width: 200,
		height: 44,
		top: top,
		title: title,
		color: "#000",
		font: {
			fontWeight: "bold",
			fontSize: 16
		}
	});
	return btn;
}

//Generate the Contact popover view
function createContactPopOverView(source) {
	var view = Ti.UI.createView({
		width: 200,
		height: 93,
		top: 0
	});
	var btnEmail = createPopOverButton("Email", 0);
	var btnAddToContacts = createPopOverButton("Add to Contacts", 49);
	btnEmail.addEventListener("click", function() {
		sendEmail(source);
	});
	btnAddToContacts.addEventListener("click", function() {
		addToContacts(source);
	});
	view.add(btnEmail);
	view.add(btnAddToContacts);
	return view;
}

function sendEmail(source) {
	var where = assignmentCollection.where({
		oid: source.oid
	});
	var data = JSON.parse(JSON.stringify(where[0]));
	var emailArgs = {
		toRecipients: [data.contactEmail]
	};
	if(OS_IOS) {
		emailArgs.barColor = "#000";
	}
	var emailDialog = Ti.UI.createEmailDialog(emailArgs);
	emailDialog.open();
}

function addToContacts(source) {
	var where = assignmentCollection.where({
		oid: source.oid
	});
	var data = JSON.parse(JSON.stringify(where[0]));
	var name = data.contactName.split(" ");
	Ti.Contacts.createPerson({
		firstName: name[0],
		lastName: name[1],
		organization: data.name,
		phone: {
			work: [data.contactPhone]
		},
		email: {
			work: [data.contactEmail]
		},
		address: {
			work: [
	      {
				CountryCode: 'us', // determines how the address is displayed
				Street: data.address,
				City: data.city,
				ZIP: data.zip
			}
	   ]
		}
	});
	var alertDialog = Ti.UI.createAlertDialog({
		title: "Contact Saved",
		message: name[0] + " " + name[1] + " of " + data.name + " has been saved to your contacts."
	});
	alertDialog.show();
}

//Generate the Status popover view
function createStatusPopOverView(source) {
	var view = Ti.UI.createView({
		width: 200,
		height: 147,
		top: 0,
		layout: "vertical"
	});
	var btnActive = createPopOverButton("Active", 5);
	btnActive.addEventListener("click", function() {
		activeClick(source);
	});
	view.add(btnActive);
	if(source.status != "Complete") {
		var btnComplete = createPopOverButton("Complete", 5);
		btnComplete.addEventListener("click", function() {
			completeClick(source);
		});
		view.add(btnComplete);
	}
	if(source.status != "On Hold") {
		var btnOnHold = createPopOverButton("On Hold", 5);
		btnOnHold.addEventListener("click", function() {
			holdClick(source);
		});
		view.add(btnOnHold);
	}
	if(source.status != "Inactive") {
		var btnInActive = createPopOverButton("Inactive", 5);
		btnInActive.addEventListener("click", function() {
			inactiveClick(source);
		});
		view.add(btnInActive);
	}

	return view;
}

//The click function when "Active" is clicked from the Status Popover
function activeClick(source) {
	if(source.children && source.children[0].text) {
		source.children[0].text = "Active";
		source.status = "Active";
	} else {
		source.text = "Active";
	}
	showLoading("  Updating Assignment Status...");
	api.setAssignmentStatus({
		aid: source.aid,
		status: "Active",
		onload: function() {
			getAssignments(source)
		},
		onerror: function() {
			alert("Upadte Failed, please try again.");
		}
	});
}

//The click function when "Active" is clicked from the Status Popover
function completeClick(source) {
	if(source.children) {
		source.children[0].text = "Complete";
		source.status = "Complete";
	} else {
		source.text = "Complete";
	}
	api.setAssignmentStatus({
		aid: source.aid,
		status: "Complete",
		onerror: function() {
			alert("Upadte Failed, please try again.");
		}
	});
}

//The click function when "On Hold" is clicked from the Status Popover
function holdClick(source) {
	if(source.children) {
		source.children[0].text = "On Hold";
		source.status = "On Hold";
	} else {
		source.text = "On Hold";
	}
	api.setAssignmentStatus({
		aid: source.aid,
		status: "On Hold",
		onerror: function() {
			alert("Upadte Failed, please try again.");
		}
	});
}

//The click function when "Inactive" is clicked from the Status Popover
function inactiveClick(source) {
	if(source.children) {
		source.children[0].text = "Inactive";
		source.status = "Inactive";
	} else {
		source.text = "Inactive";
	}
	api.setAssignmentStatus({
		aid: source.aid,
		status: "Inactive",
		onerror: function() {
			alert("Upadte Failed, please try again.");
		}
	});
}

//Build and display Assignment Date sort popover
function sortDatePopover(e) {
	Ti.Analytics.featureEvent('click', {
		id: e.source.id
	});
	Alloy.Globals.apm.leaveBreadcrumb("{Name:'Sorting', event:'click', id:'" + e.source.id + "'}");
	var names = ["Outlet Name", "Assigned, Asc", "Assigned, Dsc", "Modified, Asc", "Modified, Dsc", "Due Date, Asc", "Due Date, Dsc"];

	if(OS_IOS) {
		var view = Ti.UI.createTableView({
			width: 200,
			height: 309,
			top: 0,
			borderRadius: 8
		});

		var rows = [];
		var selectedColor = (Alloy.CFG.theme == "appc-red") ? "#c4122f" : "#5bc0c3";

		for(var i in names) {
			var row = Ti.UI.createTableViewRow({
				selectedColor: "#000000",
				color: ($.dateFilter_name.text == names[i]) ? selectedColor : "#000000",
				title: names[i]
			});
			rows.push(row);
		}
		view.setData(rows);

		view.addEventListener("click", sort);

		var convertedPoint = e.source.convertPointToView({
			x: e.x,
			y: 20
		}, Alloy.Globals.MainWindow);

		var popoverArgs = {
			arrowPosition: "top",
			view: view,
			containerLayout: {
				top: convertedPoint.y,
				left: (convertedPoint.x - view.width / 2) - 40
			}
		};
		var popover = Alloy.createController("/common/popover", popoverArgs);
	} else if(OS_ANDROID) {
		var opts = {
			options: names,
			title: "Filter by date",
			callback: sort,
			type: "sort"
		};
		Alloy.createController("/common/optionDialog", opts);

	}

	function sort(evt) {
		$.dateFilter_name.text = evt.source.title;
		if(evt.source.title.split(", ")[1] == "Asc") {
			sortByDateAcs(evt.source.title);
		} else if(evt.source.title.split(", ")[1] == "Dsc") {
			sortByDateDsc(evt.source.title);
		} else if(evt.source.title == "Outlet Name") {
			sortByName();
		}
	}
}

//Build and display Assignment Name filter popover
function filterNamePopover(e) {
	Ti.Analytics.featureEvent('click', {
		id: e.source.id
	});
	Alloy.Globals.apm.leaveBreadcrumb("{Name:'location selection', event:'click', id:'" + e.source.id + "'}");

	var whereData = assignmentCollection.toJSON();
	var filterData = _.groupBy(whereData, function(data) {
		return data.name;
	});
	var names = _.keys(filterData);

	if(OS_IOS) {
		var view = Ti.UI.createTableView({
			width: 280,
			height: 305,
			top: 0,
			borderRadius: 8
		});
		var rows = [];
		var selectedColor = (Alloy.CFG.theme == "appc-red") ? "#c4122f" : "#5bc0c3";
		rows.push(Ti.UI.createTableViewRow({
			selectedColor: "#000000",
			color: ($.companyFilter_name.text == "All") ? selectedColor : "#000000",
			title: "All"
		}));
		for(var i in names) {
			var row = Ti.UI.createTableViewRow({
				selectedColor: "#000000",
				color: ($.companyFilter_name.text == names[i]) ? selectedColor : "#000000",
				title: names[i]
			});
			rows.push(row);
		}
		view.setData(rows);
		view.addEventListener("click", filterByName)
		var convertedPoint = e.source.convertPointToView({
			x: e.x,
			y: 20
		}, Alloy.Globals.MainWindow);

		var popoverArgs = {
			arrowPosition: "top",
			view: view,
			containerLayout: {
				top: convertedPoint.y,
				left: (convertedPoint.x - view.width / 2) - 40
			}
		};

		var popover = Alloy.createController("/common/popover", popoverArgs);
	} else if(OS_ANDROID) {
		var optionsArray = ["All"];
		for(var i = 0, j = names.length; i < j; i++) {
			if(names[i] != null) {
				optionsArray.push(names[i]);
			}
		}
		var opts = {
			options: optionsArray,
			title: "Filter by Name",
			callback: filterByName,
			type: "sort"
		};
		Alloy.createController("/common/optionDialog", opts);
	}

}

//Build and display Assignment Status filter popover
function statusPopover(e) {

	Ti.Analytics.featureEvent('click', {
		id: e.source.id
	});
	Alloy.Globals.apm.leaveBreadcrumb("{Name:'filtering', event:'click', id:'" + e.source.id + "'}");

	var names = ["All", "Inactive", "On Hold", "Complete"];
	if(OS_IOS) {
		var view = Ti.UI.createTableView({
			width: 200,
			height: 170,
			top: 0,
			borderRadius: 8
		});

		var rows = [];
		var selectedColor = (Alloy.CFG.theme == "appc-red") ? "#c4122f" : "#5bc0c3";
		for(var i in names) {
			var row = Ti.UI.createTableViewRow({
				selectedColor: "#000000",
				color: ($.outletFilter_name.text == names[i]) ? selectedColor : "#000000",
				title: names[i]
			});
			rows.push(row);
		}
		view.setData(rows);
		view.addEventListener("click", filterStatus)

		var convertedPoint = e.source.convertPointToView({
			x: e.x,
			y: 20
		}, Alloy.Globals.MainWindow);

		var popoverArgs = {
			arrowPosition: "top",
			view: view,
			containerLayout: {
				top: convertedPoint.y,
				left: (convertedPoint.x - view.width / 2) - 40
			}
		};
		var popover = Alloy.createController("/common/popover", popoverArgs);
	} else if(OS_ANDROID) {
		var opts = {
			options: names,
			title: "Filter by Status",
			callback: filterStatus,
			type: "sort"
		};
		Alloy.createController("/common/optionDialog", opts);
	}
}

//Sort by Dates, Ascending
function sortByName() {

	var results = {
		data: []
	};
	var whereData = assignmentCollection.toJSON();
	var sortData = _.sortBy(whereData, function(data) {
		return data["name"];
	})
	for(var i in sortData) {
		results.data.push({
			outlet: sortData[i]
		});
	}

	createOutlets(results, "update");
}

//Sort by Dates, Ascending
function sortByDateAcs(date) {

	var sortDate = "dateA";
	if(date == "Modified, Asc") {
		sortDate = "dateM";
	} else if(date == "Due Date, Asc") {
		sortDate = "dateC";

		var ctd = require('ti.crashtestdummy');
		try {
			ctd.throwException();
		} catch(e) {
			Alloy.Globals.apm.logHandledException({
				name: "Due Date Asc - myServiceOutlets.js",
				message: "Due Date Handled Exception Demo",
				line: "761"
			});
		}
		Alloy.Globals.apm.leaveBreadcrumb("Throwing an exception");
	}

	var results = {
		data: []
	};
	var whereData = assignmentCollection.toJSON();
	var sortData = _.sortBy(whereData, function(data) {
		return data[sortDate];
	})
	for(var i in sortData) {
		results.data.push({
			outlet: sortData[i]
		});
	}

	createOutlets(results, "update");
}

//Sort by Dates, Descending 
function sortByDateDsc(date) {
	var sortDate = "dateA";
	if(date == "Modified, Dsc") {
		sortDate = "dateM"
	} else if(date == "Due Date, Dsc") {
		sortDate = "dateC"

		Alloy.Globals.apm.leaveBreadcrumb("Crashing the app");
		var ctd = require('ti.crashtestdummy');
		ctd.accessBadMemory();
		return
	}
	var results = {
		data: []
	};
	var whereData = assignmentCollection.toJSON();
	var sortData = _.sortBy(whereData, function(data) {
		return data[sortDate];
	})
	for(var l = sortData.length - 1; l >= 0; l--) {
		results.data.push({
			outlet: sortData[l]
		});
	}

	createOutlets(results, "update");
}

//Filter function to filter by assignment status
function filterStatus(evt) {
	$.companyFilter_name.text = "All";
	var title = (evt.rowData && evt.rowData.title) || evt.source.title;
	$.outletFilter_name.text = title;
	var results = {
		data: []
	};
	if(title != "All") {
		var whereData = assignmentCollection.where({
			status: title
		});

		for(var i in whereData) {
			results.data.push({
				outlet: whereData[i].toJSON()
			});
		}
	} else {
		var whereData = assignmentCollection.toJSON();
		for(var i in whereData) {
			results.data.push({
				outlet: whereData[i]
			});
		}
	}

	createOutlets(results, "update");
}

//Filter function for filter by company name
function filterByName(evt) {
	var filterData = evt.value || (evt.rowData && evt.rowData.title) || evt.source.title;

	$.companyFilter_name.text = filterData;
	$.outletFilter_name.text = "All";
	var results = {
		data: []
	};

	if(filterData != "All") {
		var whereData = assignmentCollection.where({
			name: filterData
		});
		for(var i in whereData) {
			results.data.push({
				outlet: whereData[i].toJSON()
			});
		}

	} else {
		var whereData = assignmentCollection.toJSON();
		for(var i in whereData) {

			results.data.push({
				outlet: whereData[i]
			});
		}
	}

	createOutlets(results, "update");
}

//Search function to filter placards
function searchByName(evt) {
	var filterData = evt.value.toLowerCase();;

	// $.companyFilter_name.text = filterData;

	var results = {
		data: []
	};

	var whereData = assignmentCollection.toJSON();

	var searchData = _.filter(whereData, function(data) {
		return data.search.indexOf(filterData) !== -1;
	});
	for(var i in searchData) {
		
		results.data.push({
			outlet: searchData[i]
		});
	}

	createOutlets(results, "update");
}

//Display the assignment placards
function displayList() {

	Alloy.Globals.Map.close();

}

//Show the clear icon on search focus
function searchFocus() {
	if($.searchBox.value) {
		$.clearIcon.show();
	}
}

//Show clear icon when there is a value
function searchChange() {
	if($.searchBox.value) {
		$.clearIcon.show();
	} else {
		$.clearIcon.hide();
	}
}

//Remove clear icon and clear search value
function searchBlur() {
	// $.searchBox.value = "";
	$.clearIcon.hide();
}

//Clear the search box
function searchClear() {
	$.searchBox.value = "";
}

function mapOpened(style) {
	if(style == "container") {
		$.searchBoxView.animate({
			opacity: 0.4,
			duration: 250
		});
		$.dateFilterView.animate({
			opacity: 0.4,
			duration: 250
		});
		$.searchBoxView.touchEnabled = false;
		$.dateFilterView.touchEnabled = false;
	}
}

function mapClosed() {
	if($.searchBoxView.touchEnabled == false) {
		$.searchBoxView.animate({
			opacity: 1.0,
			duration: 250
		});
		$.dateFilterView.animate({
			opacity: 1.0,
			duration: 250
		});
		$.searchBoxView.touchEnabled = true;
		$.dateFilterView.touchEnabled = true;
	}
	if($.mapBtn.backgroundImage != "/my-service-outlets/view-map-inactive.png") {
		$.listBtn.backgroundImage = "/my-service-outlets/view-list-active.png";
		$.mapBtn.applyProperties({
			backgroundImage: "/my-service-outlets/view-map-inactive.png",
			touchEnabled: true
		});
	}
}

//Exported functions
$.placardClick = placardClick;
$.createPopOverButton = createPopOverButton;
$.openDetails = openDetails;
$.openMap = openMap;
$.mapOpened = mapOpened;
$.mapClosed = mapClosed;
$.activeClick = activeClick;
