import Value from '@/components/EngineValue'
import { FromBottom } from '@/components/ui/animate'
import { useEngine } from '@/components/utils/EngineContext'
import { Markdown } from '@/components/utils/markdown'
import { Button } from '@/design-system/buttons'
import { Spacing } from '@/design-system/layout'
import { H3 } from '@/design-system/typography/heading'
import { Intro } from '@/design-system/typography/paragraphs'
import { Trans } from 'react-i18next'

export default function CotisationsForfaitaires() {
	const rule = useEngine().getRule(
		'dirigeant . indépendant . cotisations et contributions . début activité'
	)
	return (
		<FromBottom>
			<div>
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
						<Spacing lg />
						<Button
							href={Object.values(rule.rawNode.références)[0]}
							size="XS"
							light
						>
							<Trans>Voir la fiche Urssaf</Trans>
						</Button>
					</>
				)}
			</div>
		</FromBottom>
	)
}
