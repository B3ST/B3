/* globals define */

define([
  'marionette'
], function(Marionette) {
  'use strict';
  return Marionette.AppRouter.extend({
    appRoutes: {
      ""                     : "showHome",
      "page/:page"           : "showArchive",
      "post/:slug/page/:page": "showPostBySlug",
      "post/:slug"           : "showPostBySlug",
      "post/:id"             : "showPostById",
      "*slug"                : "showPageBySlug"
    }
  });
});
