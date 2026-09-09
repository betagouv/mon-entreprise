import * as O from 'effect/Option'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import { useCMG } from '@/contextes/cmg'
import { Radio, Spacing, ToggleGroup } from '@/design-system'

import { Question } from '../styled-components'

export default function QuestionCMGPerçu() {
	const { situation, set } = useCMG()
	const { t } = useTranslation()

	const valeur = useMemo(() => {
		if (O.isNone(situation.aPerçuCMG)) {
			return ''
		} else if (situation.aPerçuCMG.value) {
			return 'oui'
		} else {
			return 'non'
		}
	}, [situation.aPerçuCMG])

	const onChange = (valeur: string) => {
		if (valeur === 'oui') {
			set.aPerçuCMG(O.some(true))
		} else if (valeur === 'non') {
			set.aPerçuCMG(O.some(false))
		} else {
			set.aPerçuCMG(O.none())
		}
	}

	return (
		<>
			<Question id="CMG-perçu-label">
				{t(
					'pages.assistants.cmg.informations-générales.CMG-perçu.label',
					'Avez-vous perçu un CMG au titre des déclarations réalisées entre mars et mai 2025 ?'
				)}
			</Question>

			<Spacing xxs />

			<ToggleGroup
				aria-labelledby="CMG-perçu-label"
				onChange={onChange}
				value={valeur}
			>
				<StyledRadio value="oui" id="input-CMG-perçu-oui">
					{t('Oui')}
				</StyledRadio>
				<StyledRadio value="non" id="input-CMG-perçu-non">
					{t('Non')}
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
