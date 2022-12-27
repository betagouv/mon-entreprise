import styled from 'styled-components'

import { CheckmarkIcon, CrossIcon } from '../icons'

export const CheckList = ({
	items,
}: {
	items: { label: string; isChecked: boolean }[]
}) => {
	return (
		<ul>
			{items.map(({ isChecked, label }, index) => (
				<StyledLi key={`checklist-item-${label}-${index}`}>
					{isChecked ? <CheckmarkIcon /> : <CrossIcon />}
					{label}
				</StyledLi>
			))}
		</ul>
	)
}

const StyledLi = styled.li<{ $isChecked?: boolean }>`
	list-style: none;
	svg {
		margin-right: 0.375rem;
	}
	display: flex;
	align-items: center;
	font-family: ${({ theme }) => theme.fonts.main};
	&:not(:last-child) {
		margin-bottom: 0.375rem;
	}
`
