'use strict';

module.exports = function (app) {

  var self = {
    init: function(req, res) {
      res.render('widget/item/index', {
        baseUrl: ""
      });
    }
  };
  return self;
}
