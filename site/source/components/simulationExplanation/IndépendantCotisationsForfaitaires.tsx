import { Trans } from 'react-i18next'

import Value from '@/components/EngineValue/Value'
import { FromBottom } from '@/components/ui/animate'
import { useEngine } from '@/components/utils/EngineContext'
import { Button, H3, Intro, Markdown, Message, Spacing } from '@/design-system'

export default function CotisationsForfaitaires() {
	const rule = useEngine().getRule(
		'dirigeant . indépendant . cotisations et contributions . début activité'
	)

	return (
		<FromBottom>
			<Message>
				<H3 as="h2">{rule.title}</H3>
				<Intro>
					<Trans i18nKey="pages.simulateurs.indépendant.cotisations-forfaitaires">
						Montant des cotisations forfaitaires :{' '}
					</Trans>
					<Value expression="dirigeant . indépendant . cotisations et contributions . début activité" />
				</Intro>

				<Markdown>{rule.rawNode.description ?? ''}</Markdown>
				{rule.rawNode.références && (
					<>
						<Spacing md />
						<Button
							href={Object.values(rule.rawNode.références)[0]}
							size="XS"
							light
						>
							<Trans>Voir la fiche Urssaf</Trans>
						</Button>
						<Spacing lg />
					</>
				)}
			</Message>
		</FromBottom>
	)
}
