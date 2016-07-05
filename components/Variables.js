import React from 'react'

import colors from './variable-colors.yaml'

function convertHex(hex,opacity){
	let	r = parseInt(hex.substring(0,2), 16),
		g = parseInt(hex.substring(2,4), 16),
		b = parseInt(hex.substring(4,6), 16),
		result =`rgba(${r},${g},${b},${opacity})`

	return result
}

const Variable = ({variable: {variable, tags}, selectedTags, variableColors}) =>
	<li className="variable" style={{background: convertHex(variableColors[variable], .15)}}>
		<h3>{variable}</h3>
		<ul>
			{Object.keys(tags)
					.filter(name => !selectedTags.find(([n]) => name == n))
					.map(name =>
						<li key={name}>
							{name + ': ' + tags[name]}
						</li>
					)}
		</ul>
	</li>

export default class Variables extends React.Component {
	render(){
		let {variables, selectedTags} = this.props,
			variableSet =
				variables.reduce((set, {variable}) => set.add(variable), new Set()), // get unique variable names
			variableColors = [...variableSet].reduce((correspondance, v, i) => Object.assign(correspondance, {[v]: colors[i]}), {})

		return <ul id="variables">
			{variables.map((v, i) => <Variable variableColors={variableColors} key={i} variable={v} selectedTags={selectedTags}/>)}
		</ul>
	}
}
