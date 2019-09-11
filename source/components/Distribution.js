/* @flow */

import Observer from '@researchgate/react-intersection-observer'
import withColours from 'Components/utils/withColours'
import Value from 'Components/Value'
import { findRuleByDottedName } from 'Engine/rules'
import React, { useState } from 'react'
import emoji from 'react-easy-emoji'
import { Trans } from 'react-i18next'
import { connect } from 'react-redux'
import { config, Spring } from 'react-spring'
import { compose } from 'redux'
import { flatRulesSelector } from 'Selectors/analyseSelectors'
import répartitionSelector from 'Selectors/repartitionSelectors'
import { isIE } from '../utils'
import './Distribution.css'
import './PaySlip'
import RuleLink from './RuleLink'
import type { ThemeColours } from 'Components/utils/withColours'
import type { Répartition } from 'Types/ResultViewTypes.js'

type Props = ?Répartition & {
	colours: ThemeColours
}

const ANIMATION_SPRING = config.gentle
function Distribution({
	colours: { colour },
	rules,
	// $FlowFixMe
	...distribution
}: Props) {
	const [branchesInViewport, setBranchesInViewport] = useState([])

	const handleBrancheInViewport = branche => (event, unobserve) => {
		if (!event.isIntersecting) {
			return
		}
		unobserve()
		setBranchesInViewport(branchesInViewport => [
			branche,
			...branchesInViewport
		])
	}

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
				{répartition.map(
					([brancheDottedName, { partPatronale, partSalariale }]) => {
						const branche = findRuleByDottedName(rules, brancheDottedName),
							brancheInViewport =
								branchesInViewport.indexOf(brancheDottedName) !== -1
						const montant = brancheInViewport
							? partPatronale + partSalariale
							: 0

						return (
							<Observer
								key={brancheDottedName}
								threshold={[0.5]}
								onChange={handleBrancheInViewport(brancheDottedName)}>
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
											<BranchIcône icône={branche.icons} />
											<div className="distribution-chart__item-content">
												<p className="distribution-chart__counterparts">
													<span className="distribution-chart__branche-name">
														<RuleLink {...branche} />
													</span>
													<br />
													<small>{branche.summary}</small>
												</p>
												<ChartItemBar {...{ styles, colour, montant, total }} />
											</div>
										</div>
									)}
								</Spring>
							</Observer>
						)
					}
				)}
			</div>
			<div className="distribution-chart__total">
				<span />
				<RuleLink {...salaireNet} />
				<Value {...salaireNet} unit="€" maximumFractionDigits={0} />
				<span>+</span>
				<Trans>Cotisations</Trans>
				<Value maximumFractionDigits={0} unit="€">
					{total.partPatronale + total.partSalariale}
				</Value>
				<span />
				<div className="distribution-chart__total-border" />
				<span>=</span>
				<RuleLink {...salaireChargé} />
				<Value {...salaireChargé} unit="€" maximumFractionDigits={0} />
			</div>
		</>
	)
}
export default compose(
	withColours,
	connect(state => ({
		...répartitionSelector(state),
		rules: flatRulesSelector(state)
	}))
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
		<div
			css={`
				font-weight: bold;
				margin-left: 1rem;
				color: var(--textColourOnWhite);
			`}>
			<Value maximumFractionDigits={0} unit="€">
				{montant}
			</Value>
		</div>
	</div>
)

let BranchIcône = ({ icône }) => (
	<div className="distribution-chart__legend">
		<span className="distribution-chart__icon">{emoji(icône)}</span>
	</div>
)
