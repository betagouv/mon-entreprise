import React, { useRef } from 'react'
import { AriaButtonProps, useButton } from 'react-aria'
import { styled } from 'styled-components'

import { ChevronIcon } from '../icons'
import { CardButton, CardContainer } from './Card'

type Props = {
	children: React.ReactNode
} & AriaButtonProps<'button'>

export const BasicCard = ({ children, ...ariaProps }: Props) => {
	const ref = useRef<HTMLButtonElement>(null)
	const { buttonProps } = useButton(ariaProps, ref)

	return (
		<Container>
			{children}
			<Bouton $size="XXS" $light $color="primary" ref={ref} {...buttonProps}>
				<ChevronIcon />
			</Bouton>
		</Container>
	)
}

const Container = styled(CardContainer)`
	display: flex;
	flex-direction: column;
	row-gap: ${({ theme }) => theme.spacings.md};
	align-items: center;
	justify-content: space-between;
	@media (min-width: ${({ theme }) => theme.breakpointsWidth.sm}) {
		flex-direction: row;
		column-gap: ${({ theme }) => theme.spacings.lg};
	}
`

const Bouton = styled(CardButton)`
	padding: ${({ theme }) => theme.spacings.xxs};
`
