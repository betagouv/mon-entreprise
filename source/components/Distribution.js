import { ThemeColoursContext } from 'Components/utils/withColours'
import Value from 'Components/Value'
import { findRuleByDottedName } from 'Engine/rules'
import React, { useContext } from 'react'
import emoji from 'react-easy-emoji'
import { useSelector } from 'react-redux'
import { config, animated, useSpring } from 'react-spring'
import { flatRulesSelector } from 'Selectors/analyseSelectors'
import répartitionSelector from 'Selectors/repartitionSelectors'
import { isIE } from '../utils'
import './Distribution.css'
import './PaySlip'
import RuleLink from './RuleLink'
import useDisplayOnIntersecting from 'Components/utils/useDisplayOnIntersecting'

export default function Distribution() {
	const distribution = useSelector(répartitionSelector)

	if (!Object.values(distribution).length) {
		return null
	}

	return (
		<>
			<div className="distribution-chart__container">
				{distribution.répartition.map(
					([brancheDottedName, { partPatronale, partSalariale }]) => (
						<DistributionBranch
							key={brancheDottedName}
							{...{
								brancheDottedName,
								partPatronale,
								partSalariale,
								distribution
							}}
						/>
					)
				)}
			</div>
		</>
	)
}

const ANIMATION_SPRING = config.gentle
function DistributionBranch({
	brancheDottedName,
	partPatronale,
	partSalariale,
	distribution
}) {
	const rules = useSelector(flatRulesSelector)
	const [intersectionRef, brancheInViewport] = useDisplayOnIntersecting({
		threshold: 0.5
	})
	const colours = useContext(ThemeColoursContext)
	const branche = findRuleByDottedName(rules, brancheDottedName)
	const montant = brancheInViewport ? partPatronale + partSalariale : 0
	const styles = useSpring({
		config: ANIMATION_SPRING,
		to: {
			flex: montant / distribution.cotisationMaximum,
			opacity: montant ? 1 : 0
		}
	})

	return (
		<animated.div
			ref={intersectionRef}
			className="distribution-chart__item"
			style={{ opacity: styles.opacity }}>
			<BranchIcône icône={branche.icons} />
			<div className="distribution-chart__item-content">
				<p className="distribution-chart__counterparts">
					<span className="distribution-chart__branche-name">
						<RuleLink {...branche} />
					</span>
					<br />
					<small>{branche.summary}</small>
				</p>
				<ChartItemBar
					{...{
						styles,
						colour: colours.colour,
						montant,
						total: distribution.total
					}}
				/>
			</div>
		</animated.div>
	)
}

let ChartItemBar = ({ styles, colour, montant }) => (
	<div className="distribution-chart__bar-container">
		<animated.div
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
