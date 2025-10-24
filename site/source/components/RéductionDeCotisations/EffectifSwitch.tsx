import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import { DottedName } from '@/domaine/publicodes/DottedName'
import { useEngine } from '@/hooks/useEngine'
import { enregistreLaRéponseÀLaQuestion } from '@/store/actions/actions'

import {
	SwitchContainer,
	SwitchLabel,
	SwitchRadio,
	SwitchToggleGroup,
} from './réductionDeCotisations'

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
				{t('Quel est l’effectif de votre entreprise ?')}
			</SwitchLabel>
			<SwitchToggleGroup
				value={currentEffectif}
				onChange={(value) => {
					setCurrentEffectif(value)
					dispatch(enregistreLaRéponseÀLaQuestion(dottedName, value))
				}}
				aria-labelledby="effectif-switch-label"
			>
				<SwitchRadio value="10">{t('Moins de 50 salariés')}</SwitchRadio>
				<SwitchRadio value="100">{t('Plus de 50 salariés')}</SwitchRadio>
			</SwitchToggleGroup>
		</SwitchContainer>
	)
}
