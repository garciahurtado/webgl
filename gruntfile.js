'use strict';

module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);

  // Project Configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    nodemon: {
      dev: {
        script: 'server.js',
        options: {
          args: [],
          ignore: ['public/**', 'bower_components', 'node_modules'],
          ext: 'js,html',
          nodeArgs: ['--debug'],
          delayTime: 1,
          env: {
            PORT: 3000
          },
          cwd: __dirname
        }
      }
    },

    concurrent: {
      server: {
        tasks: ['nodemon'],
        options: {
          logConcurrentOutput: true
        }
      },
      compile: {
        tasks: ['compass']
      }
    },

    env: {
      test: {
        NODE_ENV: 'test'
      }
    }
  });

  //Default task(s).
  if (process.env.NODE_ENV === 'production') {
    grunt.registerTask('default', ['concurrent']);
  } else {
    grunt.registerTask('default', ['concurrent:server']);
  }
};
