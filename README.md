# B3

B3 is a Backbone.js starter theme for WordPress.

It is designed as a launchpad for your own cutting edge themes: so clone it, rename it, hack it and republish it.

## Getting Started

This brief guide assumes you have at least some familiarity with WordPress and JavaScript development.  We fully intend to make this process as painless as possible, but we still have a few critical features taking precedence.

1. Install and activate the [WP API](https://wordpress.org/plugins/json-rest-api/) plugin.
2. Make sure [pretty permalinks are enabled](http://codex.wordpress.org/Using_Permalinks) on your WordPress install. They are required for the REST API to work.
3. Clone the [B3 REST API Extensions](https://github.com/B3ST/B3-REST-API) repository into your plugins folder and activate the plugin:

    $ cd your/wordpress/install/wp-content/plugins
    $ git clone https://github.com/B3ST/B3-REST-API.git b3-rest-api

4. Clone this repository into your themes folder:

    $ cd your/wordpress/install/wp-content/themes
    $ git clone https://github.com/B3ST/B3.git b3

5. We're not done yet, first we need to install required Node dependencies and build the theme using Gulp:

    $ cd b3
    $ npm install -g gulp bower
    $ npm install
    $ gulp build

6. Activate the theme. You're ready to start hacking!

Please bear in mind that B3 is a work in progress and can't (yet) be considered ready for production use.

## Build Automation

B3 is bundled with a number of [Gulp](http://gulpjs.com/) tasks to automate building and testing:

* `gulp build`: Builds the theme application.
* `gulp clean`: Removes all compiled files, leaving only the original sources.
* `gulp rebuild`: Builds the theme application from scratch.
* `gulp test`: Runs automated tests (JavaScript and PHP).
* `gulp watch`: Watches your codebase for changes, triggering a partial rebuild and refreshing the browser.

### Extra Tasks

* `gulp bower`: Installs Bower dependencies. This runs on `build`.
* `gulp build:fonts`: Deploys font assets to the public application folder.
* `gulp build:images`: Compresses image assets and deploys them to the public application folder.
* `gulp build:scripts`: Compiles, minifies and deploys JavaScript sources.
* `gulp build:styles`: Compiles, lints, minifies and deploys LESS styles as CSS.
* `gulp build:templates`: Compiles and deploys [Dust.js](https://linkedin.github.io/dustjs/) templates.
* `gulp jasmine`: Runs automated Jasmine tests only.
* `gulp jshint`: Lints JavaScript sources.
* `gulp phpunit`: Runs automated PHPUnit tests only.

We don't use Grunt, so it's not (yet) supported.  We welcome your pull requests, though!

## Licensing

B3 is released under an MIT license. This is to make sure you don't run into licensing issues should you decide to repackage portions of the project as a Phonegap/Cordova application.
