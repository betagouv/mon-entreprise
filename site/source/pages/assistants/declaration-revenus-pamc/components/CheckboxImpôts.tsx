import { PublicodesExpression } from 'publicodes'
import { styled } from 'styled-components'

import { useEngine } from '@/hooks/useEngine'

type Props = {
	expression: PublicodesExpression
	idPrefix: string
}

export default function CheckboxImpôts({ expression, idPrefix }: Props) {
	const engine = useEngine()
	const nodeValue = engine.evaluate({
		'!=': [expression, 'non'],
	}).nodeValue
	const checked = !!nodeValue

	return (
		<StyledInput
			id={`${idPrefix}-value`}
			type="checkbox"
			readOnly
			checked={checked}
		/>
	)
}

const StyledInput = styled.input`
	margin: ${({ theme }) => `${theme.spacings.xs} ${theme.spacings.sm} 0 0`};
`
