import React, { useContext, useState } from 'react'
import emoji from 'react-easy-emoji'
import { animated, config, useSpring } from 'react-spring'
import useDisplayOnIntersecting from 'Components/utils/useDisplayOnIntersecting'
import { ThemeColorsContext } from 'Components/utils/colors'
import { formatValue } from 'publicodes'
import { useTranslation } from 'react-i18next'

const ANIMATION_SPRING = config.gentle

type ChartItemBarProps = {
	numberToPlot: number
	unit?: string
	style: React.CSSProperties
}

function ChartItemBar({ style, numberToPlot, unit }: ChartItemBarProps) {
	const language = useTranslation().i18n.language
	return (
		<div className="distribution-chart__bar-container">
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
	disableAnimation : boolean
}

export default function BarChartBranch({
																 value,
																 title,
																 icon,
																 maximum,
																 description,
																 unit,
																 disableAnimation
															 }: BarChartBranchProps) {
	const [intersectionRef, brancheInViewport] = useDisplayOnIntersecting({
		threshold: 0.5
	})
	const numberToPlot = brancheInViewport ? value : 0
	const styles = useSpring({
		config: ANIMATION_SPRING,
		to: {
			flex: numberToPlot / maximum,
			opacity: numberToPlot ? 1 : 0,
		},
	}) as { flex: number; opacity: number } // TODO: problème avec les types de react-spring ?

	return (
		!disableAnimation ?
			<animated.div
				ref={intersectionRef}
				className='distribution-chart__item'
				style={{ opacity: styles.opacity }}
			>
				<InnerBarChartBranch value={numberToPlot} maximum={maximum} title={title}
												unit={unit} icon={icon}
												description={description} />
			</animated.div>
			:
			<InnerBarChartBranch value={value} maximum={maximum} title={title} unit={unit} icon={icon} description={description}/>

	)
};

type InnerBarChartBranchProps = {
	title: React.ReactNode
	icon?: string
	maximum: number
	description?: string
	unit?: string
	value: number
}


function InnerBarChartBranch({
																				 value,
																				 title,
																				 icon,
																				 maximum,
																				 description,
																				 unit,
																			 }: InnerBarChartBranchProps) {

	const { color } = useContext(ThemeColorsContext)
	return (
		<>
			{icon && <BranchIcon icon={icon} />}
			<div className='distribution-chart__item-content'>
				<p className='distribution-chart__counterparts'>
					<span className='distribution-chart__branche-name'>{title}</span>
					<br />
					{description && <small>{description}</small>}
				</p>
				<ChartItemBar
					style={{
						backgroundColor: color,
						flex: value / maximum,
					}}
					numberToPlot={value}
					unit={unit}
				/>
			</div>
		</>
	)
}
