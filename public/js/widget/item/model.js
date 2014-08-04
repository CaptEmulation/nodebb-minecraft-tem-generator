define(function (require, exports, module) {
  'use strict'

  var _ = require('underscore');
  var Backbone = require('backbone');
  var object = require('js/util/object');

  function capitaliseFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
  }

  var createItemModel = exports.createItemModel = function (rootModel) {

    var model = object.mixin(new (Backbone.Model.extend(_({
      defaults: {
        name: "epic name",
        lore: "epic backstory",
        id: -1,
        type: "axe",
        material: "wooden"
      },
      initialize: function () {
        _.defer(function () {
          this.getEnchantments().on('remove', function () {
            this.trigger.apply(this, [ 'ench:remove' ].concat([].slice.apply(arguments)));
          }, this);
          this.getEnchantments().on('change', function () {
            this.trigger.apply(this, [ 'change' ].concat([].slice.apply(arguments)));
          }, this);
        }.bind(this));
      }
    }).extend(this.prototype)))()).property('Enchantments').getter(function () {
      if (!this.get('ench')) {
        var collection = createEnchantmentCollection([{}], this);
        collection.root = rootModel;
        this.set('ench', collection);
      }
      return this.get('ench');
    }).readOnly().property('Name').hasSetter(function (value) {
      this.set('name', value);
    }).getter(function () {
      return this.get('name');
    }).property('Id').hasSetter(function (value) {
      this.set('id', value);
    }).getter(function () {
      return this.get('id');
    }).property('Lore').hasSetter(function (value) {
      this.set('lore', value);
    }).getter(function () {
      return this.get('lore');
    }).property('Type').hasSetter(function (value) {
      this.set('type', value);
    }).getter(function () {
      return this.get('type');
    }).property('Material').hasSetter(function (value) {
      this.set('material', value);
    }).getter(function () {
      return this.get('material');
    }).object();

    return model;
  };



  var sTypes = exports.sTypes = {
    helmet: {
      name: 'Helmet',
      materials: {
        leather: {
          id: 298,
          name: "Leather Cap"
        },
        chain: {
          id: 302,
          name: "Chain Helmet"
        },
        iron: {
          id: 306,
          name: "Iron Helmet"
        },
        golden: {
          id: 314,
          name: "Golden Helmet"
        },
        diamond: {
          id: 310,
          name: "Diamond Helmet"
        }
      }
    },
    chestplate: {
      name: "Chestplate",
      materials: {
          leather: {
            id: 299,
            name: "Leather Tunic"
          },
          chain: {
            id: 303,
            name: "Chain Chestplate"
          },
          iron: {
            id: 307,
            name: "Iron Chestplate"
          },
          golden: {
            id: 283,
            name: "Golden Sword"
          },
          diamond: {
            id: 311,
            name: "Diamond Chestplate"
          }
      }
    },
    leggings: {
      name: "Leggings",
      materials: {
          leather: {
            id: 300,
            name: "Leather Pants"
          },
          chain: {
            id: 304,
            name: "Chain Leggings"
          },
          iron: {
            id: 308,
            name: "Iron Leggings"
          },
          golden: {
            id: 316,
            name: "Golden Leggings"
          },
          diamond: {
            id: 312,
            name: "Diamond Leggings"
          }
      }
    },
    boots: {
      name: "Boots",
      materials: {
          leather: {
            id: 301,
            name: "Leather Boots"
          },
          chain: {
            id: 305,
            name: "Chain Boots"
          },
          iron: {
            id: 309,
            name: "Iron Boots"
          },
          golden: {
            id: 317,
            name: "Golden Boots"
          },
          diamond: {
            id: 313,
            name: "Diamond Boots"
          }
      }
    },
    sword: {
      name: "Sword",
      materials: {
          wooden: {
            id: 268,
            name: "Wooden Sword"
          },
          stone: {
            id: 272,
            name: "Stone Sword"
          },
          iron: {
            id: 267,
            name: "Iron Sword"
          },
          golden: {
            id: 283,
            name: "Golden Sword"
          },
          diamond: {
            id: 276,
            name: "Diamond Sword"
          }
      }
    },
    axe: {
      name: "Axe",
      materials: {
          wooden: {
            id: 271,
            name: "Wooden Axe"
          },
          stone: {
            id: 275,
            name: "Wooden Axe"
          },
          iron: {
            id: 258,
            name: "Iron Axe"
          },
          golden: {
            id: 286,
            name: "Golden Axe"
          },
          diamond: {
            id: 279,
            name: "Diamond Axe"
          }
      }
    },
    pickaxe: {
      name: "Pickaxe",
      materials: {
          wooden: {
            id: 270,
            name: "Wooden Pickaxe"
          },
          stone: {
            id: 274,
            name: "Iron Pickaxe"
          },
          iron: {
            id: 257,
            name: "Iron Pickaxe"
          },
          golden: {
            id: 285,
            name: "Golden Pickaxe"
          },
          diamond: {
            id: 278,
            name: "Diamond Pickaxe"
          }
      }
    },
    shovel: {
      name: "Shovel",
      materials: {
          wooden: {
            id: 269,
            name: "Wooden Shovel"
          },
          stone: {
            id: 273,
            name: "Stone Shovel"
          },
          iron: {
            id: 256,
            name: "Iron Shovel"
          },
          golden: {
            id: 284,
            name: "Golden Shovel"
          },
          diamond: {
            id: 277,
            name: "Diamond Shovel"
          }
      }
    },
    hoe: {
      name: "Hoe",
      materials: {
          wooden: {
            id: 290,
            name: "Wooden Hoe"
          },
          stone: {
            id: 291,
            name: "Stone Hoe"
          },
          iron: {
            id: 292,
            name: "Iron Hoe"
          },
          golden: {
            id: 294,
            name: "Golden Hoe"
          },
          diamond: {
            id: 293,
            name: "Diamond Hoe"
          }
      }
    },
    bow: {
      id: 261,
      name: "Bow"
    },
    shears: {
      id: 359,
      name: "Shears"
    },
    fishingRod: {
      id: 346,
      name: "Fishing Rod"
    },
    flintAndSteel: {
      id: 259,
      name: "Flint and Steel"
    }
  };


  exports.createTypeCollection = function () {
    var TypeModel = Backbone.Model.extend({
      defaults: {
        label: "",
        descriptor: null
      }
    });

    var TypeCollection = Backbone.Collection.extend({
      model: TypeModel
    });

    var collection = new TypeCollection((function () {
      var types = [];

      Object.keys(sTypes).forEach(function (key) {
        var type = sTypes[key];
        if (type.materials) {
          types.push({
            label: type.name,
            descriptor: type.materials
          });
        } else {
          types.push({
            label: type.name,
            descriptor: {
              id: type.id
            }
          });
        }
      });

      return types;
    }()));

    return collection;
  }


  /**
   * Source: http://minecraft.gamepedia.com/Enchanting
   */
  exports.sEnchantments = [{
    id: 0,
    maxLevel: 4,
    text: 'Protection',
    description: 'Reduces most damage<br><i>Exceptions</i>: doesn\'t reduce damage from The Void and the /kill command.',
    allowedFromEnchantingTable: [ 'helmet', 'chestplate', 'leggings', 'boots'],
    allowedFromAnvil: []
  }, {
    id: 1,
    maxLevel: 4,
    text: 'Fire Protection',
    description: 'Reduces fire damage<br>Also reduces burn time when set on fire.',
    allowedFromEnchantingTable: [ 'helmet', 'chestplate', 'leggings', 'boots'],
    allowedFromAnvil: []
  }, {
    id: 2,
    maxLevel: 4,
    text: 'Feather Falling',
    description: 'Reduces fall damage<br>Also reduces the fall damage from ender pearl teleportations.',
    allowedFromEnchantingTable: ['boots'],
    allowedFromAnvil: []
  }, {
    id: 3,
    maxLevel: 4,
    text: 'Blast Protection',
    description: 'Reduces explosion damage<br>Also reduces explosion knockback.',
    allowedFromEnchantingTable: [ 'helmet', 'chestplate', 'leggings', 'boots'],
    allowedFromAnvil: []
  }, {
    id: 4,
    maxLevel: 4,
    text: 'Projectile Protection',
    description: 'Reduces projectile damage<br>Includes damage from arrows, ghast/blaze fire charges, etc.',
    allowedFromEnchantingTable: [ 'helmet', 'chestplate', 'leggings', 'boots'],
    allowedFromAnvil: []
  }, {
    id: 5,
    maxLevel: 3,
    text: 'Respiration',
    description: 'Extends underwater breathing time<br>Increases underwater breathing time by +15 seconds per level<br>Increases time between suffocation damage by +1 second per level<br>Improves underwater vision',
    allowedFromEnchantingTable: [ 'helmet' ],
    allowedFromAnvil: []
  }, {
    id: 6,
    maxLevel: 1,
    text: 'Aqua Affinity',
    description: "Increases underwater mining rate<br>Breaking blocks underwater is allowed at regular speed, though the player cannot be floating to get the full effect.",
    allowedFromEnchantingTable: ['helmet'],
    allowedFromAnvil: []
  }, {
    id: 7,
    text: 'Thorns',
    maxLevel: 3,
    description: "Damages attackers<br>(Level × 15)% chance of inflicting 0.5-4 damage on anyone who attacks wearer. Success also reduces durability of armor. If present on multiple pieces of armor, only the highest one counts.",
    allowedFromEnchantingTable: ['chestplate'],
    allowedFromAnvil: ['helmet', 'leggings', 'boots']
  }, {
    id: 8,
    maxLevel: 3,
    text: 'Depth Strider',
    description: 'Increases underwater movement speed<br><ul><li>Every level reduces the amount water slows you by ⅓.</li><li>Level 3 will make you swim as fast as you walk on land. (Any level beyond that will have no effect on speed.)</li><li>Speed potions will affect your swimming the same way as your walking at level 3.</li><li>Does not increase vertical speed.</li></ul>',
    allowedFromEnchantingTable: ["boots"],
    allowedFromAnvil: []
  }, {
    id: 16,
    maxLevel: 5,
    text: "Sharpness",
    description: "Increases damage<br>Each level separately adds 1.25 extra damage to each hit",
    allowedFromEnchantingTable: ["sword"],
    allowedFromAnvil: ["axe"]
  }, {
    id: 17,
    text: 'Smite',
    maxLevel: 5,
    description: 'Increases damage to "undead" mobs (skeletons, zombies, withers, wither skeletons, and zombie pigmen)<br>Each level separately adds 2.5 extra damage to each hit, to "undead" mobs only',
    allowedFromEnchantingTable: ["sword"],
    allowedFromAnvil: ["axe"]
  }, {
    id: 18,
    text: "Bane of Arthropods",
    maxLevel: 5,
    description: 'Increases damage to "arthropod" mobs (spiders, cave spiders, silverfish and Endermites)<br>Each level separately adds 2.5 extra damage to each hit, to "arthropods" only. The enchantment will also cause "arthropods" to briefly have the slowness effect when hit.',
    allowedFromEnchantingTable: ["sword"],
    allowedFromAnvil: ["axe"]
  }, {
    is: 19,
    text: "Knockback",
    maxLevel: 2,
    description: "Increases knockback<br>More knockback at level II. Does combine slightly with knockback caused by attacking while sprinting.",
    allowedFromEnchantingTable: ["sword"],
    allowedFromAnvil: []
  }, {
    id: 20,
    text: "Fire Aspect",
    maxLevel: 2,
    description: "Sets the target on fire<br>Fire Aspect I deals 3 fire damage over 3 seconds. Fire Aspect II deals 7 over 7 seconds. Dropped meat will be cooked if killed while on fire.",
    allowedFromEnchantingTable: ["sword"],
    allowedFromAnvil: []
  }, {
    id: 21,
    text: "Looting",
    maxLevel: 3,
    description: "Mobs can drop more loot<br><ul><li>Increases maximum loot drop by +1 per level.</li><li>Increases chance of rare drops by +0.5 percentage points per level (i.e., 3% at level I, 3.5% at level II, and 4% at level III).</li><ul>",
    allowedFromEnchantingTable: ["sword"],
    allowedFromAnvil: []
  }, {
    id: 32,
    text: "Efficiency",
    maxLevel: 5,
    description: "Increases mining speed<br>Increases mining speed +30% over the previous level: I=130%, II=169%, III=220%, IV=286%, V=371%. One must use the preferred tool for a block in order to receive the speed. The speed increase applies to all blocks that when mined, will drop an item.",
    allowedFromEnchantingTable: ["pickaxe", "shovel", "axe"],
    allowedFromAnvil: ["shears"]
  }, {
    id: 33,
    text: "Silk Touch",
    maxLevel: 1,
    description: "Mined blocks drop themselves instead of the usual items<br>Allows collection of blocks that are normally unobtainable.",
    allowedFromEnchantingTable: ["pickaxe", "shovel", "axe"],
    allowedFromAnvil: ["shears"]
  }, {
    id: 34,
    text: "Unbreaking",
    maxLevel: 3,
    description: "Increases durability<br>For most items, (100/(Level+1))% chance a use reduces durability. On average, lifetime is (Level+1) times as long.<br>For armor, (60 + (40/(Level+1)))% chance a use reduces durability. (In other words, each durability hit against “unbreaking” armor has a 20%/27%/30% chance of being ignored.) Thus, on average, armor lasts 25%/36%/43% longer.",
    allowedFromEnchantingTable: ["sword", "shovel", "axe", "fishing rod", "helmet", "chestplate", "leggings", "boots", "sword", "bow"],
    allowedFromAnvil: ["hoe", "flint and steel"]
  }, {
    id: 35,
    text: "Fortune",
    maxLevel: 3,
    description: "Increases block drops<br>For coal, diamond, emerald, nether quartz and lapis lazuli, level I gives a 33% chance to multiply drops by 2 (averaging 33% increase), level II gives a chance to multiply drops by 2 or 3 (25% chance each, averaging 75% increase), and level III gives a chance to multiply drops by 2, 3 or 4 (20% chance each, averaging 120% increase).<br>For redstone, carrots, glowstone, sea lanterns, melons, nether wart, potatoes and wheat (seeds only), each level increases the drop maximum by +1 (maximum 4 for glowstone, 5 for sea lanterns, and 9 for melons). For tall grass, each level increases the drop maximum by +2.<br>For gravel, the drop rate of flint is increased to 14% at level I, 25% at level II, and 100% at level III.",
    allowedFromEnchantingTable: ["pickaxe", "shovel", "axe"],
    allowedFromAnvil: []
  }, {
    id: 48,
    text: "Power",
    maxLevel: 5,
    description: "Increases damage<br>Increases arrow damage by 25% × (level + 1), rounded up to nearest half-heart.",
    allowedFromEnchantingTable: ["bow"],
    allowedFromAnvil: []
  }, {
    id: 49,
    text: "Punch",
    maxLevel: 2,
    description: "Increases knockback<br>Mobs and players are knocked back further.",
    allowedFromEnchantingTable: ["bow"],
    allowedFromAnvil: []
  }, {
    id: 50,
    text: "Flame",
    maxLevel: 1,
    description: "Flaming arrows<br>Arrows are on fire when shot. Unlike flint and steel, flaming arrows only affect players, mobs, and TNT. No other blocks catch fire and they do not produce light. Fire damage applies after initial damage, similar to Fire Aspect.",
    allowedFromEnchantingTable: ["bow"],
    allowedFromAnvil: []
  }, {
    id: 51,
    maxLevel: 1,
    text: "Infinity",
    description: "Shooting consumes no arrows<br>Firing requires at least one arrow in inventory, but does not consume it. Fired arrows cannot be retrieved, except in creative mode.",
    allowedFromEnchantingTable: ["bow"],
    allowedFromAnvil: []
  }, {
    id: 61,
    text: "Luck of the Sea",
    maxLevel: 3,
    description: 'Decreases odds of catching worthless junk<br>Lowers chance of "junk" catches by 2.5% per level and increases chance of "treasure" catches by 1% per level.',
    allowedFromEnchantingTable: ["fishing rod"],
    allowedFromAnvil: []
  }, {
    id: 62,
    text: "Lure",
    maxLevel: 3,
    description: 'Increases rate of fish biting your hook<br>Decreases wait time until a catch by 5 seconds per level. Also decreases chances of both "junk" and "treasure" catches by 1% per level. At Level VIII the fish-catching particle effects start almost instantly. At Level IX you are not able to catch anything. Neither level can be achieved without editing.',
    allowedFromEnchantingTable: ["fishing rod"],
    allowedFromAnvil: []
  }];

  var createEnchantmentModel = exports.createEnchantmentModel = function (attributes, parentModel) {

    var self = object.mixin(new (Backbone.Model.extend({
      defaults: {
        id: -1,
        power: 1,
        romanPower: "I",
        maxPower: 1,
        label: ""
      },
      isEmpty: function () {
        return this.getEnchId() === -1;
      },
      getRootModel: function () {
        return parentModel;
      }
    }))(attributes)).property('EnchId').hasSetter(function (value) {
      this.set('id', value);
    }).getter(function () {
      return this.get('id');
    }).property('Label').hasSetter(function (value) {
      this.set('label', value);
    }).getter(function () {
      return this.get('label');
    }).property('MaxPower').hasSetter(function (value) {
      this.set('maxPower', value);
    }).getter(function () {
      return this.get('maxPower');
    }).property('Power').hasSetter(function (value) {
      if (typeof value === "string") {
        value = parseInt(value);
      }
      var maxPower = this.get('maxPower');
      if (value <= maxPower) {
          this.set('power', value);
      }
    }).getter(function () {
      return this.get('power');
    }).property('Type').readOnly().getter(function () {
      return parentModel.getType();
    }).object();

    var numberToRoman = {
      0: " ",
      1: "I",
      2: "II",
      3: "III",
      4: "IV",
      5: "V",
      6: "VI",
      7: "VII",
      8: "VIII",
      9: "IX"
    }

    self.on('change:power', function () {
      self.set('romanPower', numberToRoman[this.getPower()]);
    }, self);

    self.on("change:id", function () {
      var descriptor = _.where(exports.sEnchantments, {
        id: self.getEnchId()
      });
      descriptor.some(function (d) {
        this.setMaxPower(d.maxLevel);
        if (this.getPower() > this.getMaxPower()) {
          this.setPower(this.getMaxPower());
        }
        return true;
      }.bind(this));
    }, self);

    self.root = parentModel;

    return self;
  }

  var createMaterialCollection = exports.createMaterialCollection = function (rootModel) {
    var Model = Backbone.Model.extend({
      defaults: {
        label: "",
        id: 0,
        isSelected: false
      }
    })

    var collection = new (Backbone.Collection.extend({
      model: Model,
      getSelected: function () {
        var selecteds = this.where({ isSelected: true });
        if (selecteds.length) {
          return selecteds[0];
        }
      }
    }));

    Object.keys(sTypes).forEach(function (type) {
      var descriptor = sTypes[type];
      if (descriptor && descriptor.materials && rootModel.getType().toLowerCase() === type.toLowerCase()) {
        Object.keys(descriptor.materials).forEach(function (key) {
          var material = descriptor.materials[key];
          collection.push({
            label: capitaliseFirstLetter(key),
            id: material.id,
            isSelected: false
          });
        })
      }
    });

    return collection;
  }

  var createEnchantmentCollection = exports.createEnchantmentCollection = function (array, parentModel) {
    var collection = new (Backbone.Collection.extend({
      model: function (array) {
        return createEnchantmentModel(array, parentModel)
      },
      // filterBy: function () {
      //   var matcher, collection = this;
      //
      //   var self = {
      //     any: function (arg) {
      //       var values;
      //       if (arguments.length > 1) {
      //         values = [].slice.apply(arguments);
      //       } else if (arguments.length === 1 && Array.isArray(arg)) {
      //         values = arg[0];
      //       } else {
      //         funcs = [ arg ];
      //       }
      //
      //       return Object.create(function () {
      //
      //
      //         var finder = function () {
      //           return collection.filter()
      //         }
      //       }, self);
      //     },
      //
      //     type: function (type) {
      //       return Object.create(function () {
      //         return function (item) {
      //           return item === type;
      //         }
      //       }, self);
      //     },
      //
      //     typeOfModel: function (model) {
      //       return Object.create(function () {
      //         return function (item) {
      //           return model.getType() === item;
      //         }
      //       }, self);
      //     }
      //
      //   };
      //
      // }
    }))(array);
    parentModel.on('change:type', function () {
      var triggerArgs = ['change:type'].concat([].slice.apply(arguments));
      collection.trigger.apply(collection, triggerArgs);
      collection.forEach(function (model) {
        model.trigger.apply(model, triggerArgs);
      });
    }, collection);
    return collection;
  }

  var createEnchantmentDropdownCollection = exports.createEnchantmentDropdownCollection = function (array) {
    var DropdownItem = Backbone.Model.extend({
      defaults: {
        id: -1,
        maxLevel: -1,
        text: ''
      }
    });

    var DropdownCollection = Backbone.Collection.extend({
      model: DropdownItem
    });

    var dropdownCollection = new DropdownCollection(array);
    return dropdownCollection;
  }


  var is = (function () {
    var type = function (o) {
      var s = Object.prototype.toString.call(o);
      return s.match(/\[object (.*?)\]/)[1].toLowerCase();
    }

    var that = {};

    ["string", "object", "number", "function", "array", "date", "null", "undefined", "regex"].forEach(function (t) {
      that[t] = function (v) {
        return type(v) === t;
      };
    });

    return that;
  }());

  var minecraftJSONStringify = function (object) {


    var printObject = function (object) {
      if (is.object(object)) {
        return objectToString(object);
      } else if (is.array(object)) {
        return arrayToString(object);
      } else if (is.string(object)) {
        return '"' + object + '"';
      } else {
        return object;
      }
    }

    var arrayToString = function (array) {
      var str = "[";

      array.forEach(function(value, index) {
        str += printObject(value);
        // Comma
        if (array.length > 1 && index < array.length - 1) {
          str += ","
        }
      });

      str += "]";

      return str;
    }

    var objectToString = function (object) {
      var str = "{";

      Object.keys(object).forEach(function(key, index, array) {
        str += key + ":" + printObject(object[key]);
        // Comma
        if (array.length > 1 && index < array.length - 1) {
          str += ","
        }
      });

      str += "}";

      return str;
    };

    return printObject(object);
  }

  var createPreviewModel = exports.createPreviewModel = function () {
    return new (Backbone.Model.extend({

      defaults: {
        data: {

        }
      },

      accept: function (displayModel, options) {
        options = options || {};

        var render = function () {
          var widthInChars = options.loreWidth || 32;

          var name = displayModel.getName();
          var lore = (function () {
            var lores = [];
            var lore = displayModel.get('lore').trim();

            lore.split('\n').forEach(function (breaks) {
              var words = breaks.split(' ');
              var lineCount = 0;
              var lineWordCount = 0;

              do {
                words.some(function (word) {
                  if (lineCount === 0) {
                    lores.push(word);
                  } else if ((lineCount + word.length) < widthInChars) {
                    lores.push(lores.pop() + ' ' + word);
                  }

                  lineWordCount += 1;
                  lineCount += word.length + 1;
                  return lineCount > widthInChars
                });
                if (words.length != lineWordCount) {
                  words = words.slice(-lineWordCount);
                } else {
                  words = [];
                }

                lineCount = 0;
                lineWordCount = 0;
              } while (words.length !== 0);
            });

            return lores;
          }.bind(this)());

          var ench = (function () {
            var enchantments = displayModel.getEnchantments().toJSON();
            var enchs = [];

            enchantments.forEach(function (enchantment) {
              if (enchantment.id > -1) {
                enchs.push({
                  id: enchantment.id,
                  lvl: enchantment.power
                });
              }
            });

            return enchs;
          }());

          var data = {
            'display': {
              'Name': name,
              'Lore': lore
            }
          };
          if (ench.length) {
            data.ench = ench;
          }
          var model = displayModel.toJSON();
          this.set('data', '/give yourname ' + displayModel.getId() +' 1 0 ' + minecraftJSONStringify(data))
        }.bind(this);

        displayModel.on('change ench:remove', function () {
          render();
          this.trigger('change', this);
        }, this);

        render();
      }
    }))();
  }

});
