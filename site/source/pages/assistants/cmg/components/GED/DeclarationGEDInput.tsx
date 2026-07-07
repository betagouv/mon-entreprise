import * as O from 'effect/Option'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { css, styled } from 'styled-components'

import { DéclarationDeGardeGED } from '@/contextes/cmg/index'
import { Checkbox } from '@/design-system/index'
import { Montant } from '@/domaine/Montant'
import { ChangeHandler } from '@/utils/ChangeHandler'

import AideSaisieCMG from '../declaration/AideSaisieCMG'
import AideSaisieHeuresDeGarde from '../declaration/AideSaisieHeuresDeGarde'
import AideSaisieRémunération from '../declaration/AideSaisieRemuneration'
import CMGPerçuInput from '../declaration/CMGPercuInput'
import HeuresDeGardeInput from '../declaration/HeuresDeGardeInput'
import RémunérationInput from '../declaration/RemunerationInput'
import { DesktopHidden, Question } from '../styled-components'

type Props = {
	idSuffix: string
	month: string
	declaration: O.Option<DéclarationDeGardeGED>
	onDéclarationChange: ChangeHandler<O.Option<DéclarationDeGardeGED>>
	onMoisIdentiquesChange: ChangeHandler<boolean>
	moisIdentiques: O.Option<boolean>
	avecAideSaisie?: boolean
	avecEspacement?: boolean
}

export default function DéclarationGEDInput({
	idSuffix,
	month,
	declaration,
	onDéclarationChange,
	onMoisIdentiquesChange,
	moisIdentiques,
	avecAideSaisie,
	avecEspacement,
}: Props) {
	const { t } = useTranslation()

	const currentDéclaration = useMemo(
		() =>
			O.getOrElse(
				declaration,
				() =>
					({
						type: 'GED',
						heuresDeGarde: O.none(),
						rémunération: O.none(),
						CMGPerçu: O.none(),
					}) satisfies DéclarationDeGardeGED
			),
		[declaration]
	)

	const onHeuresDeGardeChange = (heuresDeGarde: O.Option<number>) => {
		onDéclarationChange(
			O.some({
				...currentDéclaration,
				heuresDeGarde,
			})
		)
	}

	const onRémunérationChange = (rémunération: O.Option<Montant<'€'>>) => {
		onDéclarationChange(
			O.some({
				...currentDéclaration,
				rémunération,
			})
		)
	}

	const onCMGPerçuChange = (CMGPerçu: O.Option<Montant<'€'>>) => {
		onDéclarationChange(
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
			<DoubleRowContainer $double={O.isNone(moisIdentiques)}>
				<CMGPerçuInput
					idSuffix={idSuffix}
					valeur={currentDéclaration.CMGPerçu}
					onChange={onCMGPerçuChange}
				/>
			</DoubleRowContainer>
			{O.isSome(moisIdentiques) && (
				<Checkbox
					id={`${idSuffix}-mois-identiques`}
					label={t(
						'pages.assistants.cmg.declarations.mois-identiques',
						'Saisir les mêmes informations pour avril et mai'
					)}
					isSelected={moisIdentiques.value}
					onChange={onMoisIdentiquesChange}
					alignment="start"
				/>
			)}
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
	${DesktopHidden}
`
type DoubleRowContainerProps = {
	$double: boolean
}
const DoubleRowContainer = styled.div<DoubleRowContainerProps>`
	${({ $double }) =>
		$double
			? css`
					grid-row: span 2;
			  `
			: css`
					margin-bottom: ${({ theme }) => theme.spacings.lg};
			  `}
`
