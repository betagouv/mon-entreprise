import { css, styled } from 'styled-components'

import { Palette } from '@/types/styled'

import { CrossIcon } from '../icons'
import { getColorPalette } from '../theme'
import { GenericButtonOrNavLinkProps } from '../typography/link'
import { Button } from './Button'

export const CloseButton = styled(Button).attrs({
	light: true,
	children: <CrossIcon />,
})<GenericButtonOrNavLinkProps>`
	@media print {
		display: none !important;
	}
	display: flex;
	align-items: center;
	justify-content: center;
	height: 1.5rem;
	width: 1.5rem;
	padding: 0;
	margin-left: 1rem;

	img {
		width: 0.7em !important;
		height: 0.7em !important;
	}

	${({ color = 'primary' }) => {
		const colorPalette = getColorPalette(color)
		const borderColor =
			color === 'primary'
				? (colorPalette as Palette)[700]
				: color === 'error'
				? colorPalette[400]
				: colorPalette[600]

		return css`
			svg {
				fill: ${borderColor};
			}
		`
	}}
`
