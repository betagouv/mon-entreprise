import { formatValue } from 'publicodes'
import {
	Bar,
	ComposedChart,
	Legend,
	ResponsiveContainer,
	Tooltip,
	TooltipProps,
	XAxis,
	YAxis,
} from 'recharts'

type Data =
	| Array<{ date: string; nombre: number }>
	| Array<{ date: string; nombre: Record<string, number> }>

type PagesChartProps = {
	sync?: boolean
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

function getColor(i: number): string {
	return Palette[i % Palette.length]
}

export default function PagesChart({ data, sync = true }: PagesChartProps) {
	if (!data.length) {
		return null
	}

	const dataKeys = Object.keys(data[0].nombre)
	const flattenedData = (data as any).map((d: any) => ({ ...d, ...d.nombre }))

	return (
		<ResponsiveContainer
			width="100%"
			height={500}
			css={`
				svg {
					overflow: visible;
				}
			`}
		>
			<ComposedChart
				layout="horizontal"
				data={flattenedData}
				syncId={sync ? '1' : undefined}
			>
				<Legend />
				<XAxis dataKey="date" type="category" tickFormatter={formatMonth} />

				<YAxis
					tickFormatter={formatValue}
					domain={['0', 'auto']}
					type="number"
				/>

				<Tooltip content={<CustomTooltip />} />

				{dataKeys.map((k, i) => (
					<Bar
						key={k}
						dataKey={k}
						name={formatLegend(k)}
						fill={getColor(i)}
						stackId={1}
					/>
				))}
			</ComposedChart>
		</ResponsiveContainer>
	)
}

function formatMonth(date: string | Date) {
	return new Date(date).toLocaleString('default', {
		month: 'short',
		year: '2-digit',
	})
}

const CustomTooltip = ({ active, payload }: TooltipProps) => {
	if (!active || !payload) {
		return null
	}

	const data = payload[0].payload

	return (
		<p className="ui__ card">
			<small>{formatMonth(data.date)}</small>
			<br />
			{payload
				.map(({ color, value, name }) => (
					<div
						key={name}
						style={{
							display: 'flex',
							flexDirection: 'row',
							alignItems: 'center',
						}}
					>
						<div
							style={{
								background: color,
								width: '1rem',
								height: '0.7rem',
							}}
						></div>
						<strong
							style={{
								margin: '0.3rem',
							}}
						>
							{typeof value === 'number' ? formatValue(value) : value}
						</strong>
						<div>{formatLegend(name)}</div>
						<br />
					</div>
				))
				.reverse()}
		</p>
	)
}

const formatLegend = (key: string) =>
	key.replace('simulateurs / ', '').replace(/_/g, ' ')
