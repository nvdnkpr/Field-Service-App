var _args = arguments[0] || {},
selectedColor = (Alloy.CFG.theme == "appc-red") ? "#c4122f" : "#5bc0c3";

switch(_args.index) {
	case 0:
		$.summary.color = selectedColor;
		break;
	case 1:
		$.tasks.color = selectedColor;
		break;
	case 2:
		$.products.color = selectedColor;
		break;
	case 3:
		$.expenses.color = selectedColor;
		break;
	case 4:
		$.documents.color = selectedColor;
		break;
	case 5:
		$.confirmation.color = selectedColor;
}

function statusUpdate(e) {
	_args.callback && _args.callback(e);
}

$.taskCount.text = _args.data.tasks.length;
$.productCount.text = _args.data.products.length;
$.documentCount.text = _args.data.documents.length;
$.expenseCount.text = _args.data.expenses.length;