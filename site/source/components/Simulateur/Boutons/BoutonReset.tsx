import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import { ArrowCircleIcon, Button } from '@/design-system'
import { réinitialiseLaSimulation } from '@/store/actions/actions'

export const BoutonReset = () => {
	const { t } = useTranslation()
	const dispatch = useDispatch()

	return (
		<Button
			size="XXS"
			light
			onPress={() => {
				dispatch(réinitialiseLaSimulation())
			}}
		>
			<ArrowCircleIcon />
			{t(
				'components.simulateur.zone-de-saisie.situation.réinitialiser',
				'Valeurs par défaut'
			)}
		</Button>
	)
}
