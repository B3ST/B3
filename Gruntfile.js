module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    requirejs: {
      mainJS: {
        options: {
          baseUrl: ".",
          paths: {
            "app": "app/config/init"
          },
          wrap: true,
          name: "node_modules/almond/almond",
          preserveLicenseComments: false,
          optimize: "uglify",
          mainConfigFile: "app/config/init.js",
          include: ["app"],
          out: "app/config/init.min.js"
        }
      },
      mainCSS: {
        options: {
          optimizeCss: "standard",
          cssIn: "./styles/*.css",
          out: "./style.css"
        }
      }
    },
    jshint: {
      files: ['Gruntfile.js', 'app/**/*.js', '!app/**/*min.js'],
      options: {
        globals: {
          jQuery: true,
          console: false,
          module: true,
          document: true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.registerTask('test', ['jshint']);
  grunt.registerTask('build', ['requirejs:mainJS', 'requirejs:mainCSS']);
  grunt.registerTask('default', ['test', 'build']);

};