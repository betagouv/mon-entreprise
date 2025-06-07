import * as O from 'effect/Option'
import { useMemo } from 'react'
import { styled } from 'styled-components'

import { DéclarationDeGardeGED } from '@/contextes/cmg'
import { Montant } from '@/domaine/Montant'
import { ChangeHandler } from '@/utils/ChangeHandler'

import CMGPerçuInput from '../déclaration/CMGPerçuInput'
import HeuresDeGardeInput from '../déclaration/HeuresDeGardeInput'
import RémunérationInput from '../déclaration/RémunérationInput'
import { Question } from '../styled-components'

type Props = {
	idSuffix: string
	month: string
	déclaration: O.Option<DéclarationDeGardeGED>
	onChange: ChangeHandler<O.Option<DéclarationDeGardeGED>>
}

export default function DéclarationGEDInput({
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
						type: 'GED',
						heuresDeGarde: O.none(),
						rémunération: O.none(),
						CMGPerçu: O.none(),
					}) satisfies DéclarationDeGardeGED
			),
		[déclaration]
	)

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
		<Container>
			<StyledQuestion>{month}</StyledQuestion>
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
		</Container>
	)
}

const Container = styled.div`
	display: flex;
	flex-direction: column;
	gap: ${({ theme }) => theme.spacings.sm};
`
const StyledQuestion = styled(Question)`
	margin-top: 0;
	align-self: center;
	text-transform: capitalize;
`
