import { Trans } from 'react-i18next'

import Value from '@/components/EngineValue'
import { FromBottom } from '@/components/ui/animate'
import { useEngine } from '@/components/utils/EngineContext'
import { Markdown } from '@/components/utils/markdown'
import { Message } from '@/design-system'
import { Button } from '@/design-system/buttons'
import { Spacing } from '@/design-system/layout'
import { H3 } from '@/design-system/typography/heading'
import { Intro } from '@/design-system/typography/paragraphs'

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
