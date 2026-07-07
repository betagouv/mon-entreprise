import * as A from 'effect/Array'
import { useTranslation } from 'react-i18next'

import { SalariéeAMA, useCMG } from '@/contextes/cmg/index'
import { Button } from '@/design-system/index'

import { Titre2 } from '../styled-components'
import AMAInput from './AMAInput'

export default function AMA() {
	const { t } = useTranslation()
	const { salarieesAMA, moisIdentiques, set } = useCMG()

	const onSalariéeChange =
		(index: number) => (salarieeAMA: SalariéeAMA<string>) => {
			set.salarieesAMA(A.replace(salarieesAMA, index, salarieeAMA))
		}

	const onSalariéeDelete = (index: number) => () => {
		set.salarieesAMA(A.remove(salarieesAMA, index))
		set.moisIdentiques({
			GED: moisIdentiques.GED,
			AMA: A.remove(moisIdentiques.AMA, index),
		})
	}

	const onMoisIdentiquesChange = (index: number) => (value: boolean) => {
		set.moisIdentiques({
			GED: moisIdentiques.GED,
			AMA: A.replace(moisIdentiques.AMA, index, value),
		})
		if (value) {
			const declarationMars = salarieesAMA[index].mars
			set.salarieesAMA(
				A.replace(salarieesAMA, index, {
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
					'pages.assistants.cmg.declarations.AMA.h2',
					'Assistantes maternelles agréées'
				)}
			</Titre2>

			{salarieesAMA.map((salarieeAMA, index) => (
				<AMAInput
					key={index}
					number={index + 1}
					idSuffix={`AMA-${index}`}
					salariee={salarieeAMA}
					moisIdentiques={moisIdentiques.AMA[index]}
					onSalariéeChange={onSalariéeChange(index)}
					onSalariéeDelete={onSalariéeDelete(index)}
					onMoisIdentiquesChange={onMoisIdentiquesChange(index)}
				/>
			))}

			<Button size="XXS" color="secondary" light onPress={set.nouvelleAMA}>
				{t(
					'pages.assistants.cmg.declarations.add-button-label',
					'Déclarer une salariee'
				)}
			</Button>
		</>
	)
}
