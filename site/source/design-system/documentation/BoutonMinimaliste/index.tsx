import { styled } from 'styled-components'

export const BoutonMinimaliste = styled.button`
	font-size: 0.8rem;
	background-color: ${({ theme }) => theme.colors.extended.grey[200]};
	border-radius: ${({ theme }) => theme.box.borderRadius};
	border: none;
	padding: ${({ theme }) => `${theme.spacings.xxs} ${theme.spacings.xs}`};
	color: ${({ theme }) => theme.colors.extended.grey[800]};
	cursor: pointer;
	transition: background-color 0.2s;

	&:hover {
		background-color: ${({ theme }) => theme.colors.extended.grey[300]};
	}

	${({ theme }) =>
		theme.darkMode &&
		`
		background-color: ${theme.colors.extended.dark[600]};
		color: ${theme.colors.extended.grey[200]};

		&:hover {
			background-color: ${theme.colors.extended.dark[500]};
		}
	`}
`
