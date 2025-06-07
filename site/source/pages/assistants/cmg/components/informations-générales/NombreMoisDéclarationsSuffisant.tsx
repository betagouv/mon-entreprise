import * as O from 'effect/Option'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import { useCMG } from '@/contextes/cmg'
import { Radio, Spacing, ToggleGroup } from '@/design-system'

import { Question } from '../styled-components'

export default function NombreMoisDéclarationsSuffisant() {
	const { situation, set } = useCMG()
	const { t } = useTranslation()

	const valeur = useMemo(() => {
		if (O.isNone(situation.plusDe2MoisDeDéclaration)) {
			return undefined
		} else if (situation.plusDe2MoisDeDéclaration.value) {
			return 'oui'
		} else {
			return 'non'
		}
	}, [situation.plusDe2MoisDeDéclaration])

	const onChange = (valeur: string) => {
		if (valeur === 'oui') {
			set.plusDe2MoisDeDéclaration(O.some(true))
		} else if (valeur === 'non') {
			set.plusDe2MoisDeDéclaration(O.some(false))
		} else {
			set.plusDe2MoisDeDéclaration(O.none())
		}
	}

	return (
		<>
			<Question id="mois-déclarations-label">
				{t(
					'pages.assistants.cmg.informations-générales.mois-déclarations.label',
					'Avez-vous déclaré au moins 2 mois entre mars et mai 2025 ?'
				)}
			</Question>

			<Spacing xxs />

			<ToggleGroup
				aria-labelledby="mois-déclarations-label"
				onChange={onChange}
				value={valeur}
			>
				<StyledRadio value="oui" id="input-mois-déclarations-oui">
					{t('Oui')}
				</StyledRadio>
				<StyledRadio value="non" id="input-mois-déclarations-non">
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
