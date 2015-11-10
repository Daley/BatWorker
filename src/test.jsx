var instruments = [
  'kick', 'snare', 'hihat', 'open hihat',
  'clap', 'shaker', 'noise', 'ad lib',
  'piano', 'bass', 'random', 'loud snare',
  'symbol', 'crash', 'other 1', 'other 2'
];
// build a 16 x 16 Grid
var grid = _.map(instruments, (title, index) => {
  return {id: index, title: title, grids: _.map(_.range(16), index => {
    return {id: index, active: false};
  })}
});

var Cell = React.createClass({
    render: function() {
      var divStyle = null,
          classes = this.props.active? 'checked grid' : 'grid';
      
      if (this.props.columnId == 0) {
        divStyle =  {clear: 'right'};
      }

      return (
        <div style={divStyle} 
          onClick={this.props.onClick.bind(null, this.props.rowId, this.props.columnId )} 
          className={classes} 
          id={this.props.columnId}>&nbsp;
        </div>
      );
    }
});

var Row = React.createClass({
  render: function() {
    var columns = this.props.row.get('grids').map(column => {
          return (
              <Cell active={column.get('active')} 
                      onClick={this.props.onClick}
                      columnId={column.get('id')} 
                      rowId={this.props.row.get('id')}/>
          );
        }).toArray();
        
        return (
          <div className='gridRow'>
            <div className='title grid' id={this.props.row.get('id')}>{this.props.row.get('title')}</div>
            {columns}
          </div>
        );
  }
});

var Sequencer = React.createClass({
    render: function() {
    
      var rows = this.props.grid.map(row => {
        return (
          <Row row={row} onClick={this.props.onClick} />
        );
      }).toArray();

      return (
          <div className="sequencer">
              {rows}
          </div>
      );
    }
});

var App = React.createClass({
  getInitialState: function() {
    return {
      history: Immutable.List(),
      future: Immutable.List(),
      items: Immutable.fromJS(grid) 
    }
  },
  
  onClick: function(rowId, colId) {
    var newItems = this.state.items.updateIn([rowId, 'grids', colId, 'active'], active => !active);
    
    this.setState({
      history: this.state.history.push(this.state.items),
      items: newItems
    });
  },
  
  undo: function() {
    if (this.state.history.size < 1) return;
    this.setState({
      history: this.state.history.pop(),
      future: this.state.future.push(this.state.items),
      items: this.state.history.last()
    });
  },
  
  redo: function() {
    if (this.state.future.size < 1) return;
    this.setState({
      items: this.state.future.last(),
      history: this.state.history.push(this.state.items),
      future: this.state.future.pop()
    });
  },
  
  render: function() {
    return (
      <div>
        <Sequencer onClick={this.onClick} grid={this.state.items} />
        <button className="btn btn-default" disabled={this.state.history.size < 1} onClick={this.undo}>Undo</button>
        <button className="btn btn-default" disabled={this.state.future.size < 1} onClick={this.redo}>Redo</button>
      </div>
    );
  }
});

React.render(<App/>, window.appContainer);
