import { PressEvent } from 'react-aria'
import { styled } from 'styled-components'

import { Button } from './Button'

type Props = {
	children: React.ReactNode
	onPress?: (e: PressEvent) => void
}

export const BorderlessButton = ({ children, onPress }: Props) => (
	<StyledButton light size="XXS" onPress={onPress}>
		{children}
	</StyledButton>
)

const StyledButton = styled(Button)`
	border: none;
	font-weight: 700;
`
