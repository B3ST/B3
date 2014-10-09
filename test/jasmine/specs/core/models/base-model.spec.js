/* global define */

define([
  "models/base-model",
  "models/settings-model"
], function (BaseModel, Settings) {
  "use strict";

  describe("BaseModel", function() {
    var server, response, model;

    beforeEach(function() {
      var Extended = BaseModel.extend({
        url: Settings.get('api_url') + '/posts/1'
      });

      model = new Extended({ ID: 1 });
      response = getJSONFixture("post.json");

      server = stubServer({
        url:      Settings.get('api_url') + '/posts/1',
        code:     200,
        response: response
      });

      model.fetch();
      server.respond();
    });

    afterEach(function() {
      server.restore();
    });

    describe("When parsing a BaseModel", function() {
      it("should set its attributes if successful", function() {
        expect(model.get('content')).toEqual(response.content);
        expect(model.get('author').get('username')).toEqual(response.author.username);
        expect(model.get('author').get('ID')).toEqual(response.author.ID);
        expect(model.get('date')).toEqual(new Date(response.date));
      });
    });

    describe("When converting to JSON", function() {
      it("should convert to JSON format", function() {
        expect(model.toJSON().content).toEqual(response.content);
        expect(model.toJSON().author.username).toEqual(response.author.username);
        expect(model.toJSON().author.ID).toEqual(response.author.ID);
      });
    });
  });
});