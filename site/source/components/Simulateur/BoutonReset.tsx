import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import { ArrowCircleIcon, BorderlessButton } from '@/design-system'
import { réinitialiseLaSimulation } from '@/store/actions/actions'

export const BoutonReset = () => {
	const { t } = useTranslation()
	const dispatch = useDispatch()

	return (
		<BorderlessButton
			onPress={() => {
				dispatch(réinitialiseLaSimulation())
			}}
		>
			<ArrowCircleIcon />
			{t('components.simulateur.réinitialiser', 'Valeurs par défaut')}
		</BorderlessButton>
	)
}
