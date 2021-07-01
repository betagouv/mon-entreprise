import { Explicable } from 'Components/conversation/Explicable'
import Value, { Condition } from 'Components/EngineValue'
import RuleLink from 'Components/RuleLink'
import Animate from 'Components/ui/animate'
import { useEngine } from 'Components/utils/EngineContext'
import { Markdown } from 'Components/utils/markdown'
import { DottedName } from 'modele-social'
import { useMemo } from 'react'
import emoji from 'react-easy-emoji'
import { Trans } from 'react-i18next'

export default function ResultatsParFormulaire() {
	const engine = useEngine()
	const informations = (Object.keys(engine.getParsedRules()) as DottedName[])
		.filter((s) =>
			s.startsWith(
				'aide déclaration revenu indépendant 2020 . informations résultat par formulaire . '
			)
		)
		.map((dottedName) => engine.getRule(dottedName))
	return (
		<section
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
						Vos déclarations fiscales
					</Trans>
				</h2>
				<p>
					Important : les montants affichés ici concernent uniquement le calcul
					des cotisations de l'exploitant (et du conjoint collaborateur si
					présent). Les rubriques avec le symbole (+) signifient qu'il vous
					faudra peut-être ajouter d'autres éléments au montant affiché pour une
					déclaration correcte.{' '}
				</p>
				<p>En cas de doute, référez-vous à votre expert comptable.</p>
				{(
					[
						'aide déclaration revenu indépendant 2020 . formulaire 2035',
						'aide déclaration revenu indépendant 2020 . formulaire 2033',
						'aide déclaration revenu indépendant 2020 . formulaire 2050',
						'aide déclaration revenu indépendant 2020 . formulaire 2042',
						'aide déclaration revenu indépendant 2020 . formulaire 2042 PRO C',
					] as const
				).map((dottedName) => (
					<DeclarationForm key={dottedName} dottedName={dottedName} />
				))}
				<Condition expression="aide déclaration revenu indépendant 2020 . informations résultat par formulaire">
					<h3>{emoji('ℹ️')} Pour votre information </h3>
					<div className="ui__ box-container">
						{informations.map((r) => (
							<Condition key={r.dottedName} expression={r.dottedName}>
								<Animate.fromTop style={{ display: 'flex' }}>
									<div
										className="ui__ box card"
										css={`
											margin: 0;
											flex: 1 !important;
										`}
									>
										<p>
											<RuleLink dottedName={r.dottedName} />
											<br />
											<small>{r.rawNode.résumé}</small>
										</p>

										{r.rawNode.description && (
											<div className="ui__ notice">
												<Markdown source={r.rawNode.description} />
											</div>
										)}
										<p className="ui__ lead" css="margin-bottom: 1rem;">
											<Value
												expression={r.dottedName}
												displayedUnit="€"
												unit="€/an"
												precision={0}
											/>
										</p>
									</div>
								</Animate.fromTop>
							</Condition>
						))}
					</div>
				</Condition>
			</div>
		</section>
	)
}

function DeclarationForm({ dottedName }: { dottedName: DottedName }) {
	const engine = useEngine()
	const r = engine.getRule(dottedName)
	const rubriques = useMemo(
		() =>
			Object.keys(engine.getParsedRules()).filter((name) =>
				name.startsWith(dottedName + ' . ')
			),
		[engine, dottedName]
	) as DottedName[]
	return (
		<Condition expression={dottedName} key={dottedName}>
			<Animate.fromTop>
				<div
					className="ui__ card"
					css={`
						display: flex;
						flex-direction: column;
						margin: 1rem 0;
					`}
				>
					<h3>
						{r.title} <small>{r.rawNode.résumé}</small>
					</h3>
					<ul className="ui__ lead">
						{rubriques
							.map((dottedName) => engine.getRule(dottedName))
							.map((node) => (
								<Condition expression={node.dottedName} key={node.dottedName}>
									<Animate.fromTop>
										<li key={node.dottedName}>
											<small>
												{node.rawNode.résumé}
												{node.rawNode.description && (
													<Explicable>
														<div style={{ marginTop: '1rem' }}>
															<Markdown source={node.rawNode.description} />
														</div>
													</Explicable>
												)}
											</small>
											<br />
											<strong>
												{node.title} :{' '}
												<Value expression={node.dottedName} displayedUnit="€" />
											</strong>{' '}
											{/* <small style={{ marginLeft: '0.2rem' }}>
											</small> */}
										</li>
									</Animate.fromTop>
								</Condition>
							))}
					</ul>
				</div>
			</Animate.fromTop>
		</Condition>
	)
}
