import { styled } from 'styled-components'

import { Emoji } from '../emoji'
import { GenericButtonOrNavLinkProps } from '../typography/link'
import { Button } from './Button'

export default styled(Button).attrs({
	light: true,
	children: <Emoji emoji="✖️" />,
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
`
