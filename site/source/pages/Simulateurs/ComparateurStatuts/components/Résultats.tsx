import styled from 'styled-components'

import { Container } from '@/design-system/layout'

import RevenuEstimé from './RevenuEstimé'

const Résultats = () => {
	return (
		<StyledContainer
			backgroundColor={(theme) => theme.colors.bases.primary[200]}
		>
			<RevenuEstimé />
		</StyledContainer>
	)
}

export default Résultats

const StyledContainer = styled(Container)`
	padding: ${({ theme }) => theme.spacings.lg};
`
