import * as A from 'effect/Array'
import { useTranslation } from 'react-i18next'

import { SalariéeGED, useCMG } from '@/contextes/cmg'
import { Button, H2 } from '@/design-system'

import GEDInput from './GEDInput'

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
			<H2>
				{t(
					'pages.assistants.cmg.déclarations.GED.h2',
					'Gardes d’enfants à domicile'
				)}
			</H2>

			{salariéesGED.map((salariéeGED, index) => (
				<GEDInput
					key={index}
					number={index + 1}
					idSuffix={`${index}`}
					salariée={salariéeGED}
					onChange={onChange(index)}
					onDelete={onDelete(index)}
				/>
			))}

			<Button size="XXS" color="secondary" light onPress={set.nouvelleGED}>
				{t(
					'pages.assistants.cmg.déclarations.add-button-label',
					'Ajouter une salariée'
				)}
			</Button>
		</>
	)
}
