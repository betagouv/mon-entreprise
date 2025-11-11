import { styled } from 'styled-components'

export const Valeur = styled.span.withConfig({
	shouldForwardProp: (prop) => !['large', 'couleur'].includes(prop),
})<{
	large?: boolean
	couleur?: 'primary' | 'secondary' | 'success' | 'error'
}>`
	font-weight: bold;
	color: ${({ couleur = 'primary', theme }) => {
		switch (couleur) {
			case 'secondary':
				return theme.colors.bases.secondary[600]
			case 'success':
				return theme.colors.extended.success[600]
			case 'error':
				return theme.colors.extended.error[500]
			default:
				return theme.colors.bases.primary[700]
		}
	}};
	font-size: ${({ large }) => (large ? '1.25rem' : '1rem')};

	${({ theme }) =>
		theme.darkMode &&
		`
		color: ${theme.colors.bases.primary[400]};
	`}
`
