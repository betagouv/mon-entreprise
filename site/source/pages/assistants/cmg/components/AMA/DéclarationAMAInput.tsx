import * as O from 'effect/Option'
import { useMemo } from 'react'
import { css, styled } from 'styled-components'

import { DéclarationDeGardeAMA } from '@/contextes/cmg'
import { Montant } from '@/domaine/Montant'
import { ChangeHandler } from '@/utils/ChangeHandler'

import AideSaisieCMG from '../déclaration/AideSaisieCMG'
import AideSaisieHeuresDeGarde from '../déclaration/AideSaisieHeuresDeGarde'
import AideSaisieRémunération from '../déclaration/AideSaisieRémunération'
import CMGPerçuInput from '../déclaration/CMGPerçuInput'
import HeuresDeGardeInput from '../déclaration/HeuresDeGardeInput'
import RémunérationInput from '../déclaration/RémunérationInput'
import { Question } from '../styled-components'
import AideSaisieEnfants from './AideSaisieEnfants'
import EnfantsGardésInput from './EnfantsGardésInput'

type Props = {
	idSuffix: string
	month: string
	déclaration: O.Option<DéclarationDeGardeAMA<string>>
	onChange: ChangeHandler<O.Option<DéclarationDeGardeAMA<string>>>
	avecAideSaisie?: boolean
	avecEspacement?: boolean
}

export default function DéclarationAMAInput({
	idSuffix,
	month,
	déclaration,
	onChange,
	avecAideSaisie,
	avecEspacement,
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
			<StyledQuestion $avecEspacement={!!avecEspacement}>
				{month} 2025
			</StyledQuestion>
			{avecAideSaisie && (
				<DesktopHiddenContainer>
					<AideSaisieEnfants />
				</DesktopHiddenContainer>
			)}
			<EnfantsGardésInput
				enfantsGardés={currentDéclaration.enfantsGardés}
				onChange={onEnfantsGardésChange}
			/>
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

type StyledQuestionProps = {
	$avecEspacement: boolean
}
const StyledQuestion = styled(Question)<StyledQuestionProps>`
	${({ $avecEspacement }) =>
		$avecEspacement &&
		css`
			@media (max-width: ${({ theme }) => theme.breakpointsWidth.sm}) {
				margin-top: ${({ theme }) => theme.spacings.xxl};
			}
		`}
	margin-top: 0;
	text-transform: capitalize;
`
const DesktopHiddenContainer = styled.div`
	@media (min-width: ${({ theme }) => theme.breakpointsWidth.sm}) {
		display: none;
	}
`
