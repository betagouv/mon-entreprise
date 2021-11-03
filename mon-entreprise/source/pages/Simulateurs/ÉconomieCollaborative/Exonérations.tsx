import { useContext } from 'react'
import { Trans } from 'react-i18next'
import { CheckItem, Checklist } from 'Components/ui/Checklist'
import { changeCritèreExonération } from './actions'
import { StoreContext } from './StoreContext'
import { Activity } from './Activité'

export default function Exonération({
	exceptionsExonération,
	exonération,
	activité,
}: any) {
	const { state, dispatch } = useContext(StoreContext)
	if (!exceptionsExonération && !exonération) return null
	const defaultChecked = state[activité].critèresExonération
	console.log(defaultChecked)
	return (
		<>
			<h2>
				<Trans i18nKey="économieCollaborative.exonération.question">
					Êtes-vous dans un des cas suivants ?
				</Trans>
			</h2>
			<Checklist
				onItemCheck={(index, checked) =>
					dispatch(changeCritèreExonération(activité, index, checked))
				}
				defaultChecked={defaultChecked}
			>
				{(exceptionsExonération || exonération).map(
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
				{exceptionsExonération && (
					<Trans i18nKey="économieCollaborative.exonération.exception-notice">
						Si aucun de ces cas ne s'applique à vous, vous n'aurez rien à
						déclarer.
					</Trans>
				)}
				{exonération && (
					<Trans i18nKey="économieCollaborative.exonération.notice">
						Si un de ces cas s'applique à vous, vous n'aurez rien à déclarer.
					</Trans>
				)}
			</p>
		</>
	)
}
