var _args = arguments[0] || {},
_data = _args.data,
	rowNum = 0,
	detail = null,
	tableRows = [],
	headerStack = [];

for(var i in _data.expenses) {
	tableRows.push(createRow(_data.expenses[i]));
}

adjustTableHeight();
$.expenseList.data = tableRows;

$.getHeader = function() {
	if(headerStack.length) {
		return headerStack[headerStack.length - 1];
	} else {
		return {};
	}
};

headerStack.push({
	title: "Expenses",
	itemCount: _data.expenses.length || 0,
	rightNavButton: {
		type: "Add",
		event: addExpense
	}
});

function adjustTableHeight() {
	$.expenseList.height = tableRows.length * 44;
}

function createRow(_rowData) {
	var tableViewRow = Ti.UI.createTableViewRow({
		height: 44,
		width: Ti.UI.FILL,
		hasChild: true,
		selectionStyle: Titanium.UI.iPhone.TableViewCellSelectionStyle.GRAY,
		backgroundColor: "#FFF",
	});
	var rowContainer = Ti.UI.createView({
		height: 44,
		left: 10,
		right: 10,
		touchEnabled: false
	});
	var title = Ti.UI.createLabel({
		height: 40,
		font: {
			fontWeight: "bold",
			fontSize: 16
		},
		left: 0,
		width: 100,
		text: _rowData.type,
		color: "#000",
		touchEnabled: false
	});
	var separator = Ti.UI.createView({
		height: 44,
		left: 100,
		width: 1,
		backgroundColor: "#F5F5F5",
		touchEnabled: false
	})
	var description = Ti.UI.createLabel({
		left: 111,
		right: 140,
		text: _rowData.notes,
		color: "#000",
		height: 20,
		touchEnabled: false
	});
	var lblExpenditure = Ti.UI.createLabel({
		right: 40,
		width: 80,
		height: 44,
		text: _rowData.cost,
		touchEnabled: false
	});
	rowContainer.add(title);
	rowContainer.add(separator);
	rowContainer.add(description);
	rowContainer.add(lblExpenditure);
	tableViewRow.add(rowContainer);
	return tableViewRow;
}

//Add button function
function addExpense(e) {
	var expenseDetail = Alloy.createController("/service-outlet-detail/expensesDetail", {
		aid: _data.outlet.aid,
		existing: false
	});

	var updateObj = {
		title: "Expense Detail",
		itemCount: 0,
		rightNavButton: {
			type: "Cancel",
			event: closeDetail
		},
		leftNavButton: {
			type: "Save",
			event: function() {
				expenseDetail.updateExpense(function(_addedExpense) {
					var row = createRow(_addedExpense);
					tableRows.push(row);
					$.expenseList.data = tableRows;
					_args.data.expenses.push(_addedExpense);
					closeDetail();
				});

			}
		}
	};

	var detailView = expenseDetail.getView();
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
			detailView = expenseDetail = null;
		});
		detailView.animate(closeAnimation);
	}
}

function openDetail(e) {
	var expenseDetail = Alloy.createController("/service-outlet-detail/expensesDetail", {
		data: _data.expenses[e.index],
		existing: true
	});
	var detailView = expenseDetail.getView();
	detailView.left = 599;
	$.wrapper.add(detailView);

	var updateObj = {
		title: "Expense Detail",
		itemCount: 0,
		rightNavButton: {
			type: "Delete",
			event: function() {
				expenseDetail.deleteExpense(function() {
					tableRows.splice(e.index, 1);
					_args.data.expenses.splice(e.index, 1);
					$.expenseList.data = tableRows;
					closeDetail();
				});
			}
		},
		leftNavButton: {
			type: "Back",
			title: "Expenses",
			event: function() {
				expenseDetail.updateExpense(function(_isExpenseUpdated, _updatedExpense) {
					if(_isExpenseUpdated) {
						_args.data.expenses[e.index] = _updatedExpense;
						tableRows[e.index] = createRow(_updatedExpense);
						$.expenseList.data = tableRows;
					} else {
						Ti.UI.createAlertDialog({
							title: "Field Service Demo",
							message: "Error saving the expense"
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
			detailView = expenseDetail = null;
		});
		detailView.animate(closeAnimation);
	}
}