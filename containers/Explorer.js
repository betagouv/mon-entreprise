import React from 'react'
import {selectVariables, selectTagStats} from '../selectors'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as actions from '../actions'

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
				<ul id="tags">
					{tags.map(tag =>
						<TagSelect selectTag={actions.selectTag} key={tag.name} tag={tag} />
					)}
				</ul>
				<ul id="variables">
					{variables.map((v, i) => <Variable key={i} data={v}/>)}
				</ul>
			</div>
		)
	}
}

class TagSelect extends React.Component {
	render(){
		let {tag: {name, choices, number}, selectTag} = this.props
		return (<li>
			<span className="name">{`${name} (${number} variables)`}</span>
			<ul className="choices">
				{[...choices].map(c =>
					<li key={c} onClick={() => selectTag(name, c)}>
					{c}
					</li>
				)}
			</ul>
		</li>)
	}
}

const mapStateToProps = state => (
	{
		variables: selectVariables(state),
		tags: selectTagStats(state)
	}
)

const actionsToProps = dispatch => ({
	actions: bindActionCreators(actions, dispatch),
})

const VariableExplorer = connect(mapStateToProps, actionsToProps)(Explorer)

export default VariableExplorer
