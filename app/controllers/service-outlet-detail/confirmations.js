var _args = arguments[0] || {},
data = _args.data.products,
	rows = [],
	Paint = require('ti.paint'),
	signatureView = Paint.createPaintView({
		top: 0,
		right: 0,
		bottom: 0,
		left: 0,
		strokeColor: '#000000',
		strokeAlpha: 255,
		strokeWidth: 2,
		eraseMode: false,
		zIndex: 50
	});

for(var i in data) {
	var row = Ti.UI.createTableViewRow({
		title: data[i].productName
	});
	rows.push(row);
}

$.productList.setData(rows);

$.signaturePad.add(signatureView);

//Delete the current signature and start over
function deleteSignature() {
	signatureView.clear();
	$.signatureLabel.show();
}

function getHeader() {
	return {
		title: "Confirmation",
		itemCount: 0,
		callback: null
	}
}
$.getHeader = getHeader;