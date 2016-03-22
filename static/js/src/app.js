"use strict";


define([
    'jquery',
    'underscore',
    'backbone',
    'router',
], function($, _, Backbone, Router, Bootstrap){

    var initialize = function(){
        Router.initialize();
    }

    return {
        initialize: initialize
    };
});