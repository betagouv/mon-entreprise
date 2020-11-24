import { useContext } from 'react'
import { Trans } from 'react-i18next'
import { CheckItem, Checklist } from 'Components/ui/Checklist'
import { changeCritèreExonération } from './actions'
import { StoreContext } from './StoreContext'
import { Activity } from './Activité'

export default function ExceptionsExonération({
	exceptionsExonération,
	activité
}: any) {
	const { state, dispatch } = useContext(StoreContext)
	if (!exceptionsExonération) return null
	const defaultChecked = state[activité].critèresExonération.map(
		(estRespecté: boolean) => !estRespecté
	)

	return (
		<>
			<h2>
				<Trans i18nKey="économieCollaborative.exonération.question">
					Êtes-vous dans un des cas suivants ?
				</Trans>
			</h2>
			<Checklist
				onItemCheck={(index, checked) =>
					dispatch(changeCritèreExonération(activité, index, !checked))
				}
				defaultChecked={defaultChecked}
			>
				{exceptionsExonération.map(
					({ titre, explication }: Activity, index: string) => (
						<CheckItem
							key={index}
							name={index}
							title={titre}
							explanations={explication}
						/>
					)
				)}
			</Checklist>
			<p className="ui__ notice">
				<Trans i18nKey="économieCollaborative.exonération.notice">
					Si aucun de ces cas ne s'applique à vous, vous n'aurez rien à
					déclarer.
				</Trans>
			</p>
		</>
	)
}
