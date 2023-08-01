import { ReactNode } from 'react'
import styled, { css } from 'styled-components'

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
					<StyledLi $isChecked={isChecked} key={`checklist-item-${index}`}>
						{isChecked ? <CheckmarkIcon /> : <CrossIcon />}
						{label}
					</StyledLi>
				)
			})}
		</StyledUl>
	)
}

const StyledUl = styled.ul`
	padding: 0;
	flex: 1;
	display: flex;
	flex-direction: column;
	justify-content: flex-end;
`

const StyledLi = styled.li<{ $isChecked?: boolean }>`
	list-style: none;
	svg {
		margin-right: 0.5rem;
		flex-shrink: 0;
		${({ theme, $isChecked }) =>
			!$isChecked &&
			css`
				fill: ${theme.darkMode
					? theme.colors.extended.grey[100]
					: theme.colors.extended.grey[600]}!important;
			`}
	}
	display: flex;
	align-items: center;
	flex-wrap: wrap;
	font-family: ${({ theme }) => theme.fonts.main};
	&:not(:last-child) {
		margin-bottom: 1.5rem;
	}
`
