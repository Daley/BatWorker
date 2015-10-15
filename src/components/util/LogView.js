
import {Grid, Row,Col,Button,DropdownButton,MenuItem,Panel,Nav,NavItem,Jumbotron,PanelGroup} from 'react-bootstrap';

import React, {Component} from 'react';

var global=window;

class LogView extends Component{
	constructor() {
		super();
		
        this.state= {logs:[]};
	}

	componentDidMount() {
        this.unsubscribe = global.LogStore.listen(this.onModelChange.bind(this));
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    onModelChange(model) {
    	
        this.setState({logs:model,dataChange:true});
    }

    onClean(){
    	global.LogActions.cleanLog();
    }

    fixPos(){
    	var div=React.findDOMNode(this.refs.myDiv);
    	div.scrollTop = div.scrollHeight;
    	this.state.dataChange=false;
    }

    test(){
    	//defaultExpanded={true} expanded={true} accordion defaultExpanded='false' expanded='false'>

    	var f=function(){
    		console.log('ffff');
    	}
    	return (
	      <div  accordion>
	        <Panel header="Panel 1" eventKey={1} expanded={false} collapsible={true} onSelect={f}>Panel 1 content</Panel>
	        <Panel header="Panel 2" eventKey={2}>Panel 2 content</Panel>
	      </div>
	    );
    }
	
	render(){

		//return this.test();
		//不知道为什么。拖滚动条也会触发render
		if(this.state.dataChange){
			setTimeout(this.fixPos.bind(this), 20);
		}

		var pStyle={'wordWrap':'break-word','wordBreak':'break-all'};	
		//console.log('fuck fuck fuck chchch',this.state.logs);
		return <div style={{width:'380px',height:'300px','overflow-y':'scroll'}} ref='myDiv'>
					<Button bsSize="small" onClick={this.onClean.bind(this)}>清理</Button>
			{
				
				this.state.logs.map(function(item){

					return <p style={pStyle}>{item}</p>
				})
			}
		</div>
		//return <textarea cols="20" rows="3">{this.state.log}</textarea>
		//return <p>{this.state.log}</p>
	}
}

export default LogView;