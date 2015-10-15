import React, {Component} from 'react/addons';
import * as ReactBootstrap from 'react-bootstrap';

class PanelGroup extends Component {

    renderChildren(){
        let eventKeyCount = 0;
        return React.Children.map(this.props.children, child => {
            return React.addons.cloneWithProps(child, {eventKey: ++eventKeyCount});
        });
    }

    render(){
        return (
            <ReactBootstrap.PanelGroup {...this.props}>
                {this.renderChildren()}
            </ReactBootstrap.PanelGroup>
        );
    }
}

export default PanelGroup;
