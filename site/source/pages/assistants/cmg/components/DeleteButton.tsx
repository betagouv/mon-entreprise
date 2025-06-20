import { useTranslation } from 'react-i18next'

import { Button } from '@/design-system'

type Props = {
	onDelete: () => void
}

export default function DeleteButton({ onDelete }: Props) {
	const { t } = useTranslation()

	return (
		<Button size="XXS" light onPress={onDelete}>
			{t('Supprimer')}
		</Button>
	)
}
