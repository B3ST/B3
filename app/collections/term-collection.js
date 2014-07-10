define([
  'jquery',
  'backbone',
  'models/term-model'
], function ($, Backbone, Term) {
  var Terms = Backbone.Collection.extend({
    model: Term
  });

  return Terms;
});