import { Trans } from 'react-i18next'

import { FromBottom } from '@/components/ui/animate'
import { useEngine } from '@/components/utils/EngineContext'
import Markdown from '@/components/utils/Markdown/Markdown'
import { Button } from '@/design-system/buttons'
import { Spacing } from '@/design-system/layout'
import { H3 } from '@/design-system/typography/heading'

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
