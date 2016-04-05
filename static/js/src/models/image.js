"use strict";


define([
    'underscore',
    'backbone',
], function(_, Backbone){

    var ImageModel = Backbone.Model.extend({

        getUrl: function(lat, lon, date) {
            return 'imagery/?lat='+lat+'&lon='+lon+'&date='+date
        },
    });
    return ImageModel;
});