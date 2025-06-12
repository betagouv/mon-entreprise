import { styled } from 'styled-components'

import AideSaisieCMG from '../déclaration/AideSaisieCMG'
import AideSaisieHeuresDeGarde from '../déclaration/AideSaisieHeuresDeGarde'
import AideSaisieRémunération from '../déclaration/AideSaisieRémunération'

export default function AideSaisieGED() {
	return (
		<Container>
			<AideSaisieHeuresDeGarde />
			<AideSaisieRémunération />
			<AideSaisieCMG />
		</Container>
	)
}
const Container = styled.div`
	max-width: 25%;
`
