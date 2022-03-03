import { FromBottom } from 'Components/ui/animate'
import { useEngine } from 'Components/utils/EngineContext'
import { Markdown } from 'Components/utils/markdown'
import { Button } from 'DesignSystem/buttons'
import { Spacing } from 'DesignSystem/layout'
import { H3 } from 'DesignSystem/typography/heading'
import { Trans } from 'react-i18next'

export default function CotisationsRégularisation() {
	const rule = useEngine().getRule(
		'dirigeant . indépendant . cotisations et contributions . régularisation'
	)
	return (
		<FromBottom>
			<div>
				<H3 as="h2">{rule.title}</H3>
				<Markdown>{rule.rawNode.description ?? ''}</Markdown>

				{rule.rawNode.références && (
					<>
						<Spacing lg />
						<Button
							light
							size="XS"
							href={Object.values(rule.rawNode.références)[0]}
						>
							<Trans>Voir la fiche Urssaf</Trans>
						</Button>
						<Spacing lg />
					</>
				)}
			</div>
		</FromBottom>
	)
}
