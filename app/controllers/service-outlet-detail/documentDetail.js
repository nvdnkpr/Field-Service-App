var _args = arguments[0] || {},
api = require("fieldServiceApi");
type = null;

$.lblContent.value = _args.data.name || "";

_args.data.url = _args.data.url || (_args.data.urls && _args.data.urls.original) || null;

if(_args.data.url) {
	$.vBody.remove($.imageView);
	$.webView.url = _args.data.url;
} else {
	$.vBody.remove($.webView);
	$.imageView.image = _args.data.file;
}

$.lblType.text = _args.data.type ? _args.data.type : (_args.data.url ? (_args.data.url.substr(_args.data.url.length - 3)).toUpperCase() : 'Unknown');

type = ($.lblType.text.toUpperCase() == "PHOTO") ? "PHOTO" : "FILE";

_args.data.description && ($.tfComments.value = _args.data.description);

$.updateDocument = function(_callback) {
	if(_args.data.id) {
		api.updateDocument({
			name: $.lblContent.value,
			aid: _args.aid,
			id: _args.data.id,
			description: $.tfComments.value,
			type: type,
			onload: function(e) {
				var responseObj = null;
				if(type === "PHOTO") {
					console.log("Document Updated - " + e.photos[0].id);
					responseObj = {
						id: e.photos[0].id,
						name: e.photos[0].custom_fields.name,
						description: e.photos[0].custom_fields.description,
						url: e.photos[0].urls.original,
						aid: e.photos[0].custom_fields.aid,
						type: "PHOTO"
					}
				} else {
					console.log("Document Updated - " + e.files[0].id);
					responseObj = {
						id: e.files[0].id,
						name: e.files[0].name,
						description: e.files[0].custom_fields.description,
						url: e.files[0].url,
						aid: e.files[0].custom_fields.aid,
						type: "FILE"
					}
				}
				_callback && _callback(true, responseObj);
			},
			onerror: function(e) {
				console.log("Error:" + e);
				_callback && _callback(false);
			}
		});
	} else {
		api.createDocument({
			file: _args.data.file,
			name: $.lblContent.value,
			description: $.tfComments.value,
			aid: _args.aid,
			type: "PHOTO",
			onload: function(e) {
				var responseObj = (e.photos && e.photos[0]) ? e.photos[0] : e;
				_callback && _callback({
					id: responseObj.id,
					name: responseObj.custom_fields.name,
					description: responseObj.custom_fields.description,
					aid: responseObj.custom_fields.aid,
					type: "PHOTO"
				});
			},
			onerror: function(e) {
				console.log("Error:" + e);
				Ti.UI.createAlertDialog({
					title: "Field Service Demo",
					message: "Error creating a new document"
				}).show();
			}
		});
	}
};

$.deleteDocument = function(_callback) {
	api.deleteDocument({
		id: _args.data.id,
		type: type,
		onload: function(e) {
			console.log("Deleted Document - " + JSON.stringify(e));
			_callback();
		},
		onerror: function(e) {
			console.log("Error:" + e);
			Ti.UI.createAlertDialog({
				title: "Field Service Demo",
				message: "Error deleting the document"
			}).show();
		}
	});
};

function shareDoc(e) {
	var emailDialog = Ti.UI.createEmailDialog()
	emailDialog.messageBody = 'Appcelerator Field Service demo';
	var f = Ti.Filesystem.getFile(_args.data.url);
	emailDialog.addAttachment(f);
	emailDialog.open();
}