import { MontantField } from '@/design-system'
import { euros } from '@/domaine/Montant'
import { rémunérationBruteDottedName } from '@/utils/réductionDeCotisations'

import { useEngine } from '../utils/EngineContext'

type Props = {
	index: number
	monthName: string
	rémunérationBrute: number
	onRémunérationChange: (monthIndex: number, rémunérationBrute: number) => void
}

export default function RémunérationInput({
	index,
	monthName,
	rémunérationBrute,
	onRémunérationChange,
}: Props) {
	const engine = useEngine()

	return (
		<MontantField
			id={`${rémunérationBruteDottedName.replace(/\s|\./g, '_')}-${monthName}`}
			aria={{
				label: `${engine.getRule(rémunérationBruteDottedName)
					?.title} (${monthName})`,
				labelledby: 'simu-update-explaining',
			}}
			onChange={(montant) => onRémunérationChange(index, montant?.valeur ?? 0)}
			value={
				rémunérationBrute !== undefined ? euros(rémunérationBrute) : undefined
			}
			unité="€"
			avecCentimes
		/>
	)
}
