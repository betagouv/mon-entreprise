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
		<Container>
			<StyledBody id="effectif-switch-label">
				<Strong>{t("Effectif de l'entreprise")} :</Strong>
			</StyledBody>
			<StyledToggleGroup
				value={currentEffectif}
				onChange={(value) => {
					setCurrentEffectif(value)
					dispatch(enregistreLaRéponse(dottedName, `'${value}'`))
				}}
				aria-labelledby="effectif-switch-label"
			>
				<StyledRadio value="10">{t('Moins de 50 salariés')}</StyledRadio>
				<StyledRadio value="100">{t('Plus de 50 salariés')}</StyledRadio>
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
		/* flex-direction: column; */
	}
`
const StyledRadio = styled(Radio)`
	white-space: nowrap;
	> span {
		width: 100%;
	}
`
