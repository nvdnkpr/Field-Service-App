/*
 * assignments.js: Controller for /api/assignments Endpoint
 *
 * Copyright (c) 2012, Appcelerator, Inc.  All Rights Reserved.
 * See the LICENSE file for more information.
 */

var ACS = require('acs').ACS;
var UTIL = require("../lib/utils");

var adapter_url = "../adapters/{adapter}/assignments";

function callAdapter(func, req, res) {
	// Determine what API we are using? ACS OR SALESFORCE
	ACS.KeyValues.get({
		name: "API"
	}, function(e) {
		if (e.success) {
			var adapterUrl = adapter_url.replace("{adapter}", e.keyvalues[0].value.toLowerCase());
			var API = require(adapterUrl);
			API && API[func](req, res);
		} else {
			res.write("{success: false, error: 'FAILURE GETTING API'}");
			res.end();
		}
	})
}

// CRUD Functions 

// GET
function get(req, res) {
	var func = arguments.callee.name;
	callAdapter(func, req, res);
};

// POST
function create(req, res) {
	var func = arguments.callee.name;
	callAdapter(func, req, res);
};

// PUT
function update(req, res) {
	var func = arguments.callee.name;
	callAdapter(func, req, res);
};

// DELETE
function del(req, res) {
	var func = arguments.callee.name;
	callAdapter(func, req, res);
};

//Custom Functions
function getdetail(req, res) {
	var func = arguments.callee.name;
	callAdapter(func, req, res);
};

function getstatus(req, res) {
	var func = arguments.callee.name;
	callAdapter(func, req, res);
};
