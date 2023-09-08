import { formatValue } from 'publicodes'
import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { animated, config, useSpring } from 'react-spring'
import { styled, ThemeContext } from 'styled-components'

import useDisplayOnIntersecting from '@/components/utils/useDisplayOnIntersecting'
import { Emoji } from '@/design-system/emoji'
import { Spacing } from '@/design-system/layout'
import { Body, SmallBody } from '@/design-system/typography/paragraphs'

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
	const {
		colors: {
			bases: { primary },
		},
	} = useContext(ThemeContext)
	const style = useSpring({
		config: config.slow,
		delay: 100,
		from: {
			flex: 0,
		},
		flex: display ? percentage : 0,
	})

	return (
		<div className="distribution-chart__bar-container">
			{disableAnimation ? (
				<div
					className="distribution-chart__bar print-background-force"
					css={{ backgroundColor: primary[600] }}
					style={{ flex: percentage }}
				/>
			) : (
				<animated.div
					className="distribution-chart__bar print-background-force"
					css={{ backgroundColor: primary[600] }}
					style={style}
				/>
			)}
			<Value>
				{formatValue(numberToPlot, {
					displayedUnit: unit,
					precision: 0,
					language,
				})}
			</Value>
		</div>
	)
}

const Value = styled.div`
	font-weight: bold;
	margin-left: 1rem;
	font-family: ${({ theme }) => theme.fonts.main};
`

function BranchIcon({ icon }: { icon: string }) {
	return (
		<div className="distribution-chart__legend">
			<span className="distribution-chart__icon">
				<Emoji emoji={icon} />
			</span>
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
	...props
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
		opacity: display ? 1 : 0,
	})

	const innerBarChartBranch = (
		<InnerBarChartBranch
			value={value}
			display={display}
			maximum={maximum}
			title={title}
			unit={unit}
			icon={icon}
			description={description}
		/>
	)

	return disableAnimation ? (
		innerBarChartBranch
	) : (
		// @ts-ignore Ignore type instantiation is excessively deep and possibly infinite.
		<animated.div ref={intersectionRef} style={style} {...props}>
			{innerBarChartBranch}
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
				<div className="distribution-chart__counterparts">
					<Body
						as="h3"
						css={`
							margin-bottom: 0;
						`}
					>
						{title}
					</Body>
					{description && <SmallBody>{description}</SmallBody>}
				</div>
				<Spacing md className="print-hidden" />
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
