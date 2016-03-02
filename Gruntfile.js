'use strict';

module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-express-server');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-notify');
  grunt.loadNpmTasks('grunt-exec');

  grunt.initConfig({
    exec: {
      electron: {
        cmd: 'electron index.js & grunt watch'
      }
    },
    notify: {
      server: {
        options: {
          message: 'Server ready!'
        }
      },
      test: {
        options: {
          message: 'Test suite executed!'
        }
      }
    },
    express: {
      dev: {
        options: {
          script: 'index.js'
        }
      }
    },
    jshint: {
      files: ['Gruntfile.js', 'index.js', './src/**/*.js'],
      options: {
        jshintrc: true,
        ignores: ['./src/public/assets/*.js']
      }
    },
    watch: {
      express: {
        files:  ['<%= jshint.files %>'],
        tasks:  ['express:dev', 'jshint', 'notify:server'],
        options: {
          spawn: false
        }
      },
      test: {
        files: './test/**/*.js',
        tasks: ['test', 'notify:test']
      },
      css: {
        files: './src/public/css/**/*.scss',
        tasks: ['sass', 'cssmin', 'notify:server']
      },
      js: {
        files: './src/public/js/**/*.js',
        tasks: ['browserify', 'uglify:my_target']
      }
    },
    browserify: {
      main: {
        browserifyOptions: {
          bundleOptions: {
            debug: true
          }
        },
        src: './src/public/js/wharf.js',
        dest: './src/public/assets/wharf.js'
      }
    },
    uglify: {
      my_target: {
        options: {
          sourceMap: true,
          sourceMapName: './src/public/assets/wharf.min.js.map',
          mangle: false
        },
        files: {
          './src/public/assets/wharf.min.js': './src/public/assets/wharf.js'
        }
      }
    },
    sass: {
      options: {
        sourceMap: true
      },
      dist: {
        files: {
          './src/public/assets/wharf.css': './src/public/css/wharf.scss'
        }
      }
    },
    cssmin: {
      options: {
        sourceMap: true
      },
      target: {
        files: {
          './src/public/assets/wharf.min.css': './src/public/assets/wharf.css'
        }
      }
    },
    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
          clearRequireCache: true
        },
        src: ['./test/**/*.js']
      }
    }
  });

  grunt.registerTask('env:dev', 'Load Dev Environment', function() {
    grunt.log.writeln('Loading Development environment...');
    process.env.APP_ENV = 'development';
  });

  grunt.registerTask('env:test', 'Load Test Environment', function() {
    grunt.log.writeln('Loading Test environment...');
    process.env.APP_ENV = 'test';
  });

  grunt.registerTask('default', ['env:dev', 'express:dev', 'jshint', 'exec:electron']);
  grunt.registerTask('test', ['env:test', 'mochaTest', 'notify:test']);
};
