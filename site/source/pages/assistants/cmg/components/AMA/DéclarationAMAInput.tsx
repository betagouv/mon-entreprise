import * as O from 'effect/Option'
import { useMemo } from 'react'
import { styled } from 'styled-components'

import { DéclarationDeGardeAMA } from '@/contextes/cmg'
import { Montant } from '@/domaine/Montant'
import { ChangeHandler } from '@/utils/ChangeHandler'

import CMGPerçuInput from '../déclaration/CMGPerçuInput'
import HeuresDeGardeInput from '../déclaration/HeuresDeGardeInput'
import RémunérationInput from '../déclaration/RémunérationInput'
import { Question } from '../styled-components'
import EnfantsGardésInput from './EnfantsGardésInput'

type Props = {
	idSuffix: string
	month: string
	déclaration: O.Option<DéclarationDeGardeAMA<string>>
	onChange: ChangeHandler<O.Option<DéclarationDeGardeAMA<string>>>
}

export default function DéclarationAMAInput({
	idSuffix,
	month,
	déclaration,
	onChange,
}: Props) {
	const currentDéclaration = useMemo(
		() =>
			O.getOrElse(
				déclaration,
				() =>
					({
						type: 'AMA',
						enfantsGardés: [],
						heuresDeGarde: O.none(),
						rémunération: O.none(),
						CMGPerçu: O.none(),
					}) satisfies DéclarationDeGardeAMA<string>
			),
		[déclaration]
	)

	const onEnfantsGardésChange = (enfantsGardés: Array<string>) => {
		onChange(
			O.some({
				...currentDéclaration,
				enfantsGardés,
			})
		)
	}

	const onHeuresDeGardeChange = (heuresDeGarde: O.Option<number>) => {
		onChange(
			O.some({
				...currentDéclaration,
				heuresDeGarde,
			})
		)
	}

	const onRémunérationChange = (rémunération: O.Option<Montant<'Euro'>>) => {
		onChange(
			O.some({
				...currentDéclaration,
				rémunération,
			})
		)
	}

	const onCMGPerçuChange = (CMGPerçu: O.Option<Montant<'Euro'>>) => {
		onChange(
			O.some({
				...currentDéclaration,
				CMGPerçu,
			})
		)
	}

	return (
		<>
			<StyledQuestion>{month} 2025</StyledQuestion>
			<EnfantsGardésInput
				enfantsGardés={currentDéclaration.enfantsGardés}
				onChange={onEnfantsGardésChange}
			/>
			<HeuresDeGardeInput
				idSuffix={idSuffix}
				valeur={currentDéclaration.heuresDeGarde}
				onChange={onHeuresDeGardeChange}
			/>
			<RémunérationInput
				idSuffix={idSuffix}
				valeur={currentDéclaration.rémunération}
				onChange={onRémunérationChange}
			/>
			<CMGPerçuInput
				idSuffix={idSuffix}
				valeur={currentDéclaration.CMGPerçu}
				onChange={onCMGPerçuChange}
			/>
		</>
	)
}

const StyledQuestion = styled(Question)`
	margin-top: 0;
	text-transform: capitalize;
`
