define([
  'backbone',
  'models/user-model'
], function (Backbone, User) {
  describe("Backbone.Model", function() {
    beforeEach(function() {
      this.date = new Date();
      this.user = new User();

      var Model = Backbone.Model.extend({
        defaults: {
          ID: 1,
          date: this.date,
          modified: this.date,
          date_gmt: this.date,
          modified_gmt: this.date,
          author: this.user
        }
      });

      this.model = new Model();
    });

    describe(".toJSON", function() {
      it("should return a JSON representation of the model", function() {
        var iso  = this.date.toISOString(),
            json = {ID: 1, date: iso, modified: iso, date_gmt: iso, modified_gmt: iso, author: this.user.attributes };
        expect(this.model.toJSON()).toEqual(json);
      });
    });

    describe(".parse", function() {
      it("should parse the response", function() {
        var iso  = this.date.toISOString(),
            obj  = {ID: 1, date: iso, modified: iso, date_gmt: iso, modified_gmt: iso, author: this.user.attributes},
            json = JSON.stringify(obj);
        expect(this.model.parse(json)).toEqual(json);
      });
    });
  });
});