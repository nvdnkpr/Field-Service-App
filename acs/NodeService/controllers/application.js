var settings = require('../lib/settings').load(),
	pageTitle = settings.title,
	menuSelect = "login",
	ACS = require('acs').ACS;

ACS.init(settings.credentials.appkey);

function index(req, res) {
	res.render('index', {
		title: pageTitle,
		menu: menuSelect
	});
};