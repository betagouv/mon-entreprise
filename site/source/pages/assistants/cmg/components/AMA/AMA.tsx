import * as A from 'effect/Array'
import { useTranslation } from 'react-i18next'

import { SalariéeAMA, useCMG } from '@/contextes/cmg'
import { Button } from '@/design-system'

import { Titre2 } from '../styled-components'
import AMAInput from './AMAInput'

export default function AMA() {
	const { t } = useTranslation()
	const { salariéesAMA, moisIdentiques, set } = useCMG()

	const onSalariéeChange =
		(index: number) => (salariéeAMA: SalariéeAMA<string>) => {
			set.salariéesAMA(A.replace(salariéesAMA, index, salariéeAMA))
		}

	const onSalariéeDelete = (index: number) => () => {
		set.salariéesAMA(A.remove(salariéesAMA, index))
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
			const déclarationMars = salariéesAMA[index].mars
			set.salariéesAMA(
				A.replace(salariéesAMA, index, {
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
					'pages.assistants.cmg.déclarations.AMA.h2',
					'Assistantes maternelles agréées'
				)}
			</Titre2>

			{salariéesAMA.map((salariéeAMA, index) => (
				<AMAInput
					key={index}
					number={index + 1}
					idSuffix={`${index}`}
					salariée={salariéeAMA}
					moisIdentiques={moisIdentiques.AMA[index]}
					onSalariéeChange={onSalariéeChange(index)}
					onSalariéeDelete={onSalariéeDelete(index)}
					onMoisIdentiquesChange={onMoisIdentiquesChange(index)}
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
