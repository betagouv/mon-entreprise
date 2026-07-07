import { styled } from 'styled-components'

import AideSaisieCMG from '../declaration/AideSaisieCMG'
import AideSaisieHeuresDeGarde from '../declaration/AideSaisieHeuresDeGarde'
import AideSaisieRémunération from '../declaration/AideSaisieRemuneration'
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
