import { styled } from 'styled-components'

export const DocumentationMDXContainer = styled.div`
	font-family: ${({ theme }) => theme.fonts.main};
	color: ${({ theme }) =>
		theme.darkMode
			? theme.colors.extended.grey[100]
			: theme.colors.extended.grey[800]};

	h1 {
		font-family: 'Montserrat', sans-serif;
		font-weight: 700;
		font-size: 2rem;
		line-height: 2.375rem;
		margin: ${({ theme }) => `${theme.spacings.xxxl} 0 ${theme.spacings.xl}`};
		color: ${({ theme }) =>
			theme.darkMode
				? theme.colors.extended.grey[100]
				: theme.colors.bases.primary[700]};

		&::after {
			height: 1.25rem;
			width: 5rem;
			display: block;
			content: ' ';
			border-bottom: 4px solid
				${({ theme }) => theme.colors.bases.secondary[500]};
		}
	}

	h2 {
		font-family: 'Montserrat', sans-serif;
		font-weight: 700;
		font-size: 1.625rem;
		line-height: 2rem;
		margin: ${({ theme }) => `${theme.spacings.xxl} 0 ${theme.spacings.lg}`};
		color: ${({ theme }) =>
			theme.darkMode
				? theme.colors.extended.grey[100]
				: theme.colors.bases.primary[700]};

		&::after {
			height: 1.25rem;
			width: 5rem;
			display: block;
			content: ' ';
			border-bottom: 4px solid
				${({ theme }) => theme.colors.bases.secondary[500]};
		}
	}

	h3 {
		font-family: 'Montserrat', sans-serif;
		font-weight: 700;
		font-size: 1.25rem;
		line-height: 1.75rem;
		margin: ${({ theme }) => `${theme.spacings.xl} 0 ${theme.spacings.md}`};
		color: ${({ theme }) =>
			theme.darkMode
				? theme.colors.extended.grey[100]
				: theme.colors.bases.primary[700]};
	}

	h4 {
		font-family: 'Montserrat', sans-serif;
		font-weight: 700;
		font-size: 1.125rem;
		line-height: 1.5rem;
		margin: ${({ theme }) => `${theme.spacings.lg} 0 ${theme.spacings.sm}`};
		color: ${({ theme }) =>
			theme.darkMode
				? theme.colors.extended.grey[100]
				: theme.colors.bases.primary[700]};
	}

	h5,
	h6 {
		font-family: 'Montserrat', sans-serif;
		font-weight: 700;
		font-size: 1rem;
		line-height: 1.5rem;
		margin: ${({ theme }) => `${theme.spacings.md} 0 ${theme.spacings.xs}`};
		color: ${({ theme }) =>
			theme.darkMode
				? theme.colors.extended.grey[100]
				: theme.colors.bases.primary[700]};
	}

	p {
		font-size: 1rem;
		line-height: 1.5rem;
		margin: ${({ theme }) => `0 0 ${theme.spacings.md}`};
	}

	ul {
		margin: ${({ theme }) => `${theme.spacings.sm} 0`};
		padding-left: ${({ theme }) => theme.spacings.lg};
	}

	ol {
		margin: ${({ theme }) => `${theme.spacings.sm} 0`};
		padding-left: ${({ theme }) => theme.spacings.lg};
	}

	li {
		margin: ${({ theme }) => `${theme.spacings.xxs} 0`};
		line-height: 1.5rem;
	}

	a {
		color: ${({ theme }) => theme.colors.bases.primary[600]};
		text-decoration: underline;
		text-underline-offset: 3px;

		&:hover {
			color: ${({ theme }) => theme.colors.bases.primary[700]};
		}

		&:visited {
			color: ${({ theme }) => theme.colors.bases.primary[800]};
		}
	}

	code {
		overflow: auto;
		padding: 0.25rem;
		background-color: ${({ theme }) =>
			theme.darkMode
				? theme.colors.extended.dark[600]
				: theme.colors.extended.grey[300]};
		color: inherit;
		border-radius: 0.25rem;
		font-family: 'Courier New', monospace;
		font-size: 0.875rem;
	}

	pre {
		overflow: auto;
		padding: 0.5rem;
		background-color: ${({ theme }) =>
			theme.darkMode
				? theme.colors.extended.dark[600]
				: theme.colors.extended.grey[300]};
		color: inherit;
		border-radius: 0.25rem;
		margin: ${({ theme }) => `${theme.spacings.md} 0`};

		code {
			overflow: initial;
			padding: 0;
			background-color: initial;
			color: inherit;
			border-radius: initial;
		}
	}

	blockquote {
		margin: ${({ theme }) => `${theme.spacings.md} 0`};
		padding: ${({ theme }) => `${theme.spacings.sm} ${theme.spacings.md}`};
		border-left: 4px solid ${({ theme }) => theme.colors.bases.secondary[500]};
		background-color: ${({ theme }) =>
			theme.darkMode
				? theme.colors.extended.dark[700]
				: theme.colors.extended.grey[200]};
		font-style: italic;
	}

	strong {
		font-weight: 700;
	}

	em {
		font-style: italic;
	}

	hr {
		border: none;
		height: 1px;
		background-color: ${({ theme }) =>
			theme.darkMode
				? theme.colors.extended.dark[500]
				: theme.colors.extended.grey[400]};
		margin: ${({ theme }) => `${theme.spacings.xl} 0`};
	}

	table {
		width: 100%;
		border-collapse: collapse;
		margin: ${({ theme }) => `${theme.spacings.md} 0`};
	}

	th,
	td {
		border: 1px solid
			${({ theme }) =>
				theme.darkMode
					? theme.colors.extended.dark[500]
					: theme.colors.extended.grey[400]};
		padding: ${({ theme }) => `${theme.spacings.xs} ${theme.spacings.sm}`};
		text-align: left;
	}

	th {
		background-color: ${({ theme }) =>
			theme.darkMode
				? theme.colors.extended.dark[600]
				: theme.colors.extended.grey[200]};
		font-weight: 700;
	}
`
