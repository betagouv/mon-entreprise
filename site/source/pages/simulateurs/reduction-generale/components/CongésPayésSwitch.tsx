import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import {
	SwitchContainer,
	SwitchLabel,
	SwitchRadio,
	SwitchToggleGroup,
} from '@/components/RéductionDeCotisations/réductionDeCotisations'
import { useEngine } from '@/components/utils/EngineContext'
import { DottedName } from '@/domaine/publicodes/DottedName'
import { enregistreLaRéponse } from '@/store/actions/actions'
import { réductionGénéraleDottedName } from '@/utils/réductionDeCotisations'

export default function CongésPayésSwitch() {
	const dispatch = useDispatch()
	const engine = useEngine()
	const dottedName =
		`${réductionGénéraleDottedName} . caisse de congés payés` as DottedName
	const engineCongésPayés = engine.evaluate(dottedName).nodeValue as boolean
	const [currentCongésPayés, setCurrentCongésPayés] = useState(
		engineCongésPayés ? 'oui' : 'non'
	)
	const { t } = useTranslation()

	useEffect(() => {
		const congésPayés = engineCongésPayés ? 'oui' : 'non'
		setCurrentCongésPayés(congésPayés)
	}, [currentCongésPayés, engineCongésPayés])

	return (
		<SwitchContainer>
			<SwitchLabel id="caisse-congés-payés-label">
				{engine.getRule(dottedName).rawNode.question}
			</SwitchLabel>
			<SwitchToggleGroup
				value={currentCongésPayés}
				onChange={(value) => {
					setCurrentCongésPayés(value)
					dispatch(enregistreLaRéponse(dottedName, value))
				}}
				aria-labelledby="caisse-congés-payés-label"
			>
				<SwitchRadio value="oui">{t('Oui')}</SwitchRadio>
				<SwitchRadio value="non">{t('Non')}</SwitchRadio>
			</SwitchToggleGroup>
		</SwitchContainer>
	)
}
