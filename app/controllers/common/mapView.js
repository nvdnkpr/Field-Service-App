var args = arguments[0] || {},
init = false;
if(args.container || args.style == "fullscreen") {
	open(arguments[0]);
} else if(args.style != "fullscreen") {

	$.map.applyProperties({
		annotations: args.annotations,
		region: args.region
	});
	setStyle(args.style);
	if(init) {
		$.map.setRegion(args.region);
	} else {
		setTimeout(function() {
			$.map.setRegion(args.region);
			init = true;
		}, 500);
	}

}

$.setAnnotations = function(annotations) {
	$.map.setAnnotations(annotations);
	if(annotations.length == 1) {
		$.map.selectAnnotation($.map.annotations[0]);
	}
}

//Handle map click and open details view if rightButton click
function mapClick(evt) {
	if(evt.clicksource == "rightButton") {
		Alloy.Globals.MyOutlets.openDetails(evt);
		close();
	}
}

//Handle the user location enabled
function myLocation() {
	if($.map.userLocation) {
		$.map.userLocation = false;
	} else {
		$.map.userLocation = true;
	}
}

//Enlarge map to fullscreen
function zoomMap(evt) {

	var point = $.wrapper.convertPointToView({
		x: 0,
		y: 0
	}, Alloy.Globals.MainWindow);
	var size = {
		height: $.wrapper.size.height,
		width: $.wrapper.size.width
	};
	var mapImage = Ti.UI.createView({
		backgroundImage: $.wrapper.toImage(),
		zIndex: 100,
		left: point.x,
		top: point.y,
		height: size.height,
		width: size.width
	});
	Alloy.Globals.MainWindow.add(mapImage);
	mapImage.animate({
		opacity: 0.0,
		top: null,
		left: null,
		transform: Ti.UI.create2DMatrix({
			scale: 3.0
		}),
		duration: 500
	}, removeImage);
	close({
		callback: function() {
			setStyle("fullscreen");
			Alloy.Globals.MainWindow.add($.wrapper);
			$.wrapper.animate({
				opacity: 1.0,
				duration: 250
			});
		}
	});

	function removeImage() {
		Alloy.Globals.MainWindow.remove(mapImage);
		mapImage = null;
	}
}

//Close map from close btn byt leaves map in memory for next use
function close(params) {
	if($.wrapper.getParent()) {

		if(Alloy.Globals.currentPlacard) {
			Alloy.Globals.currentPlacard.animate({
				opacity: 1.0,
				transform: Ti.UI.create2DMatrix({
					scale: 1.0
				}),
				duration: 250
			}, function() {
				Alloy.Globals.currentPlacard = null;
			});
		}
		//TODO: Android map fix
		if(OS_IOS) {
			var checkReturn = false;
			if($.wrapper.getParent() == Alloy.Globals.MainWindow) {
				checkReturn = true;
			}
			$.wrapper.animate({
				opacity: 0.0,
				duration: 250
			}, function() {
				var parent = $.wrapper.getParent();
				parent.remove($.wrapper);
				Alloy.Globals.MyOutlets.mapClosed();
				if(checkReturn) {
					if(Alloy.Globals.returnView) {
						open(Alloy.Globals.returnView);

					}
				}
				if(params && params.callback) {
					params.callback();
				};

			});
		} else {
			$.wrapper.getParent().remove($.wrapper);
			setTimeout(function() {
				if(params && params.callback) {
					params.callback();
				};
			}, 400);
		}
	}
}

//Set the styling of the mapview and its wrapper
function setStyle(style) {
	if(style == "fullscreen") {
		$.wrapper.applyProperties({
			backgroundImage: "/my-service-outlets/map-fullscreen-bg.png",
			top: 0,
			left: 0,
			right: 0,
			bottom: 0,
			zIndex: 50
		});
		$.map.applyProperties({
			height: Ti.UI.FILL,
			width: Ti.UI.FILL,
			left: 40,
			right: 40,
			bottom: 40,
			top: 40,
			borderRadius: 8
		});

		$.locationBtn.applyProperties({
			backgroundImage: "/my-service-outlets/map-current-location-btn.png",
			backgroundSelectedImage: "/my-service-outlets/map-current-location-btn-touch.png",
			width: 51,
			right: 10
		});
		$.zoomBtn.hide();

		if($.map.annotations.length == 1) {
			$.map.selectAnnotation($.map.annotations[0]);
		}
		$.closeBtn.show();
	} else if(style == "container") {
		$.wrapper.applyProperties({
			backgroundImage: "/my-service-outlets/map-border-flex.png",
			backgroundTopCap: 6,
			backgroundLeftCap: 6
		});
		$.map.applyProperties({
			height: Ti.UI.FILL,
			width: Ti.UI.FILL,
			left: 4,
			right: 4,
			bottom: 4,
			top: 4,
			borderRadius: 3,
		});
		$.locationBtn.applyProperties({
			backgroundImage: "/my-service-outlets/map-mini-current-location-btn.png",
			backgroundSelectedImage: "/my-service-outlets/map-mini-current-location-btn-touch.png",
			width: 47,
			right: 53,
			visible: true
		});
		$.zoomBtn.applyProperties({
			width: 47,
			right: 10,
			bottom: 10,
			backgroundImage: "/my-service-outlets/map-mini-search-btn.png",
			backgroundSelectedImage: "/my-service-outlets/map-mini-search-btn-touch.png",
			visible: true
		});
		$.closeBtn.show();
	} else if(style == "summary") {

		// $.zoomBtn.applyProperties({
		// width:51,
		// right:5,
		// bottom:5,
		// backgroundImage:"/service-outlet-detail/map-zoom-btn.png",
		// backgroundSelectedImage:"/service-outlet-detail/map-zoom-btn-touch.png",
		// visible:true
		// });
		$.zoomBtn.hide();
		$.wrapper.applyProperties({
			backgroundImage: "/service-outlet-detail/map-bg.png",
			height: 118,
			width: 210
			// backgroundTopCap:6,
			// backgroundLeftCap:6
		});
		$.map.applyProperties({
			height: Ti.UI.FILL,
			width: Ti.UI.FILL,
			left: 4,
			right: 4,
			bottom: 4,
			top: 4,
			borderRadius: 0,
		});
		$.locationBtn.hide();
		$.closeBtn.hide();
	} else {
		$.zoomBtn.applyProperties({
			width: 47,
			right: 10,
			bottom: 10,
			backgroundImage: "/my-service-outlets/map-mini-search-btn.png",
			backgroundSelectedImage: "/my-service-outlets/map-mini-search-btn-touch.png",
			visible: true
		});

		$.wrapper.applyProperties({
			backgroundImage: "/my-service-outlets/map-border-flex.png",
			backgroundTopCap: 6,
			backgroundLeftCap: 6
		});
		$.map.applyProperties({
			height: Ti.UI.FILL,
			width: Ti.UI.FILL,
			left: 4,
			right: 4,
			bottom: 4,
			top: 4,
			borderRadius: 3,
		});
		$.locationBtn.applyProperties({
			width: 47,
			right: 53,
			backgroundImage: "/my-service-outlets/map-mini-directions-btn.png",
			backgroundSelectedImage: "/my-service-outlets/map-mini-directions-btn-touch.png",
			visible: true
		});

		$.closeBtn.show();
	}
}

//Show the mapview and set its options
function show(params) {
	if(params && params.annotations && params.container && params.style) {
		if($.wrapper.getParent()) {
			close({
				callback: function() {
					open(params)
				}
			});
		} else {
			open(params);
		}
	}
}

//Map open function called from show once previois map is successfully removed.
function open(params) {
	Alloy.Globals.MyOutlets.mapOpened(params.style);

	setStyle(params.style);

	if(params.style == "fullscreen") {
		params.container = Alloy.Globals.MainWindow;
	} else if(params.style == "summary") {
		Alloy.Globals.returnView = params;
	}

	$.wrapper.opacity = 0.0;

	if(init) {
		$.map.applyProperties({
			annotations: params.annotations,
			region: params.region || null
		});
		if($.map.annotations.length == 1) {
			$.map.selectAnnotation($.map.annotations[0]);
		}
	} else {
		setTimeout(function() {
			$.map.applyProperties({
				annotations: params.annotations,
				region: params.region || null
			});
			if($.map.annotations.length == 1) {
				$.map.selectAnnotation($.map.annotations[0]);
			}
			init = true;
		}, 500);
	}

	if(params.style == "placard") {
		Alloy.Globals.currentPlacard = params.container.getView("wrapper");

		params.container.getView("mapContainer").add($.wrapper)
		$.wrapper.animate({
			opacity: 1.0,
			duration: 500
		}, function() {
			$.map.setRegion(params.region);
		});
		Alloy.Globals.currentPlacard.animate({
			opacity: 0.0,
			transform: Ti.UI.create2DMatrix({
				scale: 1.5
			}),
			duration: 500
		});
	} else {
		params.container.add($.wrapper);
		$.wrapper.animate({
			opacity: 1.0,
			duration: 500
		}, function() {
			$.map.setRegion(params.region);
		});
	}

}

//export some map functions
$.close = close;
$.show = show;
$.setStyle = setStyle;