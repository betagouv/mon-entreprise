import { ThemeColorsContext } from 'Components/utils/colors'
import { formatValue } from 'publicodes'
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

type Period = 'mois' | 'jours'

type Data =
	| Array<{ date: string; nombre: number }>
	| Array<{ date: string; nombre: Record<string, number> }>

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
	'hsl(203.721, 91.489%, 53.922%)',
	'hsl(230.555, 56.25%, 62.353%)',
	'hsl(298.788, 40.408%, 51.961%)',
	'hsl(330, 100%, 58.824%)',
	'hsl(350.066, 97.419%, 69.608%)',
	'hsl(22.148, 96.129%, 69.608%)',
	'hsl(47.647, 94.4445%, 64.706%)',
	'hsl(76.364, 56.571%, 65.686%)',
	'hsl(138.409, 54.321%, 68.235%)',
	'hsl(170, 68.182%, 56.863%)',
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
			return [lighterColor, lightColor, darkColor][i % 3].toString()
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
