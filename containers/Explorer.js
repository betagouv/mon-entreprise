import React from 'react'
import {connect} from 'react-redux'
import {getVariables} from '../selectors'
import TagNavigation from '../components/TagNavigation'
import * as actions from '../actions'
import {bindActionCreators} from 'redux'
import {getTagsToSelect} from '../selectors'


const Variable = ({variable: {variable, tags}, selectedTags}) => <li className="variable">
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

class Explorer extends React.Component {
	render() {
		let {variables, selectedTags, tagsToSelect, actions: {selectTag}} = this.props
		return (
			<div>
				<h1>Liste des prélèvements sociaux sur les salaires en France</h1>
				<TagNavigation selectedTags={selectedTags} tagsToSelect={tagsToSelect} selectTag={selectTag}/>
				<ul id="variables">
					{variables.map((v, i) => <Variable key={i} variable={v} selectedTags={selectedTags}/>)}
				</ul>
			</div>
		)
	}
}


const mapStateToProps = state => (
	{
		variables: getVariables(state),
		selectedTags: state.selectedTags,
		tagsToSelect: getTagsToSelect(state)
	}
)

const actionsToProps = dispatch => ({
	actions: bindActionCreators(actions, dispatch)
})

const VariableExplorer = connect(mapStateToProps, actionsToProps)(Explorer)

export default VariableExplorer
