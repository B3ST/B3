/* global define */

define([
  'controllers/base-controller',
  'views/footer-view'
], function (BaseController, FooterView) {
  'use strict';

  var FooterController = BaseController.extend({
    showFooter: function () {
      this.show(new FooterView());
    }
  });

  return FooterController;
});