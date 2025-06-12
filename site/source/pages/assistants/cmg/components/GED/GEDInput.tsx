import { useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import { SalariéeGED } from '@/contextes/cmg'
import { H3 } from '@/design-system'
import { ChangeHandler } from '@/utils/ChangeHandler'

import DeleteButton from '../DeleteButton'
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
			<Container>
				<H3>
					{t(
						'pages.assistants.cmg.déclarations.GED.h3',
						'Garde à domicile {{ count }} - Déclaration(s) sur la période de référence',
						{ count: number }
					)}
				</H3>
				<DeleteButton onDelete={onDelete} />
			</Container>
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
					/>
				))}
			</InputsContainer>
		</>
	)
}

const Container = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
`
const InputsContainer = styled.div`
	display: flex;
	justify-content: space-between;
	background-color: ${({ theme }) => theme.colors.extended.grey['200']};
	border-radius: ${({ theme }) => theme.box.borderRadius};
	padding: ${({ theme }) => `${theme.spacings.sm} ${theme.spacings.lg}`};
	margin-bottom: ${({ theme }) => theme.spacings.sm};
`
