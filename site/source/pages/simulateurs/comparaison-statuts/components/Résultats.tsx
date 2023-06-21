import styled from 'styled-components'

import { Container } from '@/design-system/layout'

import { EngineComparison } from './Comparateur'
import RevenuAprèsImpot from './RevenuAprèsImpot'
import RevenuEstimé from './RevenuEstimé'

const Résultats = ({ namedEngines }: { namedEngines: EngineComparison }) => {
	return (
		<StyledContainer
			backgroundColor={(theme) =>
				theme.darkMode
					? theme.colors.extended.dark[700]
					: theme.colors.bases.primary[200]
			}
		>
			<RevenuEstimé />
			<RevenuAprèsImpot namedEngines={namedEngines} />
		</StyledContainer>
	)
}

export default Résultats

const StyledContainer = styled(Container)`
	padding: ${({ theme }) => theme.spacings.lg};
`
