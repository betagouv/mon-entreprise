import { css } from 'styled-components'

const LABEL_AND_HELPERS_HEIGHT = '0.9rem'
const TRANSITION = 'transition: all 200ms;'

export const fieldContainerStyles = css`
	display: flex;
	flex-direction: column;
	gap: ${({ theme }) => theme.spacings.xxs};

	font-family: ${({ theme }) => theme.fonts.main};
`

export const labelAndInputContainerStyles = css`
	display: flex;
	flex-direction: column;
	gap: ${({ theme }) => theme.spacings.xxs};

	border: ${({ theme }) =>
		`${theme.box.borderWidth} solid ${
			theme.darkMode
				? theme.colors.extended.grey[100]
				: theme.colors.extended.grey[700]
		}`};
	border-radius: ${({ theme }) => theme.box.borderRadius};
	outline: transparent solid 1px;

	background: ${({ theme }) =>
		theme.darkMode
			? 'rgba(255, 255, 255, 10%)'
			: theme.colors.extended.grey[100]};

	${TRANSITION}

	&:focus-within {
		outline-color: ${({ theme }) =>
			theme.darkMode
				? theme.colors.bases.primary[100]
				: theme.colors.bases.primary[700]};
		outline-offset: ${({ theme }) => theme.spacings.xxs};
		outline-width: ${({ theme }) => theme.spacings.xxs};
	}

	&:focus-within label {
		color: ${({ theme }) => theme.colors.bases.primary[800]};
	}
`

export const fieldLabelStyles = css`
	padding: ${({ theme }) => `${theme.spacings.xxs} ${theme.spacings.sm} 0`};

	font-size: ${LABEL_AND_HELPERS_HEIGHT};

	${TRANSITION}

	@media not print {
		color: ${({ theme }) =>
			theme.darkMode
				? theme.colors.extended.grey[100]
				: theme.colors.extended.grey[800]};
	}
`

export const fieldInputStyles = css`
	margin: ${({ theme }) =>
		`${theme.spacings.xxs} ${theme.spacings.sm} ${theme.spacings.xs}`};
	padding: 0;
	border: none;
	outline: none;

	font-size: 1rem;

	&::placeholder {
		color: ${({ theme }) =>
			theme.darkMode
				? theme.colors.extended.grey[200]
				: theme.colors.extended.grey[600]};
	}

	@media not print {
		color: ${({ theme }) =>
			theme.darkMode
				? `color: ${theme.colors.extended.grey[100]}`
				: 'color: inherit'};
	}
`

export const errorColorStyle = css`
	color: ${({ theme }) => theme.colors.extended.error[400]} !important;
`
