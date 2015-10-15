var React = require('react');

import {Button,ButtonGroup, DropdownButton,MenuItem,Panel,ListGroup,Glyphicon,Tooltip,OverlayTrigger} from 'react-bootstrap';

var global=window;

class HeaderView extends Component{	
	constructor() {
		super();
	}

	render(){
		return <Navbar>
    			<NavBrand>{global.lang.APP_NAME}</NavBrand>
			    <Nav>
			      <NavItem eventKey={1} href="#">Link</NavItem>
			      <NavItem eventKey={2} href="#">Link</NavItem>
			      <NavDropdown eventKey={3} title="Dropdown" id="basic-nav-dropdown">
			        <MenuItem eventKey="1">Action</MenuItem>
			        <MenuItem eventKey="2">Another action</MenuItem>
			        <MenuItem eventKey="3">Something else here</MenuItem>
			        <MenuItem divider />
			        <MenuItem eventKey="4">Separated link</MenuItem>
			      </NavDropdown>
			    </Nav>
			  </Navbar>
	}
}





 export default HeaderView;