/*
 * settings.js: file to set settings for the application
 *
 * Copyright (c) 2012, Appcelerator, Inc.  All Rights Reserved.
 * See the LICENSE file for more information.
 */

var OBJ = {
	title: "Appcelerator Administration",
	api: {
		adapter: 'undefined',
		catalog: 'catalog',
		assignments: 'assignments',
		files: 'files',
		outlets: 'outlets',
		tasks: 'tasks'
	},
	credentials: {
		appkey: '[REPLACE WITH acs-api-key-development FROM tiapp.xml]',
		key: '',
		secret: ''
	}
};

/*
 * exports.load()
 * 
 * return {Object} OBJ 
 */
exports.load = function() {
	return OBJ;
};

/*
 * exports.updateAdapter()
 * params  {String} value
 * return {String} 
 */
exports.updateAdapter = function(value) {
	OBJ.api.adapter = value;
};
