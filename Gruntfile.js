var path = require('path');

module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    copy: {
      vendor: {
        files: [
          {
            expand: true, cwd: 'bower_components/bootstrap/',
            src: ['js/**', 'less/**'], dest: 'public/vendor/bootstrap/'
          },
          {
            expand: true, cwd: 'bower_components/bootstrap-js-dropdown/',
            src: ['**/*.js'], dest: 'public/vendor/bootstrap-js-dropdown'
          },
          {
            expand: true, cwd: 'bower_components/backbone/',
            src: ['backbone.js'], dest: 'public/vendor/backbone/'
          },
          {
            expand: true, cwd: 'bower_components/backbone.babysitter/lib',
            src: ['backbone.babysitter.js'], dest: 'public/vendor/backbone/'
          },
          {
            expand: true, cwd: 'bower_components/backbone.marionette/lib',
            src: ['backbone.marionette.js'], dest: 'public/vendor/backbone/'
          },
          {
            expand: true, cwd: 'bower_components/jquery/dist/',
            src: ['jquery.js'], dest: 'public/vendor/jquery/'
          },
          {
            expand: true, cwd: 'bower_components/requirejs/',
            src: ['require.js'], dest: 'public/vendor/requirejs/'
          },
          {
            expand: true, cwd: 'bower_components/underscore/',
            src: ['underscore.js'], dest: 'public/vendor/underscore/'
          },
          {
            expand: true, cwd: 'bower_components/bootstrap/dist/css',
            src: ['**/*.css', '**/*.css.map', '**/*.min.css'], dest: 'public/css'
          }
        ]
      }
    },
    concurrent: {
      dev: {
        tasks: ['nodemon', 'watch'],
        options: {
          logConcurrentOutput: true
        }
      }
    },
    nodemon: {
      dev: {
        script: 'app.js',
        options: {
          ignore: [
            'node_modules/**',
            'public/**'
          ],
          ext: 'js'
        }
      }
    },
    watch: {
      clientJS: {
         files: [
          'public/private/**/*.js', '!public/**/*.min.js',
          'public/public/**/*.js', '!public/**/*.min.js'
         ],
         tasks: ['newer:uglify', 'newer:jshint:client']
      },
      serverJS: {
         files: ['private/**/*.js','views/**/*.jade'],
         tasks: ['newer:jshint:server']
      },
      clientLess: {
         files: [
          'public/less/**/*.less'
         ],
         tasks: ['newer:less']
      }
    },
    uglify: {
      options: {
        sourceMap: true,
        sourceMapName: function(filePath) {
          return filePath + '.map';
        }
      },
      layouts: {
        files: {
          'public/js/index.min.js': [
            'public/js/index.js'
          ],
          'public/js/core.min.js': [
            'public/vendor/jquery/jquery.js',
            'public/vendor/underscore/underscore.js',
            'public/vendor/backbone/backbone.js',
            'public/vendor/backbone/backbone.marionette.js',
            'public/vendor/backbone/backbone.babysitter.js',
            'public/vendor/requirejs/require.js',
            'public/vendor/bootstrap/js/dropdown.js',
            'public/vendor/momentjs/moment.js'
          ],
          'public/js/widget/item/main.min.js': ['public/js/widget/item/main.js']
        }
      },
      views: {
        files: [{
          expand: true,
          cwd: 'public/js/',
          src: ['**/*.js', '!**/*.min.js'],
          dest: 'public/js/',
          ext: '.min.js'
        }]
      }
    },
    jshint: {
      client: {
        options: {
          jshintrc: '.jshintrc-client',
          ignores: [
            'public/public/**/*.min.js'
          ]
        },
        src: [
          'public/public/js/**/*.js'
        ]
      },
      server: {
        options: {
          jshintrc: '.jshintrc-server'
        },
        src: [
          'private/**/*.js'
        ]
      }
    },
    less: {
      options: {
        compress: true
      },
      layouts: {
      },
      views: {
        files: [{
          expand: true,
          cwd: 'public/less',
          src: ['**/*.less'],
          dest: 'public/css',
          ext: '.min.css'
        }]
      }
    },
    clean: {
      js: {
        src: [
          'public/public/js/**/*.min.js',
          'public/public/js/**/*.min.js.map'
        ]
      },
      css: {
        src: [
          'public/css/**/*.min.css'
        ]
      },
      vendor: {
        src: ['public/vendor/**']
      }
    },
    // Configure a mochaTest task
    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['{public,private}/**/test/**/*.js']
      }
    },
    '--': '$(ps aux | grep "node app.js" | grep -v "grep"); kill -s USR1 $2'
  });

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-newer');
  grunt.loadNpmTasks('grunt-mocha-test');

  grunt.registerTask('default', ['copy:vendor', 'newer:uglify', 'newer:less', 'concurrent', 'mochaTest']);
  grunt.registerTask('build', ['copy:vendor', 'uglify', 'less']);
  grunt.registerTask('lint', ['jshint']);
};
