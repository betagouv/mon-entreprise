import * as O from 'effect/Option'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import { useCMG } from '@/contextes/cmg'
import { Radio, Spacing, ToggleGroup } from '@/design-system'

import { Question } from '../styled-components'

export default function SituationFamiliale() {
	const { situation, set } = useCMG()
	const { t } = useTranslation()

	const valeur = useMemo(() => {
		if (O.isNone(situation.parentIsolé)) {
			return undefined
		} else if (situation.parentIsolé.value) {
			return 'parent-isolé'
		} else {
			return 'couple'
		}
	}, [situation.parentIsolé])

	const onChange = (valeur: string) => {
		if (valeur === 'parent-isolé') {
			set.parentIsolé(O.some(true))
		} else if (valeur === 'couple') {
			set.parentIsolé(O.some(false))
		} else {
			set.parentIsolé(O.none())
		}
	}

	return (
		<>
			<Question id="situation-familiale-label">
				{t(
					'pages.assistants.cmg.informations-générales.situation-familiale.label',
					'Quelle est votre situation familiale ?'
				)}
			</Question>

			<Spacing xxs />

			<ToggleGroup
				aria-labelledby="situation-familiale-label"
				onChange={onChange}
				value={valeur}
			>
				<StyledRadio value="parent-isolé" id="input-parent-isolé">
					{t(
						'pages.assistants.cmg.informations-générales.situation-familiale.parent-isolé.label',
						'Seul / seule'
					)}
				</StyledRadio>
				<StyledRadio value="couple" id="input-couple">
					{t(
						'pages.assistants.cmg.informations-générales.situation-familiale.couple.label',
						'En couple'
					)}
				</StyledRadio>
			</ToggleGroup>
		</>
	)
}

const StyledRadio = styled(Radio)`
	& > span {
		border: none !important;
		border-radius: 0 !important;
	}
`
