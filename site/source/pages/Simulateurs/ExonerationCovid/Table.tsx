import { Item, Select } from '@/design-system/field/Select'
import { baseParagraphStyle } from '@/design-system/typography/paragraphs'
import { Key } from 'react'
import { Trans } from 'react-i18next'
import styled, { css } from 'styled-components'

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
	title?: string
	total?: string
	label?: string
	items: {
		key: string
		text: string
	}[]
	onSelectionChange?: (key: Key) => void
	defaultSelectedKey?: Key
}

export const Row = ({
	title,
	total,
	items,
	label,
	onSelectionChange,
	defaultSelectedKey,
}: RowProps) => {
	return (
		<Tr>
			<Td>{title}</Td>
			<Td>
				{items.length > 0 ? (
					<Select
						onSelectionChange={onSelectionChange}
						defaultSelectedKey={defaultSelectedKey}
						label={label}
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
			<Td>{total}</Td>
		</Tr>
	)
}
