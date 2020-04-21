import { ThemeColorsContext } from 'Components/utils/colors'
import { EngineContext } from 'Components/utils/EngineContext'
import useDisplayOnIntersecting from 'Components/utils/useDisplayOnIntersecting'
import { formatValue } from 'Engine/format'
import { add, max } from 'ramda'
import React, { useContext } from 'react'
import emoji from 'react-easy-emoji'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { animated, config, useSpring } from 'react-spring'
import { DottedName } from 'Rules'
import { targetUnitSelector } from 'Selectors/simulationSelectors'
import './Distribution.css'
import './PaySlip'
import { getCotisationsBySection } from './PaySlip'
import RuleLink from './RuleLink'

export default function Distribution() {
	const targetUnit = useSelector(targetUnitSelector)
	const engine = useContext(EngineContext)
	const distribution = (getCotisationsBySection(
		useContext(EngineContext).getParsedRules()
	).map(([section, cotisations]) => [
		section,
		cotisations
			.map(c => engine.evaluate(c, { unit: targetUnit }))
			.reduce(
				(acc, evaluation) => acc + ((evaluation?.nodeValue as number) || 0),
				0
			)
	]) as Array<[DottedName, number]>)
		.filter(([, value]) => value > 0)
		.sort(([, a], [, b]) => b - a)

	const maximum = distribution.map(([, value]) => value).reduce(max, 0)
	const total = distribution.map(([, value]) => value).reduce(add, 0)

	return (
		<>
			<div className="distribution-chart__container">
				{distribution.map(([sectionName, value]) => (
					<DistributionBranch
						key={sectionName}
						dottedName={sectionName}
						value={value}
						distribution={{ maximum, total }}
					/>
				))}
			</div>
		</>
	)
}

type DistributionBranchProps = {
	dottedName: DottedName
	value: number
	distribution: { maximum: number; total: number }
	icon?: string
}

const ANIMATION_SPRING = config.gentle
export function DistributionBranch({
	dottedName,
	value,
	icon,
	distribution
}: DistributionBranchProps) {
	const rules = useContext(EngineContext).getParsedRules()
	const [intersectionRef, brancheInViewport] = useDisplayOnIntersecting({
		threshold: 0.5
	})
	const { color } = useContext(ThemeColorsContext)
	const branche = rules[dottedName]
	const montant = brancheInViewport ? value : 0
	const styles = useSpring({
		config: ANIMATION_SPRING,
		to: {
			flex: montant / distribution.maximum,
			opacity: montant ? 1 : 0
		}
	}) as { flex: number; opacity: number } // TODO: problème avec les types de react-spring ?

	return (
		<animated.div
			ref={intersectionRef}
			className="distribution-chart__item"
			style={{ opacity: styles.opacity }}
		>
			<BranchIcône icône={(icon ?? branche.icons) as string} />
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
						color,
						montant,
						total: distribution.total
					}}
				/>
			</div>
		</animated.div>
	)
}

let ChartItemBar = ({
	styles,
	color,
	montant
}: {
	styles: React.CSSProperties
	color: string
	montant: number
}) => {
	const { i18n } = useTranslation()
	return (
		<div className="distribution-chart__bar-container">
			<animated.div
				className="distribution-chart__bar"
				style={{
					backgroundColor: color,
					...styles
				}}
			/>
			<div
				css={`
					font-weight: bold;
					margin-left: 1rem;
					color: var(--textColorOnWhite);
				`}
			>
				{formatValue({
					nodeValue: montant,
					unit: '€',
					precision: 0,
					language: i18n.language
				})}
			</div>
		</div>
	)
}

let BranchIcône = ({ icône }: { icône: string }) => (
	<div className="distribution-chart__legend">
		<span className="distribution-chart__icon">{emoji(icône)}</span>
	</div>
)
