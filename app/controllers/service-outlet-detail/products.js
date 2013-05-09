var _args = arguments[0] || {},
_data = _args.data,
	detail = null,
	tableRows = [],
	headerStack = [];

$.itemList.height = _data.products.length * 44;

for(var i in _data.products) {
	tableRows.push(createRow(_data.products[i]));
}

adjustTableHeight();

$.itemList.data = tableRows;

$.getHeader = function() {
	if(headerStack.length) {
		return headerStack[headerStack.length - 1];
	} else {
		return {};
	}
}

headerStack.push({
	title: "Products",
	itemCount: _data.products.length || 0,
	rightNavButton: {
		type: "Add",
		event: addProduct
	}
});

function adjustTableHeight() {
	$.itemList.height = tableRows.length * 44;
}

function createRow(_rowData) {
	var tableViewRow = Ti.UI.createTableViewRow({
		height: 44,
		width: Ti.UI.FILL,
		hasChild: true,
		selectionStyle: Titanium.UI.iPhone.TableViewCellSelectionStyle.GRAY
	});
	var rowContainer = Ti.UI.createView({
		height: 44,
		left: 10,
		right: 10,
		touchEnabeld: false
	});
	var title = Ti.UI.createLabel({
		height: 40,
		font: {
			fontWeight: "bold",
			fontSize: 16
		},
		left: 0,
		width: 100,
		text: _rowData.productName,
		color: "#000",
		touchEnabeld: false
	});
	var separator = Ti.UI.createView({
		height: 44,
		left: 100,
		width: 1,
		backgroundColor: "#F5F5F5",
		touchEnabeld: false
	})
	var description = Ti.UI.createLabel({
		left: 111,
		right: 40,
		text: _rowData.productDescription,
		color: "#000",
		height: 20,
		touchEnabeld: false
	});
	rowContainer.add(title);
	rowContainer.add(separator);
	rowContainer.add(description);
	tableViewRow.add(rowContainer);
	return tableViewRow;
}

function openProductDetail(e) {
	var productDetail = Alloy.createController("/service-outlet-detail/productDetail", {
		data: _data.products[e.index],
		existing: true
	});
	var detailView = productDetail.getView();
	detailView.left = 599;
	$.wrapper.add(detailView);

	var updateObj = {
		title: "Product Detail",
		itemCount: 0,
		rightNavButton: {
			type: "Delete",
			event: function() {
				productDetail.deleteProduct(function() {
					tableRows.splice(e.index, 1);
					_args.data.products.splice(e.index, 1);
					$.itemList.data = tableRows;
					closeDetail();
				});
			}
		},
		leftNavButton: {
			type: "Back",
			title: "Products",
			event: function() {
				productDetail.updateProduct(function(_isProductUpdated, _updatedProduct) {
					if(_isProductUpdated) {
						_args.data.products[e.index] = _updatedProduct;
						tableRows[e.index] = createRow(_updatedProduct);
						$.itemList.data = tableRows;
					} else {
						Ti.UI.createAlertDialog({
							title: "Field Service Demo",
							message: "Error saving the product"
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
			detailView = productDetail = null;
		});
		detailView.animate(closeAnimation);
	}
}

//Add button function
function addProduct(e) {
	var productDetail = Alloy.createController("/service-outlet-detail/productDetail", {
		aid: _data.outlet.aid,
		existing: false
	});

	var updateObj = {
		title: "Product Detail",
		itemCount: 0,
		rightNavButton: {
			type: "Cancel",
			event: closeDetail
		},
		leftNavButton: {
			type: "Save",
			event: function() {
				productDetail.updateProduct(function(e) {
					var row = createRow(e);
					tableRows.push(row);
					$.itemList.data = tableRows;
					_args.data.products.push(e);
					closeDetail();
				});
			}
		}
	};

	var detailView = productDetail.getView();
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
			detailView = productDetail = null;
		});
		detailView.animate(closeAnimation);
	}
}