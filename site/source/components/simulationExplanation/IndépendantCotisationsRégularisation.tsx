import { Trans } from 'react-i18next'

import { FromBottom } from '@/components/ui/animate'
import { useEngine } from '@/components/utils/EngineContext'
import { Button, H3, Markdown, Spacing } from '@/design-system'

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
