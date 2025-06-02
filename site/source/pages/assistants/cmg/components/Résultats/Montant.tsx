import { Body } from '@/design-system'
import * as M from '@/domaine/Montant'
import { toString as formatMontant } from '@/domaine/Montant'

type Props = {
	montant: M.Montant
}

export default function Montant({ montant }: Props) {
	return (
		<Body>
			Montant théorique du complément transitoire :&nbsp;
			{formatMontant(montant)}
		</Body>
	)
}
