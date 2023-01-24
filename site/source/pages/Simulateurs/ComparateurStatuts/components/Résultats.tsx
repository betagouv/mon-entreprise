import Engine from 'publicodes'
import styled from 'styled-components'

import { DottedName } from '@/../../modele-social'
import { Container } from '@/design-system/layout'

import RevenuAprèsImpot from './RevenuAprèsImpot'
import RevenuEstimé from './RevenuEstimé'

const Résultats = ({
	engines,
}: {
	engines: [Engine<DottedName>, Engine<DottedName>, Engine<DottedName>]
}) => {
	return (
		<StyledContainer
			backgroundColor={(theme) =>
				theme.darkMode
					? theme.colors.bases.primary[800]
					: theme.colors.bases.primary[200]
			}
		>
			<RevenuEstimé />
			<RevenuAprèsImpot engines={engines} />
		</StyledContainer>
	)
}

export default Résultats

const StyledContainer = styled(Container)`
	padding: ${({ theme }) => theme.spacings.lg};
`
