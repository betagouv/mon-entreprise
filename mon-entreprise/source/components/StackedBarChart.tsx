import RuleLink from 'Components/RuleLink'
import useDisplayOnIntersecting from 'Components/utils/useDisplayOnIntersecting'
import { Names } from 'modele-social/dist/names'
import { EvaluatedNode } from 'publicodes'
import React from 'react'
import { useSelector } from 'react-redux'
import { animated, useSpring } from 'react-spring'
import { targetUnitSelector } from 'Selectors/simulationSelectors'
import styled from 'styled-components'
import HSLInterface from './utils/color/HSLInterface'
import { useEngine } from './utils/EngineContext'

const BarStack = styled.div`
	display: flex;
	border-radius: 0.4em;
	overflow: hidden;
`

const BarItem = styled.div`
	height: 26px;
	border-right: 2px solid white;
	transition: width 0.3s ease-out;

	&:last-child {
		border-right: none;
	}
`

const BarStackLegend = styled.div`
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
	color: hsl(0, 0%, 33.333%);
	strong {
		display: inline-block;
		color: hsl(0, 0%, 6.667%);
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

function integerAndDecimalParts(value: number) {
	const integer = Math.floor(value)
	const decimal = value - integer
	return { integer, decimal }
}

// This function calculates rounded percentages so that the sum of all
// returned values is always 100. For instance: [60, 30, 10].
export function roundedPercentages(values: Array<number>) {
	const sum = (a = 0, b: number) => a + b
	const total = values.reduce(sum, 0)
	const percentages = values.map((value) =>
		integerAndDecimalParts((value / total) * 100)
	)
	const totalRoundedPercentage = percentages
		.map((v) => v.integer)
		.reduce(sum, 0)
	const indexesToIncrement = percentages
		.map((percentage, index) => ({ ...percentage, index }))
		.sort((a, b) => b.decimal - a.decimal)
		.map(({ index }) => index)
		.splice(0, 100 - totalRoundedPercentage)

	return percentages.map(
		({ integer }, index) =>
			integer + (indexesToIncrement.includes(index) ? 1 : 0)
	)
}

type StackedBarChartProps = {
	data: Array<{
		color?: HSLInterface
		value: EvaluatedNode['nodeValue']
		legend: React.ReactNode
		key: string
	}>
}

export function StackedBarChart({ data }: StackedBarChartProps) {
	const [intersectionRef, displayChart] = useDisplayOnIntersecting({
		threshold: 0.5,
	})
	const percentages = roundedPercentages(
		data.map((d) => (typeof d.value === 'number' && d.value) || 0)
	)
	const dataWithPercentage = data.map((data, index) => ({
		...data,
		percentage: percentages[index],
	}))

	const styles = useSpring({ opacity: displayChart ? 1 : 0 })
	return (
		<animated.div ref={intersectionRef} style={styles}>
			<BarStack>
				{dataWithPercentage
					// <BarItem /> has a border so we don't want to display empty bars
					// (even with width 0).
					.filter(({ percentage }) => percentage !== 0)
					.map(({ key, color, percentage }) => (
						<BarItem
							style={{
								width: `${percentage}%`,
								backgroundColor: color?.toString() || 'green',
							}}
							key={key}
						/>
					))}
			</BarStack>
			<BarStackLegend>
				{dataWithPercentage.map(({ key, percentage, color, legend }) => (
					<BarStackLegendItem key={key}>
						<SmallCircle style={{ backgroundColor: color?.toString() }} />
						{legend}
						<strong>{percentage} %</strong>
					</BarStackLegendItem>
				))}
			</BarStackLegend>
		</animated.div>
	)
}

type StackedRulesChartProps = {
	data: Array<{ color?: HSLInterface; dottedName: Names; title?: string }>
}

export default function StackedRulesChart({ data }: StackedRulesChartProps) {
	const engine = useEngine()
	const targetUnit = useSelector(targetUnitSelector)
	return (
		<StackedBarChart
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
