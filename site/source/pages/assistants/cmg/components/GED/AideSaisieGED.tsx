import { styled } from 'styled-components'

import AideSaisieCMG from '../déclaration/AideSaisieCMG'
import AideSaisieHeuresDeGarde from '../déclaration/AideSaisieHeuresDeGarde'
import AideSaisieRémunération from '../déclaration/AideSaisieRémunération'

export default function AideSaisieGED() {
	return (
		<>
			<AideSaisieHeuresDeGardeContainer>
				<AideSaisieHeuresDeGarde />
			</AideSaisieHeuresDeGardeContainer>
			<AideSaisieRémunération />
			<AideSaisieCMG />
		</>
	)
}

const AideSaisieHeuresDeGardeContainer = styled.div`
	grid-row-start: 2;
`
