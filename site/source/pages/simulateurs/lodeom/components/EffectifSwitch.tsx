import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import { SwitchContainer, SwitchLabel } from '@/components/Switch'
import { ChoixUnique } from '@/design-system'
import { DottedName } from '@/domaine/publicodes/DottedName'
import { enregistreLaRéponseÀLaQuestion } from '@/store/actions/actions'
import { useEngine } from '@/utils/publicodes/EngineContext'

export const effectifDottedName =
	'entreprise . salariés . effectif' as DottedName

export default function EffectifSwitch() {
	const dispatch = useDispatch()
	const engine = useEngine()
	const engineEffectif = engine.evaluate(effectifDottedName).nodeValue as string
	const [currentEffectif, setCurrentEffectif] = useState(engineEffectif)
	const { t } = useTranslation()

	const options = [
		{
			value: '10',
			label: t(
				'pages.simulateurs.lodeom.effectif.moins-de-50',
				'Moins de 50 salariés'
			),
		},
		{
			value: '100',
			label: t(
				'pages.simulateurs.lodeom.effectif.plus-de-50',
				'Plus de 50 salariés'
			),
		},
	]

	useEffect(() => {
		const effectif = parseInt(engineEffectif) > 49 ? '100' : '10'
		setCurrentEffectif(effectif)
	}, [currentEffectif, engineEffectif])

	return (
		<SwitchContainer>
			<SwitchLabel id="effectif-switch-label" as="label">
				{t('Quel est l’effectif de votre entreprise ?')}
			</SwitchLabel>

			<ChoixUnique
				variant="toggle"
				options={options}
				value={currentEffectif}
				onChange={(value) => {
					setCurrentEffectif(value)
					dispatch(enregistreLaRéponseÀLaQuestion(effectifDottedName, value))
				}}
				aria={{ labelledby: 'effectif-switch-label' }}
			/>
		</SwitchContainer>
	)
}
