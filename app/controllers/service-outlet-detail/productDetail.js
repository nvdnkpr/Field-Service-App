var _args = arguments[0] || {},
api = require("fieldServiceApi");

if(_args.data) {
	$.lblNameValue.text = _args.data.productName;
	$.txtQuantity.value = _args.data.quantity;
	$.txtComments.value = _args.data.productDescription;
}

$.updateProduct = function(_callback) {
	if(_args.existing) {
		api.updateProduct({
			productName: $.lblNameValue.text,
			productDescription: $.txtComments.value,
			productStatus: _args.data.productStatus,
			quantity: $.txtQuantity.value,
			id: _args.data.id,
			onload: function(e) {
				console.log("Product Updated - " + e.products[0].id);
				_callback && _callback(true, e.products[0]);
			},
			onerror: function(e) {
				console.log("Error:" + e);
				_callback && _callback(false);
			}
		});
	} else {
		if(_args.id) {
			api.createProduct({
				quantity: $.txtQuantity.value,
				cid: _args.cid,
				id: _args.id,
				aid: _args.aid,
				onload: function(e) {
					console.log("Product Created - " + e.id);
					_callback && _callback({
						id: e.id,
						quantity: e.quantity,
						productName: e["[CUSTOM_catalog]catalog_id"][0].name,
						productDescription: e["[CUSTOM_catalog]catalog_id"][0].description,
						productStatus: e["[CUSTOM_catalog]catalog_id"][0].status,
						cid: e.cid,
						aid: e.aid,
						productCID: e["[CUSTOM_catalog]catalog_id"][0].cid
					});
				},
				onerror: function(e) {
					console.log("Error:" + e);
					Ti.UI.createAlertDialog({
						title: "Field Service Demo",
						message: "Error creating a new product"
					}).show();
				}
			});
		} else {
			Ti.UI.createAlertDialog({
				title: "Field Service Demo",
				message: "Please select a product"
			}).show();
		}
	}
};

$.deleteProduct = function(_callback) {
	api.deleteProduct({
		id: _args.data.id,
		onload: function(e) {
			console.log("Deleted Product - " + JSON.stringify(e));
			_callback && _callback();
		},
		onerror: function(e) {
			console.log("Error:" + e);
			Ti.UI.createAlertDialog({
				title: "Field Service Demo",
				message: "Error deleting the product from this assignment"
			}).show();
		}
	});
};

function setName(_productDetails) {
	$.lblNameValue.text = _productDetails.name;
	$.txtComments.value = _productDetails.description;
	$.txtQuantity.value = 1;
	_args.productStatus = _productDetails.status;
	_args.cid = _productDetails.cid;
	_args.id = _productDetails.id;
}

function openProductsList(e) {
	var productsList = Alloy.createController("/service-outlet-detail/productsList", {
		callback: setName
	});

	var convertedPoint = e.source.convertPointToView({
		x: e.x,
		y: e.y
	}, Alloy.Globals.MainWindow);
	var popoverArgs = {
		arrowPosition: "top",
		view: productsList.getView(),
		containerLayout: {
			left: convertedPoint.x - 140,
			top: convertedPoint.y
		}
	};
	var popover = Alloy.createController("/common/popover", popoverArgs);
}