import React from 'react'
import {connect} from 'react-redux'
import TagNavigation from '../components/TagNavigation'
import Variables from '../components/Variables'
import * as actions from '../actions'
import {bindActionCreators} from 'redux'
import {tagsToSelectSelector, variablesSelector} from '../selectors/selectors'


class Explorer extends React.Component {
	render() {
		let {variables, selectedTags, selectedVariable, tagsToSelect, actions: {selectTag, resetTags, selectVariable}} = this.props
		return (
			<div>
				<h1>Les prélèvements sociaux sur les salaires</h1>
				<TagNavigation selectedTags={selectedTags} tagsToSelect={tagsToSelect} selectTag={selectTag} resetTags={resetTags}/>
				<Variables variables={variables}
					selectedTags={selectedTags} selectedVariable={selectedVariable}
					selectVariable={selectVariable}/>
			</div>
		)
	}
}


const mapStateToProps = state => (
	{
		selectedTags: state.selectedTags,
		tagsToSelect: tagsToSelectSelector(state),
		variables: variablesSelector(state),
		selectedVariable: state.selectedVariable
	}
)

const actionsToProps = dispatch => ({
	actions: bindActionCreators(actions, dispatch)
})

const VariableExplorer = connect(mapStateToProps, actionsToProps)(Explorer)

export default VariableExplorer
