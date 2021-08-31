import { add, mapObjIndexed } from 'ramda'
import emoji from 'react-easy-emoji'
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
		<div className="ui__ card">
			<small>
				Sur{' '}
				<strong style={data.total < 10 ? { color: 'red' } : {}}>
					{data.total} avis
				</strong>{' '}
				en {formatMonth(data.date)} :
			</small>
			<ul>
				<li>
					<strong>
						{Math.round((data['très bien'] ?? 0) + (data['bien'] ?? 0))}%
					</strong>{' '}
					satisfaits{' '}
					<small>
						({Math.round(data['très bien'] ?? 0)}% {emoji('😀')} /{' '}
						{Math.round(data['bien'] ?? 0)}% {emoji('🙂')})
					</small>
				</li>
				<li>
					<strong>{Math.round(data['mauvais'] ?? 0)}%</strong> négatifs
					{emoji('🙁')}
				</li>
			</ul>
		</div>
	)
}
