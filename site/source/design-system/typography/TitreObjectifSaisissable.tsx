import { ReactNode } from 'react'
import { styled } from 'styled-components'

export type TitreObjectifSaisissableProps = {
	id?: string
	htmlFor: string
	children: ReactNode
}

export const TitreObjectifSaisissable = ({
	id,
	children,
	htmlFor,
}: TitreObjectifSaisissableProps) => {
	return (
		<StyledLabel htmlFor={htmlFor} id={id}>
			{children}
		</StyledLabel>
	)
}

const StyledLabel = styled.label`
	color: ${({ theme }) =>
		theme.darkMode
			? theme.colors.extended.grey[100]
			: theme.colors.bases.primary[700]};
	font-weight: 700;
	font-family: ${({ theme }) => theme.fonts.main};
`
