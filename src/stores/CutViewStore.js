'use strict';

import React, {Component} from 'react';
var Reflux = require('reflux');
var global = window;

var defaultModel = '';

var CutViewStore = Reflux.createStore({
    model: defaultModel,
    listenables: global.CutViewActions,

    onCutView: function(view) {
    	this.model=view;
        this.trigger(this.model);
    }

});

module.exports = CutViewStore;