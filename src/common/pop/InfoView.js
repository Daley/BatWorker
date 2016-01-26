import React, {Component} from 'react';
import {Button,Modal} from 'react-bootstrap';

class InfoView extends Component{	
	constructor() {
		super();
	}

	onClose(){
		this.props.callback();
	}


	render(){

		return (
				<Modal show={true} onHide={this.onClose.bind(this)} aria-labelledby="contained-modal-title">
				    
				      <Modal.Header closeButton>
				        <Modal.Title>{this.props.title}</Modal.Title>
				      </Modal.Header>

				      <Modal.Body>
				      {this.props.body} 
				      </Modal.Body>

				      <Modal.Footer>
				        <Button bsStyle="primary" onClick={this.onClose.bind(this)}>关闭</Button>
				      </Modal.Footer>
				    
			  </Modal>)
	}
}

export default InfoView;