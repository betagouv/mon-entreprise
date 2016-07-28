import React from 'react'

import SelectedVariable from './SelectedVariable'
import colors from './variable-colors.yaml'
console.log(colors.length);
import R from 'ramda'

function convertHex(hex,opacity){
	let	r = parseInt(hex.substring(0,2), 16),
		g = parseInt(hex.substring(2,4), 16),
		b = parseInt(hex.substring(4,6), 16),
		result =`rgba(${r},${g},${b},${opacity})`

	return result
}

const Variable = ({color, name, selectVariable}) =>
	<li
		className="variable" style={{background: convertHex(color, .2)}}
		onClick={() => selectVariable(name)} >
		<h3>{name}</h3>
	</li>

export default class Variables extends React.Component {
	render(){
		let {variables, selectedTags, selectedVariable, selectVariable} = this.props
		console.log('variables prop in <Variables', variables)
		// let
		// 	variableSet =
		// 		variables.reduce((set, {variable}) => set.add(variable), new Set()), // get unique variable names
		// 	variableColors = [...variableSet].reduce((correspondance, v, i) => Object.assign(correspondance, {[v]: colors[i]}), {})

		console.log('selectedVariable',selectedVariable)
		if (selectedVariable != null)
			return <SelectedVariable
				variable={R.find(R.propEq('name', selectedVariable))(variables)}
				selectedTags={selectedTags}
			/>

		return <ul id="variables">
			{variables.map((v, i) =>
				<Variable key={i}
					color={colors[i]} name={v.name}
					selectVariable={selectVariable}
					/>
			)}
		</ul>
	}
}
