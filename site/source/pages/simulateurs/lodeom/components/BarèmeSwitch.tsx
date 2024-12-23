import { DottedName } from 'modele-social'
import { useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import { ExplicableRule } from '@/components/conversation/Explicable'
import { useEngine } from '@/components/utils/EngineContext'
import { Radio, ToggleGroup } from '@/design-system'
import { Strong } from '@/design-system/typography'
import { Body } from '@/design-system/typography/paragraphs'
import { useBarèmeLodeom } from '@/hooks/useBarèmeLodeom'
import { useZoneLodeom } from '@/hooks/useZoneLodeom'

export default function BarèmeSwitch() {
	const { t } = useTranslation()
	const engine = useEngine()
	const { currentZone } = useZoneLodeom()
	const { barèmes, currentBarème, updateBarème } = useBarèmeLodeom()

	return (
		<Container>
			<StyledBody id="barème-switch-label">
				<Strong>
					{t(
						'pages.simulateurs.lodeom.bareme-switch-label',
						'Barème à appliquer :'
					)}
				</Strong>
			</StyledBody>
			<StyledToggleGroup
				value={currentBarème}
				onChange={updateBarème}
				aria-labelledby="barème-switch-label"
			>
				{barèmes.map((barème, index) => {
					const dottedName =
						`salarié . cotisations . exonérations . lodeom . ${currentZone} . ${barème}` as DottedName
					const rule = engine.getRule(dottedName)

					return (
						<StyledRadio key={index} value={barème}>
							{rule.title}
							<ExplicableRule
								light
								dottedName={dottedName}
								aria-label={t("Plus d'informations sur {{ title }}", {
									title: barème,
								})}
							/>
						</StyledRadio>
					)
				})}
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
		flex-direction: column;
	}
`
const StyledRadio = styled(Radio)`
	white-space: nowrap;
	> span {
		width: 100%;
	}
`
