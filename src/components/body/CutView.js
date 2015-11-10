
import {Grid, Row,Col,Button,DropdownButton,MenuItem,Panel,Nav,NavItem,Jumbotron,PanelGroup} from 'react-bootstrap';

import React, {Component} from 'react';

var global=window;

class CutView extends Component{
	constructor() {
		super();
		
        this.state= {view:(<div/>)};
	}

	componentDidMount() {
        this.unsubscribe = global.CutViewStore.listen(this.onModelChange.bind(this));
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    onClean(){

    }

    onModelChange(model) {
    	
        this.setState({view:model});
    }

	
	render1(){

		//console.dir(this.state.view);
		
		return <div> <Button bsSize="small" onClick={this.onClean.bind(this)}>清理</Button>
			{
				
				this.state.view
			}
		</div>
		//return <textarea cols="20" rows="3">{this.state.log}</textarea>
		//return <p>{this.state.log}</p>
	}

	render(){

		
		return <div> <Button bsSize="small" onClick={this.onClean.bind(this)}>清理</Button>
			<textarea>
			{
				
				this.state.view
			}
			</textarea>
		</div>
		//return <textarea cols="20" rows="3">{this.state.log}</textarea>
		//return <p>{this.state.log}</p>
	}
}

export default CutView;