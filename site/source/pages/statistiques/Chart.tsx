import { formatValue } from 'publicodes'
import { ComponentProps, ReactElement, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import {
	Area,
	Bar,
	Brush,
	BrushProps,
	CartesianGrid,
	ComposedChart,
	Legend,
	Line,
	ReferenceLine,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts'
import { styled, useTheme } from 'styled-components'

import { StyledLegend } from '@/components/charts/PagesCharts'
import { Strong } from '@/design-system/typography'
import { Li, Ul } from '@/design-system/typography/list'
import { Body } from '@/design-system/typography/paragraphs'
import { useDarkMode } from '@/hooks/useDarkMode'

type Period = 'mois' | 'jours'

export type Data<T = number | Record<string, number>> = {
	date: string
	nombre: T
	info?: ReactNode
}[]

export type DataStacked = Data<Record<string, number>>

export const isDataStacked = (data: Data): data is DataStacked =>
	typeof data[0]?.nombre !== 'number'

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
	const { t } = useTranslation()
	const [darkMode] = useDarkMode()
	const { colors } = useTheme()
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

	const ComposedChartWithRole = (
		props: ComponentProps<typeof ComposedChart> | { role: string }
	): ReactElement => <ComposedChart {...props} />

	return (
		<Body as="div">
			<RealResponsiveContainer width="100%" height={500}>
				<ComposedChartWithRole
					layout={layout}
					data={flattenData}
					syncId={sync ? '1' : undefined}
					aria-label={t(
						'Graphique statistiques détaillés du nombre visites par jour, présence d’une alternative accessible après l’image'
					)}
					role="img"
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
						stroke={darkMode ? 'lightGrey' : 'gray'}
					/>

					<YAxis
						tickFormatter={(val: number) => formatValue(val) as string}
						type="number"
						stroke={darkMode ? 'lightGrey' : 'gray'}
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

					{flattenData
						.filter(({ info }) => info)
						.map(({ date }) => (
							<ReferenceLine
								key={date}
								x={date}
								stroke={darkMode ? 'dodgerblue' : 'dodgerblue'}
								strokeWidth={2}
							/>
						))}
				</ComposedChartWithRole>
			</RealResponsiveContainer>
		</Body>
	)
}

export const RealResponsiveContainer = (
	props: ComponentProps<typeof ResponsiveContainer>
) => (
	<StyledDiv
		style={{
			width: props.width,
			height: props.height,
			overflow: 'hidden',
			position: 'relative',
		}}
	>
		<div
			style={{
				width: '100%',
				height: '100%',
				position: 'absolute',
				top: 0,
				left: 0,
			}}
		>
			<ResponsiveContainer {...props} width="100%" height="100%" />
		</div>
	</StyledDiv>
)
const StyledDiv = styled.div`
	svg {
		overflow: visible;
	}
`
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
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
			{data.info}
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

export const formatLegend = (key: string) =>
	key === 'accueil'
		? 'visites'
		: key === 'simulation_commencee'
		? 'simulation commencée'
		: key === 'simulation_terminee'
		? 'simulation terminée'
		: key === 'declaration_resultat'
		? 'déclaration résultat'
		: key === 'declaration_revenu'
		? 'déclaration revenu'
		: key.replace(/_/g, ' ')
