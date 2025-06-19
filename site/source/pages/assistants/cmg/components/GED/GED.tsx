import * as A from 'effect/Array'
import { useTranslation } from 'react-i18next'

import { SalariéeGED, useCMG } from '@/contextes/cmg'
import { Button } from '@/design-system'

import { Titre2 } from '../styled-components'
import GEDInput from './GEDInput'

export default function GED() {
	const { t } = useTranslation()
	const { salariéesGED, moisIdentiques, set } = useCMG()

	const onSalariéeChange = (index: number) => (salariéeGED: SalariéeGED) => {
		set.salariéesGED(A.replace(salariéesGED, index, salariéeGED))
	}

	const onSalariéeDelete = (index: number) => () => {
		set.salariéesGED(A.remove(salariéesGED, index))
		set.moisIdentiques({
			AMA: moisIdentiques.AMA,
			GED: A.remove(moisIdentiques.GED, index),
		})
	}

	const onMoisIdentiquesChange = (index: number) => (value: boolean) => {
		set.moisIdentiques({
			AMA: moisIdentiques.AMA,
			GED: A.replace(moisIdentiques.GED, index, value),
		})
		if (value) {
			const déclarationMars = salariéesGED[index].mars
			set.salariéesGED(
				A.replace(salariéesGED, index, {
					mars: déclarationMars,
					avril: déclarationMars,
					mai: déclarationMars,
				})
			)
		}
	}

	return (
		<>
			<Titre2>
				{t(
					'pages.assistants.cmg.déclarations.GED.h2',
					'Gardes d’enfants à domicile'
				)}
			</Titre2>

			{salariéesGED.map((salariéeGED, index) => (
				<GEDInput
					key={index}
					number={index + 1}
					idSuffix={`${index}`}
					salariée={salariéeGED}
					moisIdentiques={moisIdentiques.GED[index]}
					onSalariéeChange={onSalariéeChange(index)}
					onSalariéeDelete={onSalariéeDelete(index)}
					onMoisIdentiquesChange={onMoisIdentiquesChange(index)}
				/>
			))}

			<Button size="XXS" color="secondary" light onPress={set.nouvelleGED}>
				{t(
					'pages.assistants.cmg.déclarations.add-button-label',
					'Déclarer une salariée'
				)}
			</Button>
		</>
	)
}
