import { DottedName } from 'modele-social'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import { useEngine } from '@/components/utils/EngineContext'
import {
	SwitchContainer,
	SwitchLabel,
	SwitchRadio,
	SwitchToggleGroup,
} from '@/design-system/réductionDeCotisations'
import { Strong } from '@/design-system/typography'
import { enregistreLaRéponse } from '@/store/actions/actions'

export default function EffectifSwitch() {
	const dispatch = useDispatch()
	const engine = useEngine()
	const dottedName = 'entreprise . salariés . effectif' as DottedName
	const engineEffectif = engine.evaluate(dottedName).nodeValue as string
	const [currentEffectif, setCurrentEffectif] = useState(engineEffectif)
	const { t } = useTranslation()

	useEffect(() => {
		const effectif = parseInt(engineEffectif) > 49 ? '100' : '10'
		setCurrentEffectif(effectif)
	}, [currentEffectif, engineEffectif])

	return (
		<SwitchContainer>
			<SwitchLabel id="effectif-switch-label">
				<Strong>{t('Effectif de l’entreprise')} :</Strong>
			</SwitchLabel>
			<SwitchToggleGroup
				value={currentEffectif}
				onChange={(value) => {
					setCurrentEffectif(value)
					dispatch(enregistreLaRéponse(dottedName, `'${value}'`))
				}}
				aria-labelledby="effectif-switch-label"
			>
				<SwitchRadio value="10">{t('Moins de 50 salariés')}</SwitchRadio>
				<SwitchRadio value="100">{t('Plus de 50 salariés')}</SwitchRadio>
			</SwitchToggleGroup>
		</SwitchContainer>
	)
}
