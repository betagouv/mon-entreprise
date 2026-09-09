import { styled } from 'styled-components'

import AideSaisieCMG from '../déclaration/AideSaisieCMG'
import AideSaisieHeuresDeGarde from '../déclaration/AideSaisieHeuresDeGarde'
import AideSaisieRémunération from '../déclaration/AideSaisieRémunération'
import { MobileHidden } from '../styled-components'
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
			<AideSaisieCMGContainer>
				<AideSaisieCMG />
			</AideSaisieCMGContainer>
		</>
	)
}

const AideSaisieEnfantsContainer = styled.div`
	grid-row-start: 2;
	${MobileHidden}
`
const AideSaisieCMGContainer = styled.div`
	grid-row: span 2;
	${MobileHidden}
`
const MobileHiddenContainer = styled.div`
	${MobileHidden}
`
