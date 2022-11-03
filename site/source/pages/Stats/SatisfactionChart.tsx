import { Bar, BarChart, LabelList, Tooltip, XAxis } from 'recharts'

import { StyledLegend } from '@/components/charts/PagesCharts'
import Emoji from '@/components/utils/Emoji'
import { Strong } from '@/design-system/typography'
import { Li, Ul } from '@/design-system/typography/list'
import { Body } from '@/design-system/typography/paragraphs'
import { useDarkMode } from '@/hooks/useDarkMode'

import { RealResponsiveContainer } from './Chart'
import { SatisfactionLevel } from './types'

export const SatisfactionStyle: [
	SatisfactionLevel,
	{ emoji: string; color: string }
][] = [
	[SatisfactionLevel.Mauvais, { emoji: '🙁', color: '#D97C76' }],
	[SatisfactionLevel.Moyen, { emoji: '😐', color: '#f3dd68' }],
	[SatisfactionLevel.Bien, { emoji: '🙂', color: '#90e789' }],
	[SatisfactionLevel.TrèsBien, { emoji: '😀', color: '#17B890' }],
]

function toPercentage(data: Record<string, number>): Record<string, number> {
	const total = Object.values(data).reduce((a, b: number) => a + b, 0)

	return {
		...Object.fromEntries(
			Object.entries(data).map(([key, value]) => [key, (100 * value) / total])
		),
		total,
	}
}

type SatisfactionChartProps = {
	data: Array<{
		date: string
		nombre: Record<string, number>
	}>
}

export default function SatisfactionChart({ data }: SatisfactionChartProps) {
	const [darkMode] = useDarkMode()

	if (!data.length) {
		return null
	}
	const flattenData = data
		.map((d) => ({ ...d, ...toPercentage(d.nombre) }))
		.filter((d) => Object.values(d.nombre).reduce((a, b) => a + b, 0))

	return (
		<Body as="div">
			<RealResponsiveContainer width="100%" height={400}>
				<BarChart data={flattenData}>
					<XAxis
						dataKey="date"
						tickFormatter={formatMonth}
						angle={-45}
						textAnchor="end"
						height={60}
						minTickGap={-8}
						stroke={darkMode ? 'lightGrey' : 'darkGray'}
					/>
					<Tooltip content={CustomTooltip} />
					{SatisfactionStyle.map(([level, { emoji, color }]) => (
						<Bar
							key={level}
							dataKey={level}
							stackId="1"
							fill={color}
							maxBarSize={50}
						>
							<LabelList
								dataKey={level}
								content={() => emoji}
								position="left"
							/>
						</Bar>
					))}
				</BarChart>
			</RealResponsiveContainer>
		</Body>
	)
}

function formatMonth(date: string | Date) {
	return new Date(date).toLocaleString('default', {
		month: 'short',
		year: '2-digit',
	})
}

type CustomTooltipProps = {
	active?: boolean
	payload?: {
		payload?: {
			total: number
			'très bien': number
			bien: number
			mauvais: number
			date: string | Date
		}
	}[]
}

const CustomTooltip = ({ payload, active }: CustomTooltipProps) => {
	const data = (payload && payload.length > 0 && payload[0].payload) || null

	if (!active || !data) {
		return null
	}

	return (
		<StyledLegend>
			<Body>
				Sur{' '}
				<Strong style={data.total < 10 ? { color: 'red' } : {}}>
					{data.total} avis
				</Strong>{' '}
				en {formatMonth(data.date)} :
			</Body>
			<Ul size="XS">
				<Li>
					<Strong>
						{Math.round((data['très bien'] ?? 0) + (data.bien ?? 0))}%
					</Strong>{' '}
					satisfaits{' '}
					<small>
						({Math.round(data['très bien'] ?? 0)}% <Emoji emoji="😀" /> /{' '}
						{Math.round(data.bien ?? 0)}% <Emoji emoji="🙂" />)
					</small>
				</Li>
				<Li>
					<Strong>{Math.round(data.mauvais ?? 0)}%</Strong> négatifs
					<Emoji emoji="🙁" />
				</Li>
			</Ul>
		</StyledLegend>
	)
}
