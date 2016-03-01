'use strict';

module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-express-server');
  grunt.loadNpmTasks('grunt-mocha-cov');
  grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-notify');

  grunt.initConfig({
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
      files: ['Gruntfile.js', 'index.js', 'lib/**/*.js', 'config/**/*.js'],
      options: {
        jshintrc: true,
        ignores: ['lib/public/assets/*.js']
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
        files: 'test/**/*.js',
        tasks: ['test', 'notify:test']
      },
      css: {
        files: 'lib/public/css/**/*.scss',
        tasks: ['sass', 'cssmin', 'notify:server']
      },
      js: {
        files: 'lib/public/js/**/*.js',
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
        src: 'lib/public/js/wharf.js',
        dest: 'lib/public/assets/wharf.js'
      }
    },
    uglify: {
      my_target: {
        options: {
          sourceMap: true,
          sourceMapName: 'lib/public/assets/wharf.min.js.map',
          mangle: false
        },
        files: {
          'lib/public/assets/wharf.min.js': 'lib/public/assets/wharf.js'
        }
      }
    },
    sass: {
      options: {
        sourceMap: true
      },
      dist: {
        files: {
          'lib/public/assets/wharf.css': 'lib/public/css/wharf.scss'
        }
      }
    },
    cssmin: {
      options: {
        sourceMap: true
      },
      target: {
        files: {
          'lib/public/assets/wharf.min.css': 'lib/public/assets/wharf.css'
        }
      }
    },
    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
          clearRequireCache: true
        },
        src: ['test/**/*.js']
      }
    },
    mochacov: {
      options: {
        reporter: 'html-cov'
      },
      all: ['test/**/*.js']
    },
    exec: {
      coverage: {
        cmd: 'grunt mochacov > ./test/coverage.html'
      }
    }
  });

  grunt.registerTask('env:dev', 'Load Dev Environment', function() {
    process.env.NODE_PATH = 'lib';
    process.env.APP_ENV = 'development';
    grunt.log.writeln('Loading Development environment...');
  });

  grunt.registerTask('env:test', 'Load Test Environment', function() {
    process.env.NODE_PATH = 'lib';
    process.env.APP_ENV = 'test';
    grunt.log.writeln('Loading Test environment...');
  });

  grunt.registerTask('default', ['env:dev', 'express:dev', 'jshint', 'watch']);
  grunt.registerTask('test', ['env:test', 'mochaTest', 'notify:test']);
};
