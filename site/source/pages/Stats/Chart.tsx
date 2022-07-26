import { StyledLegend } from '@/components/charts/PagesCharts'
import { Strong } from '@/design-system/typography'
import { Li, Ul } from '@/design-system/typography/list'
import { Body } from '@/design-system/typography/paragraphs'
import { formatValue } from 'publicodes'
import { useContext } from 'react'
import {
	Area,
	Bar,
	Brush,
	BrushProps,
	CartesianGrid,
	ComposedChart,
	Legend,
	Line,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts'
import { ThemeContext } from 'styled-components'

type Period = 'mois' | 'jours'

export type Data<T = number | Record<string, number>> = {
	date: string
	nombre: T
}[]

export type DataStacked = Data<Record<string, number>>

export const isDataStacked = (data: Data): data is DataStacked =>
	typeof data[0].nombre !== 'number'

export interface VisitsChartProps {
	period: Period
	sync?: boolean
	stack?: boolean
	grid?: boolean
	colored?: boolean
	layout?: 'horizontal' | 'vertical'
	onDateChange: BrushProps['onChange']
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
	const { colors } = useContext(ThemeContext)
	if (!data.length) {
		return null
	}
	const isBarChart = data.length <= 3
	const dataKeys = isDataStacked(data)
		? Object.keys(data[0].nombre)
		: ['nombre']
	const flattenData = isDataStacked(data)
		? data.map((d) => ({ ...d, ...d.nombre }))
		: data

	function getColor(i: number): string {
		if (!colored) {
			return [
				colors.bases.primary[300],
				colors.bases.primary[500],
				colors.bases.primary[700],
			][i % 3]
		}

		return Palette[i % Palette.length]
	}

	return (
		<Body
			as="div"
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

					<XAxis
						dataKey="date"
						type="category"
						tickFormatter={period === 'jours' ? formatDay : formatMonth}
						angle={-45}
						textAnchor="end"
						height={60}
						minTickGap={-8}
					/>

					<YAxis
						dataKey={dataKeys[0]}
						tickFormatter={(val: number) => formatValue(val) as string}
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
						) : isDataStacked(data) ? (
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
								key={k}
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
		</Body>
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
		<StyledLegend>
			<Body>
				{period === 'jours' ? formatDayLong(data.date) : formatMonth(data.date)}
			</Body>
			<Ul size="XS">
				{dataKeys.map((key: string) => (
					<Li key={key}>
						<Strong>{formatValue(data[key])}</Strong>{' '}
						{dataKeys.length > 1 && formatLegend(key)}
					</Li>
				))}
			</Ul>
		</StyledLegend>
	)
}

const formatLegend = (key: string) =>
	key === 'accueil'
		? 'visites'
		: key === 'simulation_commencee'
		? 'simulation commencée'
		: key === 'simulation_terminee'
		? 'simulation terminée'
		: key.replace(/_/g, ' ')
