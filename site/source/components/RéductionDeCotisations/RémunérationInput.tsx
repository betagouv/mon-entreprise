import { MontantField } from '@/design-system'
import { euros } from '@/domaine/Montant'
import { rémunérationBruteDottedName } from '@/utils/réductionDeCotisations'
import { normalizeRuleName } from '../utils/normalizeRuleName'

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
	return (
		<MontantField
			id={`${normalizeRuleName(rémunérationBruteDottedName)}-${monthName}`}
			aria={{
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
