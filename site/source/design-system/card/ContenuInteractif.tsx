import { styled } from 'styled-components'

export const ContenuInteractif = styled.div`
	margin: ${({ theme }) => `${theme.spacings.lg} 0`};
	padding: ${({ theme }) => theme.spacings.lg};
	background-color: ${({ theme }) =>
		theme.darkMode
			? theme.colors.extended.dark[700]
			: theme.colors.extended.grey[100]};
	border-radius: ${({ theme }) => theme.box.borderRadius};
	border: 1px solid
		${({ theme }) =>
			theme.darkMode
				? theme.colors.extended.dark[500]
				: theme.colors.extended.grey[300]};
`
