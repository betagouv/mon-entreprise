import { ReactNode } from 'react'
import { styled } from 'styled-components'

import { BodyStyle } from './paragraphs'

export type TitreObjectifSaisissableProps = {
	id?: string
	htmlFor: string
	children: ReactNode
}

export const TitreObjectifSaisissable = ({
	id,
	children,
	htmlFor,
}: TitreObjectifSaisissableProps) => {
	return (
		<StyledLabel htmlFor={htmlFor} id={id}>
			{children}
		</StyledLabel>
	)
}

const StyledLabel = styled.label`
	${BodyStyle}
	font-weight: 700;
`
