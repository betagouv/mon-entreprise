import { useCMG } from '@/contextes/cmg'

import Montant from './Montant'
import NonÉligible from './NonÉligible'

export default function Résultats() {
	const { éligible, montantCT } = useCMG()

	return (
		<>
			{éligible && montantCT.valeur ? (
				<Montant montant={montantCT} />
			) : (
				<NonÉligible />
			)}
		</>
	)
}
