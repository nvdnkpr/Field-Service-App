// initialize app
function start(app, express) {
	app.use(express.methodOverride());
	app.use(express.bodyParser());
	app.use(express.cookieParser());
	app.use(express.session({
		key: 'node.acs',
		secret: '[REPLACE THIS VALUE WITH YOUR OWN]'
	}));
	app.use(express.favicon(__dirname + '/public/images/favicon.ico')); //set favicon
}

// release resources
function stop() {

}
