import * as O from 'effect/Option'
import { useMemo } from 'react'
import { styled } from 'styled-components'

import { DéclarationDeGardeGED } from '@/contextes/cmg'
import { Montant } from '@/domaine/Montant'
import { ChangeHandler } from '@/utils/ChangeHandler'

import AideSaisieCMG from '../déclaration/AideSaisieCMG'
import AideSaisieHeuresDeGarde from '../déclaration/AideSaisieHeuresDeGarde'
import AideSaisieRémunération from '../déclaration/AideSaisieRémunération'
import CMGPerçuInput from '../déclaration/CMGPerçuInput'
import HeuresDeGardeInput from '../déclaration/HeuresDeGardeInput'
import RémunérationInput from '../déclaration/RémunérationInput'
import { Question } from '../styled-components'

type Props = {
	idSuffix: string
	month: string
	déclaration: O.Option<DéclarationDeGardeGED>
	onChange: ChangeHandler<O.Option<DéclarationDeGardeGED>>
	avecAideSaisie?: boolean
}

export default function DéclarationGEDInput({
	idSuffix,
	month,
	déclaration,
	onChange,
	avecAideSaisie,
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
		<>
			<StyledQuestion>{month} 2025</StyledQuestion>
			{avecAideSaisie && (
				<DesktopHiddenContainer>
					<AideSaisieHeuresDeGarde />
				</DesktopHiddenContainer>
			)}
			<HeuresDeGardeInput
				idSuffix={idSuffix}
				valeur={currentDéclaration.heuresDeGarde}
				onChange={onHeuresDeGardeChange}
			/>
			{avecAideSaisie && (
				<DesktopHiddenContainer>
					<AideSaisieRémunération />
				</DesktopHiddenContainer>
			)}
			<RémunérationInput
				idSuffix={idSuffix}
				valeur={currentDéclaration.rémunération}
				onChange={onRémunérationChange}
			/>
			{avecAideSaisie && (
				<DesktopHiddenContainer>
					<AideSaisieCMG />
				</DesktopHiddenContainer>
			)}
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
const DesktopHiddenContainer = styled.div`
	@media (min-width: ${({ theme }) => theme.breakpointsWidth.sm}) {
		display: none;
	}
`
