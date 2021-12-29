import { Grid } from '@mui/material'
import Value, { Condition } from 'Components/EngineValue'
import RuleLink from 'Components/RuleLink'
import { FromTop } from 'Components/ui/animate'
import Emoji from 'Components/utils/Emoji'
import { useEngine } from 'Components/utils/EngineContext'
import { Markdown } from 'Components/utils/markdown'
import { H2, H3 } from 'DesignSystem/typography/heading'
import { Link } from 'DesignSystem/typography/link'
import { Body, Intro } from 'DesignSystem/typography/paragraphs'
import { Trans } from 'react-i18next'

export default function ResultatsSimples() {
	const engine = useEngine()

	return (
		<>
			<H2>
				<Emoji emoji="📄" />{' '}
				<Trans i18nKey="aide-déclaration-indépendant.results.title">
					Montants à reporter dans votre déclaration de revenus
				</Trans>
			</H2>
			<Body>
				L'ancienne Déclaration Sociale des Indépendant (DSI) qui était
				précédemment à effectuer sur le site net-entreprises.fr est désormais
				intégrée à la déclaration fiscale des revenus (déclaration 2042) sur
				impots.gouv.fr.{' '}
				<Link
					href="https://www.impots.gouv.fr/portail/www2/minisite/declaration/independants.html?11"
					target="_blank"
				>
					En savoir plus
				</Link>
			</Body>
			<Body>
				Vous pouvez reporter les montants suivants dans votre déclaration,
				calculés à partir des informations saisies.
			</Body>
			{(
				[
					'aide déclaration revenu indépendant 2020 . résultat simple . cotisations obligatoires',
					'aide déclaration revenu indépendant 2020 . résultat simple . total charges sociales déductible',
				] as const
			).map((dottedName) => {
				const r = engine.getRule(dottedName)
				if (engine.evaluate(dottedName).nodeValue === false) {
					return null
				}
				return (
					<FromTop key={dottedName}>
						<H3>
							{r.title}
							<Condition
								expression={{
									'toutes ces conditions': [
										'aide déclaration revenu indépendant 2020 . cotisations payées version simple = non',
										'entreprise . imposition . IR . micro-fiscal = non',
									],
								}}
							>
								&nbsp;
								<small>{r.rawNode.résumé}</small>
							</Condition>{' '}
							:{' '}
							<RuleLink dottedName={r.dottedName}>
								<Value
									expression={r.dottedName}
									displayedUnit="€"
									unit="€/an"
									precision={0}
								/>
							</RuleLink>
						</H3>

						{r.rawNode.description && (
							<Markdown>{r.rawNode.description}</Markdown>
						)}
					</FromTop>
				)
			})}
			<Condition
				expression={{
					'toutes ces conditions': [
						'aide déclaration revenu indépendant 2020 . cotisations payées version simple = non',
						'entreprise . imposition . IR . micro-fiscal = non',
					],
				}}
			>
				<H2>
					<Emoji emoji="ℹ️" /> Pour votre information{' '}
				</H2>
				<Grid container spacing={2}>
					{(
						[
							'aide déclaration revenu indépendant 2020 . réduction covid . total',
							'aide déclaration revenu indépendant 2020 . résultat simple . revenu net fiscal',
							'aide déclaration revenu indépendant 2020 . résultat simple . CSG déductible',
							'aide déclaration revenu indépendant 2020 . résultat simple . CFP',
							'aide déclaration revenu indépendant 2020 . résultat simple . assiette sociale',
						] as const
					).map((dottedName) => {
						const r = engine.getRule(dottedName)
						if (engine.evaluate(dottedName).nodeValue === false) {
							return null
						}
						return (
							<Grid item key={dottedName} xs={12} sm={6} md={4} lg={3}>
								<Intro>
									<RuleLink dottedName={r.dottedName} />
									&nbsp;
									<small>{r.rawNode.résumé}</small>
								</Intro>

								{r.rawNode.description && (
									<Markdown>{r.rawNode.description}</Markdown>
								)}
								<Intro>
									<RuleLink dottedName={r.dottedName}>
										<Value
											expression={r.dottedName}
											displayedUnit="€"
											unit="€/an"
											precision={0}
										/>
									</RuleLink>
								</Intro>
							</Grid>
						)
					})}
				</Grid>
			</Condition>
		</>
	)
}
