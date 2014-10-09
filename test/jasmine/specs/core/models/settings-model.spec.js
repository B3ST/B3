/* global define */

define([
  "models/settings-model"
], function(Settings) {
  "use strict";

  describe("Settings", function() {
    var methodNames = {
      'archive': {
        'root':   'showHome',
        'date':   'showPostByDate',
        'search': 'showSearch'
      },
      'post': {
        'post':       'showPostBySlug',
        'page':       'showPageBySlug',
        'attachment': '',
        'default':    'showPostTypeBySlug'
      },
      'taxonomy': {
        'category': 'showPostByCategory',
        'post_tag': 'showPostByTag',
        'default' : 'showPostByTaxonomy'
      },
      'author'  : {
        'author': 'showPostByAuthor',
      }
    };

    it("should indicate the WP URL Root", function() {
      expect(Settings.get("api_url")).toBeDefined();
    });

    it("should carry the WP Nonce", function() {
      expect(Settings.get("nonce")).toBeDefined();
    });

    describe(".getRoutes", function() {
      it("should convert the given routes to routing methods", function() {
        var json = getJSONFixture("routes.json");

        Settings.set({ routes: json.routes });
        expect(Settings.getRoutes(methodNames)).toEqual({
          "(page/:paged)": "showHome",
          "attachment/:attachment": "showPostTypeBySlug",
          "search/:search(/page/:paged)": "showSearch",
          "post/author/:author(/page/:paged)": "showPostByAuthor",
          "post/:post(/page/:paged)": "showPostBySlug",
          "post/:post/attachment/:attachment": "showPostTypeBySlug",
          ":page(/page/:paged)": "showPageBySlug",
          ":page/attachment/:attachment": "showPostTypeBySlug",
          "post/qualquer-coisa/:qualquer_coisa(/page/:paged)": "showPostTypeBySlug",
          "post/qualquer-coisa/:qualquer_coisa/attachment/:attachment": "showPostTypeBySlug",
          "post/cena/:cena(/page/:paged)": "showPostTypeBySlug",
          "post/cena/:cena/attachment/:attachment": "showPostTypeBySlug",
          "post/category/:category(/page/:paged)": "showPostByCategory",
          "post/tag/:post_tag(/page/:paged)": "showPostByTag",
          "post/type/:post_format(/page/:paged)": "showPostByTaxonomy",
          "post/nome-qualquer/:nome_qualquer(/page/:paged)": "showPostByTaxonomy",
          "post/:year/:monthnum/:day(/page/:paged)": "showPostByDate",
          "post/:year/:monthnum(/page/:paged)": "showPostByDate",
          "post/:year(/page/:paged)": "showPostByDate"
        });
      });
    });
  });
});