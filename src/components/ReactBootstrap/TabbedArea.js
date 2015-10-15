import React, {Component} from 'react';
import * as ReactBootstrap from 'react-bootstrap';

class TabbedArea extends Component {

    renderChildren(){
        let eventKeyCount = 0;
        return React.Children.map(this.props.children, child => {
            return React.addons.cloneWithProps(child, {eventKey: ++eventKeyCount});
        });
    }

    render(){
        return (
            <div style={{marginTop: '10px'}} {...this.props}>
                <ReactBootstrap.TabbedArea {...this.props}>
                    {this.renderChildren()}
                </ReactBootstrap.TabbedArea>
            </div>
        );
    }
}

export default TabbedArea;
