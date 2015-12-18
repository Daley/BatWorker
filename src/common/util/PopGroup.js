import React, {Component} from 'react';
import {Grid, Row,Col,Modal,Button,Panel,MenuItem} from 'react-bootstrap';
var _ = require('lodash');

class PanelWrapper extends Component{	
	constructor() {
		super();
	}

	onClose(){
		this.props.onCallback(this.props.pop_id,false);
	}

	onOk(){
		this.props.onCallback(this.props.pop_id,true);
	}

	render() {    
		
	    return (
	      <div style={{height: 200}}>
	        
	        <Modal
	          show={true}
	          onHide={this.onClose.bind(this)}
	          container={this}
	          aria-labelledby="contained-modal-title"
	        >
	          <Modal.Header closeButton>
	            {this.props.renderHeader()}
	          </Modal.Header>
	          <Modal.Body>
	            {this.props.renderBody()}
	          </Modal.Body>
	          <Modal.Footer>
	            <Button onClick={this.onOk.bind(this)}>确定</Button>
	          </Modal.Footer>
	        </Modal>
	      </div>
	    );
	}
}

class MovePanel extends Component{
	constructor() {
		super();
		this.state={isMouseDown:false};
	}


	onMouseDown(e){
		var vo=this.props.vo;
		this.setState({
			isMouseDown:true,
			mouse:{x:vo.left,y:vo.top},
			pos:{x:e.pageX,y:e.pageY},
			init:{left:vo.left,top:vo.top}
		});

		//window.document.addEventListener("onmousemove", this.onMouseMove.bind(this));
		//window.document.addEventListener("onmouseup", this.onMouseMove.bind(this));

		$(document).mousemove(this.onMouseMove.bind(this));
		$(document).mouseup(this.onMouseUp.bind(this));

		e.stopPropagation();

		//console.log("dengyp MovePanel onMouseDown");
		
	}

	onMouseMove(e){

		if(this.state.isMouseDown){
			var vo=this.props.vo;
			var mouse=this.state.mouse;
			mouse.x=e.pageX-this.state.pos.x+this.state.init.left;
			mouse.y=e.pageY-this.state.pos.y+this.state.init.top;
			this.forceUpdate();
		}
		//console.log("dengyp MovePanel onMouseMove");
		e.stopPropagation();
		
	}

	onMouseUp(e){
		this.setState({isMouseDown:false});
		var vo=this.props.vo;
		var mouse=this.state.mouse;
		vo=vo.set("left",mouse.x);
		vo=vo.set("top",mouse.y);

		this.props.vo=vo;

		e.stopPropagation();
		
		//console.log("dengyp MovePanel onMouseDown"); 
		$(document).mousemove(null);
		$(document).mouseup(null);
	}

 //onMouseUp={this.onMouseUp.bind(this)} onMouseMove={this.onMouseMove.bind(this)}
	renderHeader(){
		return <div style={{cursor:'move'}} onMouseDown={this.onMouseDown.bind(this)}>
					{this.props.header}
				</div>
	}

	render(){
		var vo=this.props.vo;
		var mouse=this.state.mouse?this.state.mouse:{x:vo.left,y:vo.top};
		var clazz=this.props.clazz;
		var obj={height: vo.height,position: 'absolute',left:mouse.x,top:mouse.y,width:vo.width};
		var header=this.renderHeader();//this.props.header;

		//obj={position: 'absolute',backgroundColor:'green',left:vo.left,top:vo.top};

		return <div style={obj} >
					<Panel header={header} >
						{
							React.createElement(clazz)
						}
					</Panel>
				</div>;
	}
}

class PopGroup extends Component{

	constructor() {
		super();
		this.state={pops:[]};
	}

	showPop(props){
		props.pop_id=this.state.pops.length;
		console.log("dengyp PopGroup showPop");

		this.state.pops.push(props);
		this.update();
	}

	clearPop(){
		this.state.pops=[];
		this.update();
	}

	onCallback(idx,isOk){
		var obj=this.state.pops[idx];
		if(isOk){
			obj.okHandler();
		}else if(obj.cancelHandler){
			obj.cancelHandler();
			//_.pullAt(this.state.pops,idx);
		}
		_.pullAt(this.state.pops,idx);
		this.update();
	}

	update(){
		this.setState({pops:this.state.pops});
	}
	
	render(){
		var pops=this.state.pops;
		//变态
		global.showPop=this.showPop.bind(this);
		global.clearPop=this.clearPop.bind(this);

		var onCallBack=this.onCallback.bind(this);

		return(<div>
				{			
					pops.map(function(item){
						if(item.isFloat){
							return <MovePanel {...item}/>
						}else{
							return <PanelWrapper {...item}  onCallback={onCallBack}/>
						}
						
					})
				}
				</div>);
	}


}


export default PopGroup;