# B3

B3 is a Backbone.js starter theme for WordPress.

It is designed as a launchpad for your own cutting edge themes: so clone it, rename it, hack it and republish it.

## Warning

**The official WP API is undergoing substantial changes and may break compatibility with B3 at any time.**

It is recommended that you either use [the version on WordPress.org](https://wordpress.org/plugins/json-rest-api/) or at the very least stick to the [master branch](https://github.com/WP-API/WP-API) in order to minimize issues.

Also, please bear in mind that B3 is a work in progress and can't (yet) be considered ready for production use. Do so at your own risk.

## Getting Started

This brief guide assumes you have at least some familiarity with WordPress and JavaScript development.  We fully intend to make this process as painless as possible, but we still have a few critical features taking precedence.

1. Install and activate the [WP API](https://wordpress.org/plugins/json-rest-api/) plugin.
2. Make sure [pretty permalinks are enabled](http://codex.wordpress.org/Using_Permalinks) on your WordPress install. They are required for the REST API to work.
3. Clone the [B3 REST API Extensions](https://github.com/B3ST/B3-REST-API) repository into your plugins folder and activate the plugin:

    ```
    $ cd your/wordpress/install/wp-content/plugins
    $ git clone https://github.com/B3ST/B3-REST-API.git b3-rest-api
    ```

4. Clone this repository into your themes folder:

    ```
    $ cd your/wordpress/install/wp-content/themes
    $ git clone https://github.com/B3ST/B3.git b3
    ```

5. We're not done yet, we still need to install required Node dependencies (the theme is built automatically at the end):

    ```
    $ cd b3
    $ npm install -g gulp bower requirejs
    $ npm install
    ```

6. Activate the theme. You're ready to start hacking!

## Build Automation

B3 is bundled with a number of [Gulp](http://gulpjs.com/) tasks to automate building and testing:

* `gulp build`: Builds the theme application.
* `gulp watch`: Watches your codebase for changes, triggering a partial rebuild and refreshing the browser.
* `gulp jasmine`: Runs automated Jasmine tests in the browser, with support for live updates.
* `gulp phpunit`: Runs automated PHPUnit tests in the terminal.

### Extra Tasks

* `gulp bower`: Installs Bower dependencies. This runs on `build`.
* `gulp build:fonts`: Deploys font assets to the public application folder.
* `gulp build:images`: Compresses image assets and deploys them to the public application folder.
* `gulp build:scripts`: Compiles, minifies and deploys JavaScript sources.
* `gulp build:styles`: Compiles, lints, minifies and deploys LESS styles as CSS.
* `gulp build:templates`: Compiles and deploys [Dust.js](https://linkedin.github.io/dustjs/) templates.
* `gulp clean`: Removes all compiled files, leaving only the original sources.
* `gulp jshint`: Lints JavaScript sources.
* `gulp rebuild`: Builds the theme application from scratch.

We don't use Grunt, so it's not (yet) supported.  We welcome your pull requests, though!

### Build Configuration

Gulp task parameters (such as file paths and BrowserSync configurations) are provided in a centralized file located at _gulp/config.js_.

### Optimization

By default, the provided Gulp tasks will minify scripts but not concatenate them, leading to dozens of files being requested to the server.

To avoid this, theme modules can be bundled for deployment using the [RequireJS Optimizer](http://requirejs.org/docs/optimization.html).

The easiest and fastest way to do this is using the [r.js](https://github.com/jrburke/r.js) command line utility. If you completed the installation steps at the start of this guide, you should already have it. To package the site for deployment, open a terminal at the theme's root folder and enter:

```
$ r.js -o build.js
```

This will convert most scripts in your theme's _dist_ folder into concatenated versions.

Most scripts will go into _main.js_, the same file your un-optimized theme would load on launch. Files that for any reason were not concatenated into _main.js_ will remain in their original places, ensuring the theme is still able to find them.

External libraries will be combined as _infrastructure.js_. This file will likely be larger than your theme, but also less likely to change over time, and so it makes sense to keep it separate to make the most of browser and CDN caches.

## Licensing

B3 is released under an MIT license. This is to make sure you don't run into licensing issues should you decide to repackage portions of the project as a Phonegap/Cordova application.
