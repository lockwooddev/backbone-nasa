"use strict";


define([
    'underscore',
    'backbone',
    'models/flyover',
], function(_, Backbone, FlyoverModel){

    var FlyoverCollection = Backbone.Collection.extend({
        model: FlyoverModel,

        url: function(lat, lon) {
            return 'assets/?lat='+lat+'&lon='+lon
        },

        parse: function(resp, xhr){
            return resp
        }
    });

    return FlyoverCollection;
});