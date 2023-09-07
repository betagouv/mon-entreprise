import { styled } from 'styled-components'

import { GenericButtonOrNavLinkProps } from '../typography/link'
import { Button } from './Button'

export default styled(Button).attrs({
	light: true,
	children: '×',
})<GenericButtonOrNavLinkProps>`
	@media print {
		display: none !important;
	}
	text-align: center;
	height: 1.5rem;
	line-height: 1rem;
	width: 1.5rem;
	padding: 0;
	font-weight: bold;
	margin-left: 1rem;
`
