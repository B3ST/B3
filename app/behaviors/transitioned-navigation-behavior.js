/* global define */

define([
  'behaviors/navigation-behavior'
], function (Navigation) {
  'use strict';

  var TransitionedNavigation = Navigation.extend({
    onNavigateLink: function (options) {
      this.$el.fadeOut('slow', function () {
        this.triggerMethod('navigate', options);
      }.bind(this));
    }
  });

  /**
   * Register behavior
   * @type {TransitionedNavigation}
   */
  window.Behaviors.TransitionedNavigation = TransitionedNavigation;

  return TransitionedNavigation;
});