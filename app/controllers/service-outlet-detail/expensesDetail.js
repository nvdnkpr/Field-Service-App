var _args = arguments[0] || {},
api = require("fieldServiceApi");

if(_args.data) {
	$.txtContent.value = _args.data.type;
	$.txtPrice.value = _args.data.cost;
	$.txtComments.value = _args.data.notes;
}

$.updateExpense = function(_callback) {
	if(_args.existing) {
		api.updateExpense({
			type: $.txtContent.value,
			cost: $.txtPrice.value,
			notes: $.txtComments.value,
			id: _args.data.id,
			onload: function(e) {
				console.log("Expense Updated - " + e.expenses[0].id);
				_callback && _callback(true, e.expenses[0]);
			},
			onerror: function(e) {
				console.log("Error:" + e);
				_callback && _callback(false);
			}
		});
	} else {
		api.createExpense({
			type: $.txtContent.value || "test",
			cost: $.txtPrice.value || "30",
			notes: $.txtComments.value || "test",
			aid: _args.aid,
			onload: function(e) {
				console.log("Expense Added - " + e.id);
				_callback && _callback(e);
			},
			onerror: function(e) {
				console.log("Error:" + e);
				Ti.UI.createAlertDialog({
					title: "Field Service Demo",
					message: "Error creating a new expense"
				}).show();
			}
		});
	}
};

$.deleteExpense = function(_callback) {
	api.deleteExpense({
		id: _args.data.id,
		onload: function(e) {
			console.log("Deleted Expense - " + JSON.stringify(e));
			_callback();
		},
		onerror: function(e) {
			console.log("Error:" + e);
			Ti.UI.createAlertDialog({
				title: "Field Service Demo",
				message: "Error deleting the expense"
			}).show();
		}
	});
};