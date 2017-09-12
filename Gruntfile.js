module.exports = function (grunt) {
	// Project configuration.
	var gConfig = {};
	gConfig.mySetting = {
		localJavaPort: '8080', // Port where tomcat is using
		mockServicePath: '/destinations/carsdemo',
		localServicePath: '/olingo.odata2.sample.cars.web'
	};
	// Watch 
	gConfig.watch = {
		livereload: {
			options: {
				livereload: "<%= connect.settings.livereload %>"
			},
			files: ["webapp/test.html", "webapp/manifest.json", "webapp/**/*.js", "webapp/**/*.xml", "!node_modules/**"]
		}
    };
	
	// Prompt browser
	gConfig.open = {
		root: {
			path: "http://<%= connect.settings.hostname %>:<%= connect.settings.port %>",
			app: "Chrome",
			options: {
				delay: 500
			}
		}
	};
	
	// Connection settings
	var connect = {};
	gConfig.connect = connect;
	connect.settings = {
		port: 9090,
		livereload: 35729,
		hostname: "localhost",
		base: "./webapp"
	};
	var localServer = {
		options: {
			debug : true,
			hostname: 'localhost',
			keepalive: true,
			open: true,
			changeOrigin : true,
			middleware: function(connect, options, defaultMiddleware) {
				var proxy = require('grunt-connect-proxy/lib/utils').proxyRequest;
				return [proxy].concat(defaultMiddleware);
			}
		},
		proxies: []
	};
	connect.LocalServer = localServer;
	var proxy = {
		context: "<%= mySetting.mockServicePath %>",
		host: 'localhost',
		changeOrigin : true,
		https : true,
		port : '<%= mySetting.localJavaPort %>',
		rewrite: {}
	};
	localServer.proxies.push(proxy);
	proxy.rewrite['^' + gConfig.mySetting.mockServicePath] = gConfig.mySetting.localServicePath;

	// Live reload
	var livereload = {};
	connect.livereload = livereload;
	livereload.options = {
		middleware: function (connect, options) {
			if (!Array.isArray(options.base)) {
				options.base = [options.base];
			}

			// Setup the proxy
			var middlewares = [require('grunt-connect-proxy/lib/utils').proxyRequest];

			// Serve static files.
			options.base.forEach(function (base) {
				middlewares.push(connect.static(base));
			});

			// Make directory browse-able.
			var directory = options.directory || options.base[options.base.length - 1];
			middlewares.push(connect.directory(directory));
			
			return middlewares;
		}
	};
	connect.ui5preload = {
		default: {
			options: {
			},
			paths: [
			]
		}
	};
	
	grunt.initConfig(gConfig);

    // load provided tasks
    grunt.loadNpmTasks("grunt-open");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-connect-proxy");
    grunt.loadNpmTasks("grunt-contrib-connect");
	grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-eslint");
	grunt.loadNpmTasks('grunt-ui5');

    grunt.registerTask("serve", function () {
        grunt.task.run(["configureProxies:LocalServer", "connect:LocalServer", "connect:livereload", "open", "watch"]);
    });
}