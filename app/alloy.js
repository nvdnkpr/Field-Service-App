var APP = {
	/**
	 * Holds data from the JSON config file
	 */
	ID: null,
	VERSION: null,
	LEGAL: {
		COPYRIGHT: null,
		TOS: null,
		PRIVACY: null,
	},
	COMPANY: "Appcelerator",
	TITLE: "",
	Settings: null,
	/**
	 * Setup the main content database
	 * @type {Object}
	 */
	MainWindow: null,
	/**
	 * Navigation Widget using for routing controllers
	 * @type {Object}
	 */
	Navigation: {},
	/**
	 * Initialize the application
	 * NOTE: This should only be fired in index controller file and only once.
	 * @type {Function}
	 */
	init: function() {
		// TODO: Sanity Check to make sure globals are set properly
		// Global system Events
		Ti.Network.addEventListener('change', _.bind(this.networkObserverUpdate, this));
		Ti.App.addEventListener('pause', _.bind(this.exit, this));
		Ti.App.addEventListener('close', _.bind(this.exit, this));
		Ti.App.addEventListener('resume', _.bind(this.resume, this));

		//  Initializing Navigational Widget
		this.Navigation.init({
			leftMenuController: 'leftMenu',
			rightMenuController: 'rightMenu',
		});
	},
	/**
	 * Loads in the appropriate controller and config data
	 */
	loadContent: function() {
		this.log('debug', 'APP.loadContent');

		var contentFile = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'app.json');

		if (!contentFile.exists()) {
			contentFile = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory + 'data/app.json');
		}

		var content = contentFile.read();
		var data;

		try {
			data = JSON.parse(content.text);
		} catch(_error) {
			this.log('error', 'Unable to parse downloaded JSON, reverting to packaged JSON');

			contentFile = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory + "data/app.json");
			content = contentFile.read();
			data = JSON.parse(content.text);
		}

		this.ID = data.id;
		this.VERSION = data.VERSION;
		this.LEGAL = {
			COPYRIGHT: data.legal.copyright,
			TOS: data.legal.terms,
			PRIVACY: data.legal.privacy,
		};
		this.ConfigurationURI = data.configurationURI && data.configurationUri.length > 10 ? data.configurationUri : false;
		this.Settings = data.settings;
	},
	/**
	 * Registers the app for push notifications
	 */
	registerPush: function() {
		this.log('debug', 'APP.registerPush');
	},
	/**
	 * Global network event handler
	 * @param {Object} _event Standard Ti callback
	 */
	networkObserverUpdate: function(_event) {
		this.log('debug', 'APP.networkObserverUpdate');
	},
	/**
	 * Exit event observer
	 */
	exit: function() {
		this.log('debug', 'APP.exit');
	},
	/**
	 * Resume event observer
	 */
	resume: function() {
		this.log('debug', 'APP.resume');
	},
	/**
	 * Pause event observer
	 */
	pause: function() {
		this.log('debug', 'APP.pause');
	},
	/**
	 * Logger utility for console data
	 */
	log: function(_serverity, _msg) {
		switch(_serverity.toLowerCase()) {
			case 'debug':
				Ti.API.info(_msg);
				break;
			case 'error':
				Ti.API.error(_msg);
				break;
			case 'info':
				Ti.API.info(_msg);
				break;
			case 'log':
				Ti.API.log(_msg);
				break;
			case 'trace':
				Ti.API.trace(_msg);
				break;
			case 'warn':
				Ti.API.warn(_msg);
				break;
		}
	}
};

Alloy.Globals.formatDate = function(date){
	var moment = require("alloy/moment");
	return moment(date).format("MM-DD-YYYY");
}
