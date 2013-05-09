var _args = arguments[0] || {},
outletData = _args.data.outlet.outlet,
	mapData = {
		style: "summary",
		annotations: [Ti.Map.createAnnotation({
			title: outletData.name,
			image: "/common/map-pin-icon-active.png",
			latitude: outletData.latitude,
			longitude: outletData.longitude
		})],
		region: {
			latitude: outletData.latitude,
			latitudeDelta: 0.005,
			longitude: outletData.longitude,
			longitudeDelta: 0.005
		}
	};

if(OS_IOS) {
	var map = Alloy.createController("/common/mapView", mapData).getView(),
		zoomBtn = Ti.UI.createButton({
			backgroundImage: "/service-outlet-detail/map-zoom-btn.png",
			backgroundSelectedImage: "/service-outlet-detail/map-zoom-btn-touch.png",
			height: 43,
			width: 51,
			bottom: 5,
			right: 5,
			id: "btnLocation",
			oid: _args.data.outlet.outlet.oid
		});
	$.outletMap.add(map)
	map.add(zoomBtn);
	zoomBtn.addEventListener("click", _args.mapClick);

} else {
	mapData.container = $.outletMap;
	if(!Alloy.Globals.Map) {
		Alloy.Globals.Map = Alloy.createController("/common/mapView", mapData);
	} else {
		Alloy.Globals.Map.show(mapData);
	}
}

$.outlet_name.text = outletData.name || null;
$.outlet_id.text = "#" + outletData.oid || null;
$.outlet_street.text = outletData.address || null;
$.outlet_city_state_zip.text = outletData.city + ", " + outletData.state + " " + outletData.zip || null;
$.contact_name_title.text = outletData.contactName || null;
$.contact_phone.text = outletData.contactPhone || null;
$.taskCount.text = _args.data.tasks.length;
$.productCount.text = _args.data.products.length;
$.documentCount.text = _args.data.documents.length;
$.expenseCount.text = _args.data.expenses.length;

$.getHeader = function() {
	return {
		title: "Summary",
		itemCount: 0,
		callback: null
	}
};

function navClick(evt) {
	_args.parent.setCurrentPage(evt.index + 1);
	_args.callback(evt.index + 1);
}