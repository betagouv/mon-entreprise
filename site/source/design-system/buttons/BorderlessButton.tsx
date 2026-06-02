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
	svg {
		fill: ${({ theme }) => theme.colors.bases.primary[700]};
	}
	display: flex;
	align-items: center;
	gap: ${({ theme }) => theme.spacings.xs};
	font-weight: 700;
`
