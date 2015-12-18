
import React, {Component} from 'react';
import {Button,ButtonGroup, DropdownButton,MenuItem,Panel,NavBrand,Glyphicon,Tooltip,OverlayTrigger,Navbar,Nav,NavItem} from 'react-bootstrap';



class HeaderView extends Component{	
	constructor() {
		super();

	}

	onSelect(){
		this.showHelp();
	}

	componentDidMount(){
    	
    }

	renderHelpBody(){
		return (<div>
					<h2>快捷键</h2>
					<h5>Ctrl+S 保存</h5>
					<h5>Ctrl+R 运行队列或你最后运行的项目</h5>
					<h5>Ctrl+Z 撤消</h5>
					<h5>Ctrl+Y 重做</h5>
					<h5>Ctrl+H 本帮助</h5>
					<hr />
					<h2>balalalala</h2>
				</div>)
	}

	showHelp(){
		window.log("显示帮助");
		window.popMgr.showInfo('简单的帮助',this.renderHelpBody());
	}

	render(){
		
		return <Navbar fluid={true}>
    			<NavBrand left bsSize='lg'>{window.lang.APP_NAME}</NavBrand>
			    <Nav right>
			      <NavItem eventKey={1} onSelect={this.onSelect.bind(this)}>帮助</NavItem>	      
			    </Nav>
			  </Navbar>
	}
}


 export default HeaderView;