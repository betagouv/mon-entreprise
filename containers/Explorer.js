import React from 'react'
import {connect} from 'react-redux'
import {getVariables} from '../selectors'
import TagNavigation from '../components/TagNavigation'
import Variables from '../components/Variables'
import * as actions from '../actions'
import {bindActionCreators} from 'redux'
import {getTagsToSelect} from '../selectors'


class Explorer extends React.Component {
	render() {
		let {variables, selectedTags, tagsToSelect, actions: {selectTag}} = this.props
		return (
			<div>
				<h1>Liste des prélèvements sociaux sur les salaires en France</h1>
				<TagNavigation selectedTags={selectedTags} tagsToSelect={tagsToSelect} selectTag={selectTag}/>
				<Variables variables={variables} selectedTags={selectedTags} />
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
