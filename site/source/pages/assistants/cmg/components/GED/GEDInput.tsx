import { SalariéeGED } from '@/contextes/cmg'
import { Button } from '@/design-system'
import { ChangeHandler } from '@/utils/ChangeHandler'

import DéclarationGEDInput from './DéclarationGEDInput'

type Props = {
	idSuffix: string
	salariée: SalariéeGED
	onChange: ChangeHandler<SalariéeGED>
	onDelete: () => void
}

export default function GEDInput({
	idSuffix,
	salariée,
	onChange,
	onDelete,
}: Props) {
	return (
		<>
			{Object.keys(salariée).map((month) => (
				<DéclarationGEDInput
					key={month}
					idSuffix={`${idSuffix}-${month}`}
					month={month}
					déclaration={salariée[month as keyof SalariéeGED]}
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
