import Value from 'Components/EngineValue'
import { FromBottom } from 'Components/ui/animate'
import Emoji from 'Components/utils/Emoji'
import { useEngine } from 'Components/utils/EngineContext'
import { Markdown } from 'Components/utils/markdown'
import { Button } from 'DesignSystem/buttons'
import { H2 } from 'DesignSystem/typography/heading'
import { Body, Intro } from 'DesignSystem/typography/paragraphs'
import { Trans } from 'react-i18next'

export default function CotisationsForfaitaires() {
	const rule = useEngine().getRule(
		'dirigeant . indépendant . cotisations et contributions . début activité'
	)
	return (
		<FromBottom>
			<H2>{rule.title}</H2>
			<Intro>
				<Trans i18nKey="pages.simulateurs.indépendant.cotisations-forfaitaires">
					Montant des cotisations forfaitaires :{' '}
				</Trans>
				<strong>
					<Value expression="dirigeant . indépendant . cotisations et contributions . début activité" />
				</strong>
			</Intro>

			<Markdown source={rule.rawNode.description} />
			<Body>
				{rule.rawNode.références && (
					<Button
						href={Object.values(rule.rawNode.références)[0]}
						target="_blank"
						size="XS"
						light
					>
						<Emoji emoji="👉" /> <Trans>Voir la fiche Urssaf</Trans>
					</Button>
				)}
			</Body>
		</FromBottom>
	)
}
