"use strict";


define([
    'underscore',
    'backbone',
    'models/flyover',
], function(_, Backbone, ImageModel){

    var ImageCollection = Backbone.Collection.extend({
        model: ImageModel,
    });

    return ImageCollection;
});