var _args = arguments[0] || {},
api = require("fieldServiceApi");
data = _args.data || [], filteredData = [];

if(_args.type && _args.type === "taskDetail") {
	!data && (data = []);
	buildProductList(data);
} else {
	api.getCatalog({
		onload: function(_productList) {
			data = _productList.data;
			buildProductList(data);
		},
		onerror: function(e) {
			console.log("Error:" + e);
		}
	});
}

function buildProductList(_data) {
	var rows = [];
	for(var i = 0, j = _data.length; i < j; i++) {
		var row = Ti.UI.createTableViewRow({
			height: 44
		});
		row.productData = _data[i];
		var title = Ti.UI.createLabel({
			left: 10,
			right: 10,
			textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
			font: {
				fontWeight: "bold"
			},
			text: _data[i].name || _data[i].productName || _data[i].type,
			height: Ti.UI.FILL,
			touchEnabled: false
		});
		row.add(title);
		rows.push(row);
	}
	$.productsTable.data = rows;
}

function getRowData(e) {
	e.row.productData && _args.callback(e.row.productData);
}

function filter(e) {
	filteredData = [];
	if(e.value == "" || e.value == "undefined") {
		buildProductList(data);
	} else {
		for(var i = 0, j = data.length; i < j; i++) {
			var lowerCaseName = data[i].name.toLowerCase();
			var searchString = e.value.toLowerCase();
			if(lowerCaseName.indexOf(searchString) !== -1) {
				filteredData.push(data[i]);
			};
		}
		buildProductList(filteredData);
	}
}