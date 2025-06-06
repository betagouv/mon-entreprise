import { useCMG } from '@/contextes/cmg'
import { Body } from '@/design-system'
import { toString as formatMontant } from '@/domaine/Montant'

import Navigation from '../components/Navigation'
import NonÉligible from './NonÉligible'

export default function Résultat() {
	const { éligible, montantCT } = useCMG()

	return (
		<>
			{éligible && montantCT.valeur ? (
				<Body>
					Montant théorique du complément transitoire :&nbsp;
					{formatMontant(montantCT)}
				</Body>
			) : (
				<NonÉligible />
			)}

			<Navigation précédent="AMA" />
		</>
	)
}
