import { useEffect, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import { Radio, ToggleGroup } from '@/design-system'
import { DottedName } from '@/domaine/publicodes/DottedName'
import { enregistreLaRéponseÀLaQuestion } from '@/store/actions/actions'
import { useEngine } from '@/utils/publicodes/EngineContext'

export const OptionBarèmeSwitch = () => {
	const dispatch = useDispatch()
	const { t } = useTranslation()
	const engine = useEngine()
	const dottedName = 'impôt . méthode de calcul' as DottedName
	const engineOptionPFU = engine.evaluate(dottedName).nodeValue as string

	const [currentOptionPFU, setCurrentOptionPFU] = useState(engineOptionPFU)

	useEffect(() => {
		if (currentOptionPFU !== engineOptionPFU) {
			setCurrentOptionPFU(engineOptionPFU)
		}
	}, [currentOptionPFU, engineOptionPFU])

	return (
		<ToggleGroup
			value={currentOptionPFU}
			onChange={(value) => {
				setCurrentOptionPFU(value)
				dispatch(enregistreLaRéponseÀLaQuestion(dottedName, value))
			}}
			aria-label={t("Régime d'imposition")}
		>
			<Radio value="PFU">
				<Trans>
					PFU (<i>"flat tax"</i>)
				</Trans>
			</Radio>
			<Radio value="barème standard">
				<Trans>Impôt au barème</Trans>
			</Radio>
		</ToggleGroup>
	)
}
