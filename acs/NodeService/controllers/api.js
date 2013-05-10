/*
 * create.js: Titanium iOS CLI create command
 *
 * Copyright (c) 2012, Appcelerator, Inc.  All Rights Reserved.
 * See the LICENSE file for more information.
 */

function timedisplay(req, res) {
	var myDate = new Date();
	res.json(myDate);
}
