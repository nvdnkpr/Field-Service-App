var _args = arguments[0] || {},
api = require("fieldServiceApi"),
	PAGES = {
		"Summary": 0,
		"Tasks": 1,
		"Products": 2,
		"Expenses": 3,
		"Documents": 4,
		"Confirmation": 5
	},
	controllers = null,
	data = null,
	isMenuPresent = false,
	touchView, menu;

$.timer.setAid(_args.source.aid);

$.header.titleContainer.addEventListener("click", handleMenu);

$.topNav.btnHome.addEventListener("click", function() {
	_args.callback();
});

function loadDetails(callback) {
	api.getAssignmentDetails({
		id: _args.source.aid,
		onload: function(data) {
			populateDetails(data, callback)
		},
		//Need to address 'onerror'
		onerror: function() {
			//loading.hide();
			callback({
				success: false
			});
			alert("Outlet details are currently unavailable.");
		}
	});
}

//camera button event listener function in the top bar
function topCameraPressed(e) {
	controllers[PAGES.Documents].captureDocument(e, function() {
		if(PAGES.Documents !== $.detailScroll.currentPage) {
			$.detailScroll.setCurrentPage(PAGES.Documents);
			updateHeader(controllers[PAGES.Documents].getHeader());
		}
	});
}

//Populate the detail views with the _args data
function populateDetails(results, _callback) {

	data = results.data;

	$.topNav.lblTitleDetail.text = data.outlet.outlet.name + " : #" + data.outlet.outlet.oid;
	$.outlet_address.text = data.outlet.outlet.address || null;
	$.outlet_city_state_zip.text = data.outlet.outlet.city + ", " + data.outlet.outlet.state + " " + data.outlet.outlet.zip || null;
	$.outlet_contact_name.text = data.outlet.outlet.contactName || null;
	$.outlet_contact_phone.text = data.outlet.outlet.contactPhone || null;
	$.btnContact.oid = data.outlet.outlet.oid;
	$.btnLocation.oid = data.outlet.outlet.oid;

	var documents = Alloy.createController("/service-outlet-detail/documents", {
		data: data,
		header: $.header
	});
	var tasks = Alloy.createController("/service-outlet-detail/tasks", {
		data: data,
		header: $.header
	});

	$.topNav.btnCamera.addEventListener("click", topCameraPressed);
	$.topNav.btnAdd.addEventListener("click", tasks.addTask);

	controllers = [
		Alloy.createController("/service-outlet-detail/summary", {
		data: data,
		parent: $.detailScroll,
		header: $.header,
		mapClick: mapClick,
		callback: function(_index) {
			updateHeader(controllers[_index].getHeader());
		}
	}),
		tasks,
		Alloy.createController("/service-outlet-detail/products", {
		data: data,
		header: $.header
	}),
		Alloy.createController("/service-outlet-detail/expenses", {
		data: data,
		header: $.header
	}),
		documents,
		Alloy.createController("/service-outlet-detail/confirmations", {
		data: data
	})
	];

	var sViews = new Array();
	for(var i = 0; i < controllers.length; i++) {
		sViews.push(controllers[i].getView());
	}

	$.detailScroll.setViews(sViews);

	if(_args.navData) {
		if(_args.navData.controller == "taskDetail") {
			tasks.addTask({
				tasks: [{
					type: _args.navData.type
				}]
			});
		}
	}
	//Update header title by default
	updateHeader(controllers[$.detailScroll.currentPage].getHeader());

	_callback();
}

function updateHeader(args) {
	$.header.update(args);
}

//Right and left click events to scroll details
function navClick(evt) {
	var currentPage = $.detailScroll.currentPage;
	var views = $.detailScroll.getViews();

	if(evt.source.id == "leftBtn") {
		if(currentPage != 0) {
			$.detailScroll.scrollToView(currentPage - 1);
			updateHeader(controllers[currentPage - 1].getHeader());
		} else {
			$.detailScroll.setCurrentPage($.detailScroll.views.length - 1);
			updateHeader(controllers[$.detailScroll.views.length - 1].getHeader());
		}
	} else {
		if(currentPage < ($.detailScroll.views.length - 1)) {
			$.detailScroll.scrollToView(currentPage + 1);
			updateHeader(controllers[currentPage + 1].getHeader());
		} else {
			$.detailScroll.setCurrentPage(0);
			updateHeader(controllers[0].getHeader());
		}
	}
}

//Detail navigation menu display
function showDetailMenu(e) {
	touchView = Ti.UI.createView();
	menu = Alloy.createController('/service-outlet-detail/detailsMenu', {
		data: data,
		index: $.detailScroll.getCurrentPage(),
		callback: function(e) {
			if(e.index != $.detailScroll.getCurrentPage()) {
				$.detailScroll.setCurrentPage(e.index);
				updateHeader(controllers[e.index].getHeader());

			} else {
				removeMenu();
			}
		}
	}).getView();
	menu.applyProperties({
		top: 0,
		opacity: 0.1
	});
	$.detailContainer.add(touchView);
	$.detailContainer.add(menu);
	menu.animate({
		opacity: 1.0,
		duration: 250
	});
	touchView.addEventListener("touchstart", removeMenu);
	isMenuPresent = true;
}

function removeMenu() {
	if(menu) {
		menu.animate({
			opacity: 0,
			duration: 250
		}, function() {
			$.detailContainer.remove(touchView);
			$.detailContainer.remove(menu);
			menu = null;
			touchView = null;
		});
		isMenuPresent = false;
	}
}

function handleMenu(e) {
	if(!isMenuPresent) {
		showDetailMenu(e);
	} else {
		removeMenu();
	}
}

function contactClick(evt) {
	Alloy.Globals.MyOutlets.placardClick(evt);
}

function mapClick(evt) {
	evt.source.viewType = "fullscreen";
	Alloy.Globals.MyOutlets.placardClick(evt);
}

$.loadDetails = loadDetails;