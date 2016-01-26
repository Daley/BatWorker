'use strict';

import React, {Component} from 'react';
var Reflux = require('reflux');
var global = window;

var defaultModel = '';

var CutViewStore = Reflux.createStore({
    model: defaultModel,
    listenables: global.CutViewActions,

    onCutView: function(view) {
        if(view==""){
            this.model="";
        }else{
            var str=view.replace(/\},\s*\{/g,"},{");
            str=str.replace(/\s*\"id.*\n/g,"\n");
            str=str.replace(/\\\\/g,"\\");
            this.model+=str;
        }
        
        this.trigger(this.model);
    }

});

module.exports = CutViewStore;