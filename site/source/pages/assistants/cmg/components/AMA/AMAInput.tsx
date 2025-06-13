import * as O from 'effect/Option'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import { SalariéeAMA } from '@/contextes/cmg'
import { Checkbox } from '@/design-system'
import { ChangeHandler } from '@/utils/ChangeHandler'

import DeleteButton from '../DeleteButton'
import { Titre3 } from '../styled-components'
import AideSaisieAMA from './AideSaisieAMA'
import DéclarationAMAInput from './DéclarationAMAInput'

type Props = {
	idSuffix: string
	number: number
	salariée: SalariéeAMA<string>
	onChange: ChangeHandler<SalariéeAMA<string>>
	onDelete: () => void
}

export default function AMAInput({
	idSuffix,
	number,
	salariée,
	onChange,
	onDelete,
}: Props) {
	const { t } = useTranslation()
	const moisDifférents = useMemo(
		() => O.getOrElse(salariée.moisDifférents, () => false),
		[salariée.moisDifférents]
	)

	const onMoisDifférentsChange = (value: boolean) => {
		const newSalariée = {
			...salariée,
			moisDifférents: O.some(value),
		}

		if (value) {
			newSalariée.déclarations.avril = newSalariée.déclarations.mai = O.none()
		} else {
			newSalariée.déclarations.avril = newSalariée.déclarations.mai =
				newSalariée.déclarations.mars
		}

		onChange(newSalariée)
	}

	return (
		<>
			<TitreContainer>
				<Titre3>
					{t(
						'pages.assistants.cmg.déclarations.AMA.h3',
						'Assistante maternelle {{ count }} - Déclaration(s) sur la période de référence',
						{ count: number }
					)}
				</Titre3>
				<DeleteButton onDelete={onDelete} />
			</TitreContainer>

			<StyledDiv>
				<Checkbox
					label={t(
						'pages.assistants.cmg.déclarations.déclarations-identiques.checkbox-label',
						'Déclarations différentes selon les mois'
					)}
					isSelected={moisDifférents}
					onChange={onMoisDifférentsChange}
				/>
			</StyledDiv>

			<InputsContainer $moisDifférents={moisDifférents}>
				<AideSaisieAMA />
				{moisDifférents ? (
					Object.keys(salariée.déclarations).map((month) => (
						<DéclarationAMAInput
							key={month}
							idSuffix={`${idSuffix}-${month}`}
							titre={`${month} 2025`}
							déclaration={
								salariée.déclarations[
									month as keyof SalariéeAMA<string>['déclarations']
								]
							}
							onChange={(value) =>
								onChange({
									...salariée,
									déclarations: {
										...salariée.déclarations,
										[month]: value,
									},
								})
							}
						/>
					))
				) : (
					<DéclarationAMAInput
						idSuffix={idSuffix}
						titre={t(
							'pages.assistants.cmg.déclarations.déclarations-identiques.titre-formulaire',
							'Mars / Avril / Mai 2025'
						)}
						déclaration={salariée.déclarations.mars}
						onChange={(value) =>
							onChange({
								...salariée,
								déclarations: {
									mars: value,
									avril: value,
									mai: value,
								},
							})
						}
					/>
				)}
			</InputsContainer>
		</>
	)
}

const TitreContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	flex-wrap: wrap;
	row-gap: ${({ theme }) => theme.spacings.md};
	margin-bottom: ${({ theme }) => theme.spacings.lg};
`

const StyledDiv = styled.div`
	padding-left: ${({ theme }) => theme.spacings.md};
	margin-bottom: ${({ theme }) => theme.spacings.sm};
`

type InputsContainerProps = {
	$moisDifférents: boolean
}
const InputsContainer = styled.div<InputsContainerProps>`
	display: grid;
	grid-template-rows: repeat(5, min-content);
	grid-template-columns: ${({ $moisDifférents }) =>
		$moisDifférents ? '30% repeat(3, 1fr)' : 'auto'};
	grid-auto-flow: column;
	grid-column-gap: ${({ theme }) => theme.spacings.xl};
	background-color: ${({ theme }) => theme.colors.extended.grey['200']};
	border-radius: ${({ theme }) => theme.box.borderRadius};
	padding: ${({ theme }) => `${theme.spacings.sm} ${theme.spacings.lg}`};
	margin-bottom: ${({ theme }) => theme.spacings.sm};
`
