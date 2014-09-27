var React = require('react/addons')
var Widgets = require('../index')
var DropdownList = require('../src/dropdowns/Dropdown-List.jsx')
var Select = require('../src/select/select.jsx')
var CheckBoxList = require('../src/select/checkboxlist.jsx')
var Calendar = Widgets.Calendar
var DatePicker = Widgets.DateTimePicker
var NumberPicker = Widgets.NumberPicker
var ComboBox = require('../src/dropdowns/Combobox.jsx')
var chance = new (require('chance'))
//var _ = require('lodash')

var ListItem = React.createClass({

	render: function(){

		return (
			<span>{ "hi: " + this.props.item.name}</span>
		)
	}
})

var App = React.createClass({

	getInitialState: function(){
		var list = generateList()
		return {
			data: list,
			dropdownValue: list[0],
			comboboxValue: list[0],
			selectValues: [],
			calDate: new Date,
			numberValue: 1
		}
	},

	render: function(){
		var self = this;
		
		function change(field, data) {
			var obj = {}

			obj[field] = data
			self.setState(obj)
			//console.log('example: set field: ' + field, data)
		}

		return (
			<div style={{ fontSize: 14 }}>
				<div style={{ width: 200 }}>
					<section className="example" style={{ marginBottom: 20 }}>
						<DropdownList 
							isRtl={false}
							id='MyDropdownList'
							data={ this.state.data } 
							textField='name'
							valueField='id'
							busy={false}
							value={ this.state.dropdownValue} 
							onChange={change.bind(null, 'dropdownValue')}/>
					</section>
					<section className="example" style={{ marginBottom: 20 }}>
						<Calendar 
							id='Calendar'
							value={ new Date } 
							onChange={change.bind(null, 'calValue')}/>
					</section>
					<section className="example" style={{ marginBottom: 20 }}>
						<ComboBox 
							isRtl={false}
							data={ this.state.data } 
							textField='name'
							valueField='id'
							suggest={false}
							filter='startsWith'
							busy={false}
							virtualScroll={{
								initialItems: 20,
								itemHeight: 20
							}}
							value={ this.state.comboboxValue} 
							onChange={change.bind(null, 'comboboxValue')}/>
					</section>
					<section className="example" style={{ marginBottom: 20 }}>

					</section>

					<section className="example" style={{ marginBottom: 20 }}>
						<Select 
							isRtl={false}
							data={ this.state.data } 
							placeholder="hi i am a placeholder"
							textField='name'
							valueField='id'
							value={ this.state.selectValues } 

							tagComponent={ListItem}
							itemComponent={ListItem}
							onChange={change.bind(null, 'selectValues')}/>
					</section>
					<section className="example" style={{ marginBottom: 20 }}>
						<DatePicker 
							id='AwesomeDatePicker' 
							isRtl={false} 
							value={this.state.calDate} 
							onChange={change.bind(null, 'calDate')}/>
					</section>
					<section className="example" style={{ marginBottom: 20 }}>
						<NumberPicker id='AwesomeNumPicker' 
							isRtl={false} 
							min={0}
							max={5}
							format="c"
							value={this.state.numberValue} 
							onChange={change.bind(null, 'numberValue')}/>
 					</section>
				</div>
				<div className='clearfix'>
					<div className='c1' style={{ float: 'left', width: 150, height: 200 }}/>
					<div className='c2' style={{ float: 'left', width: 150, height: 200 }}/>
					<div className='c3' style={{ float: 'left', width: 150, height: 200 }}/>
					<div className='c4' style={{ float: 'left', width: 150, height: 200 }}/>
					<div className='c5' style={{ float: 'left', width: 150, height: 200 }}/>
					<div className='c6' style={{ float: 'left', width: 150, height: 200 }}/>
					<div className='c7' style={{ float: 'left', width: 150, height: 200 }}/>
					<div className='c8' style={{ float: 'left', width: 150, height: 200 }}/>
				</div>
			</div>

		)
	},


})

React.renderComponent(
	  App()
	, document.body);


				
function generateList(){
	var arr = new Array(300)

	for(var i = 0; i < arr.length; i++)
		arr[i] = { id: i + 1, name: chance.name() }

	return arr
}

					
							// 				<CheckBoxList 
							// isRtl={false}
							// data={ this.state.data } 
							// textField='name'
							// valueField='id'
							// value={ this.state.selectValues } 
							// onChange={change.bind(null, 'selectValues')}/>