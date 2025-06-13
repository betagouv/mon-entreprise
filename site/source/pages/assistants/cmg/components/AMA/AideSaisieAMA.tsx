import { styled } from 'styled-components'

import AideSaisieCMG from '../déclaration/AideSaisieCMG'
import AideSaisieHeuresDeGarde from '../déclaration/AideSaisieHeuresDeGarde'
import AideSaisieRémunération from '../déclaration/AideSaisieRémunération'
import AideSaisieEnfants from './AideSaisieEnfants'

export default function AideSaisieAMA() {
	return (
		<>
			<AideSaisieEnfantsContainer>
				<AideSaisieEnfants />
			</AideSaisieEnfantsContainer>
			<MobileHiddenContainer>
				<AideSaisieHeuresDeGarde />
			</MobileHiddenContainer>
			<MobileHiddenContainer>
				<AideSaisieRémunération />
			</MobileHiddenContainer>
			<MobileHiddenContainer>
				<AideSaisieCMG />
			</MobileHiddenContainer>
		</>
	)
}

const AideSaisieEnfantsContainer = styled.div`
	grid-row-start: 2;
	@media (max-width: ${({ theme }) => theme.breakpointsWidth.sm}) {
		display: none;
	}
`
const MobileHiddenContainer = styled.div`
	@media (max-width: ${({ theme }) => theme.breakpointsWidth.sm}) {
		display: none;
	}
`
