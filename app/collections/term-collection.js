define([
  'jquery',
  'backbone',
  'models/term-model'
], function ($, Backbone, Term) {
  'use strict';
  var Terms = Backbone.Collection.extend({
    model: Term
  });

  return Terms;
});
