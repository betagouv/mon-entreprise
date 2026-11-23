import { normalizeRuleName } from '@/components/utils/normalizeRuleName'
import { Lodeom } from '@/contextes/salarié'
import { MontantField } from '@/design-system'
import { euros } from '@/domaine/MontantPonctuel'

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
			id={`${normalizeRuleName(Lodeom.rémunérationBruteDottedName)}-${monthName}`}
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
