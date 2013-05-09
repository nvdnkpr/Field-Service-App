var $S = require('alloy/string'),
	_args = arguments[0] || {},
	dateFormat = Alloy.Globals.formatDate;

// Setup Placard properties
$.outlet_tasks_count.text = (_args.outlet.tasksCount != null) ? _args.outlet.tasksCount : 0;
$.outlet_name.text = _args.outlet.name;
$.outlet_id.text = "#" + _args.outlet.oid;
$.outlet_address.text = _args.outlet.address;
$.outlet_city_state_zip.text = (_args.outlet.city + ", " + _args.outlet.state + " " + _args.outlet.zip);
$.outlet_contact_name.text = _args.outlet.contactName;
$.outlet_contact_phone.text = _args.outlet.contactPhone;
$.assignedDate.text = dateFormat(_args.outlet.dateA);
$.modifiedDate.text = dateFormat(_args.outlet.dateM);
$.dueDate.text = dateFormat(_args.outlet.dateC);
$.status = _args.outlet.status;
$.btnLocation.count = _args.count;
$.btnLocation.oid = _args.outlet.oid;
$.btnContact.oid = _args.outlet.oid;
$.wrapper.aid = _args.outlet.aid;
$.contentView.aid = _args.outlet.aid;
$.outlet_contact_info.aid = _args.outlet.aid;
$.outlet_location_info.aid = _args.outlet.aid;
$.statusView.aid = _args.outlet.aid;
$.statusView.status = _args.outlet.status;
$.lblStatus.text = _args.outlet.status;

//Private Functions
function btnClickAccept(event) {
	alert('Accept Clicked');
};

function btnClickDecline(event) {
	alert('Decline Clicked')
}