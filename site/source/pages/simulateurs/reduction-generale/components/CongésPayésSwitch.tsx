import { DottedName } from 'modele-social'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { styled } from 'styled-components'

import { useEngine } from '@/components/utils/EngineContext'
import { Radio, ToggleGroup } from '@/design-system'
import { Strong } from '@/design-system/typography'
import { Body } from '@/design-system/typography/paragraphs'
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
		<Container>
			<StyledBody id="caisse-congés-payés-label">
				<Strong>{engine.getRule(dottedName).title} :</Strong>
			</StyledBody>
			<StyledToggleGroup
				value={currentCongésPayés}
				onChange={(value) => {
					setCurrentCongésPayés(value)
					dispatch(enregistreLaRéponse(dottedName, value))
				}}
				aria-labelledby="caisse-congés-payés-label"
			>
				<StyledRadio value="oui">{t('Oui')}</StyledRadio>
				<StyledRadio value="non">{t('Non')}</StyledRadio>
			</StyledToggleGroup>
		</Container>
	)
}

const Container = styled.div`
	text-align: left;
	display: flex;
	flex-direction: column;
	flex-wrap: wrap;
	column-gap: ${({ theme }) => theme.spacings.sm};
	width: 100%;
`
const StyledBody = styled(Body)`
	margin: ${({ theme }) => theme.spacings.xxs} 0;
`
const StyledToggleGroup = styled(ToggleGroup)`
	display: flex;
	> * {
		display: flex;
	}
`
const StyledRadio = styled(Radio)`
	white-space: nowrap;
	> span {
		width: 100%;
	}
`
