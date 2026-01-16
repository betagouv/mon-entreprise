import { useTranslation } from 'react-i18next'

import { Chip, Emoji } from '@/design-system'

export default function BêtaChip() {
	const { t } = useTranslation()

	return (
		<Chip type="info" icon={<Emoji emoji="🚧" />}>
			{t('Version bêta')}
		</Chip>
	)
}
