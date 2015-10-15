'use strict';

var Reflux = require('reflux');
var ProjectActions = window.ProjectActions;

var defaultModel = window.cfgs.projectTmp;

var ProjectStore = Reflux.createStore({
    model: defaultModel,
    listenables: ProjectActions,

    onChangeAction: function(vo) {
    	this.model=vo;
        this.trigger(this.model);
    }

});

module.exports = ProjectStore;