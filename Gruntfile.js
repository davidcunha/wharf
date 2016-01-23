'use strict';

module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-express-server');
  grunt.loadNpmTasks('grunt-mocha-cov');
  grunt.loadNpmTasks('grunt-exec');

  grunt.initConfig({
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
        jshintrc: true
      }
    },
    watch: {
      express: {
        files:  ['<%= jshint.files %>'],
        tasks:  ['express:dev', 'jshint'],
        options: {
          spawn: false
        }
      },
      test: {
        files: 'test/*/*.js',
        tasks: ['test']
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
    process.env.APP_ENV   = 'development';
    grunt.log.writeln('Loading Development environment...');
  });

  grunt.registerTask('env:test', 'Load Test Environment', function() {
    process.env.NODE_PATH = 'lib';
    process.env.APP_ENV   = 'test';
    grunt.log.writeln('Loading Test environment...');
  });

  grunt.registerTask('default', ['env:dev', 'express:dev', 'jshint', 'watch']);
  grunt.registerTask('test', ['env:test', 'mochaTest']);
};
