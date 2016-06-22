
module.exports = function (grunt) { //Rör ej denna!

	//Konfig
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		uglify: {
			dev: {
				options: {
					beautify: true,
					mangle: false,
					compress: false,
					preserveComments: 'all'
				},
				src: 'src/js/*.js',
				dest: 'js/script.min.js'
			},
			build: {
				src: 'src/js/*.js',
				dest: 'js/script.min.js'
			}
		},

		sass: {
			dev: {
				options: {
					outputstyle: 'expanded'
				},
				files:{
					'css/style.css': 'src/scss/style.scss'
				}
			},
			build: {
				options: {
					outputstyle: 'compressed'
				},
				files: {
					'css/style.css': 'src/scss/style.scss'
				}
			}
		},

		postcss: {
			options: {
				map: false,
				processors: [
					require('pixrem')(),
					require('autoprefixer')({browsers: 'last 2 versions'}),
					require('cssnano')()
				]
			}
			build: {
				src: 'css/*.css'
			}
		},

		watch: {
			js: {
				files: ['src/js/*.js'],
				tasks: ['uglify:dev']
			},
			sass:{
				files: ['src/scss/*.scss'],
				tasks: ['sass:dev']
			}
		}
	});

	//Ladda
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-sass');
	grunt.loadNpmTasks('grunt-postcss');
	grunt.loadNpmTasks('grunt-contrib-watch');

	//Registrera
	grunt.registerTask('default', ["uglify:dev", "sass:dev"]);
	grunt.registerTask('build', ['uglify:build', 'sass:build', 'postcss:build']);

};