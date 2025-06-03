import * as A from 'effect/Array'
import { useTranslation } from 'react-i18next'

import { SalariéeGED, useCMG } from '@/contextes/cmg'
import { Button, H2 } from '@/design-system'

import GEDInput from '../components/GED/GEDInput'

export default function GED() {
	const { t } = useTranslation()
	const { salariéesGED, set } = useCMG()

	const onChange = (index: number) => (salariéeGED: SalariéeGED) => {
		set.salariéesGED(A.replace(salariéesGED, index, salariéeGED))
	}

	const onDelete = (index: number) => () => {
		set.salariéesGED(A.remove(salariéesGED, index))
	}

	return (
		<>
			<H2>{t('pages.assistants.cmg.GED.h2', 'Garde d’Enfant à Domicile')}</H2>

			{salariéesGED.map((salariéeGED, index) => (
				<GEDInput
					key={index}
					idSuffix={`${index}`}
					salariée={salariéeGED}
					onChange={onChange(index)}
					onDelete={onDelete(index)}
				/>
			))}

			<Button size="XXS" light onPress={set.nouvelleGED}>
				{t('pages.assistants.cmg.GED.add-button-label', 'Ajouter une salariée')}
			</Button>
		</>
	)
}
