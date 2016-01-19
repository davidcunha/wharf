'use strict';

module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-express-server');
  grunt.loadNpmTasks('grunt-mocha-cov');

  grunt.initConfig({
    express: {
      dev: {
        options: {
          script: 'index.js'
        }
      }
    },
    jshint: {
      files: ['Gruntfile.js', 'index.js', 'lib/**/*.js'],
      options: {
        globals: {
          jQuery: true
        },
        jshintrc: true
      }
    },
    watch: {
      gruntfile: {
        files: 'Gruntfile.js',
        tasks: ['jshint:gruntfile'],
      },
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
          captureFile: 'results.txt',
          quiet: false,
          clearRequireCache: false
        },
        src: ['test/**/*.js']
      }
    },
    mochacov: {
      options: {
        reporter: 'html-cov'
      },
      all: ['test/**/*.js']
    }
  });

  grunt.registerTask('default', ['express:dev', 'jshint', 'watch']);
  grunt.registerTask('test', ['mochaTest', 'mochacov']);
};
