import React from 'react'
import {selectVariables, selectTagStats} from '../selectors'
import {connect} from 'react-redux'

const Variable = ({data: {variable, tags}}) => <li className="variable">
	<h3>{variable}</h3>
	<ul>{Object.keys(tags).map(name => <li>
			{name + ': ' + tags[name]}
	</li>)}</ul>
</li>

class Explorer extends React.Component {
	render() {
		return (
			<div>
				<h1>Les prélèvements sociaux sur les salaires</h1>
				<ul id="tags">
					{this.props.tags.map(tag =>
						<TagSelect key={tag.name} tag={tag} />
					)}
				</ul>
				<ul id="variables">
					{this.props.variables.map((v, i) => <Variable key={i} data={v}/>)}
				</ul>
			</div>
		)
	}
}

class TagSelect extends React.Component {
	render(){
		let {name, choices, number} = this.props.tag
		return (<li>
			<span className="name">{`${name} (${number} variables)`}</span>
			<ul className="choices">
				{[...choices].map(c => <li key={c}>
					{c}
				</li>)}
			</ul>
		</li>)
	}
}

const mapStateToProps = (state) => (
	{
		variables: selectVariables(state),
		tags: selectTagStats(state)
	}
)

const VariableExplorer = connect(mapStateToProps)(Explorer)

export default VariableExplorer
