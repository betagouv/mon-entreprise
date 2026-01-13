import { css } from 'styled-components'

const LABELS_HEIGHT = '1rem'
const HELPERS_HEIGHT = '0.9rem'

export const fieldTransition = css`
	transition: all 200ms;
`

export const outlineOnFocus = css`
	outline-color: ${({ theme }) =>
		theme.darkMode
			? theme.colors.bases.primary[100]
			: theme.colors.bases.primary[700]};
	outline-offset: ${({ theme }) => theme.spacings.xxs};
	outline-width: ${({ theme }) => theme.spacings.xxs};
`

export const fieldContainerStyles = css`
	display: flex;
	flex-direction: column;
	gap: ${({ theme }) => theme.spacings.xs};

	font-family: ${({ theme }) => theme.fonts.main};
`

export const labelAndInputContainerStyles = css`
	display: flex;
	flex-direction: column;
	gap: ${({ theme }) => theme.spacings.xs};

	${fieldTransition}

	&:focus-within label {
		color: ${({ theme }) => theme.colors.bases.primary[800]};
	}
`

export const fieldLabelStyles = css`
	font-size: ${LABELS_HEIGHT};

	${fieldTransition}

	@media not print {
		color: ${({ theme }) =>
			theme.darkMode
				? theme.colors.extended.grey[100]
				: theme.colors.extended.grey[800]};
	}
`

export const fieldDescriptionStyles = css`
	${fieldLabelStyles}

	font-size: ${HELPERS_HEIGHT};
`

export const fieldInputStyles = css`
	padding: ${({ theme }) => `${theme.spacings.xs} ${theme.spacings.sm}`};
	border: 1px solid ${({ theme }) => theme.colors.extended.grey[700]};
	border-radius: ${({ theme }) => theme.box.borderRadius};
	outline: transparent solid 1px;

	font-size: 1rem;

	input {
		font-size: 1rem;
	}

	&:focus,
	&:focus-within {
		${outlineOnFocus}
	}

	&::placeholder,
	&input::placeholder {
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

export const errorMessageStyle = css`
	display: flex;
	gap: ${({ theme }) => `${theme.spacings.xs}`};

	color: ${({ theme }) => theme.colors.extended.error[400]} !important;
	font-size: ${HELPERS_HEIGHT};

	svg {
		position: relative;
		top: calc(-1 * ${({ theme }) => theme.spacings.xxxs});

		width: ${HELPERS_HEIGHT};

		fill: ${({ theme }) => theme.colors.extended.error[400]};
	}
`
