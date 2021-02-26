import { ThemeColorsContext } from 'Components/utils/colors'
import { formatValue } from 'publicodes'
import { groupWith } from 'ramda'
import React, { useContext } from 'react'
import {
	Area,
	AreaChart,
	Bar,
	BarChart,
	Brush,
	CartesianGrid,
	Line,
	LineChart,
	ReferenceArea,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts'
import stats from '../../data/stats.json'

type Period = 'mois' | 'jours'

type Data =
	| Array<{ date: string; nombre: number }>
	| Array<{ date: string; nombre: Record<string, number> }>

const weekEndDays = groupWith(
	(a, b) => {
		const dayAfterA = new Date(a)
		dayAfterA.setDate(dayAfterA.getDate() + 1)
		return dayAfterA.toISOString().substring(0, 10) === b
	},
	stats.visitesJours.site
		.map(({ date }) => new Date(date))
		.filter((date) => date.getDay() === 0 || date.getDay() === 6)
		.map((date) => date.toISOString().substring(0, 10))
)

type VisitsChartProps = {
	period: Period
	onDateChange?: ({
		startIndex,
		endIndex,
	}: {
		startIndex: number
		endIndex: number
	}) => void
	startIndex?: number
	endIndex?: number
	data: Data
}

export default function VisitsChart({
	period,
	data,
	onDateChange,
	startIndex,
	endIndex,
}: VisitsChartProps) {
	const { color, lightColor, lighterColor } = useContext(ThemeColorsContext)
	if (!data.length) {
		return null
	}
	const isStacked = typeof data[0].nombre !== 'number'
	const isBarChart = data.length <= 3
	const dataKeys = isStacked ? Object.keys(data[0].nombre) : ['nombre']
	const flattenData = data.map((d) => (isStacked ? { ...d, ...d.nombre } : d))

	const Chart = isBarChart ? BarChart : isStacked ? AreaChart : LineChart
	return (
		<>
			<ResponsiveContainer width="100%" height={400}>
				<Chart data={flattenData} syncId="1">
					{data.length > 1 && onDateChange && (
						<Brush
							startIndex={startIndex}
							endIndex={endIndex}
							dataKey="date"
							onChange={onDateChange}
							tickFormatter={period === 'jours' ? formatDay : formatMonth}
						/>
					)}
					<CartesianGrid />

					<XAxis
						dataKey="date"
						tickFormatter={period === 'jours' ? formatDay : formatMonth}
					/>

					<YAxis
						domain={[0, 'auto']}
						dataKey={dataKeys[0]}
						tickFormatter={formatValue}
					/>

					<Tooltip
						content={<CustomTooltip period={period} dataKeys={dataKeys} />}
					/>
					{weekEndDays
						.filter((days) => days.length === 2)
						.map((days) => (
							<ReferenceArea
								key={days[0]}
								x1={days[0]}
								x2={days[1]}
								strokeOpacity={0.3}
							/>
						))}
					{dataKeys.map((k, i) =>
						isBarChart ? (
							<Bar
								key={k}
								dataKey={k}
								maxBarSize={50}
								fill={
									i % 3 === 2 ? color : i % 3 === 1 ? lightColor : lighterColor
								}
							/>
						) : isStacked ? (
							<Area
								key={k}
								dataKey={k}
								type="monotone"
								stroke={color}
								fill={
									i % 3 === 2 ? color : i % 3 === 1 ? lightColor : lighterColor
								}
							/>
						) : (
							<Line
								type="monotone"
								dataKey={k}
								stroke={color}
								strokeWidth={3}
								animationDuration={500}
							/>
						)
					)}
				</Chart>
			</ResponsiveContainer>
		</>
	)
}

function formatDay(date: string | Date) {
	return new Date(date).toLocaleString('default', {
		day: '2-digit',
		month: '2-digit',
	})
}

function formatMonth(date: string | Date) {
	return new Date(date).toLocaleString('default', {
		month: 'short',
		year: '2-digit',
	})
}

type CustomTooltipProps = {
	active?: boolean
	period: Period
	payload?: any
	dataKeys: string[]
}

const CustomTooltip = ({
	active,
	period,
	payload,
	dataKeys,
}: CustomTooltipProps) => {
	if (!active) {
		return null
	}
	const data = payload[0].payload
	return (
		<p className="ui__ card">
			<small>
				{period === 'jours' ? formatDay(data.date) : formatMonth(data.date)}
			</small>
			<br />
			{dataKeys.map((key: string) => (
				<>
					<strong>{formatValue(data[key])}</strong>{' '}
					{dataKeys.length > 1 &&
						(key === 'accueil'
							? 'visites'
							: key === 'simulation_commencee'
							? 'simulation commencée'
							: key === 'simulation_terminee'
							? 'simulation terminée'
							: key.replaceAll('_', ' '))}
					<br />
				</>
			))}
		</p>
	)
}
