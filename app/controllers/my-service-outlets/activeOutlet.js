var _args = arguments[0] || {},
api = require("fieldServiceApi"),
	dateFormat = Alloy.Globals.formatDate,
	getAssignments = null;

$.populateOutlet = function(_data, refresh) {

	$.outlet_tasks_count.text = (_data.tasksCount != null) ? _data.tasksCount : 0;
	$.outlet_name.text = _data.name;
	$.outlet_id.text = "#" + _data.oid;
	$.outlet_address.text = _data.address;
	$.outlet_city_state_zip.text = (_data.city + ", " + _data.state + " " + _data.zip);
	$.outlet_contact_name.text = _data.contactName;
	$.outlet_contact_phone.text = _data.contactPhone;
	$.assignedDate.text = dateFormat(_data.dateA);
	$.modifiedDate.text = dateFormat(_data.dateM);
	$.dueDate.text = dateFormat(_data.dateC);
	$.status = _data.status;
	$.btnContact.oid = _data.oid;
	$.wrapper.aid = _data.aid;
	$.outlet_contact_info.aid = _data.aid;
	$.outlet_location_info.aid = _data.aid;
	$.btnLocation.oid = _data.oid;
	$.statusView.aid = _data.aid;
	$.lblStatus.text = _data.status;
	$.btnNewTask.aid = _data.aid;
	getAssignments = refresh;
	$.timer.setAid(_data.aid);
	if(_data.status != "Active") {
		$.wrapper.backgroundImage = "/my-service-outlets/inactive-outlet-bg.png"
	}
}

if(_args.oid && Alloy.CFG.theme == "appc-blue") {
	$.populateOutlet(_args);
	$.wrapper.applyProperties({
		left: "1%",
		right: "1%"
	});
	$.currentTask.hide();
	$.timer.hide();
	$.btnNewTask.hide();
	$.lblNewTask.hide();
}

$.getActiveID = function() {
	if($.wrapper.aid != null) {
		return $.wrapper.aid;
	} else {
		return null
	}
}

function holdClick(source) {

	$.lblStatus.text = "On Hold";

	api.setAssignmentStatus({
		aid: source.aid,
		status: "On Hold",
		onload: getAssignments,
		onerror: function() {
			alert("Upadte Failed, please try again.");
		}
	});
}

function inactiveClick(source) {
	$.lblStatus.text = "Inactive";
	api.setAssignmentStatus({
		aid: source.aid,
		status: "Inactive",
		onload: getAssignments,
		onerror: function() {
			alert("Upadte Failed, please try again.");
		}
	});
}

//The click function when "Active" is clicked from the Status Popover
function completeClick(source) {
	$.lblStatus.text = "Complete";
	api.setAssignmentStatus({
		aid: source.aid,
		status: "Complete",
		onload: getAssignments,
		onerror: function() {
			alert("Upadte Failed, please try again.");
		}
	});
}

function addTask(evt) {
	var view = Ti.UI.createView({
		width: 200,
		height: 157
	});
	view.add(Alloy.Globals.MyOutlets.createPopOverButton("Stock", 0));
	view.add(Alloy.Globals.MyOutlets.createPopOverButton("Break", 49));
	view.add(Alloy.Globals.MyOutlets.createPopOverButton("Travel", 98));
	var popoverArgs = {
		arrowPosition: "top",
		view: view,
		containerLayout: {
			right: 20,
			top: 230
		}
	};
	var popover = Alloy.createController("/common/popover", popoverArgs);
	view.addEventListener("click", function(e) {
		if(e.source.title) {
			e.source.aid = evt.source.aid;
			e.source.objId = evt.source.objId;
			Alloy.Globals.MyOutlets.openDetails(evt, {
				type: e.source.title,
				controller: "taskDetail"
			});
		}
	});

}

function showStatusPopOver(e) {
	e.source.aid = $.wrapper.aid;
	if(OS_IOS) {
		var convertedPoint = e.source.convertPointToView({
			x: e.x,
			y: e.y
		}, Alloy.Globals.MainWindow);
		var popoverArgs = {
			arrowPosition: "top",
			view: createStatusPopOverView(e.source),
			containerLayout: {
				left: convertedPoint.x - 140,
				top: convertedPoint.y
			},
			type: e.type == "longpress" ? "crash" : null,
			details: {
				source: e.source,
				location: {
					x: e.x,
					y: e.y
				},
				file: "activeOutlet.js",
			}
		};
		var popover = Alloy.createController("/common/popover", popoverArgs);
	} else if(OS_ANDROID) {
		var opts = {
			options: ["Active", "On Hold", "Inactive", "Complete"],
			title: "Select Outlet Status",
			callbackArray: [null, holdClick, inactiveClick, completeClick],
			source: e.source
		};
		Alloy.createController("/common/optionDialog", opts);
	}
}

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

function createStatusPopOverView(source) {

	var view = Ti.UI.createView({
		width: 200,
		height: 147,
		top: 0
	});
	var btnOnHold = createPopOverButton("On Hold", 0);
	var btnInActive = createPopOverButton("Inactive", 49);
	var btnComplete = createPopOverButton("Complete", 98);
	btnOnHold.addEventListener("click", function() {
		holdClick && holdClick(source);
	});
	btnInActive.addEventListener("click", function() {
		inactiveClick && inactiveClick(source);
	});
	btnComplete.addEventListener("click", function() {
		completeClick && completeClick(source);
	});

	view.add(btnOnHold);
	view.add(btnInActive);
	view.add(btnComplete);
	if($.lblStatus.text != "Active") {
		var btnActive = createPopOverButton("Active", 147);
		btnActive.addEventListener("click", function() {
			Alloy.Globals.MyOutlets.activeClick(source);
		});

		view.height = 196;
		view.add(btnActive);
	}
	return view;
}

function mapClick(evt) {
	Alloy.Globals.MyOutlets.placardClick(evt);
}

function contactClick(evt) {
	Alloy.Globals.MyOutlets.placardClick(evt);
}

function openDetails(evt) {
	evt.source.aid = $.wrapper.aid
	Alloy.Globals.MyOutlets.openDetails(evt);
}