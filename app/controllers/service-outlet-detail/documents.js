var _args = arguments[0] || {},
_data = _args.data.documents,
	tableRows = [],
	api = require("fieldServiceApi"),
	detail = null,
	headerStack = [];

$.getHeader = function() {
	if(headerStack.length) {
		return headerStack[headerStack.length - 1];
	} else {
		return {};
	}
};

headerStack.push({
	title: "Documents",
	itemCount: _data.length || 0,
	rightNavButton: {
		type: "Add",
		event: captureDocument
	}
});

function createRow(_rowData) {
	var tableViewRow = Ti.UI.createTableViewRow({
		left: 10,
		right: 10,
		height: 44,
		width: Ti.UI.FILL,
		borderColor: "#CDCDCD"
	});

	var name = Ti.UI.createLabel({
		textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
		left: 10,
		width: 80,
		font: {
			fontWeight: "bold"
		},
		text: _rowData.name
	});
	var vSeperator = Ti.UI.createView({
		height: 44,
		left: 100,
		width: 1,
		backgroundColor: "#CDCDCD"
	});
	var description = Ti.UI.createLabel({
		left: 110,
		width: 400,
		height: 44,
		text: _rowData.description
	});
	var button = Ti.UI.createButton({
		left: 490,
		height: 30,
		widht: Ti.UI.SIZE,
		font: {
			fontWeight: "bold"
		},
		title: _rowData.type || _rowData.name.substring(_rowData.name.lastIndexOf(".") + 1)
	});
	var detailIcon = Ti.UI.createView({
		backgroundImage: "/service-outlet-detail/detail-icon.png",
		width: 7,
		height: 10,
		left: 560
	});
	tableViewRow.add(name);
	tableViewRow.add(vSeperator);
	tableViewRow.add(description);
	tableViewRow.add(button);
	tableViewRow.add(detailIcon);

	return tableViewRow;
}

for(var i in _data) {
	tableRows.push(createRow(_data[i]));
}

adjustTableHeight();
$.docList.data = tableRows;

function adjustTableHeight() {
	$.docList.height = tableRows.length * 44;
}

//Add document function
function captureDocument(evt, _callback) {

	selectImage({
		callback: function(e) {
			_callback && _callback();
			console.log(evt.source.id);
			if(evt.source.id === "btnCamera") {
				_args.header.leftNavButton && _args.header.leftNavButton.fireEvent('click');
				setTimeout(function() {
					openAddDocument(e);
				}, 600);
			} else {
				openAddDocument(e);
			}
		},
		view: evt.source
	});

	function openAddDocument(_image) {
		var newDoc = {
			name: "",
			description: "",
			file: _image.media,
			type: "PHOTO"
		};
		addDocument(newDoc);
	}
}

function openDetail(e) {
	var docDetail = Alloy.createController("/service-outlet-detail/documentDetail", {
		data: _data[e.index],
		aid: _args.data.outlet.aid
	});
	var detailView = docDetail.getView();
	detailView.left = 599;
	$.wrapper.add(detailView);

	var updateObj = {
		title: "Document Detail",
		itemCount: 0,
		rightNavButton: {
			type: "Delete",
			event: function() {
				docDetail.deleteDocument(function() {
					tableRows.splice(e.index, 1);
					_args.data.documents.splice(e.index, 1);
					$.docList.data = tableRows;
					closeDetail();
				});
			}
		},
		leftNavButton: {
			type: "Back",
			title: "Documents",
			event: function() {
				docDetail.updateDocument(function(_isDocumentUpdated, _updatedDocument) {
					if(_isDocumentUpdated) {
						_args.data.documents[e.index] = _updatedDocument;
						tableRows[e.index] = createRow(_updatedDocument);
						$.docList.data = tableRows;
					} else {
						Ti.UI.createAlertDialog({
							title: "Field Service Demo",
							message: "Error saving the document"
						}).show();
					}
					closeDetail();
				});
			}
		}
	};

	detailView.animate({
		left: 10,
		duration: 500
	});
	headerStack.push(updateObj);
	_args.header.update($.getHeader());

	function closeDetail() {
		var closeAnimation = Ti.UI.createAnimation({
			left: 599,
			duration: 500
		});
		headerStack.pop();
		updateObj = null;
		headerStack[0].itemCount = tableRows.length;
		adjustTableHeight();
		_args.header.update($.getHeader());
		closeAnimation.addEventListener("complete", function() {
			$.wrapper.remove(detailView);
			detailView = docDetail = null;
		});
		detailView.animate(closeAnimation);
	}
}

function addDocument(newData) {
	var docDetail = Alloy.createController("/service-outlet-detail/documentDetail", {
		data: newData,
		aid: _args.data.outlet.aid
	});

	var updateObj = {
		title: "Document Detail",
		itemCount: 0,
		rightNavButton: {
			type: "Cancel",
			event: closeDetail
		},
		leftNavButton: {
			type: "Save",
			event: function() {
				docDetail.updateDocument(function(_addedDocument) {
					var row = createRow(_addedDocument);
					tableRows.push(row);
					$.docList.data = tableRows;
					_args.data.documents.push(_addedDocument);
					closeDetail();
				});

			}
		}
	};

	var detailView = docDetail.getView();
	detailView.top = 558;
	$.wrapper.add(detailView);

	detailView.animate({
		top: 0,
		duration: 500
	});
	headerStack.push(updateObj);
	_args.header.update($.getHeader());

	function closeDetail() {
		var closeAnimation = Ti.UI.createAnimation({
			top: 558,
			duration: 500
		});
		headerStack.pop();
		updateObj = null;
		headerStack[0].itemCount = tableRows.length;
		adjustTableHeight();
		_args.header.update($.getHeader());
		closeAnimation.addEventListener("complete", function() {
			$.wrapper.remove(detailView);
			detailView = docDetail = null;
		});
		detailView.animate(closeAnimation);
	}
}

function camera(params) {
	Titanium.Media.showCamera({
		success: function(e) {
			Titanium.Media.saveToPhotoGallery(e.media);
			params.callback && params.callback(e);
		},
		cancel: selectImage,
		error: function(error) {
			var a = Titanium.UI.createAlertDialog({
				title: 'Camera'
			});
			if(error.code == Titanium.Media.NO_CAMERA) {
				a.setMessage('Sorry, you need a camera.');
			} else {
				a.setMessage('Unexpected error: ' + error.code);
			}
			a.show();
		},
		mediaTypes: Ti.Media.MEDIA_TYPE_PHOTO,
		autohide: true
	});
};

function gallery(params) {
	console.log("Opening Gallery");
	Titanium.Media.openPhotoGallery({
		success: params.callback,
		cancel: function() {},
		error: function(error) {
			var a = Titanium.UI.createAlertDialog({
				title: 'Camera'
			});
			a.setMessage('Unexpected error: ' + error.code);
			a.show();
		},
		mediaTypes: Ti.Media.MEDIA_TYPE_PHOTO,
		autohide: true,
		popoverView: params.view || null
	});
};

function selectImage(params) {
	if(Ti.Media.isCameraSupported) {
		var dialog = Ti.UI.createOptionDialog({
			title: "Capture a Document!",
			options: ['Take a Picture', 'Image Gallery', 'Cancel'],
			cancel: 2
		})
		dialog.show();

		dialog.addEventListener('click', function(e) {
			switch(e.index) {
				case 0:
					camera(params);
					break;
				case 1:
					gallery(params);
					break;

			}
		});
	} else {
		gallery(params);
	}
}

$.captureDocument = captureDocument;