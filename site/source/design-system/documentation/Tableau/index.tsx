import { styled } from 'styled-components'

export const Tableau = styled.table`
	width: 100%;
	border-collapse: collapse;
	margin: ${({ theme }) => theme.spacings.lg} 0;

	th,
	td {
		padding: ${({ theme }) => `${theme.spacings.sm} ${theme.spacings.md}`};
	}

	th {
		background-color: ${({ theme }) =>
			theme.darkMode
				? theme.colors.bases.primary[800]
				: theme.colors.bases.primary[200]};
		color: ${({ theme }) =>
			theme.darkMode
				? theme.colors.bases.primary[100]
				: theme.colors.bases.primary[800]};
		font-weight: 700;
		border: 1px solid
			${({ theme }) =>
				theme.darkMode
					? theme.colors.bases.primary[700]
					: theme.colors.bases.primary[300]};
		text-align: left;
	}

	td {
		border: 1px solid
			${({ theme }) =>
				theme.darkMode
					? theme.colors.extended.dark[500]
					: theme.colors.extended.grey[400]};
	}

	tbody tr:nth-child(even) {
		background-color: ${({ theme }) =>
			theme.darkMode
				? theme.colors.extended.dark[600]
				: theme.colors.extended.grey[300]};
	}

	tbody tr:hover {
		background-color: ${({ theme }) =>
			theme.darkMode
				? theme.colors.extended.dark[500]
				: theme.colors.bases.primary[100]};
	}
`
