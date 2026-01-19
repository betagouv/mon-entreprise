import { ReactNode } from 'react'
import { css, styled } from 'styled-components'

import { Strong } from '.'
import { Body } from './paragraphs'

type Props = {
	id?: string
	children: ReactNode
	noWrap?: boolean
}

export const TitreObjectif = ({ id, children, noWrap = false }: Props) => {
	return (
		<StyledBody as="span" id={id} $noWrap={noWrap}>
			<Strong>{children}</Strong>
		</StyledBody>
	)
}

const StyledBody = styled(Body)<{ $noWrap?: boolean }>`
	color: ${({ theme }) => theme.colors.extended.grey[100]};
	margin: 0;
	${({ $noWrap }) =>
		$noWrap &&
		css`
			white-space: nowrap;
		`}
`
