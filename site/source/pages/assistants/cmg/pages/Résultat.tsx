import { useCMG } from '@/contextes/cmg'
import { Body } from '@/design-system'
import { toString as formatMontant } from '@/domaine/Montant'

import Navigation from '../components/Navigation'
import NonÉligible from './NonÉligible'

export default function Résultat() {
	const { montantCT } = useCMG()

	if (!montantCT) {
		return <NonÉligible précédent="déclarations" />
	}

	return (
		<>
			<Body>
				Montant théorique du complément transitoire :&nbsp;
				{formatMontant(montantCT)}
			</Body>

			<Navigation précédent="déclarations" />
		</>
	)
}
