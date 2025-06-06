import { useCMG } from '@/contextes/cmg'
import { Body } from '@/design-system'

export default function NonÉligible() {
	const { éligible, montantCT } = useCMG()

	if (éligible && montantCT.valeur) {
		return
	}

	return <Body>Vous n’êtes pas éligible au complément transitoire.</Body>
}
