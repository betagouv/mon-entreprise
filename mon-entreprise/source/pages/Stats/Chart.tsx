import { ThemeColorsContext } from 'Components/utils/colors'
import { formatValue } from 'publicodes'
import { groupWith } from 'ramda'
import React, { Fragment, useContext } from 'react'
import {
	Area,
	Bar,
	Brush,
	CartesianGrid,
	ComposedChart,
	Legend,
	Line,
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
	sync?: boolean
	stack?: boolean
	grid?: boolean
	colored?: boolean
	layout?: 'horizontal' | 'vertical'
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
const Palette = [
	'#1ea0f5',
	'#697ad5',
	'#b453b6',
	'#ff2d96',
	'#fd667f',
	'#fc9e67',
	'#fad750',
	'#bed976',
	'#82da9d',
	'#46dcc3',
]

export default function VisitsChart({
	period,
	data,
	onDateChange,
	sync = true,
	layout = 'horizontal',
	grid = true,
	stack = false,
	colored = false,
	startIndex,
	endIndex,
}: VisitsChartProps) {
	const { darkColor, lightColor, lighterColor } = useContext(ThemeColorsContext)
	if (!data.length) {
		return null
	}
	const isStacked = typeof data[0].nombre !== 'number'
	const isBarChart = data.length <= 3
	const dataKeys = isStacked ? Object.keys(data[0].nombre) : ['nombre']
	const flattenData = (data as any).map((d: any) =>
		isStacked ? { ...d, ...d.nombre } : d
	)

	const AxeA: any = layout === 'horizontal' ? XAxis : YAxis
	const AxeB: any = layout === 'horizontal' ? YAxis : XAxis

	function getColor(i: number): string {
		if (!colored) {
			return [lighterColor, lightColor, darkColor][i % 3]
		}
		return Palette[i % Palette.length]
	}
	return (
		<div
			css={`
				svg {
					overflow: visible;
				}
			`}
		>
			<ResponsiveContainer width="100%" height={500}>
				<ComposedChart
					layout={layout}
					data={flattenData}
					syncId={sync ? '1' : undefined}
				>
					{data.length > 1 && onDateChange && (
						<Brush
							startIndex={startIndex}
							endIndex={endIndex}
							dataKey="date"
							onChange={onDateChange}
							tickFormatter={period === 'jours' ? formatDay : formatMonth}
						/>
					)}
					{grid && <CartesianGrid />}
					<Legend />
					<AxeA
						dataKey="date"
						type="category"
						tickFormatter={period === 'jours' ? formatDay : formatMonth}
					/>

					<AxeB
						dataKey={dataKeys[0]}
						tickFormatter={formatValue}
						type="number"
					/>

					<Tooltip
						content={<CustomTooltip period={period} dataKeys={dataKeys} />}
					/>

					{dataKeys.map((k, i) =>
						isBarChart ? (
							<Bar
								layout={layout}
								key={k}
								dataKey={k}
								name={formatLegend(k)}
								barSize={20}
								stackId={stack ? 1 : undefined}
								fill={getColor(i)}
							/>
						) : isStacked ? (
							<Area
								key={k}
								dataKey={k}
								name={formatLegend(k)}
								stackId={stack ? 1 : undefined}
								type="monotone"
								stroke={getColor(i)}
								fill={getColor(i)}
							/>
						) : (
							<Line
								type="monotone"
								dataKey={k}
								name={formatLegend(k)}
								stroke={getColor(i + 1)}
								strokeWidth={3}
								animationDuration={500}
							/>
						)
					)}
				</ComposedChart>
			</ResponsiveContainer>
		</div>
	)
}

function formatDay(date: string | Date) {
	return new Date(date).toLocaleString('default', {
		day: '2-digit',
		month: '2-digit',
	})
}

function formatDayLong(date: string | Date) {
	return new Date(date).toLocaleString('default', {
		weekday: 'short',
		day: 'numeric',
		month: 'long',
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
	if (!active || !payload) {
		return null
	}

	const data = payload[0].payload
	return (
		<p className="ui__ card">
			<small>
				{period === 'jours' ? formatDayLong(data.date) : formatMonth(data.date)}
			</small>
			<br />
			{dataKeys.map((key: string) => (
				<Fragment key={key}>
					<strong>{formatValue(data[key])}</strong>{' '}
					{dataKeys.length > 1 && formatLegend(key)}
					<br />
				</Fragment>
			))}
		</p>
	)
}

const formatLegend = (key: string) =>
	key === 'accueil'
		? 'visites'
		: key === 'simulation_commencee'
		? 'simulation commencée'
		: key === 'simulation_terminee'
		? 'simulation terminée'
		: key.replaceAll('_', ' ')
