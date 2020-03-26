import { explainVariable } from 'Actions/actions'
import React, { useContext } from 'react'
import emoji from 'react-easy-emoji'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'Reducers/rootReducer'
import { parsedRulesSelector } from 'Selectors/analyseSelectors'
import { DottedName } from 'Types/rule'
import { TrackerContext } from '../utils/withTracker'
import './Explicable.css'

export default function Explicable({ dottedName }: { dottedName: DottedName }) {
	const tracker = useContext(TrackerContext)
	const dispatch = useDispatch()
	const explained = useSelector((state: RootState) => state.explainedVariable)
	const rules = useSelector(parsedRulesSelector)

	// Rien à expliquer ici, ce n'est pas une règle
	if (dottedName == null) return null

	let rule = rules[dottedName]

	if (rule.description == null) return null

	//TODO montrer les variables de type 'une possibilité'

	return (
		<button
			className="ui__ link-button"
			onClick={e => {
				tracker.push(['trackEvent', 'help', dottedName])
				dispatch(explainVariable(dottedName))
				e.preventDefault()
				e.stopPropagation()
			}}
			css={`
				margin-left: 0.3rem !important;
				vertical-align: middle;
				font-size: 110% !important;
			`}
		>
			{emoji('ℹ️')}
		</button>
	)
}
