import RuleLink from 'Components/RuleLink'
import useDisplayOnIntersecting from 'Components/utils/useDisplayOnIntersecting'
import { Names } from 'modele-social/dist/names'
import { EvaluatedNode } from 'publicodes'
import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { animated, useSpring } from 'react-spring'
import { targetUnitSelector } from 'Selectors/simulationSelectors'
import styled from 'styled-components'
import { DisableAnimationContext } from './utils/DisableAnimationContext'
import { useEngine } from './utils/EngineContext'

const BarStack = styled.div`
	display: flex;
	border-radius: 0.4em;
	overflow: hidden;
	font-family: ${({ theme }) => theme.fonts.main};
`

const BarItem = styled.div`
	font-family: ${({ theme }) => theme.fonts.main};
	height: 26px;
	border-right: 2px solid white;
	transition: width 0.3s ease-out;

	&:last-child {
		border-right: none;
	}
`

const BarStackLegend = styled.div`
	font-family: ${({ theme }) => theme.fonts.main};
	display: flex;
	margin-top: 10px;
	flex-direction: column;
	justify-content: space-between;

	@media (min-width: 800px) {
		flex-direction: row;
		text-align: center;
	}
`

const BarStackLegendItem = styled.div`
	font-family: ${({ theme }) => theme.fonts.main};
	color: #555;
	strong {
		display: inline-block;
		color: #111;
		margin-left: 8px;
	}
`

const SmallCircle = styled.span`
	display: inline-block;
	height: 11px;
	width: 11px;
	margin-right: 10px;
	border-radius: 100%;
`

type Precision = 1 | 0.1 | 0.01

function integerAndDecimalParts(value: number) {
	const integer = Math.floor(value)
	const decimal = value - integer
	return { integer, decimal }
}

/**
 * Produces integers only.
 */
function simpleRoundedPer(values: Array<number>, logScale: number) {
	const scale = Math.pow(10, 2 - logScale) // 100, 1000, 10000
	const sum = (a = 0, b: number) => a + b
	const total = values.reduce(sum, 0)
	// By default we are talking percentages, but this can be per-mille or more
	const perscalages = values.map((value) =>
		integerAndDecimalParts((value / total) * scale)
	)
	const totalRoundedPerscalage = perscalages
		.map((v) => v.integer)
		.reduce(sum, 0)
	const indexesToIncrement = perscalages
		.map((percentage, index) => ({ ...percentage, index }))
		.sort((a, b) => b.decimal - a.decimal)
		.map(({ index }) => index)
		.splice(0, scale - totalRoundedPerscalage)

	return perscalages.map(
		({ integer }, index) =>
			integer + (indexesToIncrement.includes(index) ? 1 : 0)
	)
}

/**
 * Calculates rounded percentages so that the sum of all returned values is
 * always 100. For instance: [60, 30, 10] or [60.1, 30, 9.9] depending on the
 * precision.
 */
export function roundedPercentages(
	values: Array<number>,
	precision: Precision
) {
	const logScale = Math.log10(precision)
	return simpleRoundedPer(values, logScale).map(
		(int) => int / Math.pow(10, -logScale)
	)
}

type InnerStackedBarChartProps = {
	data: Array<{
		color?: string
		value: EvaluatedNode['nodeValue']
		legend: React.ReactNode
		key: string
	}>
	precision: Precision
}

export function StackedBarChart({
	data,
	precision,
}: InnerStackedBarChartProps) {
	const [intersectionRef, displayChart] = useDisplayOnIntersecting({
		threshold: 0.5,
	})

	const styles = useSpring({ opacity: displayChart ? 1 : 0 })
	return !useContext(DisableAnimationContext) ? (
		<animated.div ref={intersectionRef} style={styles}>
			<InnerStackedBarChart data={data} precision={precision} />
		</animated.div>
	) : (
		<InnerStackedBarChart data={data} precision={precision} />
	)
}

function InnerStackedBarChart({ data, precision }: InnerStackedBarChartProps) {
	const { i18n } = useTranslation()
	const percentages = roundedPercentages(
		data.map((d) => (typeof d.value === 'number' && d.value) || 0),
		precision
	)
	const dataWithPercentage = data.map((data, index) => ({
		...data,
		percentage: percentages[index],
	}))
	return (
		<>
			<BarStack className="print-background-force">
				{dataWithPercentage
					// <BarItem /> has a border so we don't want to display empty bars
					// (even with width 0).
					.filter(({ percentage }) => percentage !== 0)
					.map(({ key, color, percentage }) => (
						<BarItem
							style={{
								width: `${percentage}%`,
								backgroundColor: color || 'green',
							}}
							key={key}
						/>
					))}
			</BarStack>
			<BarStackLegend className="print-background-force">
				{dataWithPercentage.map(({ key, percentage, color, legend }) => (
					<BarStackLegendItem key={key}>
						<SmallCircle style={{ backgroundColor: color }} />
						{legend}
						<strong>
							{Intl.NumberFormat(i18n.language).format(percentage)} %
						</strong>
					</BarStackLegendItem>
				))}
			</BarStackLegend>
		</>
	)
}

type StackedRulesChartProps = {
	data: Array<{ color?: string; dottedName: Names; title?: string }>
	precision?: Precision
}

export default function StackedRulesChart({
	data,
	precision = 1,
}: StackedRulesChartProps) {
	const engine = useEngine()
	const targetUnit = useSelector(targetUnitSelector)
	return (
		<StackedBarChart
			precision={precision}
			data={data.map(({ dottedName, title, color }) => ({
				key: dottedName,
				value: engine.evaluate({ valeur: dottedName, unité: targetUnit })
					.nodeValue,
				legend: <RuleLink dottedName={dottedName}>{title}</RuleLink>,
				color,
			}))}
		/>
	)
}
