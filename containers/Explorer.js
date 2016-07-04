import React from 'react'
import {connect} from 'react-redux'
import {getVariables} from '../selectors'
import TagNavigation from '../components/TagNavigation'

const Variable = ({data: {variable, tags}}) => <li className="variable">
	<h3>{variable}</h3>
	<ul>{Object.keys(tags).map(name => <li key={name}>
			{name + ': ' + tags[name]}
	</li>)}</ul>
</li>

class Explorer extends React.Component {
	render() {
		let {tags, actions, variables} = this.props
		return (
			<div>
				<h1>Les prélèvements sociaux sur les salaires</h1>
				<TagNavigation tags={tags} />
				<ul id="variables">
					{variables.map((v, i) => <Variable key={i} data={v}/>)}
				</ul>
			</div>
		)
	}
}


const mapStateToProps = state => (
	{
		variables: getVariables(state)
	}
)

const VariableExplorer = connect(mapStateToProps)(Explorer)

export default VariableExplorer
