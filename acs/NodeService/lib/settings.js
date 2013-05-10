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
		appkey: '[REPLACE THIS VALUE WITH YOUR OWN]',
		key: '[REPLACE THIS VALUE WITH YOUR OWN]',
		secret: '[REPLACE THIS VALUE WITH YOUR OWN]'
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
