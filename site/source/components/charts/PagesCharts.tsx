import { formatValue } from 'publicodes'
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
import styled, { css } from 'styled-components'

import { Strong } from '@/design-system/typography'
import { Li, Ul } from '@/design-system/typography/list'
import { Body } from '@/design-system/typography/paragraphs'
import { useDarkMode } from '@/hooks/useDarkMode'
import { RealResponsiveContainer } from '@/pages/statistiques/Chart'

import FoldingMessage from '../ui/FoldingMessage'

type Data =
	| Array<{ date: string; nombre: number }>
	| Array<{ date: string; nombre: Record<string, number> }>

type PagesChartProps = {
	sync?: boolean
	data: Data
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

export default function PagesChart({ data, sync = true }: PagesChartProps) {
	const [darkMode] = useDarkMode()

	const { t } = useTranslation()

	if (!data.length) {
		return null
	}

	const dataKeys = Object.keys(data[0].nombre)
	const flattenedData = (data as any).map((d: any) => ({ ...d, ...d.nombre }))

	const ComposedChartWithRole = (
		props: ComponentProps<typeof ComposedChart> | { role: string }
	): ReactElement => <ComposedChart {...props} />

	return (
		<Body as="div">
			<RealResponsiveContainer
				width="100%"
				height={500}
				css={`
					svg {
						overflow: visible;
					}
				`}
			>
				<ComposedChartWithRole
					layout="horizontal"
					data={flattenedData}
					syncId={sync ? '1' : undefined}
					aria-label={t(
						'Graphique des principaux simulateurs, présence d’une alternative accessible après l’image'
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
						tickFormatter={(x) => formatValue(x)}
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
			<AccessibleVersion data={flattenedData} />
		</Body>
	)
}

const AccessibleVersion = ({ data }: PagesChartProps) => {
	const { t } = useTranslation()

	return (
		<FoldingMessage
			title={t('Version accessible des données')}
			unfoldButtonLabel={t('Afficher la version accessible')}
		>
			<table role="table" style={{ textAlign: 'center', width: '100%' }}>
				<caption className="sr-only">
					<Trans>
						Tableau présentant le nombre de visites par page et par mois.
					</Trans>
				</caption>
				<thead>
					<tr>
						<th scope="col">
							<Trans>Date</Trans>
						</th>
						{/* Dynamically add the page keys as th */}
						{Object.keys(data[0].nombre).map((key) => (
							<th scope="col" key={key}>
								{key}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{data.map((item) => {
						const date = new Date(item.date)
						const year = date.getFullYear()
						const month = date.getMonth() + 1

						return (
							<tr key={item.date}>
								<td>{`${
									String(month).length === 1 ? `0${month}` : month
								}/${year}`}</td>
								{Object.entries(item.nombre).map(([key, value]) => {
									return (
										<td key={`${item.date}-${String(key)}`}>{value ?? 0}</td>
									)
								})}
							</tr>
						)
					})}
				</tbody>
			</table>
		</FoldingMessage>
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
								{typeof value === 'number' ? formatValue(value) : value}
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
	::before {
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
