
import React, {Component} from 'react';
import {Button,ButtonGroup, DropdownButton,MenuItem,Panel,NavBrand,Glyphicon,Tooltip,OverlayTrigger,Navbar,Nav,NavItem} from 'react-bootstrap';

class HeaderView extends Component{	
	constructor() {
		super();
	}

	render(){
		return <Navbar>
    			<span>{window.lang.APP_NAME}</span>

			    <Nav>
			      <NavItem eventKey={1} href="#">Link</NavItem>
			      <NavItem eventKey={2} href="#">Link</NavItem>			      
			    </Nav>
			  </Navbar>
	}
}


 export default HeaderView;