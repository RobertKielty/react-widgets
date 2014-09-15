var React   = require('react')
  , filter  = require('../util/filter')
  , compose = require('../util/compose')
  , transferProps  = require('../util/transferProps')
  , mergeIntoProps = transferProps.mergeIntoProps
  , cloneWithProps = transferProps.cloneWithProps
  , cx = require('../util/cx')
  , _  = require('lodash');

var DefaultListItem = React.createClass({

  mixins: [ 
    require('../mixins/DataHelpersMixin'),
    require('../mixins/RtlChildContextMixin')
  ],

  render: function(){
      var item = this.props.item;

      return this.transferPropsTo(<li>{ item ? this._dataText(item) : '' }</li>)
  }
})

module.exports = React.createClass({

  displayName: 'List',

  mixins: [ 
    require('../mixins/DataHelpersMixin'),
    require('../mixins/VirtualScrollMixin')
  ],

  propTypes: {
    data:          React.PropTypes.array,
    value:         React.PropTypes.any,
    listItem:      React.PropTypes.component,
    valueField:    React.PropTypes.string,
    textField:     React.PropTypes.string,

    optID:         React.PropTypes.string,

    messages:      React.PropTypes.shape({
      emptyList:   React.PropTypes.string
    }),
  },


  getDefaultProps: function(){
    return {
      delay:         500,
      optID:         '',
      messages: {
        emptyList:   "There are no items in this list"
      }
    }
  },

  componentDidUpdate: function(prevProps, prevState){
    if ( prevProps.focusedIndex !== this.props.focusedIndex)
      this._setScrollPosition()
  },


	render: function(){
    var emptyList   = <li>{ this.props.messages.emptyList }</li>
      , emptyFilter = <li>{ this.props.messages.emptyFilter }</li>
      , len = Math.min(this.state.displayEnd, this.props.data.length - 1)
      , items = [];

    if ( this.state.displayStart !== 0)
      items.push(<li key='top_pl' style={{height: this.state.displayStart * this.props.itemHeight}}/>);

    //console.log('render', this.state.displayEnd)  
    for (var idx = this.state.displayStart; idx <= len; ++idx) {
      var item = this.props.data[idx];
      var focused = idx === this.props.focusedIndex;

      if (!item) debugger;
      items[items.length] = (
          <li 
            key={'item_' + idx}
            role='option'
            id={ focused ? this.props.optID : '' }
            aria-selected={ idx === this.props.selectedIndex }
            className={cx({ 
              'rw-state-focus':    focused,
              'rw-state-selected': idx === this.props.selectedIndex,
            })}
            onClick={_.partial(this.props.onSelect, item, idx)}>
            { this.props.listItem 
                ? this.props.listItem({ item: item })
                : this._dataText(item)
             }
          </li>
      );
    }
    
    if ( this.state.displayEnd !== (this.props.data.length - 1))
      items.push(<li key='bottom_pl' style={{height:  (this.props.data.length - this.state.displayEnd) * this.props.itemHeight}}/>);

		return mergeIntoProps(
      _.omit(this.props, 'data', 'selectedIndex'),
			<ul 
        className="rw-list" 
        ref='scrollable'
        role='listbox'
        tabIndex="-1" 
        onKeyDown={this._keyDown}
        onScroll={this.props.itemHeight && this.onScroll} 
        onKeyPress={this.search}>
        { !this.props.data.length 
          ? emptyList 
          : items }
			</ul>
		)
	},

  _setScrollPosition: function(){
    var list = this.getDOMNode()
      , virtual = !!this.props.itemHeight
      , selected = list.children[this.props.focusedIndex]
      , scrollTop, listHeight, selectedTop, selectedHeight, bottom;

    if (!virtual && !selected) return

    scrollTop   = list.scrollTop
    listHeight  = list.clientHeight

    selectedTop =  virtual 
      ? (this.props.focusedIndex * this.props.itemHeight) 
      : selected.offsetTop

    selectedHeight = virtual 
      ? this.props.itemHeight 
      : selected.offsetHeight

    bottom =  selectedTop + selectedHeight

    list.scrollTop = scrollTop > selectedTop
      ? selectedTop
      : bottom > (scrollTop + listHeight) 
          ? (bottom - listHeight)
          : scrollTop
  }

})