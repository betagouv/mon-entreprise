import { Grid } from '@mui/material'
import Value, { Condition } from '~/components/EngineValue'
import RuleLink from '~/components/RuleLink'
import { FromTop } from '~/components/ui/animate'
import Emoji from '~/components/utils/Emoji'
import { useEngine } from '~/components/utils/EngineContext'
import { Markdown } from '~/components/utils/markdown'
import { Article } from '~/design-system/card'
import { H2, H3 } from '~/design-system/typography/heading'
import { Link } from '~/design-system/typography/link'
import { Body, Intro } from '~/design-system/typography/paragraphs'
import { utils } from 'publicodes'
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
					rel="noreferrer"
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
					'déclaration indépendants . résultat simple . cotisations obligatoires',
					'déclaration indépendants . résultat simple . total charges sociales déductible',
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
										'déclaration indépendants . cotisations payées version simple = non',
										'entreprise . imposition . IR . micro-fiscal = non',
									],
								}}
							>
								&nbsp;
								<small>{r.rawNode.résumé}</small>
							</Condition>{' '}
						</H3>
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

						{r.rawNode.description && (
							<Markdown>{r.rawNode.description}</Markdown>
						)}
					</FromTop>
				)
			})}
			<Condition
				expression={{
					'toutes ces conditions': [
						'déclaration indépendants . cotisations payées version simple = non',
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
							'déclaration indépendants . réduction covid . total',
							'déclaration indépendants . résultat simple . revenu net fiscal',
							'déclaration indépendants . résultat simple . CSG déductible',
							'déclaration indépendants . résultat simple . CFP',
							'déclaration indépendants . résultat simple . assiette sociale',
						] as const
					).map((dottedName) => {
						const r = engine.getRule(dottedName)
						if (engine.evaluate(dottedName).nodeValue === false) {
							return null
						}
						return (
							<Grid item key={dottedName} xs={12} sm={6} lg={4}>
								<Article
									to={`/documentation/${utils.encodeRuleName(dottedName)}`}
									ctaLabel={
										<Intro>
											<Value
												expression={r.dottedName}
												displayedUnit="€"
												unit="€/an"
												precision={0}
											/>
										</Intro>
									}
									title={
										<>
											<RuleLink dottedName={r.dottedName} />
											&nbsp;
											<small>{r.rawNode.résumé}</small>
										</>
									}
								>
									{r.rawNode.description && (
										<Markdown>{r.rawNode.description}</Markdown>
									)}
								</Article>
							</Grid>
						)
					})}
				</Grid>
			</Condition>
		</>
	)
}
