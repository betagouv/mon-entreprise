import { useCMG } from '@/contextes/cmg'
import { Body } from '@/design-system'
import { toString as formatMontant } from '@/domaine/Montant'

export default function Résultat() {
	const { éligible, montantCT } = useCMG()

	if (!éligible || !montantCT.valeur) {
		return
	}

	return (
		<Body>
			Montant théorique du complément transitoire :&nbsp;
			{formatMontant(montantCT)}
		</Body>
	)
}
