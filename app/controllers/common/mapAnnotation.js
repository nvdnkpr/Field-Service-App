var _args = arguments[0] || null;

var leftView = Ti.UI.createLabel({
	backgroundImage: "/my-service-outlets/map-mini-task-total-bg.png",
	width: 33,
	height: 24,
	textAlign: "center",
	text: _args.tasksCount || 0,
	color: "#ffffff",
	font: {
		fontWeight: "bold"
	}
});

var mapData = {
	title: _args.name,
	subtitle: _args.address + ", " + _args.state + "\n" + _args.contactPhone,
	latitude: _args.latitude,
	longitude: _args.longitude,
	aid: _args.aid,
	oid: _args.oid,
	leftView: leftView
};

if((_args.status == "Active") || (_args.status == "Active")) {
	mapData.image = "/common/map-pin-icon-active.png";
}

$.mapAnnotation.applyProperties(mapData);