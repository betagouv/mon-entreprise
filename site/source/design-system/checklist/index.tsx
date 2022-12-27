import { ReactNode } from 'react'
import styled from 'styled-components'

import { CheckmarkIcon, CrossIcon } from '../icons'

export const CheckList = ({
	items,
	id,
}: {
	items: { label: ReactNode; isChecked: boolean }[]
	id: string
}) => {
	return (
		<StyledUl>
			{items.map(({ isChecked, label }, index) => (
				<StyledLi key={`checklist-item-${id}-${index}`}>
					{isChecked ? <CheckmarkIcon /> : <CrossIcon />}
					{label}
				</StyledLi>
			))}
		</StyledUl>
	)
}

const StyledUl = styled.ul`
	margin: 0;
	padding: 0;
`

const StyledLi = styled.li<{ $isChecked?: boolean }>`
	list-style: none;
	svg {
		margin-right: 0.375rem;
	}
	display: flex;
	align-items: center;
	font-family: ${({ theme }) => theme.fonts.main};
	&:not(:last-child) {
		margin-bottom: 1rem;
	}
`
