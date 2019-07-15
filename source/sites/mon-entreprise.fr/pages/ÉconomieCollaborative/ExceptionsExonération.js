import React, { useContext } from 'react'
import { CheckItem, Checklist } from 'Ui/Checklist'
import { changeCritèreExonération } from './actions'
import { StoreContext } from './StoreContext'

export default function ExceptionsExonération({
	exceptionsExonération,
	activité
}) {
	const { state, dispatch } = useContext(StoreContext)
	if (!exceptionsExonération) return null
	const defaultChecked = state[activité].critèresExonération.map(
		estRespecté => !estRespecté
	)

	return (
		<>
			<h2>Êtes-vous dans un des cas suivants ?</h2>
			<Checklist
				onItemCheck={(index, checked) =>
					dispatch(changeCritèreExonération(activité, index, !checked))
				}
				defaultChecked={defaultChecked}>
				{exceptionsExonération.map(({ titre, explication }, index) => (
					<CheckItem
						key={index}
						name={index}
						title={titre}
						explanations={explication}
					/>
				))}
			</Checklist>
			<p className="ui__ notice">
				Si aucun de ces cas ne s'appliquent à vous, vous n'aurez rien à
				déclarer.
			</p>
		</>
	)
}
