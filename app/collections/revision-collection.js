define([
  'jquery',
  'backbone',
  'models/revision-model'
], function ($, Backbone, Revision) {
  var Revisions = Backbone.Collection.extend({
    model: Revision
  });

  return Revisions;
});