var _args = arguments[0] || {},
_data = _args.data,
	rows = [],
	activeRow = [],
	headerStack = [];

buildTasks();

$.getHeader = function() {
	if(headerStack.length) {
		return headerStack[headerStack.length - 1];
	} else {
		return {};
	}
}

headerStack.push({
	title: "Tasks",
	itemCount: _data.tasks.length || 0,
	rightNavButton: {
		type: "Add",
		event: addTask
	}
});

function buildTasks() {
	$.activeTask.data = [];
	$.taskTable.data = [];
	activeRow = [];
	rows = [];
	for(var i in _data.tasks) {
		var row = Alloy.createController("/service-outlet-detail/taskRow", {
			data: _data.tasks[i],
			realIndex: i
		}).getView();
		if(_data.tasks[i].status == "Active") {
			activeRow.push(row);
		} else {
			rows.push(row);
		}
	}
	adjustTablesHeights();
	$.activeTask.data = activeRow;
	$.taskTable.data = rows;
}

function adjustTablesHeights() {
	$.activeTask.height = activeRow.length * 44;
	$.taskTable.height = rows.length * 44;
}

function rowClick(e) {
	if(e.source.id == "timerBtn") {
		var timerBtn = e.source;
		if(timerBtn.paused) {
			timerBtn.applyProperties({
				backgroundImage: "/service-outlet-detail/current-task-pause-btn.png",
				backgroundSelectedImage: "/service-outlet-detail/current-task-pause-btn-touch.png",
				paused: false
			});
		} else {
			timerBtn.applyProperties({
				backgroundImage: "/service-outlet-detail/current-task-play-btn.png",
				backgroundSelectedImage: "/service-outlet-detail/current-task-play-btn-touch.png",
				paused: true
			});
		}
	} else {
		var taskDetail = Alloy.createController("/service-outlet-detail/taskDetail", {
			data: _data,
			index: e.source.realIndex,
			existing: true
		});
		var detailView = taskDetail.getView();
		detailView.left = 599;
		$.wrapper.add(detailView);

		var updateObj = {
			title: "Task Detail",
			itemCount: 0,
			rightNavButton: {
				type: "Delete",
				event: function() {
					taskDetail.deleteTask(function() {
						_args.data.tasks.splice(e.source.realIndex, 1);
						buildTasks();
						closeDetail();
					});
				}
			},
			leftNavButton: {
				type: "Back",
				title: "Tasks",
				event: function() {
					taskDetail.updateTask(function(_isTaskUpdated, _updatedTask) {
						if(_isTaskUpdated) {
							_args.data.tasks[e.source.realIndex] = _updatedTask;
							buildTasks();
						} else {
							Ti.UI.createAlertDialog({
								title: "Field Service Demo",
								message: "Error saving the task"
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

		function closeDetail(skipUpdate) {
			var closeAnimation = Ti.UI.createAnimation({
				left: 599,
				duration: 500
			});
			headerStack.pop();
			updateObj = null;
			headerStack[0].itemCount = _args.data.tasks.length;
			adjustTablesHeights();
			_args.header.update($.getHeader());
			closeAnimation.addEventListener("complete", function() {
				$.wrapper.remove(detailView);
				detailView = taskDetail = null;
			});
			detailView.animate(closeAnimation);
		}
	}
}

function addTask(data) {
	Alloy.Globals.DetailsView.getView("detailScroll").scrollToView(1);
	var taskDetail = Alloy.createController("/service-outlet-detail/taskDetail", {
		data: _data || data,
		existing: false
	});

	var updateObj = {
		title: "New Task",
		itemCount: 0,
		rightNavButton: {
			type: "Cancel",
			event: function() {
				taskDetail.cancel(function() {
					closeDetail();
				});
			}
		},
		leftNavButton: {
			type: "Save",
			event: function() {
				taskDetail.updateTask(function(_addedTask) {
					_args.data.tasks.push(_addedTask);
					buildTasks();
					closeDetail();
				});
			}
		}
	};

	var detailView = taskDetail.getView();
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
		headerStack[0].itemCount = _args.data.tasks.length;
		adjustTablesHeights();
		_args.header.update($.getHeader());
		closeAnimation.addEventListener("complete", function() {
			$.wrapper.remove(detailView);
			detailView = taskDetail = null;
		});
		detailView.animate(closeAnimation);
	}
}

$.addTask = addTask;