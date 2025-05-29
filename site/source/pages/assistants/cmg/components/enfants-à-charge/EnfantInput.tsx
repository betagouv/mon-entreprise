import { Enfant } from '@/contextes/cmg'
import { Button } from '@/design-system'
import { ChangeHandler } from '@/utils/ChangeHandler'

import DateDeNaissanceInput from './DateDeNaissanceInput'
import PrénomInput from './PrénomInput'

type Props = {
	idSuffix: string
	enfant: Enfant
	onChange: ChangeHandler<Enfant>
	onDelete: () => void
}

export default function EnfantInput({
	idSuffix,
	enfant,
	onChange,
	onDelete,
}: Props) {
	return (
		<>
			<PrénomInput
				idSuffix={idSuffix}
				valeur={enfant.prénom}
				onChange={(prénom) =>
					onChange({
						...enfant,
						prénom,
					})
				}
			/>
			<DateDeNaissanceInput
				idSuffix={idSuffix}
				valeur={enfant.dateDeNaissance}
				onChange={(dateDeNaissance) =>
					dateDeNaissance &&
					onChange({
						...enfant,
						dateDeNaissance,
					})
				}
			/>
			<Button onClick={onDelete}>Supprimer</Button>
		</>
	)
}
