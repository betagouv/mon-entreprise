import { ReactNode } from 'react'
import { styled } from 'styled-components'

type Props = {
	children: ReactNode
}

export const FicheDePaie = ({ children }: Props) => (
	<Container>{children}</Container>
)

const Container = styled.div`
	line-height: ${({ theme }) => theme.spacings.lg};

	span {
		display: flex;
		justify-content: flex-end;
		align-items: center;
		font-family: 'Courier New', Courier, monospace;
	}
`
