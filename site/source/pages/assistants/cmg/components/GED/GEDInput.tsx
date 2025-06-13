import { useTranslation } from 'react-i18next'
import { css, styled } from 'styled-components'

import { SalariéeGED } from '@/contextes/cmg'
import { ChangeHandler } from '@/utils/ChangeHandler'

import DeleteButton from '../DeleteButton'
import { Titre3 } from '../styled-components'
import AideSaisieGED from './AideSaisieGED'
import DéclarationGEDInput from './DéclarationGEDInput'

type Props = {
	idSuffix: string
	number: number
	salariée: SalariéeGED
	onChange: ChangeHandler<SalariéeGED>
	onDelete: () => void
}

export default function GEDInput({
	idSuffix,
	number,
	salariée,
	onChange,
	onDelete,
}: Props) {
	const { t } = useTranslation()

	return (
		<>
			<TitreContainer>
				<Titre3>
					{t(
						'pages.assistants.cmg.déclarations.GED.h3',
						'Garde à domicile {{ count }} - Déclaration(s) sur la période de référence',
						{ count: number }
					)}
				</Titre3>
				<DeleteButton onDelete={onDelete} />
			</TitreContainer>
			<InputsContainer>
				<AideSaisieGED />
				{Object.keys(salariée).map((month) => (
					<DéclarationGEDInput
						key={month}
						idSuffix={`${idSuffix}-${month}`}
						month={month}
						déclaration={salariée[month as keyof SalariéeGED]}
						onChange={(value) =>
							onChange({
								...salariée,
								[month]: value,
							})
						}
						avecAideSaisie={month === 'mars'}
					/>
				))}
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
	grid-template-rows: repeat(4, min-content);
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
