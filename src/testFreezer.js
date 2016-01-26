var Freezer=require("freezer-js");
import React from 'react';

document.Test = React.createClass({

	clickHandler:function(){
		var vo=this.props.vo;
		console.log(vo);
		if(vo.conts==null){
			vo = vo.set("conts",[{name:"test"}]);
		}
		if(vo.isExpand==null){
			vo = vo.set("isExpand",true);
		}else{
			vo = vo.set("isExpand",!vo.isExpand);
		}
	},

    render: function() {
    	var vo=this.props.vo;
    	var conts;
    	var Test=document.Test;
    	var ident=this.props.ident;
    	if(vo.isExpand){
			if(vo.conts){
    			conts=vo.conts.map(function(item){
    				return <Test vo={item} ident={ident+"--"}/>
    			});
    		}else{
    			conts=[];
    		}
       		return   <div onClick={this.clickHandler}>                    
                    	{ident+vo.name}
                    	{conts}
                	</div>
    	}

    	return <div onClick={this.clickHandler}>
                    	{ident+vo.name}
                	</div>
    }
});

var freezer=new Freezer({name:"root"});

var Test=document.Test;

freezer.on('update', function( updated ){
	React.render(<Test vo={freezer.get()} ident="--"/>, document.getElementById('content'));
});

React.render(<Test vo={freezer.get()} ident="--"/>, document.getElementById('content'));