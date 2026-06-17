import { styled } from 'styled-components'

export const Liseré = styled.div.withConfig({
	shouldForwardProp: (prop) => !['couleur', 'label'].includes(prop),
})<{
	couleur?: string
	label?: string
}>`
	border: 1px solid ${({ couleur = '#795548' }) => couleur};
	border-radius: 3px;
	padding: ${({ theme }) => `${theme.spacings.sm} ${theme.spacings.md}`};
	position: relative;
	margin: ${({ theme }) => `${theme.spacings.lg} 0 ${theme.spacings.md}`};

	${({ theme, label, couleur = '#795548' }) =>
		label &&
		`
		&::before {
			content: '${label}';
			background-color: ${couleur};
			color: white;
			padding: 0.4rem 0.6rem;
			position: absolute;
			top: -0.5rem;
			left: -1px;
			border-bottom-right-radius: 0.3rem;
			font-weight: 600;
			font-size: ${theme.fontSizes.min};
			text-transform: capitalize;
		}
	`}
`
