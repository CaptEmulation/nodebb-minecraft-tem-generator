define(function (require, exports, module) {
  'use strict'

  var $ = require('jquery');
  var _ = require('underscore');
  var Backbone = require('backbone');
  var Marionette = require('marionette');
  var object = require('js/util/object');
  var factory = require('js/widget/item/model');

  console.log('Minecraft Item -- Initializing');

  var ItemRow = exports.ItemRow = function (model) {

    return new (Marionette.LayoutView.extend({
      template: '#tmpl-_item-row',
      className: 'view-item',
      regions: {
         Description: 'section.description',
         Type: 'section.type',
         Material: 'section.material',
         Enchantments: 'section.enchantments',
         Preview: 'section.preview'
       },
       onShow: function() {
          this.Description.show(new DescriptionRow(model));
          this.Type.show(new TypeRow(model));
          this.Material.show(createMaterialRow(model));
          this.Enchantments.show(new EnchantmentsRow(model));
          this.Preview.show(new PreviewRow(model));
       }
    }))();
  };



  var DescriptionRow = exports.DescriptionRow = function (model) {

    return new (Marionette.ItemView.extend({
      template: '#tmpl-_description-row',
      className: 'view-description',
      events: {
        'change input.item-name': 'onItemNameChanged',
        'change textarea.item-lore': 'onItemLoreChanged'
      },

      onItemNameChanged: function (event) {
        this.model.setName($(event.currentTarget).val());
      },
      onItemLoreChanged: function () {
        this.model.setLore($(event.currentTarget).find('textarea.item-lore').val());
      }
    }))({
      model: model
    });
  };

  var TypeRow = exports.TypeRow = function (rootModel) {

    var collection = factory.createTypeCollection();

    return new (Marionette.CompositeView.extend({
      template: '#tmpl-_type-row',
      className: 'view-type',
      events: {
        'click .btn' : 'onButtonClick'
      },
      childView: Backbone.Marionette.ItemView.extend({
        tagName: 'cell',
        className: 'btn',
        template: '#tmpl-_label-row-item',
        events: {
          'click' : 'onButtonClick'
        },
        modelEvents: {
          'change:isSelected': 'onSelectedChange'
        },
        onSelectedChange: function () {
          if (this.model.get('isSelected')) {
            this.$el.addClass('is-selected');
          } else {
            this.$el.removeClass('is-selected');
          }
        },
        onButtonClick: function(event) {
          var $button = $(event.currentTarget);
          this.$el.find('.is-selected').removeClass('is-selected');
          $button.addClass('is-selected');

          this.model.collection.where({ isSelected: true }).forEach(function (model) {
            model.set('isSelected', false);
          })
          this.model.set('isSelected', true);

          rootModel.setType(this.model.get('label'));
           collection.where({ label: this.model.get('label') }).forEach(function (type) {
             var id = type.get('descriptor').id;
             if (id) {
               rootModel.setId(id);
             }
           });
        },
        onRender: function () {
          if (this.model.get('isSelected')) {
            this.$el.addClass('is-selected');
          }
        }
      }),
      onButtonClick: (function () {
        return function(event) {
          var $button = $(event.currentTarget);
          this.$el.find('.is-selected').removeClass('is-selected');
          $button.addClass('is-selected');
          this.model.setType($button.text().toLowerCase());
        };
      }())
    }))({
      model: rootModel,
      collection: collection
    });
  };

  var createMaterialRow = function (rootModel) {

    var MaterialButtons = Backbone.Marionette.CompositeView.extend({
      template: '#tmpl-_material-row',
      className: 'view-material',
      childViewContainer: '.btn-grp',
      childView: Backbone.Marionette.ItemView.extend({
        tagName: 'cell',
        className: 'btn',
        template: '#tmpl-_label-row-item',
        events: {
          'click' : 'onButtonClick'
        },
        modelEvents: {
          'change:isSelected': 'onSelectedChange'
        },
        onSelectedChange: function () {
          if (this.model.get('isSelected')) {
            this.$el.addClass('is-selected');
          } else {
            this.$el.removeClass('is-selected');
          }
        },
        onButtonClick: function(event) {
          var $button = $(event.currentTarget);
          this.$el.find('.is-selected').removeClass('is-selected');
          $button.addClass('is-selected');

          this.model.collection.where({ isSelected: true }).forEach(function (model) {
            model.set('isSelected', false);
          })
          this.model.set('isSelected', true);

          rootModel.setId(this.model.get('id'));
          rootModel.setMaterial(this.model.get('label'));
        },
        onRender: function () {
          if (this.model.get('isSelected')) {
            this.$el.addClass('is-selected');
          }
        }
      }),
      modelEvents: {
        'change:type': 'onChangeType'
      },
      onChangeType: function () {
        var collection = factory.createMaterialCollection(rootModel);
        var selectedCollection = new Backbone.Collection(this.collection.where({ isSelected: true }));

        selectedCollection.forEach(function (model) {
          var targets = selectedCollection.where({ label: model.get('label') })

          if (targets.length) {
            targets.forEach(function(model) {
              model.set('isSelected', true);
            });
          }

        });

        if (!selectedCollection.length && collection.length) {
          collection.last().set('isSelected', true);
        }

        this.collection.reset(collection.models);
      }
    });

    var collection = factory.createMaterialCollection(rootModel);
    collection.last().set('isSelected', true);

    var buttons = new MaterialButtons({
      model: rootModel,
      collection: collection
    });

    rootModel.on('change:type', function () {
      var triggerArgs = ['change:type'].concat([].slice.apply(arguments));
      collection.trigger.apply(collection, triggerArgs);
      collection.forEach(function (model) {
        model.trigger.apply(model, triggerArgs);
      });
      collection.where({ isSelected: true }).forEach(function (model) {
        rootModel.setId(model.get('id'));
      });
    }, collection);

    return buttons;
  }


  var createDropdownCollectionView = function (attributes, model, filter) {
    var DropdownItem = Backbone.Marionette.ItemView.extend({
      tagName: "li",
      attributes: {
        "role": "presentation"
      },
      template: '#tmpl-_dropdown-item'
    });


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
        if (itemType === model.getType().toLowerCase()) {
          allowed = true;
          return true;
        }
      });
      return allowed;
    });
    return factory.createEnchantmentDropdownCollection(enchantments);
  };


  var createDropdownButtonView = function (model) {

    var view = new (Backbone.Marionette.ItemView.extend({
      template: '#tmpl-_enchantment-dropdown',
      className: 'dropdown',
      events: {
          "click .container.dropdown-item" : "updateEnchantment"
      },
      modelEvents: {
        'change:type': 'onChangeType'
      },
      onChangeType: function () {
        this.render();
      },
      updateEnchantment: function(event){
        var text = $(event.currentTarget).text();
        this.model.setLabel(text);
        this.menu.collection.where({text: text}).forEach(function (e) {
          this.model.setMaxPower(e.get('maxLevel'));
          this.model.setEnchId(e.get('id'));
        }.bind(this));
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

    return view;
  }


  var LabelView = Marionette.ItemView.extend({
    template: '#tmpl-_label-row-item',
    tagName: 'h3'
  });

  var EnchantmentsRow = exports.EnchantmentsRow = function (rootModel) {

    var EnchantmentRowItem = function (child) {

      return new (Marionette.LayoutView.extend({
        template: '#tmpl-_enchantment-row-item',
        className: 'view-enchantment-row-item',
        tagName: 'cell',
        regions: {
          'Content': 'div.row'
        },
        events: {
          'click .btn.add' : 'onAddButtonClick'
        },
        onAddButtonClick: (function () {
          return function(event) {
            this.model.collection.add({});
            this.Content.show(new EnchantmentCreateRow(this.model));
          };
        }()),
        onShow: function () {
          this.model.root = rootModel;
          this.Content.show(new EnchantmentDefaultRow(this.model));
        }
      }))({
        model: child.model
      });

    };

    return new (Marionette.CollectionView.extend({
      template: '#tmpl-_enchantment-row',
      className: 'view-enchantments',
      childView: EnchantmentRowItem
    }))({
      collection: rootModel.getEnchantments()
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

  var createEnchantmentPowerView = exports.createEnchantmentPowerView = function (model) {

    return new (Marionette.ItemView.extend({
      template: '#tmpl-_enchantment-create-row-item-power',
      className: 'view-enchantment-power',
      modelEvents: {
        'change:romanPower': 'render'
      },
      events: {
        'click .btn.more' : 'onMoreButtonClick',
        'click .btn.less': 'onLessButtonClick'
      },
      onMoreButtonClick: function () {
        this.model.setPower(this.model.getPower() + 1);
      },
      onLessButtonClick: function () {
        this.model.setPower(this.model.getPower() - 1);
      }
    }))({
      model: model
    });
  };

  var EnchantmentCreateRow = exports.EnchantmentCreateRow = function (model) {

    return new (Marionette.LayoutView.extend({
      template: '#tmpl-_enchantment-create-row-item',
      className: 'view-enchantment-create',
      events: {
        'click .btn.remove' : 'onRemoveButtonClick',
      },
      modelEvents: {
        'change:label': 'renderLabel'
      },
      regions: {
        'Dropdown': '.form-group.dropdown',
        'Power': '.row.power'
      },
      onShow: function () {
        this.Dropdown.show(createDropdownButtonView(model));
        this.Power.show(createEnchantmentPowerView(model));
      },
      onRemoveButtonClick: (function () {
        return function(event) {
          this.model.collection.remove(this.model);
        };
      }()),
      renderLabel: function () {
        var region = new Marionette.Region({
          el: this.$el.find('label.enchantment-label')
        });
        region.show(new LabelView({
          model: this.model
        }));
      },
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
        'change': 'render',
        'change:data': 'onDataChanged'
      },
      onDataChanged: function () {
        var textarea = $('textarea.item-preview');
        var text = textarea.val();
        var matches = text.match(/\n/g),
        breaks = matches ? matches.length : 2;
        textarea.attr('rows',breaks + 2);
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
