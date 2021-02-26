import { ThemeColorsContext } from 'Components/utils/colors'
import { add, mapObjIndexed } from 'ramda'
import React, { useContext } from 'react'
import emoji from 'react-easy-emoji'
import {
	Bar,
	BarChart,
	LabelList,
	ResponsiveContainer,
	Tooltip,
	XAxis,
} from 'recharts'

type Period = 'mois' | 'jours'

type SatisfactionChartProps = {
	startIndex?: number
	endIndex?: number
	data: Array<{
		date: string
		nombre: {
			'très bien': number
			bien: number
			mauvais: number
			moyen: number
		}
	}>
}

function toPercentage(data: Record<string, number>): Record<string, number> {
	const total = Object.values(data).reduce(add)
	return { ...mapObjIndexed((value) => (100 * value) / total, data), total }
}
export default function SatisfactionChart({
	data,
	startIndex,
	endIndex,
}: SatisfactionChartProps) {
	if (!data.length) {
		return null
	}
	const { color, lightColor, lighterColor } = useContext(ThemeColorsContext)
	const flattenData = data.map((d) => ({ ...d, ...toPercentage(d.nombre) }))
	return (
		<>
			<ResponsiveContainer width="100%" height={400}>
				<BarChart data={flattenData}>
					<XAxis dataKey="date" tickFormatter={formatMonth} />
					<Tooltip content={<CustomTooltip />} />
					<Bar dataKey="mauvais" stackId="1" fill="#ffcccb" maxBarSize={50}>
						<LabelList dataKey="mauvais" content={() => '🙁'} position="left" />
					</Bar>
					<Bar dataKey="moyen" stackId="1" maxBarSize={50} fill={lighterColor}>
						<LabelList dataKey="moyen" content={() => '😐'} position="left" />
					</Bar>
					<Bar dataKey="bien" stackId="1" maxBarSize={50} fill={lightColor}>
						<LabelList dataKey="bien" content={() => '🙂'} position="left" />
					</Bar>
					<Bar dataKey="très bien" stackId="1" maxBarSize={50} fill={color}>
						<LabelList
							dataKey="très bien"
							content={() => '😀'}
							position="left"
						/>
					</Bar>
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
