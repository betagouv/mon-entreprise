import Value from 'Components/Value'
import React, { useContext } from 'react'
import emoji from 'react-easy-emoji'
import { animated, config, useSpring } from 'react-spring'
import useDisplayOnIntersecting from 'Components/utils/useDisplayOnIntersecting'
import { ThemeColorsContext } from 'Components/utils/colors'
import { formatValue } from 'Engine/format'
import { useTranslation } from 'react-i18next'

const ANIMATION_SPRING = config.gentle

let ChartItemBar = ({ styles, color, numberToPlot, unit }) => {
	const language = useTranslation().i18n.language
	return (
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
				{formatValue({ nodeValue: numberToPlot, unit, precision: 0, language })}
			</div>
		</div>
	)
}
let BranchIcône = ({ icône }) => (
	<div className="distribution-chart__legend">
		<span className="distribution-chart__icon">{emoji(icône)}</span>
	</div>
)

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
	unit
}: BarChartBranchProps) {
	const [intersectionRef, brancheInViewport] = useDisplayOnIntersecting({
		threshold: 0.5
	})
	const { color } = useContext(ThemeColorsContext)
	const numberToPlot = brancheInViewport ? value : 0
	const styles = useSpring({
		config: ANIMATION_SPRING,
		to: {
			flex: numberToPlot / maximum,
			opacity: numberToPlot ? 1 : 0
		}
	}) as { flex: number; opacity: number } // TODO: problème avec les types de react-spring ?

	return (
		<animated.div
			ref={intersectionRef}
			className="distribution-chart__item"
			style={{ opacity: styles.opacity }}
		>
			{icon && <BranchIcône icône={icon} />}
			<div className="distribution-chart__item-content">
				<p className="distribution-chart__counterparts">
					<span className="distribution-chart__branche-name">{title}</span>
					<br />
					{description && <small>{description}</small>}
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
