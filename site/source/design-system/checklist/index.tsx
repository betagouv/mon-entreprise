import { ReactNode } from 'react'
import styled from 'styled-components'

import { CheckmarkIcon, CrossIcon } from '../icons'

export const CheckList = ({
	items,
}: {
	items: { label: ReactNode; isChecked: boolean }[]
}) => {
	return (
		<StyledUl>
			{items.map((item, index) => {
				const { isChecked, label } = item

				return (
					<StyledLi key={`checklist-item-${item.toString()}-${index}`}>
						{isChecked ? <CheckmarkIcon /> : <CrossIcon />}
						{label}
					</StyledLi>
				)
			})}
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
		margin-right: 0.5rem;
	}
	display: flex;
	align-items: center;
	font-family: ${({ theme }) => theme.fonts.main};
	&:not(:last-child) {
		margin-bottom: 1.5rem;
	}
`