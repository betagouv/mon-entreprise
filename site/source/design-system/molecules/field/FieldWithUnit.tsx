import { ReactNode } from 'react'
import { styled } from 'styled-components'

interface FieldWithUnitProps {
	children: ReactNode
	unit?: string
	small?: boolean
}

export const FieldWithUnit = ({
	children,
	unit,
	small,
}: FieldWithUnitProps) => {
	if (!unit) {
		return <>{children}</>
	}

	return (
		<Container>
			<InputWrapper>{children}</InputWrapper>
			<Unit $small={small}>&nbsp;{unit}</Unit>
		</Container>
	)
}

const Container = styled.div`
	display: flex;
	align-items: baseline;
	width: 100%;
`

const InputWrapper = styled.div`
	flex: 1;

	/* Ajuster le padding de l'input à l'intérieur */
	input {
		padding-right: 0 !important;
	}
`

const Unit = styled.span<{ $small?: boolean }>`
	font-size: ${({ $small }) => ($small ? '0.875rem' : '1rem')};
	line-height: 1.5rem;
	font-family: ${({ theme }) => theme.fonts.main};
	color: ${({ theme }) =>
		theme.darkMode
			? theme.colors.extended.grey[100]
			: theme.colors.extended.grey[800]};
	background-color: transparent;
	white-space: nowrap;
	user-select: none;
	padding-right: ${({ theme }) => theme.spacings.sm};
`
