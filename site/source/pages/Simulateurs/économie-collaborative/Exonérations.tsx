import { useContext } from 'react'
import { Trans } from 'react-i18next'

import { CheckItem, Checklist } from '@/components/ui/Checklist'
import { H2 } from '@/design-system/typography/heading'
import { Body, SmallBody } from '@/design-system/typography/paragraphs'

import { Activity } from './Activité'
import { StoreContext } from './StoreContext'
import { changeCritèreExonération } from './actions'

export default function Exonération({
	exceptionsExonération,
	exonération,
	activité,
}: {
	exceptionsExonération?: Readonly<Readonly<Activity>[]>
	exonération?: Readonly<Readonly<Activity>[]>
	activité: string
}) {
	const { state, dispatch } = useContext(StoreContext)
	if (!exceptionsExonération && !exonération) {
		return null
	}
	const defaultChecked = state?.[activité].critèresExonération.reduce(
		(acc, el, i) => ({ ...acc, [i]: el }),
		{} as { [key: string]: boolean }
	)

	return (
		<>
			<H2>
				<Trans i18nKey="économieCollaborative.exonération.question">
					Êtes-vous dans un des cas suivants ?
				</Trans>
			</H2>
			<Checklist
				onItemCheck={(index, checked) => {
					dispatch?.(changeCritèreExonération(activité, index, checked))
				}}
				defaultChecked={defaultChecked}
			>
				{(exceptionsExonération ?? exonération ?? []).map(
					({ titre, explication }, index) => (
						<CheckItem
							key={index}
							name={index.toString()}
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
