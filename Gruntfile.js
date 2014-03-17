module.exports = function(grunt) {
    // https://github.com/sindresorhus/load-grunt-tasks
    require('load-grunt-tasks')(grunt);
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        watch: {
            options: {
                spawn: false
            },
            js: {
                files: ['!**/node_modules/**', '!**/bower_components/**', 'ui/js/*.js', '*.json', 'Gruntfile.js'],
                tasks: ['jshint', 'jsbeautifier', 'copy:js'],
                options: {
                    livereload: true
                }
            },
            less: {
                files: ['ui/less/*.less'],
                tasks: ['less:development', 'copy:css'],
                options: {
                    livereload: true
                }
            },
            html: {
                files: ['!**/node_modules/**', '!**/bower_components/**', '!**/_site/bower_components/**', '**/*.html'],
                tasks: ['jekyll:dist'],
                options: {
                    livereload: true,
                    debounceDelay: 300,
                }
            }
        },
        less: {
            options: {},
            development: {
                files: [{
                    expand: true,
                    cwd: 'ui/less/',
                    //src: ['**/*.less'],
                    src: ['styles.less'],
                    dest: 'ui/css/',
                    ext: '.css',
                    report: 'min'
                }]
            },
            production: {}
        },
        copy: {
            css: {
                files:
                // includes files within path
                [{
                    expand: true,
                    src: ['ui/css/*'],
                    dest: '_site/',
                    filter: 'isFile'
                }]
            },
            js: {
                files:
                // includes files within path
                [{
                    expand: true,
                    src: ['ui/js/*'],
                    dest: '_site/',
                    filter: 'isFile'
                }]
            }
        },
        jshint: {
            options: {
                force: true
            },
            all: ['!**/node_modules/**', '!**/bower_components/**', 'ui/js/*.js', '*.json', 'Gruntfile.js'],
        },
        jsbeautifier: {
            files: ['!**/node_modules/**', '!**/bower_components/**', 'ui/js/*.js', '*.json', 'Gruntfile.js']
        },
        jekyll: { // Task
            options: { // Universal options
            },
            dist: { // Target
                options: { // Target options
                    config: '_config.yml,_config.dev.yml'
                }
            },
            serve: { // Another target
                options: {
                    drafts: true,
                    serve: true
                }
            }
        },
        connect: {
            server: {
                options: {
                    port: 4000,
                    base: '_site'
                }
            }
        }
    });

    // Default task(s).
    grunt.registerTask('default', ['serve']);

    grunt.registerTask('serve', function(target) {
        grunt.task.run([
            'connect',
            'less:development',
            'jshint',
            'jekyll:dist',
            'watch'
        ]);
    });
};
