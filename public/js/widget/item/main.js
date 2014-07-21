

require.config({
  baseUrl: "../..",
  // 3rd party script alias names (Easier to type "jquery" than "libs/jquery, etc")
  // probably a good idea to keep version numbers in the file names for updates checking
  paths:{
    // Core Libraries
    "jquery":"vendor/jquery/jquery",
    "underscore":"vendor/underscore/underscore",
    "backbone":"vendor/backbone/backbone",
    "marionette":"vendor/backbone/backbone.marionette",

    // Plugins
    "bootstrap":"vendor/bootstrap",
    "bootstrap-dropdown": "vendor/bootstrap-js-dropdown/index",

    // App framework
    'item': 'js/widget/item/item'
  },
  // Sets the configuration for your third party scripts that are not AMD compatible
  shim:{
    // Twitter Bootstrap jQuery plugins
    "bootstrap":["jquery"],
    // jQueryUI
    "jqueryui":["jquery"],
    // Backbone
    "backbone":{
      // Depends on underscore/lodash and jQuery
      "deps":["underscore", "jquery"],
      // Exports the global window.Backbone object
      "exports":"Backbone"
    },
    //Marionette
    "marionette":{
      "deps":["underscore", "backbone", "jquery"],
      "exports":"Marionette"
    },
    "underscore": {
      "exports": '_'
    },
    "bootstrap-dropdown": ["jquery"]
  }
});

require(['item', 'bootstrap-dropdown'], function () {
  // and we're live
})
