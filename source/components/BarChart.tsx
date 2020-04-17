import Value from 'Components/Value'
import React, { useContext } from 'react'
import emoji from 'react-easy-emoji'
import { animated, config, useSpring } from 'react-spring'
import useDisplayOnIntersecting from 'Components/utils/useDisplayOnIntersecting'
import { ThemeColorsContext } from 'Components/utils/colors'

const ANIMATION_SPRING = config.gentle

let ChartItemBar = ({ styles, color, numberToPlot, unit }) => (
	<div className="distribution-chart__bar-container">
		<animated.div
			className="distribution-chart__bar"
			style={{
				backgroundColor: color,
				flex: styles.flex
			}}
		/>
		<div
			css={`
				font-weight: bold;
				margin-left: 1rem;
				color: var(--textColorOnWhite);
			`}
		>
			<Value maximumFractionDigits={0} unit={unit}>
				{numberToPlot}
			</Value>
		</div>
	</div>
)
let BranchIcône = ({ icône }) => (
	<div className="distribution-chart__legend">
		<span className="distribution-chart__icon">{emoji(icône)}</span>
	</div>
)

type DistributionBranchProps = {
	data: number
	title: string
	icon?: string
	total: number
	description?: string
	unit?: string
}

export default function DistributionBranch({
	data,
	title,
	icon,
	total,
	description,
	unit
}: DistributionBranchProps) {
	const [intersectionRef, brancheInViewport] = useDisplayOnIntersecting({
		threshold: 0.5
	})
	const { color } = useContext(ThemeColorsContext)
	const numberToPlot = brancheInViewport ? data : 0
	const styles = useSpring({
		config: ANIMATION_SPRING,
		to: {
			flex: numberToPlot / total,
			opacity: numberToPlot ? 1 : 0
		}
	}) as { flex: number; opacity: number }

	return (
		<animated.div
			ref={intersectionRef}
			className="distribution-chart__item"
			style={{ opacity: styles.opacity }}
		>
			{icon ? <BranchIcône icône={icon} /> : null}
			<div className="distribution-chart__item-content">
				<p className="distribution-chart__counterparts">
					<span className="distribution-chart__branche-name">{title}</span>
					<br />
					{description ? <small>{description}</small> : null}
				</p>
				<ChartItemBar
					{...{
						styles,
						color,
						numberToPlot,
						unit
					}}
				/>
			</div>
		</animated.div>
	)
}
