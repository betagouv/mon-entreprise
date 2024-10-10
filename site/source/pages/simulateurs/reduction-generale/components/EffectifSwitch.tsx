import { DottedName } from 'modele-social'
import { useCallback, useEffect, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import { useEngine } from '@/components/utils/EngineContext'
import { Radio, ToggleGroup } from '@/design-system'
import { enregistreLaRéponse } from '@/store/actions/actions'

export default function EffectifSwitch({
	onSwitch,
}: {
	onSwitch?: (value: string) => void
}) {
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

	const onChange = useCallback(
		(value: string) => {
			setCurrentEffectif(value)
			dispatch(enregistreLaRéponse(dottedName, `'${value}'`))
			onSwitch?.(value)
		},
		[dispatch, onSwitch]
	)

	return (
		<ToggleGroup
			value={currentEffectif}
			onChange={onChange}
			aria-label={t("Effectif de l'entreprise")}
		>
			<Radio value="10">
				<Trans>Moins de 50 salariés</Trans>
			</Radio>
			<Radio value="100">
				<Trans>Plus de 50 salariés</Trans>
			</Radio>
		</ToggleGroup>
	)
}
