module.exports = function(grunt) {
	
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-http');
	grunt.loadNpmTasks('grunt-html2js');
	grunt.loadNpmTasks('grunt-ngmin');
	grunt.loadNpmTasks('grunt-recess');

	grunt.initConfig({

		files: {
			vendor: {
				js: [
					'src/vendor/ng-file-upload/angular-file-upload-html5-shim.min.js',
					'src/vendor/jquery/dist/jquery.min.js',
					'src/vendor/jquery-ui/ui/minified/jquery-ui.min.js',
					'src/vendor/angular/angular.min.js',
					'src/vendor/angular-resource/angular-resource.min.js',
					'src/vendor/angular-bootstrap/ui-bootstrap-tpls.min.js',
					'src/vendor/angular-ui-router/release/angular-ui-router.min.js',
					'src/vendor/angular-ui-sortable/sortable.min.js',
					'src/vendor/ng-file-upload/angular-file-upload.min.js',
					'src/vendor/codemirror/lib/codemirror.js',
					'src/vendor/codemirror/mode/xml/xml.js',
					'src/vendor/codemirror/mode/css/css.js',
					'src/vendor/codemirror/mode/less/less.js',
					'src/vendor/codemirror/mode/javascript/javascript.js',
					'src/vendor/codemirror/mode/htmlmixed/htmlmixed.js',
					'src/vendor/codemirror/addon/display/fullscreen.js',
					'src/vendor/angular-ui-codemirror/ui-codemirror.js'
				],
				css: [
				]
			}
		},

		pkg: grunt.file.readJSON('package.json'),
		
		concat: {
			options: {
				// define a string to put between each file in the concatenated output
				//separator: ';'
				separator: grunt.util.linefeed + ';' + grunt.util.linefeed
			},
			dist: {
				// the files to concatenate
				src: ['build/app/**/*.js'],
				// the location of the resulting JS file
				dest: 'bin/<%= pkg.name %>.js'
			},
			vendor_js: {
				src: '<%= files.vendor.js %>',
				dest: 'bin/assets/core9-admin-cms-0.0.1.js'
			}
		},
		
		copy: {
			build_js: {
				files: [{
					src: ['**/*.js'],
					dest: 'build/app',
					cwd: 'src/app',
					expand: true
				}]
			}
		},

		html2js: {
			app: {
				options: {
					base: 'src/app',
					module: 'templates-<%= pkg.name %>'
				},
				src: [ 'src/app/**/*.tpl.html' ],
				dest: 'build/app/templates.js'
			}
		},

		uglify: {
			compile: {
				options: {
					banner: '// Core9 - Module: <%= pkg.name %>\n'
				},
				files: {
					'<%= concat.dist.dest %>': '<%= concat.dist.dest %>'  
				}
			}
		},

		ngmin: {
			compile: {
				files: [{
					src: [ '**/*.js' ],
					cwd: 'build/app',
					dest: 'build/app',
					expand: true
				}]
			}
		},

		recess: {
			dist: {
				options: {
					compile: true
				},
				files: {
					'bin/assets/core9-admin-cms-0.0.1.css': [
						'src/vendor/codemirror/lib/codemirror.css',
						'src/vendor/codemirror/addon/display/fullscreen.css',
						'src/assets/less/main.less'
					]
				}
			}
		},

		jshint: {
			src: ['src/app/**/*.js'],
			gruntfile: ['gruntfile.js'],
			options: {
				curly: true,
				immed: true,
				newcap: true,
				noarg: true,
				sub: true,
				boss: true,
				eqnull: true
			},
			globals: {}
		},


		delta: {
			options: {
				livereload: true
			},

			gruntfile: {
				files: 'gruntfile.js',
				tasks: [ 'jshint:gruntfile' ],
				options: {
					livereload: false
				}
			},

			less: {
				files: ['src/assets/**/*.less'],
				tasks: ['recess', 'http:css']
			},

			jssrc: {
				files: ['src/app/**/*.js'],
				tasks: ['jshint:src', 'copy:build_js', 'ngmin', 'concat', 'http:module']
			},

			tpls: {
				files: ['src/app/**/*.tpl.html'],
				tasks: ['html2js', 'ngmin', 'concat', 'http:module']
			},
		},

		http: {
			module: {
				options: {
					url: 'http://localhost:8080/admin/files/<%= pkg.id %>?contents',
					method: 'PUT',
					json: {
						content: "content"
					},
					sourceField: 'json.content'
				},
				files: {
					'bin/<%= pkg.name %>.js': 'bin/<%= pkg.name %>.js'
				}
			},
			lib: {
				options: {
					url: 'http://localhost:8080/admin/files/<%= pkg.lib_id %>?contents',
					method: 'PUT',
					json: {
						content: "content"
					},
					sourceField: 'json.content'
				},
				files: {
					'bin/assets/core9-admin-cms-0.0.1.js': 'bin/assets/core9-admin-cms-0.0.1.js'
				}
			},
			css: {
				options: {
					url: 'http://localhost:8080/admin/files/<%= pkg.css_id %>?contents',
					method: 'PUT',
					json: {
						content: "content"
					},
					sourceField: 'json.content'
				},
				files: {
					'bin/assets/core9-admin-cms-0.0.1.css': 'bin/assets/core9-admin-cms-0.0.1.css'
				}
			}
		},
		
		clean: ['build']
	});
	grunt.renameTask('watch','delta');
	grunt.registerTask('watch', ['build', 'delta']);
	grunt.registerTask('build', ['clean', 'recess', 'copy:build_js', 'html2js', 'ngmin', 'concat', 'uglify', 'http:module', 'http:lib', 'http:css']);
	grunt.registerTask('default', ['build']);
};