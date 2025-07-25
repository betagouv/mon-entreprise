import { ComponentProps, ReactElement } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import {
	Bar,
	ComposedChart,
	Legend,
	Tooltip,
	TooltipProps,
	XAxis,
	YAxis,
} from 'recharts'
import { css, styled } from 'styled-components'

import { Body, Li, Strong, Ul } from '@/design-system'
import { useDarkMode } from '@/hooks/useDarkMode'
import { AccessibleTable } from '@/pages/statistiques/_components/AccessibleTable'
import { RealResponsiveContainer } from '@/pages/statistiques/_components/Chart'

import { formatIndicator } from './utils'

type Data =
	| Array<{ date: string; nombre: number }>
	| Array<{ date: string; nombre: Record<string, number> }>

type PagesChartProps = {
	sync?: boolean
	data: Data
	accessibleMode: boolean
}
const Palette = [
	'#0B8BE0',
	'#697ad5',
	'#b453b6',
	'#FF2491',
	'#E15505',
	'#A28306',
	'#749027',
	'#2D954C',
]

function getColor(i: number): string {
	return Palette[i % Palette.length]
}

export default function PagesChart({
	data,
	sync = true,
	accessibleMode,
}: PagesChartProps) {
	const [darkMode] = useDarkMode()

	const { t, i18n } = useTranslation()

	if (!data.length) {
		return null
	}

	const dataKeys = Object.keys(data[0].nombre)
	const flattenedData = data.map((d) => ({
		...d,
		...(typeof d.nombre === 'number'
			? { visites: { total: d.nombre } }
			: d.nombre),
	}))

	const ComposedChartWithRole = (
		props: ComponentProps<typeof ComposedChart> | { role: string }
	): ReactElement => <ComposedChart {...props} />

	return (
		<Body as="div">
			{accessibleMode ? (
				<AccessibleTable
					period="mois"
					data={data.map(({ date, nombre }) => ({
						date,
						nombre: typeof nombre === 'number' ? { visites: nombre } : nombre,
					}))}
					caption={
						<Trans>
							Tableau présentant le nombre de visites par simulateur et par
							mois.
						</Trans>
					}
					formatKey={(key) => formatLegend(key)}
				/>
			) : (
				<RealResponsiveContainer width="100%" height={500}>
					<ComposedChartWithRole
						layout="horizontal"
						data={flattenedData}
						syncId={sync ? '1' : undefined}
						aria-label={t(
							"Graphique détaillant la part des visites par simulateur (alternative accessible avec l'interrupteur en début de section)"
						)}
						role="img"
					>
						<Legend />
						<XAxis
							dataKey="date"
							type="category"
							tickFormatter={formatMonth}
							angle={-45}
							textAnchor="end"
							height={60}
							minTickGap={-8}
							stroke={darkMode ? 'lightGrey' : 'gray'}
						/>

						<YAxis
							tickFormatter={(val: number) =>
								formatIndicator(val, i18n.language)
							}
							domain={['0', 'auto']}
							type="number"
							stroke={darkMode ? 'lightGrey' : 'gray'}
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
					</ComposedChartWithRole>
				</RealResponsiveContainer>
			)}
		</Body>
	)
}

function formatMonth(date: string | Date) {
	return new Date(date).toLocaleString('default', {
		month: 'short',
		year: '2-digit',
	})
}

const CustomTooltip = ({
	active,
	payload,
}: TooltipProps<string | number, string>) => {
	const language = useTranslation().i18n.language
	if (!active || !payload) {
		return null
	}

	const data = payload[0].payload

	return (
		<StyledLegend>
			<Body>{formatMonth(data.date)}</Body>
			<Ul>
				{payload
					.map(({ color, value, name }) => (
						<ColoredLi key={name} color={color}>
							<Strong>
								{typeof value === 'number'
									? formatIndicator(value, language)
									: value}
							</Strong>{' '}
							{name && formatLegend(name)}
						</ColoredLi>
					))
					.reverse()}
			</Ul>
		</StyledLegend>
	)
}

const formatLegend = (key: string) =>
	key.replace('simulateurs / ', '').replace(/_/g, ' ')

const ColoredLi = styled(Li)<{ color?: string }>`
	&::before {
		${({ color }) =>
			color &&
			css`
				color: ${color} !important;
				background-color: inherit;
			`};
	}
`

export const StyledLegend = styled.div`
	background-color: ${({ theme }) =>
		theme.darkMode
			? theme.colors.extended.dark[600]
			: theme.colors.extended.grey[100]};
	color: inherit;
	padding: 0.125rem 1rem;
	box-shadow: ${({ theme }) =>
		theme.darkMode ? theme.elevationsDarkMode[3] : theme.elevations[3]};
	border-radius: ${({ theme }) => theme.box.borderRadius};
`
