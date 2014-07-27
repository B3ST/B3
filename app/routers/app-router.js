/* globals define */

define([
  'marionette',
  'controllers/controller'
], function(Marionette, Controller) {
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
