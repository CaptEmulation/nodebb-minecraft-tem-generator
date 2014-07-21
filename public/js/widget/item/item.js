define(function (require, exports, module) {
  'use strict'

  var $ = require('jquery');
  var _ = require('underscore');
  var Backbone = require('backbone');
  var Marionette = require('marionette');
  var object = require('js/util/object');
  var factory = require('js/widget/item/model');

  var ItemRow = exports.ItemRow = function (model) {

    return new (Marionette.LayoutView.extend({
      template: '#tmpl-_item-row',
      className: 'view-item',
      regions: {
         Description: 'section.description',
         Type: 'section.type',
         Enchantments: 'section.enchantments',
         Preview: 'section.preview'
       },
       onShow: function() {
          this.Description.show(new DescriptionRow(model));
          this.Type.show(new TypeRow(model));
          this.Enchantments.show(new EnchantmentsRow(model));
          this.Preview.show(new PreviewRow(model));
       }
    }))();
  };



  var DescriptionRow = exports.DescriptionRow = function (model) {

    return new (Marionette.ItemView.extend({
      template: '#tmpl-_description-row',
      className: 'view-description'
    }))({
      model: model
    });
  };

  var TypeRow = exports.TypeRow = function (model) {

    return new (Marionette.ItemView.extend({
      template: '#tmpl-_type-row',
      className: 'view-type',
      events: {
        'click .btn' : 'onButtonClick'
      },

      onButtonClick: (function () {

        var self = object.mixin({}).property('SelectedButton').getter(function () {
          return $('.is-selected');
        }).hasSetter().lazy().object();

        return function(event) {
          var $button = $(event.currentTarget);
          self.getSelectedButton().removeClass('is-selected');
          $button.addClass('is-selected');
          self.setSelectedButton($button);
          this.model.setType($button.text().toLowerCase());
        };
      }())
    }))({
      model: model
    });
  };

var DropdownItem = Backbone.Marionette.ItemView.extend({
  tagName: "li",
  attributes: {
    "role": "presentation"
  },
  template: '#tmpl-_dropdown-item'
});



  var createDropdownCollectionView = function (attributes, model, filter) {
    var DropdownCollectionView = Backbone.Marionette.CollectionView.extend({
        template: "#tmpl-_enchantment-dropdown-collection",

        tagName: "ul",
        className: 'dropdown-menu',
        attributes: {
          "role": "menu"
        },
        childView: DropdownItem,
        modelEvents: {
          'change:type': 'onChangeType'
        },

        onChangeType: function () {
          this.render();
        }
    });

    var self = new DropdownCollectionView(attributes);

    return self;
  }


  var createDropdownCollection = function (model) {
    var enchantments = factory.sEnchantments.filter(function (enchantment) {
      if (!(enchantment.allowedFromEnchantingTable && enchantment.allowedFromAnvil)) {
        throw new Error ('missing data.  see: ' + JSON.stringify(enchantment));
      }
      var allowedList = enchantment.allowedFromEnchantingTable.concat(enchantment.allowedFromAnvil);
      var allowed = false;
      allowedList.some(function (itemType) {
        if (itemType === model.getType()) {
          allowed = true;
          return true;
        }
      });
      return allowed;
    });
    return factory.createEnchantmentDropdownCollection(enchantments);
  };


  var createDropdownButtonView = function (model) {

    return new (Backbone.Marionette.ItemView.extend({
      template: '#tmpl-_enchantment-dropdown',
      className: 'dropdown',
      events: {
          "click .dropdown-menu a" : "updateEnchantment"
      },
      modelEvents: {
        'change:type': 'onChangeType'
      },
      onChangeType: function () {
        this.render();
      },
      updateEnchantment: function(event){
        var text = $(event.currentTarget).text();
        console.log(text);
      },
      onRender: function () {
        this.menu = createDropdownCollectionView({
          collection: createDropdownCollection(model)
        }, model);
        this.$el.append(this.menu.render().$el);
      }
    }))({
      model: model
    });
  }

  var EnchantmentsRow = exports.EnchantmentsRow = function (model) {

    return new (Marionette.CollectionView.extend({
      template: '#tmpl-_enchantment-row',
      className: 'view-enchantments',
      childView: EnchantmentRowItem
    }))({
      collection: model.getEnchantments()
    });

  };

  var EnchantmentRowItem = function (child) {

    return new (Marionette.LayoutView.extend({
      template: '#tmpl-_enchantment-row-item',
      className: 'view-enchantment-row-item',
      tagName: 'cell',
      regions: {
        'Content': 'form'
      },
      modelEvents: {
        "change": "onChangeToEdit"
      },
      events: {
        'click .btn.add' : 'onAddButtonClick'
      },

      onAddButtonClick: (function () {
        return function(event) {
          this.model.collection.add({});
          this.model.set('id', 0);
        };
      }()),
      onShow: function () {
        this.Content.show(new EnchantmentDefaultRow(this.model));
      },
      onChangeToEdit: function () {
        this.model.off("change", this.onChangeToEdit, this);
        this.Content.show(new EnchantmentCreateRow(this.model));
      }
    }))({
      model: child.model
    });
  };

  var EnchantmentDefaultRow = exports.EnchantmentDefaultRow = function (model) {

    return new (Marionette.ItemView.extend({
      template: '#tmpl-_enchantment-add-row-item',
      className: 'view-enchantment-add'
    }))({
      model: model
    });
  };

  var EnchantmentCreateRow = exports.EnchantmentCreateRow = function (model) {

    return new (Marionette.LayoutView.extend({
      template: '#tmpl-_enchantment-create-row-item',
      className: 'view-enchantment-create',
      events: {
        'click .btn.remove' : 'onRemoveButtonClick'
      },
      regions: {
        'Dropdown': '.form-group.dropdown'
      },
      onShow: function () {
        this.Dropdown.show(createDropdownButtonView(model));
      },
      onRemoveButtonClick: (function () {
        return function(event) {
          this.model.collection.remove(this.model);
        };
      }()),
    }))({
      model: model
    });
  };

  var PreviewRow = exports.PreivewRow = function (model) {

    var previewModel = factory.createPreviewModel();
    previewModel.accept(model);

    return new (Marionette.ItemView.extend({
      template: '#tmpl-_preview-row',
      className: 'view-preview',
      modelEvents: {
        'change': 'render'
      }
    }))({
      model: previewModel
    });
  };

  var itemRowView = new ItemRow(factory.createItemModel());

  var region = new Backbone.Marionette.Region({
    el: "section.item"
  });
  region.show(itemRowView);

});
