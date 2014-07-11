define([
  'views/header-view',
  'models/settings-model',
  'controllers/event-bus'
], function (HeaderView, Settings, EventBus) {
  describe("HeaderView", function() {
    beforeEach(function() {
      this.view = new HeaderView();
    });

    describe(".render", function() {
      it("should render the template", function() {
        this.view.render();
        expect(this.view.el).toBeDefined();
      });

      it("should contain the name of the site", function() {
        this.view.render();
        expect(this.view.$('.navbar-brand').text()).toEqual(Settings.get('name'));
      });
    });

    describe("When clicking in brand", function() {
      beforeEach(function() {
        this.spy = spyOn(EventBus, 'trigger');
        this.view.render();
      });

      it("should trigger a navigation to index event", function() {
        this.view.$('.navbar-brand').click();
        expect(this.spy).toHaveBeenCalledWith('nav:index');
      });
    });
  });
});