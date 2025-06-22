import * as A from 'effect/Array'
import { useTranslation } from 'react-i18next'

import { SalariéeAMA, useCMG } from '@/contextes/cmg'
import { Button } from '@/design-system'

import { Titre2 } from '../styled-components'
import AMAInput from './AMAInput'

export default function AMA() {
	const { t } = useTranslation()
	const { salariéesAMA, set } = useCMG()

	const onChange = (index: number) => (salariéeAMA: SalariéeAMA<string>) => {
		set.salariéesAMA(A.replace(salariéesAMA, index, salariéeAMA))
	}

	const onDelete = (index: number) => () => {
		set.salariéesAMA(A.remove(salariéesAMA, index))
	}

	return (
		<>
			<Titre2>
				{t(
					'pages.assistants.cmg.déclarations.AMA.h2',
					'Assistantes maternelles agréées'
				)}
			</Titre2>

			{salariéesAMA.map((salariéeAMA, index) => (
				<AMAInput
					key={index}
					number={index + 1}
					idSuffix={`AMA-${index}`}
					salariée={salariéeAMA}
					onChange={onChange(index)}
					onDelete={onDelete(index)}
				/>
			))}

			<Button size="XXS" color="secondary" light onPress={set.nouvelleAMA}>
				{t(
					'pages.assistants.cmg.déclarations.add-button-label',
					'Déclarer une salariée'
				)}
			</Button>
		</>
	)
}
