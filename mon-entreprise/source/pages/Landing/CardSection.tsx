import styled from 'styled-components'

export const CardSection = styled.section`
	display: grid;
	grid-template-columns: 1fr;
	@media (min-width: ${({ theme }) => theme.breakpointsWidth.sm}) {
		grid-template-columns: 1fr 1fr;
	}
	@media (min-width: ${({ theme }) => theme.breakpointsWidth.lg}) {
		grid-template-columns: 1fr 1fr 1fr;
	}
	gap: ${({ theme }) => theme.spacings.sm};
`
