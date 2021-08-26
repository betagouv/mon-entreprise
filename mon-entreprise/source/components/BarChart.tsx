import useDisplayOnIntersecting from 'Components/utils/useDisplayOnIntersecting'
import { formatValue } from 'publicodes'
import React, { useContext } from 'react'
import emoji from 'react-easy-emoji'
import { useTranslation } from 'react-i18next'
import { animated, config, useSpring } from 'react-spring'
import { DisableAnimationContext } from './utils/DisableAnimationContext'

type ChartItemBarProps = {
	numberToPlot: number
	unit?: string
	display: boolean
	percentage: number
}

function ChartItemBar({
	numberToPlot,
	unit,
	display,
	percentage,
}: ChartItemBarProps) {
	const language = useTranslation().i18n.language
	const disableAnimation = useContext(DisableAnimationContext)
	const style = useSpring({
		config: config.slow,
		delay: 100,
		immediate: disableAnimation,
		from: {
			flex: 0,
		},
		flex: display ? percentage : 0,
	})

	return (
		<div className="distribution-chart__bar-container ui__ print-background-force">
			<animated.div className="distribution-chart__bar" style={style} />
			<div
				css={`
					font-weight: bold;
					margin-left: 1rem;
					color: var(--textColorOnWhite);
				`}
			>
				{formatValue(numberToPlot, {
					displayedUnit: unit,
					precision: 0,
					language,
				})}
			</div>
		</div>
	)
}

function BranchIcon({ icon }: { icon: string }) {
	return (
		<div className="distribution-chart__legend">
			<span className="distribution-chart__icon">{emoji(icon)}</span>
		</div>
	)
}

type BarChartBranchProps = {
	value: number
	title: React.ReactNode
	icon?: string
	maximum: number
	description?: string
	unit?: string
}

export default function BarChartBranch({
	value,
	title,
	icon,
	maximum,
	description,
	unit,
}: BarChartBranchProps) {
	const [intersectionRef, brancheInViewport] = useDisplayOnIntersecting({
		threshold: 0.5,
	})
	const disableAnimation = useContext(DisableAnimationContext)
	const display = disableAnimation || brancheInViewport
	const style = useSpring({
		from: {
			opacity: 0,
		},
		immediate: disableAnimation,
		opacity: display ? 1 : 0,
	})
	return (
		<animated.div ref={intersectionRef} style={style}>
			<InnerBarChartBranch
				value={value}
				display={display}
				maximum={maximum}
				title={title}
				unit={unit}
				icon={icon}
				description={description}
			/>
		</animated.div>
	)
}

type InnerBarChartBranchProps = {
	title: React.ReactNode
	icon?: string
	maximum: number
	description?: string
	display: boolean
	unit?: string
	value: number
}

function InnerBarChartBranch({
	value,
	title,
	icon,
	maximum,
	display,
	description,
	unit,
}: InnerBarChartBranchProps) {
	return (
		<div className="distribution-chart__item">
			{icon && <BranchIcon icon={icon} />}
			<div className="distribution-chart__item-content">
				<p className="distribution-chart__counterparts">
					<span className="distribution-chart__branche-name">{title}</span>
					<br />
					{description && <small>{description}</small>}
				</p>
				<ChartItemBar
					display={display}
					numberToPlot={value}
					percentage={value / maximum}
					unit={unit}
				/>
			</div>
		</div>
	)
}
