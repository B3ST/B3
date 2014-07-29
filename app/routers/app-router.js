/* globals define */

define([
  'marionette'
], function (Marionette) {
  'use strict';

  return Marionette.AppRouter.extend({
    appRoutes: {
      ""                             : "showHome",
      "page/:page"                   : "showArchive",
      "post/category/:cat"           : "showPostByCategory",
      "post/category/:cat/page/:page": "showPostByCategory",
      "post/tag/:tag"                : "showPostByTag",
      "post/tag/:tag/page/:page"     : "showPostByTag",
      "post/:slug/page/:page"        : "showPostBySlug",
      "post/:slug"                   : "showPostBySlug",
      "post/:id"                     : "showPostById",
      "*slug"                        : "showPageBySlug"
    }
  });
});
