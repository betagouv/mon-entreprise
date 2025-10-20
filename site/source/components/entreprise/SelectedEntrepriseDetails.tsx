import { styled } from 'styled-components'

import EntrepriseDetails from './EntrepriseDetails'

export default function SelectedEntrepriseDetails() {
	return (
		<Container>
			<EntrepriseDetails small />
		</Container>
	)
}

const Container = styled.div`
	padding: 0 ${({ theme }) => theme.spacings.xs};
`
