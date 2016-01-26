import React from 'react';

var Test=React.createClass({

	clickHandler:function(){
		
	},

	renderItems:function(){
		var items=[]
		for(var i=0;i<100;i++){
			items.push(<h1>dddddddddddddddddd</h1>);
		}
		return items;
	},

    render: function() {
    	var style={width:"300px",height:"100%",overflowY:"scroll"};

    	return <div style={style}>
    				{this.renderItems()}
                	</div>
    }
});



React.render(<Test/>, document.getElementById('content'));