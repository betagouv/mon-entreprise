import * as A from 'effect/Array'
import { useTranslation } from 'react-i18next'

import { SalariéeAMA, useCMG } from '@/contextes/cmg'
import { Button, H2 } from '@/design-system'

import AMAInput from '../components/AMA/AMAInput'
import Navigation from '../components/Navigation'

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
			<H2>
				{t('pages.assistants.cmg.AMA.h2', 'Assistantes Maternelles Agréées')}
			</H2>

			{salariéesAMA.map((salariéeAMA, index) => (
				<AMAInput
					key={index}
					idSuffix={`${index}`}
					salariée={salariéeAMA}
					onChange={onChange(index)}
					onDelete={onDelete(index)}
				/>
			))}

			<Button size="XXS" light onPress={set.nouvelleAMA}>
				{t('pages.assistants.cmg.AMA.add-button-label', 'Ajouter une salariée')}
			</Button>

			<Navigation précédent="GED" suivant="résultat" />
		</>
	)
}
