import { styled } from 'styled-components'

export const AccordeonDocumentation = styled.details`
	margin: ${({ theme }) => `${theme.spacings.md} 0`};
	border: 1px solid ${({ theme }) => theme.colors.extended.grey[300]};
	border-radius: ${({ theme }) => theme.box.borderRadius};
	overflow: hidden;

	summary {
		padding: ${({ theme }) => `${theme.spacings.sm} ${theme.spacings.md}`};
		background-color: ${({ theme }) => theme.colors.extended.grey[100]};
		cursor: pointer;
		font-weight: 600;
		user-select: none;

		&:hover {
			background-color: ${({ theme }) => theme.colors.extended.grey[200]};
		}

		&::marker {
			content: '';
		}

		&::before {
			content: '▶';
			display: inline-block;
			margin-right: ${({ theme }) => theme.spacings.xs};
			transition: transform 0.2s;
		}
	}

	&[open] summary::before {
		transform: rotate(90deg);
	}

	& > *:not(summary) {
		padding: ${({ theme }) => theme.spacings.md};
		border-top: 1px solid ${({ theme }) => theme.colors.extended.grey[300]};
		background-color: ${({ theme }) =>
			theme.darkMode
				? theme.colors.extended.dark[700]
				: theme.colors.extended.grey[100]};
	}
`
