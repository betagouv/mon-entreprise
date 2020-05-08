import { explainVariable } from 'Actions/actions'
import React, { useContext } from 'react'
import emoji from 'react-easy-emoji'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'Reducers/rootReducer'
import { DottedName } from 'Rules'
import { TrackerContext } from '../utils/withTracker'
import './Explicable.css'
import { EngineContext } from 'Components/utils/EngineContext'

export default function Explicable({ dottedName }: { dottedName: DottedName }) {
	const rules = useContext(EngineContext).getParsedRules()
	const tracker = useContext(TrackerContext)
	const dispatch = useDispatch()
	const explained = useSelector((state: RootState) => state.explainedVariable)

	// Rien à expliquer ici, ce n'est pas une règle
	if (dottedName == null) return null

	const rule = rules[dottedName]

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
