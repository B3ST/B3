/* global define */

define([
  'controllers/command-bus'
], function (CommandBus) {
  'use strict';

  function handleProgress (evt) {
    if (evt.lengthComputable) {
      var percentComplete = evt.loaded / evt.total;
      CommandBus.execute('loading:progress', {value: percentComplete});
    }
  }

  return {
    xhr: function () {
      var xhr = $.ajaxSettings.xhr();
      xhr.onprogress = handleProgress;
      return xhr;
    }
  };
});