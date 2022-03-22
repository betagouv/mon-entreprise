import { Item, Select } from '@/design-system/field/Select'
import { baseParagraphStyle } from '@/design-system/typography/paragraphs'
import { getMeta } from '@/utils'
import { Key, useContext } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { DottedNames } from 'exoneration-covid'
import { EngineContext } from '@/components/utils/EngineContext'
import Engine, { EvaluatedNode, formatValue } from 'publicodes'

export const Th = styled.th<{ alignSelf?: string }>`
	flex: 2;
	word-break: break-word;
	${({ alignSelf }) =>
		alignSelf
			? css`
					align-self: ${alignSelf};
			  `
			: ''}
`

const Td = styled.td`
	flex: 2;
	word-break: break-word;
	margin: 0.5rem 0;
`

export const Tr = styled.tr`
	display: flex;
	flex-direction: column;
	align-items: stretch;
	flex: 1;
	word-break: break-word;
	padding: 1rem;

	${Td}:last-child {
		text-align: right;
	}
	${Td}:first-child, ${Td}:last-child {
		flex: 1;
	}
	@media (min-width: ${({ theme }) => theme.breakpointsWidth.sm}) {
		flex-direction: initial;
		align-items: center;
	}
`

export const Thead = styled.thead`
	background: ${({ theme }) => theme.colors.bases.primary[200]};
	color: ${({ theme }) => theme.colors.bases.primary[700]};
	border-radius: 0.35rem 0.35rem 0 0;

	${Th}:first-child, ${Th}:last-child {
		flex: 1;
	}
`

export const Tbody = styled.tbody`
	border-radius: 0 0 0.35rem 0.35rem;

	${Tr}:nth-child(odd) {
		background: ${({ theme }) => theme.colors.extended.grey[200]};
	}
`

export const Table = styled.table`
	display: flex;
	flex-direction: column;
	text-align: left;
	border: 1px solid ${({ theme }) => theme.colors.extended.grey[400]};
	border-radius: 0.35rem;
	${baseParagraphStyle}
	font-weight: bold;
`

const Empty = styled.div`
	display: inline-block;
	background: ${({ theme }) => theme.colors.extended.grey[300]};
	padding: 0.25rem 1rem;
	border-radius: 0.25rem;
	font-weight: 500;
	font-size: 0.9rem;
`

type RowProps = {
	dottedNames: DottedNames[]
	actualMonth: string
	title?: string
	total?: EvaluatedNode<number>
	onSelectionChange?: (key: Key) => void
	defaultSelectedKey?: Key
}

export const Row = ({
	title,
	total,
	dottedNames,
	actualMonth,
	defaultSelectedKey,
	onSelectionChange,
}: RowProps) => {
	const { t } = useTranslation()

	const engine = useContext(EngineContext) as Engine<DottedNames>

	const choices = {
		non: [t('Aucun')],
		'LFSS 600': [
			t('Interdiction d’accueil du public (600 €)'),
			t('Baisse d’au moins 50% du chiffre d’affaires (600 €)'),
		],
		'LFSS 600 65%': [
			t('Interdiction d’accueil du public (600 €)'),
			t('Baisse d’au moins 65% du chiffre d’affaires (600 €)'),
		],
		'LFSS 300': [t("Baisse entre 30% à 64% du chiffre d'affaires (300 €)")],
		LFR1: [t('Eligibilité aux mois de mars, avril ou mai 2021 (250 €)')],
	}

	const items = dottedNames
		.map((rule) => engine.getRule(rule))
		.filter(
			(node) =>
				node.dottedName &&
				actualMonth + ' . ' + node.dottedName in engine.getParsedRules() &&
				engine.evaluate(actualMonth + ' . ' + node.dottedName).nodeValue !==
					null &&
				(node.dottedName + ' applicable' in engine.getParsedRules()
					? engine.evaluate(node.dottedName + ' applicable').nodeValue
					: true)
		)
		.flatMap((node) => {
			const name = (actualMonth + ' . ' + node.dottedName) as DottedNames
			const rawNode = engine.getRule(name).rawNode

			type Meta = { "baisse d'au moins"?: string }
			const percent = getMeta<Meta>(rawNode)?.["baisse d'au moins"]

			const choice = (node.dottedName +
				(percent ? ' ' + percent : '')) as keyof typeof choices

			return choices[choice].map((text, i) => ({
				key: (node.dottedName as string) + `.${i}`,
				text,
			}))
		})
		.filter(<T,>(x: T | null): x is T => Boolean(x))

	if (items.length > 0) {
		items.unshift({ key: 'non', text: choices['non'][0] })
	}

	return (
		<Tr>
			<Td>{title}</Td>
			<Td>
				{items.length > 0 ? (
					<Select
						onSelectionChange={onSelectionChange}
						defaultSelectedKey={defaultSelectedKey}
						label={t('Situation liée à la crise sanitaire')}
					>
						{items.map(({ key, text }) => (
							<Item key={key} textValue={text}>
								{text}
							</Item>
						))}
					</Select>
				) : (
					<Empty>
						<Trans>Mois non concerné</Trans>
					</Empty>
				)}
			</Td>
			<Td>
				{(items.length > 0 &&
					typeof total?.nodeValue === 'number' &&
					(formatValue(total) as string)) ||
					'-'}
			</Td>
		</Tr>
	)
}
