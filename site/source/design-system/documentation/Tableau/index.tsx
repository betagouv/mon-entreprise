import { styled } from 'styled-components'

export const Tableau = styled.table`
	width: 100%;
	border-collapse: collapse;
	margin: ${({ theme }) => `${theme.spacings.lg} 0`};

	th {
		background-color: ${({ theme }) => theme.colors.bases.primary[100]};
		color: ${({ theme }) => theme.colors.bases.primary[800]};
		font-weight: 700;
		padding: ${({ theme }) => `${theme.spacings.sm} ${theme.spacings.md}`};
		border: 1px solid ${({ theme }) => theme.colors.bases.primary[300]};
	}

	td {
		padding: ${({ theme }) => `${theme.spacings.sm} ${theme.spacings.md}`};
		border: 1px solid ${({ theme }) => theme.colors.extended.grey[300]};
	}

	tbody tr:nth-child(even) {
		background-color: ${({ theme }) => theme.colors.extended.grey[100]};
	}

	tbody tr:hover {
		background-color: ${({ theme }) => theme.colors.bases.primary[100]};
	}
`
