/* global module, require */

var notify = require('gulp-notify');

module.exports = function() {
  "use strict";

  notify.onError({
    title: 'Compile Error',
    message: "<%= error %>"
  }).apply(this, arguments);

  this.emit('end');
};
