import { DottedName } from 'modele-social'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { styled } from 'styled-components'

import { useEngine } from '@/components/utils/EngineContext'
import { Radio, ToggleGroup } from '@/design-system'
import { FlexCenter } from '@/design-system/global-style'
import { Body } from '@/design-system/typography/paragraphs'
import { enregistreLaRéponse } from '@/store/actions/actions'

export default function CongésPayésSwitch() {
	const dispatch = useDispatch()
	const engine = useEngine()
	const dottedName =
		'salarié . cotisations . exonérations . réduction générale . caisse de congés payés' as DottedName
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
		<Container>
			<StyledBody id="caisse-congés-payés-label">
				{engine.getRule(dottedName).title}
			</StyledBody>
			<ToggleGroup
				value={currentCongésPayés}
				onChange={(value) => {
					setCurrentCongésPayés(value)
					dispatch(enregistreLaRéponse(dottedName, value))
				}}
				aria-labelledby="caisse-congés-payés-label"
			>
				<Radio value="oui">{t('Oui')}</Radio>
				<Radio value="non">{t('Non')}</Radio>
			</ToggleGroup>
		</Container>
	)
}

const Container = styled.div`
	${FlexCenter}
	flex-wrap: wrap;
	justify-content: center;
	column-gap: ${({ theme }) => theme.spacings.sm};
`
const StyledBody = styled(Body)`
	margin: ${({ theme }) => theme.spacings.xxs} 0;
`
