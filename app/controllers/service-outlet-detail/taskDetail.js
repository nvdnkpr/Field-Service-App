var _args = arguments[0] || {},
index = _args.index || 0,
	_taskData = null,
	newTaskObj = null,
	api = require("fieldServiceApi"),
	relatedProducts = [],
	relatedExpenses = [],
	relatedDocuments = [];

$.totalTime.removeStartStop();
$.totalTime.widget.addEventListener("click", showTimePicker);

if(_args.existing === false && !_args.data.tasks[index]) {
	index = _args.data.tasks.length;
	_args.data.tasks[index] = {
		notes: "",
		type: "",
		notes: ""
	};
	$.totalTime.setTime(0);
}

!_args.data.tasks[index].relatedProducts && (_args.data.tasks[index].relatedProducts = []);
!_args.data.tasks[index].relatedExpenses && (_args.data.tasks[index].relatedExpenses = []);
!_args.data.tasks[index].relatedDocuments && (_args.data.tasks[index].relatedDocuments = []);
_taskData = _args.data.tasks && _args.data.tasks[index];

if(_taskData) {
	if(!_taskData.duration) {
		_taskData.duration = 0;
	}
	$.txtType.value = (_taskData.type != "click") ? _taskData.type : "";
	$.totalTime.setTime(_taskData.duration);
	$.txtComments.value = _taskData.notes;
	buildProducts(_taskData.relatedProducts);
	buildExpenses(_taskData.relatedExpenses);
	buildDocuments(_taskData.relatedDocuments);
}

$.updateTask = function(_callback) {
	if(_args.existing) {
		api.updateTask({
			type: $.txtType.value,
			duration: $.totalTime.getTime(),
			notes: $.txtComments.value,
			status: _taskData.status || 'None',
			id: _taskData.id,
			onload: function(e) {
				console.log("Task Updated - " + e.tasks[0].id);
				_callback && _callback(true, e.tasks[0]);
			},
			onerror: function(e) {
				console.log("Error:" + e);
				_callback && _callback(false);
			}
		});
	} else {
		api.createTask({
			type: $.txtType.value || "Test",
			duration: $.totalTime.getTime(),
			notes: $.txtComments.value || "Test",
			status: "Test",
			aid: _args.data.outlet.aid,
			onload: function(e) {
				console.log("Task Added - " + JSON.stringify(e));
				_args.data.tasks.splice(index, 1);
				_callback && _callback(e);
			},
			onerror: function(e) {
				_args.data.tasks.splice(index, 1);
				console.log("Error:" + e);
				Ti.UI.createAlertDialog({
					title: "Field Service Demo",
					message: "Error creating a new task"
				}).show();
			}
		});
	}
};

$.cancel = function(_callback) {
	_args.data.tasks.splice(index, 1);
	_callback && _callback();
}

$.deleteTask = function(_callback) {
	api.deleteTask({
		id: _taskData.id,
		onload: function(e) {
			console.log("Deleted Product - " + JSON.stringify(e));
			_callback && _callback(e);
		},
		onerror: function(e) {
			console.log("Error:" + e);
			Ti.UI.createAlertDialog({
				title: "Field Service Demo",
				message: "Error deleting the task from this assignment"
			}).show();
		}
	});
};

function createRelatedRow(_relatedRowData, _rowId, _type) {
	var container = Ti.UI.createView({
		height: 44,
		top: 0
	});
	var btnDelete = Ti.UI.createButton({
		height: 44,
		width: 44,
		backgroundImage: "/service-outlet-detail/task-delete-related-btn.png",
		backgroundSelectedImage: "/service-outlet-detail/task-delete-related-btn-touch.png",
		left: 10,
		type: "deleteRelatedRow",
		rowId: _rowId
	});
	var title = Ti.UI.createLabel({
		text: _relatedRowData.name || _relatedRowData.productName || _relatedRowData.type,
		left: 74,
		width: Ti.UI.SIZE
	});
	if(_type === "products") {
		var quantityContainer = Ti.UI.createView({
			backgroundImage: "/service-outlet-detail/task-quantity-total-bg.png",
			height: 44,
			width: 42,
			right: 88
		});
		var lblQuantity = Ti.UI.createLabel({
			text: _relatedRowData.quantity,
			width: Ti.UI.SIZE,
			height: Ti.UI.FILL,
			font: {
				fontWeight: "bold",
				fontSize: 16
			}
		});
		var btnDeleteQuantity = Ti.UI.createButton({
			backgroundImage: "/service-outlet-detail/task-quantity-reduce-btn.png",
			backgroundSelectedImage: "/service-outlet-detail/task-quantity-reduce-btn-touch.png",
			width: 44,
			height: 44,
			right: 130
		});
		var quantity = _relatedRowData.quantity;
		btnDeleteQuantity.addEventListener("click", function() {
			quantity--;
			lblQuantity.text = quantity;
		});
		var btnAddQuantity = Ti.UI.createButton({
			backgroundImage: "/service-outlet-detail/task-quantity-increase-btn.png",
			backgroundSelectedImage: "/service-outlet-detail/task-quantity-increase-btn-touch.png",
			width: 44,
			height: 44,
			right: 44
		});
		btnAddQuantity.addEventListener("click", function() {
			quantity++;
			lblQuantity.text = quantity;
		});
		quantityContainer.add(lblQuantity);
		container.add(btnDeleteQuantity);
		container.add(quantityContainer);
		container.add(btnAddQuantity);

	} else if(_type === "expenses") {
		var lblCost = Ti.UI.createLabel({
			text: _relatedRowData.cost,
			width: Ti.UI.SIZE,
			height: Ti.UI.FILL,
			font: {
				fontWeight: "bold",
				fontSize: 16
			},
			right: 20
		});
		container.add(lblCost);
	}

	container.add(btnDelete);
	container.add(title);
	return container;
}

function showTimePicker(e) {
	var pickerContainer = Ti.UI.createView({
		width: 300,
		height: 230
	});
	var timePicker = Ti.UI.createPicker({
		top: -10,
		height: 250,
		width: 300
	});
	timePicker.selectionIndicator = true;
	var hoursColumn = Ti.UI.createPickerColumn();
	for(var i = 0; i < 100; i++) {
		var row = Ti.UI.createPickerRow({
			title: (i < 10) ? "0" + i : "" + i
		});
		hoursColumn.addRow(row);
	}
	var minutesColumn = Ti.UI.createPickerColumn();
	for(var j = 0; j < 60; j++) {
		var row = Ti.UI.createPickerRow({
			title: (j < 10) ? "0" + j : "" + j
		});
		minutesColumn.addRow(row);
	}
	var secondsColumn = Ti.UI.createPickerColumn();
	for(var k = 0; k < 60; k++) {
		var row = Ti.UI.createPickerRow({
			title: (k < 10) ? "0" + k : "" + k
		});
		secondsColumn.addRow(row);
	}
	timePicker.add(hoursColumn);
	timePicker.add(minutesColumn);
	timePicker.add(secondsColumn);
	timePicker.addEventListener("change", function(_pickerData) {
		var duration = parseInt(_pickerData.selectedValue[0], 10) * 3600 + parseInt(_pickerData.selectedValue[1], 10) * 60 + parseInt(_pickerData.selectedValue[2], 10);
		$.totalTime.setTime(duration);
	});
	pickerContainer.add(timePicker);
	var convertedPoint = e.source.convertPointToView({
		x: e.x,
		y: e.y
	}, Alloy.Globals.MainWindow);
	var popoverArgs = {
		arrowPosition: "top",
		view: pickerContainer,
		containerLayout: {
			left: convertedPoint.x - 160,
			top: convertedPoint.y
		}
	};
	var popover = Alloy.createController("/common/popover", popoverArgs);
	var readableTime = $.totalTime.getTime("text");
	readableTime = readableTime.split(":");
	timePicker.setSelectedRow(0, parseInt(readableTime[0], 10), false);
	timePicker.setSelectedRow(1, parseInt(readableTime[1], 10), false);
	timePicker.setSelectedRow(2, parseInt(readableTime[2], 10), false);
}

function buildProducts(_products) {
	for(var i = 0, j = _products.length; i < j; i++) {
		var row = createRelatedRow(_products[i], i, "products");
		relatedProducts.push(row);
		$.vAddProducts.add(row);
	}
}

function buildExpenses(_expenses) {
	for(var i = 0, j = _expenses.length; i < j; i++) {
		var row = createRelatedRow(_expenses[i], i, "expenses");
		relatedExpenses.push(row);
		$.vAddExpenses.add(row);
	}
}

function buildDocuments(_documents) {
	for(var i = 0, j = _documents.length; i < j; i++) {
		var row = createRelatedRow(_documents[i], i, "documents");
		relatedDocuments.push(row);
		$.vAddDocuments.add(row);
	}
}

function showProducts(e) {
	var productsList = Alloy.createController("/service-outlet-detail/productsList", {
		data: _args.data.products,
		type: "taskDetail",
		callback: function(selectedProduct) {
			for(var i = 0, j = _args.data.tasks[index].relatedProducts.length; i < j; i++) {
				if(_args.data.tasks[index].relatedProducts[i].id === selectedProduct.id) {
					Ti.UI.createAlertDialog({
						title: "Field Service Demo",
						message: "Selected product exists in the list of related products!"
					}).show();
					return;
				}
			}
			var row = createRelatedRow(selectedProduct, relatedProducts.length, "products");
			relatedProducts.push(row);
			$.vAddProducts.add(row);
			_args.data.tasks[index].relatedProducts.push(selectedProduct);
		}
	});
	var convertedPoint = e.source.convertPointToView({
		x: e.x,
		y: e.y
	}, Alloy.Globals.MainWindow);
	var popoverArgs = {
		arrowPosition: "bottom",
		view: productsList.getView(),
		containerLayout: {
			left: convertedPoint.x - 140,
			bottom: 720 - convertedPoint.y
		}
	};
	var popover = Alloy.createController("/common/popover", popoverArgs);
}

function showExpenses(e) {
	var expensesList = Alloy.createController("/service-outlet-detail/productsList", {
		data: _args.data.expenses,
		type: "taskDetail",
		callback: function(selectedExpense) {
			for(var i = 0, j = _args.data.tasks[index].relatedExpenses.length; i < j; i++) {
				if(_args.data.tasks[index].relatedExpenses[i].id === selectedExpense.id) {
					Ti.UI.createAlertDialog({
						title: "Field Service Demo",
						message: "Selected expense exists in the list of related expenses!"
					}).show();
					return;
				}
			}
			var row = createRelatedRow(selectedExpense, relatedExpenses.length, "expenses");
			relatedExpenses.push(row);
			$.vAddExpenses.add(row);
			_args.data.tasks[index].relatedExpenses.push(selectedExpense);
		}
	});
	var convertedPoint = e.source.convertPointToView({
		x: e.x,
		y: e.y
	}, Alloy.Globals.MainWindow);
	var popoverArgs = {
		arrowPosition: "bottom",
		view: expensesList.getView(),
		containerLayout: {
			left: convertedPoint.x - 140,
			bottom: 720 - convertedPoint.y
		}
	};
	var popover = Alloy.createController("/common/popover", popoverArgs);
}

function showDocuments(e) {
	var documentsList = Alloy.createController("productsList", {
		data: _args.data.documents,
		type: "taskDetail",
		callback: function(selectedDocument) {
			for(var i = 0, j = _args.data.tasks[index].relatedDocuments.length; i < j; i++) {
				if(_args.data.tasks[index].relatedDocuments[i].id === selectedDocument.id) {
					Ti.UI.createAlertDialog({
						title: "Field Service Demo",
						message: "Selected document exists in the list of related documents!"
					}).show();
					return;
				}
			}
			var row = createRelatedRow(selectedDocument, relatedDocuments.length, "documents");
			relatedDocuments.push(row);
			$.vAddDocuments.add(row);
			_args.data.tasks[index].relatedDocuments.push(selectedDocument);
		}
	});
	var convertedPoint = e.source.convertPointToView({
		x: e.x,
		y: e.y
	}, Alloy.Globals.MainWindow);
	var popoverArgs = {
		arrowPosition: "bottom",
		view: documentsList.getView(),
		containerLayout: {
			left: convertedPoint.x - 140,
			bottom: 720 - convertedPoint.y
		}
	};
	var popover = Alloy.createController("/common/popover", popoverArgs);
}

function deleteProducts(e) {
	if(e.source.type === "deleteRelatedRow") {
		$.vAddProducts.remove(relatedProducts[e.source.rowId]);
	}
}

function deleteExpenses(e) {
	if(e.source.type === "deleteRelatedRow") {
		$.vAddExpenses.remove(relatedExpenses[e.source.rowId]);
	}
}

function deleteDocuments(e) {
	if(e.source.type === "deleteRelatedRow") {
		$.vAddDocuments.remove(relatedDocuments[e.source.rowId]);
	}
}