/* @flow */

import Observer from '@researchgate/react-intersection-observer'
import withColours from 'Components/utils/withColours'
import React, { Component } from 'react'
import emoji from 'react-easy-emoji'
import { Trans } from 'react-i18next'
import { connect } from 'react-redux'
import { config, Spring } from 'react-spring'
import { compose } from 'redux'
import répartitionSelector from 'Selectors/repartitionSelectors'
import Montant from 'Ui/Montant'
import { isIE } from '../utils'
import './Distribution.css'
import './PaySlip'
import RuleLink from './RuleLink'
import type { ThemeColours } from 'Components/utils/withColours'
import type { Répartition } from 'Types/ResultViewTypes.js'

type Props = ?Répartition & {
	colours: ThemeColours
}
type State = {
	branchesInViewport: Array<string>
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
			colours: { colour },
			// $FlowFixMe
			...distribution
		} = this.props
		if (!Object.values(distribution).length) {
			return null
		}
		const {
			répartition,
			cotisationMaximum,
			total,
			salaireChargé,
			salaireNet
		} = distribution
		return (
			<>
				<div className="distribution-chart__container">
					{répartition.map(([branche, { partPatronale, partSalariale }]) => {
						const brancheInViewport =
							this.state.branchesInViewport.indexOf(branche.id) !== -1
						const montant = brancheInViewport
							? partPatronale + partSalariale
							: 0
						return (
							<Observer
								key={branche.id}
								threshold={[0.5]}
								onChange={this.handleBrancheInViewport(branche.id)}>
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
											<BranchIcône icône={branche.icône} />
											<div className="distribution-chart__item-content">
												<p className="distribution-chart__counterparts">
													<span className="distribution-chart__branche-name">
														<RuleLink {...branche} />
													</span>
													{' : '}
													{branche.descriptionCourte}
												</p>
												<ChartItemBar {...{ styles, colour, montant, total }} />
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
					<Montant numFractionDigit={0}>{salaireNet.montant}</Montant>
					<span>+</span>
					<Trans>Cotisations</Trans>
					<Montant numFractionDigit={0}>
						{total.partPatronale + total.partSalariale}
					</Montant>
					<span />
					<div className="distribution-chart__total-border" />
					<span>=</span>
					<RuleLink {...salaireChargé} />
					<Montant numFractionDigit={0}>{salaireChargé.montant}</Montant>
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

let ChartItemBar = ({ styles, colour, montant, total }) => (
	<div className="distribution-chart__bar-container">
		<div
			className="distribution-chart__bar"
			style={{
				backgroundColor: colour,
				...(!isIE()
					? { flex: styles.flex }
					: { minWidth: styles.flex * 500 + 'px' })
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
				{montant / (total.partPatronale + total.partSalariale)}
			</Montant>
		</div>
	</div>
)

let BranchIcône = ({ icône }) => (
	<div className="distribution-chart__legend">
		<span className="distribution-chart__icon">{emoji(icône)}</span>
	</div>
)
