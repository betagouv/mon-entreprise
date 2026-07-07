import * as A from 'effect/Array'
import { useTranslation } from 'react-i18next'

import { SalariéeGED, useCMG } from '@/contextes/cmg/index'
import { Button } from '@/design-system/index'

import { Titre2 } from '../styled-components'
import GEDInput from './GEDInput'

export default function GED() {
	const { t } = useTranslation()
	const { salarieesGED, moisIdentiques, set } = useCMG()

	const onSalariéeChange = (index: number) => (salarieeGED: SalariéeGED) => {
		set.salarieesGED(A.replace(salarieesGED, index, salarieeGED))
	}

	const onSalariéeDelete = (index: number) => () => {
		set.salarieesGED(A.remove(salarieesGED, index))
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
			const declarationMars = salarieesGED[index].mars
			set.salarieesGED(
				A.replace(salarieesGED, index, {
					mars: declarationMars,
					avril: declarationMars,
					mai: declarationMars,
				})
			)
		}
	}

	return (
		<>
			<Titre2>
				{t(
					'pages.assistants.cmg.declarations.GED.h2',
					'Gardes d’enfants à domicile'
				)}
			</Titre2>

			{salarieesGED.map((salarieeGED, index) => (
				<GEDInput
					key={index}
					number={index + 1}
					idSuffix={`GED-${index}`}
					salariee={salarieeGED}
					moisIdentiques={moisIdentiques.GED[index]}
					onSalariéeChange={onSalariéeChange(index)}
					onSalariéeDelete={onSalariéeDelete(index)}
					onMoisIdentiquesChange={onMoisIdentiquesChange(index)}
				/>
			))}

			<Button size="XXS" color="secondary" light onPress={set.nouvelleGED}>
				{t(
					'pages.assistants.cmg.declarations.add-button-label',
					'Déclarer une salariee'
				)}
			</Button>
		</>
	)
}
