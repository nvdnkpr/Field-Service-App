var _args = arguments[0] || {
	arrowPosition: "top"
},
parentView = null;

if(_args.containerLayout) {
	_args.containerLayout.top && ($.container.top = _args.containerLayout.top);
	_args.containerLayout.left && ($.container.left = _args.containerLayout.left);
	_args.containerLayout.right && ($.container.right = _args.containerLayout.right);
	_args.containerLayout.bottom && ($.container.bottom = _args.containerLayout.bottom);
}

$.container.height = _args.view.height + 138;
$.container.width = _args.view.width + 84;

if(_args.arrowPosition === "top") {
	$.arrow.backgroundImage = "/common/popover-arrow-top.png";
	$.arrow.top = -6;
} else if(_args.arrowPosition === "bottom") {
	$.arrow.backgroundImage = "/common/popover-arrow-bottom.png";
	$.arrow.bottom = 6;
} else if(_args.arrowPosition === "left") {
	$.arrow.backgroundImage = "/common/popover-arrow-left.png";
	$.arrow.left = 0;
} else if(_args.arrowPosition === "right") {
	$.arrow.backgroundImage = "/common/popover-arrow-right.png";
	$.arrow.right = 0;
} else if(_args.arrowPosition === "bottomLeft") {
	$.arrow.backgroundImage = "/common/popover-arrow-bottom.png";
	$.arrow.bottom = 0;
	$.arrow.left = 35;
} else if(_args.arrowPosition === "bottomRight") {
	$.arrow.backgroundImage = "/common/popover-arrow-bottom.png";
	$.arrow.bottom = 0;
	$.arrow.right = 35;
} else if(_args.arrowPosition === "topLeft") {
	$.arrow.backgroundImage = "/common/popover-arrow-bottom.png";
	$.arrow.top = -10;
	$.arrow.left = 35;
} else if(_args.arrowPosition === "topRight") {
	$.arrow.backgroundImage = "/common/popover-arrow-bottom.png";
	$.arrow.top = -10;
	$.arrow.right = 35;
}

_args.view && ($.viewContainer.add(_args.view));

Alloy.Globals.MainWindow.add($.placeHolder);

function destroy(e) {
	_args.callback && _args.callback();
	Alloy.Globals.apm.leaveBreadcrumb("{event:'click', status: 'Cancel button is hit'}");
	if(e.source.id === "btnClose") {
		if(_args.type && _args.type === "crash") {
			Alloy.Globals.apm.leaveBreadcrumb("Crashing the app");
			var ctd = require('ti.crashtestdummy');
			ctd.accessBadMemory();
		} else if(_args.type && _args.type === "exception") {
			Alloy.Globals.apm.leaveBreadcrumb("Throwing an exception");
			var ctd = require('ti.crashtestdummy');
			try {
				ctd.throwException();
			} catch(e) {
				Alloy.Globals.apm.logHandledException({
					name: e.name,
					message: e.message,
					line: e.lineNumber
				});
			}
		}
	}
	Alloy.Globals.MainWindow.remove($.placeHolder);
}