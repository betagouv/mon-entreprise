import { CheckItem, Checklist } from 'Components/ui/Checklist'
import { H2 } from 'DesignSystem/typography/heading'
import { Body, SmallBody } from 'DesignSystem/typography/paragraphs'
import { useContext } from 'react'
import { Trans } from 'react-i18next'
import { changeCritèreExonération } from './actions'
import { Activity } from './Activité'
import { StoreContext } from './StoreContext'

export default function Exonération({
	exceptionsExonération,
	exonération,
	activité,
}: any) {
	const { state, dispatch } = useContext(StoreContext)
	if (!exceptionsExonération && !exonération) return null
	const defaultChecked = state[activité].critèresExonération
	return (
		<>
			<H2>
				<Trans i18nKey="économieCollaborative.exonération.question">
					Êtes-vous dans un des cas suivants ?
				</Trans>
			</H2>
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
							explanations={<SmallBody>{explication}</SmallBody>}
						/>
					)
				)}
			</Checklist>
			<Body>
				{exceptionsExonération && (
					<Trans i18nKey="économieCollaborative.exonération.exception-notice">
						Si aucun de ces cas ne s'applique à vous, vous n'aurez rien à
						déclarer.
					</Trans>
				)}
				{exonération && (
					<Trans i18nKey="économieCollaborative.exonération.notice">
						Si l'un de ces cas s'applique à vous, vous n'aurez rien à déclarer.
					</Trans>
				)}
			</Body>
		</>
	)
}
