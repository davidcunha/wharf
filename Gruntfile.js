module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-express-server');

  grunt.initConfig({
    express: {
      dev: {
        options: {
          script: 'app.js'
        }
      }
    },
    jshint: {
      files: ['Gruntfile.js', 'app.js', 'app/**/*.js', 'config/**/*.js'],
      options: {
        globals: {
          jQuery: true
        }
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
          spawn: false // for grunt-contrib-watch v0.5.0+, "nospawn: true" for lower versions. Without this option specified express won't be reloaded
        }
      },
      test: {
        files: 'tests/*/*.js',
        tasks: ['test']
      }
    },
    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
          captureFile: 'results.txt', // Optionally capture the reporter output to a file
          quiet: false, // Optionally suppress output to standard out (defaults to false)
          clearRequireCache: false // Optionally clear the require cache before running tests (defaults to false)
        },
        src: ['tests/**/*.js']
      }
    }
  });

  grunt.registerTask('default', ['express:dev', 'jshint', 'watch']);
  grunt.registerTask('test', ['mochaTest']);
};
