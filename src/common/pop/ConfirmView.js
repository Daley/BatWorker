

import React, {Component} from 'react';
import {Button,Modal} from 'react-bootstrap';

class ConfirmView extends Component{	
	constructor() {
		super();		
	}

	onOk(){
		this.props.callback(true);
	}

	onCancel(){
		this.props.callback(false);
	}

	render(){

		return (
				<div className="static-modal">
				    <Modal.Dialog>
				      <Modal.Header>
				        <Modal.Title>{this.props.title}</Modal.Title>
				      </Modal.Header>

				      <Modal.Body>
				        {this.props.body}
				      </Modal.Body>

				      <Modal.Footer>
				        <Button onClick={this.onCancel.bind(this)}>取消</Button>
				        <Button bsStyle="primary" onClick={this.onOk.bind(this)}>确定</Button>
				      </Modal.Footer>

				    </Modal.Dialog>
			  </div>)
	}
}

export default ConfirmView;