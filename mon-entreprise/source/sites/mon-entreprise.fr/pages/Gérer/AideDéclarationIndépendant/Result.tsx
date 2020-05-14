import RuleLink from 'Components/RuleLink'
import { useEvaluation } from 'Components/utils/EngineContext'
import { formatValue } from 'publicodes'
import React from 'react'
import emoji from 'react-easy-emoji'
import { Trans } from 'react-i18next'
import Skeleton from 'react-loading-skeleton'
import ReactToPrint from 'react-to-print'
import Animate from 'Components/ui/animate'
import simulationConfig from './config.yaml'
import { DottedName } from 'Rules'

type ResultsProp = {
	componentRef?: any
}
export function Results({ componentRef }: ResultsProp) {
	const results = useEvaluation(simulationConfig.objectifs as Array<DottedName>)
	const onGoingComputation = !results.filter(node => node.nodeValue != null)
		.length
	return (
		<div
			className="ui__ card lighter-bg"
			css="margin-top: 3rem; padding: 1rem 0"
		>
			<h1 css="text-align: center; margin-bottom: 2rem">
				<Trans i18nKey="aide-déclaration-indépendant.results.title">
					Aide à la déclaration
				</Trans>
				{emoji('📄')}
			</h1>
			{onGoingComputation && (
				<h2>
					<small>
						<Trans i18nKey="aide-déclaration-indépendant.results.ongoing">
							Calcul en cours...
						</Trans>
					</small>
				</h2>
			)}
			<>
				<Animate.fromTop>
					{results.map(r => (
						<React.Fragment key={r.title}>
							<h4>
								{r.title} <small>{r.summary}</small>
							</h4>
							{r.description && <p className="ui__ notice">{r.description}</p>}
							<p className="ui__ lead" css="margin-bottom: 1rem;">
								<RuleLink dottedName={r.dottedName}>
									{r.nodeValue != null ? (
										formatValue({
											nodeValue: r.nodeValue || 0,
											language: 'fr',
											unit: '€',
											precision: 0
										})
									) : (
										<Skeleton width={80} />
									)}
								</RuleLink>
							</p>
						</React.Fragment>
					))}
					<p className="ui__ notice">
						Résultats calculés le {new Date().toLocaleDateString()}
					</p>
					{!onGoingComputation && (
						<div css="text-align: center">
							<style>
								{
									'@media print {.button.print{display: none;} body {margin: 40px;}}'
								}
							</style>
							<ReactToPrint
								trigger={() => (
									<button className="ui__ simple button print">
										{emoji('🖨')} Imprimer
									</button>
								)}
								content={() => componentRef.current}
							/>
						</div>
					)}
				</Animate.fromTop>
			</>
		</div>
	)
}
