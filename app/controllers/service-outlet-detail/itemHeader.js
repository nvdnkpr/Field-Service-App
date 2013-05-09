var _constructorArgs = arguments[0] || {};

var rightButtonEvent = null,
	leftButtonEvent = null;

$.update = function(_args) {
	var a = Ti.UI.createAnimation({
		opacity: 0,
		duration: 250
	});
	$.wrapper.animate(a);

	a.addEventListener("complete", function() {
		$.title.text = _args.title;
		if(_args.title == "") {
			$.caretIcon.width = 0;
		} else {
			$.caretIcon.width = 10;
		}

		if(_args.itemCount && _args.itemCount != 0) {
			$.itemCountView.width = 44;
			$.lblItemCount.text = _args.itemCount;
			$.title.left = 10;
		} else {
			$.itemCountView.width = 0;
			$.lblItemCount.text = 0;
			$.title.left = 0;
		}

		if(rightButtonEvent) {
			$.rightNavButton.removeEventListener('click', rightButtonEvent);
			rightButtonEvent = null;
		}

		if(leftButtonEvent) {
			$.leftNavButton.removeEventListener('click', leftButtonEvent);
			leftButtonEvent = null;
		}

		$.rightNavButton.title = "";

		if(_args.rightNavButton) {
			if(_args.rightNavButton.type === "Delete" || _args.rightNavButton.type === "Cancel") {
				$.rightNavButton.title = _args.rightNavButton.type;
				$.rightNavButton.backgroundImage = "/service-outlet-detail/nav-btn-right-flex.png";
				$.rightNavButton.backgroundSelectedImage = "/service-outlet-detail/nav-btn-right-touch-flex.png";
				$.rightNavButton.width = 80;
			} else if(_args.rightNavButton.type === "Add") {
				$.rightNavButton.backgroundImage = "/my-service-outlets/add-task-btn.png";
				$.rightNavButton.backgroundSelectedImage = "/my-service-outlets/add-task-btn-touch.png";
				$.rightNavButton.width = 44;
			}
			$.rightNavButton.show();
			if(_args.rightNavButton.event) {
				rightButtonEvent = _args.rightNavButton.event;
				$.rightNavButton.addEventListener('click', rightButtonEvent);
			}
		} else {
			$.rightNavButton.hide();
		}

		if(_args.leftNavButton) {
			if(_args.leftNavButton.type === "Back") {
				$.leftNavButton.title = _args.leftNavButton.title;
				$.leftNavButton.backgroundImage = "/service-outlet-detail/nav-btn-left-flex.png";
				$.leftNavButton.backgroundSelectedImage = "/service-outlet-detail/nav-btn-lefttouch-flex.png";
				$.leftNavButton.width = Ti.UI.SIZE;
			} else if(_args.leftNavButton.type === "Save") {
				$.leftNavButton.title = _args.leftNavButton.type;
				$.leftNavButton.backgroundImage = "/service-outlet-detail/nav-btn-right-flex.png";
				$.leftNavButton.backgroundSelectedImage = "/service-outlet-detail/nav-btn-right-touch-flex.png";
				$.leftNavButton.width = 70;
			}
			$.leftNavButton.show();
			if(_args.leftNavButton.event) {
				leftButtonEvent = _args.leftNavButton.event;
				$.leftNavButton.addEventListener('click', leftButtonEvent);
			}
		} else {
			$.leftNavButton.hide();
		}

		$.wrapper.animate({
			opacity: 1,
			duration: 250
		})
	});
};

$.update(_constructorArgs);