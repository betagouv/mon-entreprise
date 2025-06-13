import { pipe } from 'effect'
import * as A from 'effect/Array'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import { EnfantValide, estEnfantGardable, useCMG } from '@/contextes/cmg'
import { Checkbox } from '@/design-system'
import { ChangeHandler } from '@/utils/ChangeHandler'

import { Label } from '../styled-components'

type Props = {
	enfantsGardés: Array<string>
	onChange: ChangeHandler<Array<string>>
}

export default function EnfantsGardésInput({ enfantsGardés, onChange }: Props) {
	const { t } = useTranslation()
	const { enfants } = useCMG()

	const enfantsGardables = useMemo(
		() => pipe(enfants, A.filter(estEnfantGardable)),
		[enfants]
	)

	const isEnfantGardé = (enfant: EnfantValide) =>
		pipe(enfantsGardés, A.contains(enfant.prénom.value))

	const onCheckboxChange = (prénom: string) => (isSelected: boolean) => {
		if (isSelected) {
			onChange([...enfantsGardés, prénom])
		} else {
			onChange(A.remove(enfantsGardés, enfantsGardés.indexOf(prénom)))
		}
	}

	return (
		<fieldset>
			<legend>
				<Label>
					{t(
						'pages.assistants.cmg.déclarations.enfants-gardés.legend',
						'Enfant(s) gardé(s)'
					)}
				</Label>
			</legend>
			<CheckboxContainer>
				{enfantsGardables.map((enfant, index) => (
					<Checkbox
						key={index}
						id={`checkbox-enfant-${index}`}
						label={enfant.prénom.value}
						isSelected={isEnfantGardé(enfant)}
						onChange={onCheckboxChange(enfant.prénom.value)}
					/>
				))}
			</CheckboxContainer>
		</fieldset>
	)
}

const CheckboxContainer = styled.div`
	display: flex;
	flex-direction: column;
`
