import Value, { Condition } from 'Components/EngineValue'
import RuleLink from 'Components/RuleLink'
import Animate from 'Components/ui/animate'
import { useEngine } from 'Components/utils/EngineContext'
import { Markdown } from 'Components/utils/markdown'
import emoji from 'react-easy-emoji'
import { Trans } from 'react-i18next'

export default function ResultatsSimples() {
	const engine = useEngine()

	return (
		<div
			className="ui__ full-width lighter-bg"
			css={`
				margin-top: 2rem;
			`}
		>
			<div
				className="ui__ container"
				css={`
					display: flex;
					flex-direction: column;
				`}
			>
				<h2>
					{emoji('📄')}{' '}
					<Trans i18nKey="aide-déclaration-indépendant.results.title">
						Montants à reporter dans votre déclaration de revenus
					</Trans>
				</h2>
				<p>
					L'ancienne Déclaration Sociale des Indépendant (DSI) qui était
					précédemment à effectuer sur le site net-entreprises.fr est désormais
					intégrée à la déclaration fiscale des revenus (déclaration 2042) sur
					impots.gouv.fr.{' '}
					<a
						href="https://www.impots.gouv.fr/portail/www2/minisite/declaration/independants.html?11"
						target="_blank"
					>
						En savoir plus
					</a>
				</p>
				<p>
					Vous pouvez reporter les montants suivants dans votre déclaration,
					calculés à partir des informations saisies.
				</p>
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
						<Animate.fromTop key={dottedName}>
							<div
								className="ui__ card"
								css={`
									display: flex;
									flex-direction: column;
									margin: 1rem 0;
								`}
							>
								<h3>
									{r.title}
									<Condition
										expression={{
											'toutes ces conditions': [
												'aide déclaration revenu indépendant 2020 . cotisations payées version simple = non',
												'entreprise . imposition . IR . micro-fiscal = non',
											],
										}}
									>
										<small>{r.rawNode.résumé}</small>
									</Condition>
								</h3>
								<p className="ui__ lead" css="margin-bottom: 1rem;">
									<strong>
										<RuleLink dottedName={r.dottedName}>
											<Value
												expression={r.dottedName}
												displayedUnit="€"
												unit="€/an"
												precision={0}
											/>
										</RuleLink>
									</strong>
								</p>
								{r.rawNode.description && (
									<div className="ui__ notice">
										<Markdown source={r.rawNode.description} />
									</div>
								)}
							</div>
						</Animate.fromTop>
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
					<h2>{emoji('ℹ️')} Pour votre information </h2>
					<div
						css={`
							margin: 0 -0.5rem;
							display: grid;
							grid-gap: 0.5rem;
							grid-template-columns: repeat(3, auto);
						`}
					>
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
								<Animate.fromTop style={{ display: 'flex' }} key={dottedName}>
									<div
										className="ui__ box card"
										css={`
											margin: 0;
											flex: 1 !important;
										`}
									>
										<p className="ui__ lead">
											<RuleLink dottedName={r.dottedName} />{' '}
											<small>{r.rawNode.résumé}</small>
										</p>

										{r.rawNode.description && (
											<div className="ui__ notice">
												<Markdown source={r.rawNode.description} />
											</div>
										)}
										<p className="ui__ lead" css="margin-bottom: 1rem;">
											<RuleLink dottedName={r.dottedName}>
												<Value
													expression={r.dottedName}
													displayedUnit="€"
													unit="€/an"
													precision={0}
												/>
											</RuleLink>
										</p>
									</div>
								</Animate.fromTop>
							)
						})}
					</div>
				</Condition>
			</div>
		</div>
	)
}
