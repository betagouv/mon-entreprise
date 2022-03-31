import { SmallBody } from '@/design-system/typography/paragraphs'
import React from 'react'
import styled from 'styled-components'

export default function FormulaireTitle({
	formulaire,
	children,
}: {
	formulaire: string
	children: React.ReactNode
}) {
	return (
		<StyledLiasseTitle>
			{children}
			<StyledFormulaireReference>{formulaire}</StyledFormulaireReference>
		</StyledLiasseTitle>
	)
}

const StyledFormulaireReference = styled(SmallBody)`
	margin-bottom: -1.5rem;
`
const StyledLiasseTitle = styled.header`
	display: flex;
	margin-bottom: -1rem;

	flex-direction: column-reverse;
`
