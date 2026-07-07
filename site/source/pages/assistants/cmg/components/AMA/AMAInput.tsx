import { pipe } from 'effect'
import * as A from 'effect/Array'
import * as O from 'effect/Option'
import * as R from 'effect/Record'
import { useTranslation } from 'react-i18next'
import { css, styled } from 'styled-components'

import { DéclarationDeGardeAMA, Mois, SalariéeAMA } from '@/contextes/cmg/index'
import { ChangeHandler } from '@/utils/ChangeHandler'

import DeleteButton from '../DeleteButton'
import { Titre3 } from '../styled-components'
import AideSaisieAMA from './AideSaisieAMA'
import DéclarationAMAInput from './DeclarationAMAInput'

type Props = {
	idSuffix: string
	number: number
	salariee: SalariéeAMA<string>
	moisIdentiques: boolean
	onSalariéeChange: ChangeHandler<SalariéeAMA<string>>
	onSalariéeDelete: () => void
	onMoisIdentiquesChange: ChangeHandler<boolean>
}

export default function AMAInput({
	idSuffix,
	number,
	salariee,
	moisIdentiques,
	onSalariéeChange,
	onSalariéeDelete,
	onMoisIdentiquesChange,
}: Props) {
	const { t } = useTranslation()

	const onDéclarationChange = (
		month: Mois,
		declaration: O.Option<DéclarationDeGardeAMA<string>>
	) => {
		const newSalariée = {
			...salariee,
			[month]: declaration,
		}
		if (moisIdentiques) {
			if (month === 'mars') {
				newSalariée.avril = newSalariée.mai = declaration
			} else {
				onMoisIdentiquesChange(false)
			}
		}
		onSalariéeChange(newSalariée)
	}

	return (
		<>
			<TitreContainer>
				<Titre3>
					{t(
						'pages.assistants.cmg.declarations.AMA.h3',
						'Assistante maternelle {{ count }} - Déclaration(s) sur la période de référence',
						{ count: number }
					)}
				</Titre3>
				<DeleteButton onDelete={onSalariéeDelete} />
			</TitreContainer>
			<InputsContainer>
				<AideSaisieAMA />
				{pipe(
					salariee,
					R.keys,
					A.map((month) => (
						<DéclarationAMAInput
							key={month}
							idSuffix={`${idSuffix}-${month}`}
							month={month}
							declaration={salariee[month]}
							onDéclarationChange={(value) => onDéclarationChange(month, value)}
							onMoisIdentiquesChange={onMoisIdentiquesChange}
							moisIdentiques={
								month === 'mars' ? O.some(moisIdentiques) : O.none()
							}
							avecAideSaisie={month === 'mars'}
							avecEspacement={month !== 'mars'}
						/>
					))
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
const InputsContainerStyle = css`
	background-color: ${({ theme }) => theme.colors.extended.grey['200']};
	border-radius: ${({ theme }) => theme.box.borderRadius};
	padding: ${({ theme }) => `${theme.spacings.sm} ${theme.spacings.lg}`};
	margin-bottom: ${({ theme }) => theme.spacings.sm};
`
const InputsContainer = styled.div`
	${InputsContainerStyle}
	display: grid;
	grid-template-rows: repeat(6, min-content);
	grid-template-columns: 30% repeat(3, 1fr);
	grid-auto-flow: column;
	grid-column-gap: ${({ theme }) => theme.spacings.xl};
	grid-row-gap: ${({ theme }) => theme.spacings.md};
	@media (max-width: ${({ theme }) => theme.breakpointsWidth.sm}) {
		display: flex;
		flex-direction: column;
		row-gap: ${({ theme }) => theme.spacings.sm};
	}
`
