import { SalariéeAMA } from '@/contextes/cmg'
import { Button } from '@/design-system'
import { ChangeHandler } from '@/utils/ChangeHandler'

import DéclarationAMAInput from './DéclarationAMAInput'

type Props = {
	idSuffix: string
	salariée: SalariéeAMA<string>
	onChange: ChangeHandler<SalariéeAMA<string>>
	onDelete: () => void
}

export default function AMAInput({
	idSuffix,
	salariée,
	onChange,
	onDelete,
}: Props) {
	return (
		<>
			{Object.keys(salariée).map((month) => (
				<DéclarationAMAInput
					key={month}
					idSuffix={`${idSuffix}-${month}`}
					month={month}
					déclaration={salariée[month as keyof SalariéeAMA<string>]}
					onChange={(value) =>
						onChange({
							...salariée,
							[month]: value,
						})
					}
				/>
			))}
			<Button onClick={onDelete}>Supprimer</Button>
		</>
	)
}
