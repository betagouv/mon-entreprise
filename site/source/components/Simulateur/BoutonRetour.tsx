import { useTranslation } from 'react-i18next'

import { Button, ReturnLeftIcon } from '@/design-system'

type Props = {
	onPress: () => void
}

export const BoutonRetour = ({ onPress }: Props) => {
	const { t } = useTranslation()

	return (
		<Button light size="XXS" onPress={onPress}>
			<ReturnLeftIcon />
			{t('components.simulateur.zone-de-saisie.situation.retour', 'Retour')}
		</Button>
	)
}
