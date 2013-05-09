Alloy.Globals.MainController = $;

Alloy.Globals.MainWindow = $.mainWindow;

Alloy.Globals.MainWindow.open();

login();

//Create and display login widget
function login(params) {
	Alloy.Globals.Login = Alloy.createWidget("com.appcelerator.acslogin");
	if(params && params.hidden) {
		Alloy.Globals.Login.getView().applyProperties({
			transform: Ti.UI.create2DMatrix({
				scale: 0.5
			}),
			opacity: 0.0
		});
	}
	Alloy.Globals.MainWindow.add(Alloy.Globals.Login.getView());
	Alloy.Globals.Login.init({
		loginCallback: initHome
	});
}

//Initialize the home screen on successful login
function initHome(user) {
	var api = require("fieldServiceApi");
	api.setAuth({
		userID: user.id,
		user: user
	});

	Alloy.Globals.MyOutlets = Alloy.createController("/my-service-outlets/myServiceOutlets");
}

//Logout, destroy home screen and display login
function logout() {
	var Cloud = require("ti.cloud");
	Cloud.Users.logout(function(e) {
		if(e.success) {
			var api = require("fieldServiceApi");
			api.setAuth("clear");

			login({
				hidden: true
			});

			Alloy.Globals.MyOutlets.getView().animate({
				transform: Ti.UI.create2DMatrix({
					scale: 0.5
				}),
				opacity: 0.0,
				duration: 1000
			}, function() {
				Alloy.Globals.MainWindow.remove(Alloy.Globals.MyOutlets.getView());
				Alloy.Globals.MyOutlets = null;
			});
			setTimeout(function() {
				Alloy.Globals.Login.getView().animate({
					transform: Ti.UI.create2DMatrix({
						scale: 1.0
					}),
					opacity: 1.0,
					duration: 1000
				});
			}, 500);

		} else {
			alert('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
		}
	});

}

//Exported functions
$.logout = logout;
$.initHome = initHome;