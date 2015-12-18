import React, {Component} from 'react';
import {Button,Glyphicon} from 'react-bootstrap';
var _ = require('lodash');

class ToggleBtn extends Component{	
	constructor() {
		super();
		this.state={ran:Math.random()};
	}

	onChange(e){

		this.props.selected=!this.props.selected;
		this.props.onChange(this.props.selected);


		//setTimeout(function(){
			this.setState({ran:Math.random()});
		//}.bind(this), 10);

		//e.stopPropagation();
		//e.stopImmediatePropagation();
		
	}


	render() {    

		if(this.props.selected){
			return <Button bsSize="xsmall" onClick={this.onChange.bind(this)}><Glyphicon glyph="ok" /></Button>;
		}
	    return 	<Button bsSize="xsmall" onClick={this.onChange.bind(this)}><Glyphicon glyph="remove"/></Button>;	    
	}
}

export default ToggleBtn;