import { StyledLegend } from '@/components/charts/PagesCharts'
import Emoji from '@/components/utils/Emoji'
import { Strong } from '@/design-system/typography'
import { Li, Ul } from '@/design-system/typography/list'
import { Body } from '@/design-system/typography/paragraphs'
import { add, mapObjIndexed } from 'ramda'
import {
	Bar,
	BarChart,
	LabelList,
	ResponsiveContainer,
	Tooltip,
	XAxis,
} from 'recharts'
import { SatisfactionLevel } from './types'

export const SatisfactionStyle: [
	SatisfactionLevel,
	{ emoji: string; color: string }
][] = [
	[SatisfactionLevel.Mauvais, { emoji: '🙁', color: '#ff5959' }],
	[SatisfactionLevel.Moyen, { emoji: '😐', color: '#fff339' }],
	[SatisfactionLevel.Bien, { emoji: '🙂', color: '#90e789' }],
	[SatisfactionLevel.TrèsBien, { emoji: '😀', color: '#0fc700' }],
]

function toPercentage(data: Record<string, number>): Record<string, number> {
	const total = Object.values(data).reduce(add)
	return { ...mapObjIndexed((value) => (100 * value) / total, data), total }
}

type SatisfactionChartProps = {
	data: Array<{
		date: string
		nombre: Record<string, number>
	}>
}
export default function SatisfactionChart({ data }: SatisfactionChartProps) {
	if (!data.length) {
		return null
	}
	const flattenData = data
		.map((d) => ({ ...d, ...toPercentage(d.nombre) }))
		.filter((d) => Object.values(d.nombre).reduce((a, b) => a + b, 0))
	return (
		<>
			<ResponsiveContainer width="100%" height={400}>
				<BarChart data={flattenData}>
					<XAxis dataKey="date" tickFormatter={formatMonth} />
					<Tooltip content={<CustomTooltip />} />
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
			</ResponsiveContainer>
		</>
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
	payload?: any
}

const CustomTooltip = ({ payload, active }: CustomTooltipProps) => {
	if (!active) {
		return null
	}
	const data = payload[0].payload
	return (
		<StyledLegend>
			<Body>
				Sur{' '}
				<Strong style={data.total < 10 ? { color: 'red' } : {}}>
					{data.total} avis
				</Strong>{' '}
				en {formatMonth(data.date)} :
			</Body>
			<Ul small>
				<Li>
					<Strong>
						{Math.round((data['très bien'] ?? 0) + (data['bien'] ?? 0))}%
					</Strong>{' '}
					satisfaits{' '}
					<small>
						({Math.round(data['très bien'] ?? 0)}% <Emoji emoji="😀" /> /{' '}
						{Math.round(data['bien'] ?? 0)}% <Emoji emoji="🙂" />)
					</small>
				</Li>
				<Li>
					<Strong>{Math.round(data['mauvais'] ?? 0)}%</Strong> négatifs
					<Emoji emoji="🙁" />
				</Li>
			</Ul>
		</StyledLegend>
	)
}
