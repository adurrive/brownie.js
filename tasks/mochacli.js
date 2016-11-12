'use strict';

module.exports = function mochacli(grunt) {
  // Load task
  grunt.loadNpmTasks('grunt-mocha-cli');

  // Options
  return {
    src: ['test/**/*.js']
  };
};
