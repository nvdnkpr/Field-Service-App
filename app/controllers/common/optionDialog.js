var _args = arguments[0] || {};

$.dialog.options = _args.options;
$.dialog.title = _args.title;

$.dialog.show();

function executeCallback(e) {
	if(e.button) {
		$.dialog.hide();
	} else if(!e.cancel) {
		if(_args.type === "sort") {
			_args.callback({
				source: {
					title: _args.options[e.index]
				}
			});
		} else if(_args.callbackArray[e.index]) {
			if(_args.source) {
				_args.callbackArray[e.index](_args.source);
			} else {
				_args.callbackArray[e.index]();
			}
		}
	}
}