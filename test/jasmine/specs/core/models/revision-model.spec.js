define([
  'models/revision-model'
], function (Revision) {
  describe("Revision", function() {
    describe("When initializing Revision", function() {
      it("should set its parent", function() {
        var Model = Backbone.Model.extend({defaults: {ID: 12}});
        this.model = new Model();
        this.revision = new Revision({"ID":2, "post": this.model, "title":"test","status":"inherit","type":"revision","author":{"ID":1,"username":"admin","name":"admin","first_name":"word","last_name":"press","nickname":"admin","slug":"admin","URL":"","avatar":"","description":"","registered":"2013-04-04T16:58:14+00:00","meta":{"links":{"self":"http:\/\/example.com\/wp-json\/users\/1","archives":"http:\/\/example.com\/wp-json\/users\/1\/posts"}}},"content":"Revision content","parent":0,"link":"http:\/\/example.com\/2014\/05\/1-revision-v1\/","date":"2014-05-28T00:55:04+00:00","modified":"2014-05-28T00:55:04+00:00","format":"standard","slug":"1-revision-v1","guid":"http:\/\/example.com\/2014\/05\/1-revision-v1\/","excerpt":"This is the excerpt","menu_order":0,"comment_status":"closed","ping_status":"open","sticky":false,"date_tz":"UTC","date_gmt":"2014-05-28T00:55:04+00:00","modified_tz":"UTC","modified_gmt":"2014-05-28T00:55:04+00:00","password":"","title_raw":"test","content_raw":"sdfsdfsf sdfsfdsf","excerpt_raw":"","guid_raw":"http:\/\/example.com\/2014\/05\/1-revision-v1\/","post_meta":[],"meta":{"links":{"self":"http:\/\/example.com\/wp-json\/posts\/1/revisions/2","author":"http:\/\/example.com\/wp-json\/users\/1","collection":"http:\/\/example.com\/wp-json\/posts/1/revisions","up":"http:\/\/example.com\/wp-json\/posts\/1"}},"terms":[]});

        expect(this.revision.get('post')).toEqual(this.model);
      });
    });
  });
});