import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import {
	useEconomieCollaborative,
	type TypeHébergement,
} from '@/contextes/économie-collaborative'
import { Radio, ToggleGroup } from '@/design-system'

export const TypeHébergementSwitch = () => {
	const { t } = useTranslation()
	const { situation, set } = useEconomieCollaborative()

	const handleChange = useCallback(
		(value: string) => {
			set.typeHébergement(value as TypeHébergement)
		},
		[set]
	)

	return (
		<ToggleGroup
			value={situation.typeHébergement}
			onChange={handleChange}
			aria-label={t(
				'pages.simulateurs.location-de-logement-meublé.type-hébergement.aria-label',
				"Type d'hébergement"
			)}
			hideRadio
		>
			<Radio value="meublé-tourisme">
				{t(
					'pages.simulateurs.location-de-logement-meublé.type-hébergement.meublé-tourisme',
					'Meublé de tourisme'
				)}
			</Radio>
			<Radio value="chambre-hôte">
				{t(
					'pages.simulateurs.location-de-logement-meublé.type-hébergement.chambre-hôte',
					"Chambre d'hôtes"
				)}
			</Radio>
		</ToggleGroup>
	)
}
