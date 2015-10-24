

import React, {Component} from 'react';
import * as ReactBootstrap from 'react-bootstrap';
import XEditableText from "./Enhanced/XEditableText.js";

var {ListGroup,ListGroupItem,Button,ButtonGroup,Button,Panel} =ReactBootstrap;
var _ = require('lodash');
var global=window;

//props @items @creator @viewFilters={k:v} v is desc
class TestEditor extends Component{
    constructor() {
		super();
        this.state={ ran: Math.random()};
    }

    onChange(){
    	this.setState({ran:Math.random()});
    }


    render(){
        console.log('rrrrrrrrrender TestEditor');
    	return <div>
    		<Panel>
    		<p>t</p>
    		<p>t</p>
    		<p>t</p>
    		<p>t</p>
    		<p>t</p>
    		<p>t</p>
    		<Button onClick={this.onChange.bind(this)}>点击</Button>
    		<XEditableText id="v" title="testtest" val={this.state.ran.toString()} ></XEditableText>
    		</Panel>
    		</div>
    }
}


export default TestEditor;