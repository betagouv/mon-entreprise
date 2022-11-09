import { utils } from 'publicodes'
import { Trans, useTranslation } from 'react-i18next'

import Value, { Condition } from '@/components/EngineValue'
import RuleLink from '@/components/RuleLink'
import { FromTop } from '@/components/ui/animate'
import Emoji from '@/components/utils/Emoji'
import { useEngine } from '@/components/utils/EngineContext'
import { Markdown } from '@/components/utils/markdown'
import { Article } from '@/design-system/card'
import { Container, Grid, Spacing } from '@/design-system/layout'
import { H2, H3 } from '@/design-system/typography/heading'
import { Link } from '@/design-system/typography/link'
import { Body, Intro } from '@/design-system/typography/paragraphs'

export default function ResultatsSimples() {
	const engine = useEngine()
	const { t } = useTranslation()

	return (
		<>
			<Spacing lg />

			<Container
				darkMode
				backgroundColor={(theme) => theme.colors.bases.primary[600]}
			>
				{' '}
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
						aria-label={t(
							'En savoir plus sur impots.gouv.fr, nouvelle fenêtre'
						)}
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
						'déclaration charge sociales . résultat . cotisations obligatoires',
						'déclaration charge sociales . résultat . total charges sociales déductible',
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
											'déclaration charge sociales . cotisations payées = non',
											'entreprise . imposition . régime . micro-entreprise = non',
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
				<Spacing lg />
			</Container>
			<Condition
				expression={{
					'toutes ces conditions': [
						'déclaration charge sociales . cotisations payées = non',
						'entreprise . imposition . régime . micro-entreprise = non',
					],
				}}
			>
				<H2>
					<Emoji emoji="ℹ️" /> Pour votre information{' '}
				</H2>
				<Grid container spacing={2}>
					{(
						[
							'dirigeant . indépendant . cotisations et contributions . exonérations . covid . total',
							'déclaration charge sociales . résultat . revenu net fiscal',
							'déclaration charge sociales . résultat . CSG déductible',
							'déclaration charge sociales . résultat . CFP',
							'déclaration charge sociales . résultat . assiette sociale',
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
												linkToRule={false}
											/>
										</Intro>
									}
									title={
										<>
											<span>{r.title}</span>
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
