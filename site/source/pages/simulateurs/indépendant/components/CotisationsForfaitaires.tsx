import { useTranslation } from 'react-i18next'

import { Condition } from '@/components/EngineValue/Condition'
import Value from '@/components/EngineValue/Value'
import { WhenApplicable } from '@/components/EngineValue/WhenApplicable'
import { FromBottom } from '@/components/ui/animate'
import {
	Body,
	Button,
	H3,
	Intro,
	Markdown,
	Message,
	Spacing,
} from '@/design-system'
import { useEngine } from '@/utils/publicodes/EngineContext'

export default function CotisationsForfaitaires() {
	const { t } = useTranslation()
	const rule = useEngine().getRule(
		'indépendant . cotisations et contributions . début activité'
	)

	return (
		<FromBottom>
			<Message>
				<H3 as="h2">{rule.title}</H3>
				<WhenApplicable dottedName="indépendant . cotisations et contributions . début activité">
					<Intro>
						{t(
							'pages.simulateurs.indépendant.explications.cotisations.forfaitaires',
							'Cotisations forfaitaires :'
						)}{' '}
						<Value expression="indépendant . cotisations et contributions . début activité" />
					</Intro>
				</WhenApplicable>
				<Condition expression="indépendant . cotisations et contributions . cotisations . exonérations . invalidité">
					<Body>
						<em>
							{t(
								'pages.simulateurs.indépendant.explications.cotisations.invalidité',
								'Le calcul des cotisations forfaitaires de début d’activité n’est pas encore implémenté pour les cas incluant une pension invalidité.'
							)}
						</em>
					</Body>
				</Condition>

				<Markdown>{rule.rawNode.description ?? ''}</Markdown>
				{rule.rawNode.références && (
					<>
						<Spacing md />
						<Button
							href={Object.values(rule.rawNode.références)[0]}
							size="XS"
							light
						>
							{t(
								'pages.simulateurs.indépendant.explications.cotisations.fiche',
								'Voir la fiche Urssaf'
							)}
						</Button>
						<Spacing lg />
					</>
				)}
			</Message>
		</FromBottom>
	)
}
