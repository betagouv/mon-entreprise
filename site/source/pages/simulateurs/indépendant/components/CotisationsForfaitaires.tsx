import { useTranslation } from 'react-i18next'

import { Condition } from '@/components/EngineValue/Condition'
import Value from '@/components/EngineValue/Value'
import { FromBottom } from '@/components/ui/animate'
import { Button, H3, Intro, Markdown, Message, Spacing } from '@/design-system'
import { useEngine } from '@/hooks/useEngine'

export default function CotisationsForfaitaires() {
	const { t } = useTranslation()
	const rule = useEngine().getRule(
		'indépendant . cotisations et contributions . début activité'
	)

	return (
		<FromBottom>
			<Message>
				<H3 as="h2">{rule.title}</H3>
				{/* TODO: supprimer cette Condition quand
						https://github.com/betagouv/mon-entreprise/issues/4035
						sera résolu */}
				<Condition
					non
					expression={{
						'toutes ces conditions': [
							'indépendant . PL . PAMC',
							"situation personnelle . domiciliation fiscale à l'étranger",
						],
					}}
				>
					<Intro>
						{t(
							'pages.simulateurs.indépendant.explications.cotisations.forfaitaires',
							'Cotisations forfaitaires :'
						)}{' '}
						<Value expression="indépendant . cotisations et contributions . début activité" />
					</Intro>
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
