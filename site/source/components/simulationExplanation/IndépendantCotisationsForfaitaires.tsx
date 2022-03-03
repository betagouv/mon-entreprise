import Value from 'Components/EngineValue'
import { FromBottom } from 'Components/ui/animate'
import { useEngine } from 'Components/utils/EngineContext'
import { Markdown } from 'Components/utils/markdown'
import { Button } from 'DesignSystem/buttons'
import { Spacing } from 'DesignSystem/layout'
import { H3 } from 'DesignSystem/typography/heading'
import { Intro } from 'DesignSystem/typography/paragraphs'
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
