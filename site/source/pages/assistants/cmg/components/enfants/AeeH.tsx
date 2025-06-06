import * as O from 'effect/Option'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import { useCMG } from '@/contextes/cmg'
import { NumberField, Radio, Spacing, ToggleGroup } from '@/design-system'

import { Label, Question } from '../styled-components'

export default function AeeH() {
	const { perçoitAeeH, AeeH, set } = useCMG()
	const { t } = useTranslation()

	const valeur = useMemo(() => {
		if (O.isNone(perçoitAeeH)) {
			return undefined
		} else if (perçoitAeeH.value) {
			return 'oui'
		} else {
			return 'non'
		}
	}, [perçoitAeeH])

	const onChange = (valeur: string) => {
		if (valeur === 'oui') {
			set.perçoitAeeH(O.some(true))
		} else if (valeur === 'non') {
			set.perçoitAeeH(O.some(false))
			set.AeeH(O.none())
		} else {
			set.perçoitAeeH(O.none())
			set.AeeH(O.none())
		}
	}

	return (
		<>
			<Question id="perçoit-AeeH-label">
				{t(
					'pages.assistants.cmg.enfants.perçoit-AeeH.label',
					'Percevez-vous l’AeeH (allocation d’éducation de l’enfant handicapé) ?'
				)}
			</Question>

			<Spacing xxs />

			<ToggleGroup
				aria-labelledby="perçoit-AeeH-label"
				onChange={onChange}
				value={valeur}
			>
				<StyledRadio value="oui" id="input-perçoit-AeeH-oui">
					{t('Oui')}
				</StyledRadio>
				<StyledRadio value="non" id="input-perçoit-AeeH-non">
					{t('Non')}
				</StyledRadio>
			</ToggleGroup>

			{O.isSome(perçoitAeeH) && perçoitAeeH.value && (
				<>
					<Spacing md />
					<Label id="AeeH-label">
						{t(
							'pages.assistants.cmg.questions.AeeH.label',
							'Nombre d’enfants concernés'
						)}
					</Label>
					<NumberField
						value={O.getOrUndefined(AeeH)}
						onChange={(valeur) => set.AeeH(O.fromNullable(valeur))}
						aria-labelledby="AeeH-label"
					/>
				</>
			)}
		</>
	)
}

const StyledRadio = styled(Radio)`
	& > span {
		border: none !important;
		border-radius: 0 !important;
	}
`
