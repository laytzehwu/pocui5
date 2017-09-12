module.exports = function (grunt) {
	// Project configuration.
	grunt.initConfig({
		mySetting: {
			localJavaPort: '8080' // Port where tomcat is using
		},
		
        watch: {
            livereload: {
                options: {
                    livereload: "<%= connect.settings.livereload %>"
                },
                files: ["webapp/test.html", "webapp/manifest.json", "webapp/**/*.js", "webapp/**/*.xml", "!node_modules/**"]
            }
        },
		
        open: {
            root: {
                path: "http://<%= connect.settings.hostname %>:<%= connect.settings.port %>",
                app: "Chrome",
                options: {
                    delay: 500
                }
            }
        },
		
		connect: {
			settings: {
				port: 9090,
				livereload: 35729,
				hostname: "localhost",
				base: "./webapp"
			}
		}
		
	});
}