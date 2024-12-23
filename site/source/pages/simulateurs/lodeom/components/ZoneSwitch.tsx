import { useTranslation } from 'react-i18next'

import { Radio, ToggleGroup } from '@/design-system'
import { useBarèmeLodeom } from '@/hooks/useBarèmeLodeom'
import { useZoneLodeom } from '@/hooks/useZoneLodeom'

export default function ZoneSwitch() {
	const { currentZone, updateZone } = useZoneLodeom()
	const { updateBarème } = useBarèmeLodeom()
	const { t } = useTranslation()

	return (
		<ToggleGroup
			value={currentZone}
			onChange={(value) => {
				updateBarème()
				updateZone(value)
			}}
			aria-label={t("Zone de l'entreprise")}
		>
			<Radio value="zone un">
				{t('Guadeloupe, Guyane, Martinique, La Réunion')}
			</Radio>
			<Radio value="zone deux">{t('Saint-Barthélémy, Saint-Martin')}</Radio>
		</ToggleGroup>
	)
}
