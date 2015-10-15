'use strict';

var Reflux = require('reflux');
var global = window;

var defaultModel = [];

var LogStore = Reflux.createStore({
    model: defaultModel,
    listenables: global.LogActions,

    onAddLog: function(str) {
    	this.model.push(str);
        this.trigger(this.model);
    },

    onCleanLog:function(){
    	this.model=[];
    	this.trigger(this.model);
    }

});

module.exports = LogStore;