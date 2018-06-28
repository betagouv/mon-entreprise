/* @flow */

import Observer from '@researchgate/react-intersection-observer'
import React, { Component } from 'react'
import emoji from 'react-easy-emoji'
import { Trans } from 'react-i18next'
import { connect } from 'react-redux'
import { config, Spring } from 'react-spring'
import { compose } from 'redux'
import withColours from '../withColours'
import './Distribution.css'
import Montant from './Montant'
import './PaySlip'
import RuleLink from './RuleLink'
import répartitionSelector from './RépartitionSelector'

import type { Répartition, Branche } from './types'

const brancheToEmoji: { [Branche]: string } = {
	retraite: '👵',
	santé: '🏥',
	famille: '👶',
	formation: '👩‍🎓',
	logement: '🏡',
	'accidents du travail / maladies professionnelles': '☣️',
	'assurance chômage': '💸',
	transport: '🚌',
	autres: '🔧'
}

const brancheToLabel: { [Branche]: string } = {
	'accidents du travail / maladies professionnelles': 'accidents',
	'assurance chômage': 'chômage'
}

type Props = Répartition & {
	colours: { colour: string }
}
type State = {
	branchesInViewport: Array<Branche>
}

const ANIMATION_SPRING = config.gentle
class Distribution extends Component<Props, State> {
	elementRef = null
	state = {
		branchesInViewport: []
	}
	handleBrancheInViewport = branche => (event, unobserve) => {
		if (!event.isIntersecting) {
			return
		}
		unobserve()
		this.setState(({ branchesInViewport }) => ({
			branchesInViewport: [branche, ...branchesInViewport]
		}))
	}

	render() {
		const {
			répartition,
			cotisationMaximum,
			réductionsDeCotisations,
			total,
			salaireChargé,
			salaireNet,
			colours: { colour }
		} = this.props
		return (
			<>
				<div className="distribution-chart__container">
					{répartition.map(([branche, { partPatronale, partSalariale }]) => {
						const brancheInViewport =
							this.state.branchesInViewport.indexOf(branche) !== -1
						const montant = brancheInViewport
							? partPatronale + partSalariale
							: 0
						return (
							<Observer
								key={branche}
								threshold={[0.75]}
								onChange={this.handleBrancheInViewport(branche)}>
								<Spring
									config={ANIMATION_SPRING}
									to={{
										flex: montant / cotisationMaximum,
										opacity: montant ? 1 : 0
									}}>
									{styles => (
										<div
											className="distribution-chart__item"
											style={{
												opacity: styles.opacity
											}}>
											<div className="distribution-chart__legend">
												<span className="distribution-chart__icon">
													{emoji(brancheToEmoji[branche])}
												</span>
												<span className="distribution-chart__branche-name">
													<Trans>{brancheToLabel[branche] || branche}</Trans>
												</span>
											</div>
											<div className="distribution-chart__bar-container">
												<div
													className="distribution-chart__bar"
													style={{
														flex: styles.flex,
														backgroundColor: colour
													}}
												/>
												<div>
													<Montant
														className="distribution-chart__amount"
														numFractionDigit={0}
														style={{ color: colour }}>
														{montant}
													</Montant>
													<Montant
														numFractionDigit={0}
														type="percent"
														className="distribution-chart__percent">
														{montant /
															(total.partPatronale + total.partSalariale)}
													</Montant>
												</div>
											</div>
										</div>
									)}
								</Spring>
							</Observer>
						)
					})}
				</div>
				<div className="distribution-chart__total">
					<span />
					<RuleLink {...salaireNet} />
					<Montant numFractionDigit={2}>{salaireNet.montant}</Montant>
					<span>+</span>
					<Trans>Cotisations</Trans>
					<Montant numFractionDigit={2}>
						{total.partPatronale +
							total.partSalariale}
					</Montant>
					<span />
					<div className="distribution-chart__total-border" />
					<span>=</span>
					<RuleLink {...salaireChargé} />
					<Montant numFractionDigit={2}>{salaireChargé.montant}</Montant>
				</div>
			</>
		)
	}
}
export default compose(
	withColours,
	connect(
		répartitionSelector,
		{}
	)
)(Distribution)
