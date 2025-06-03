import { styled } from 'styled-components'

import { SalariéeGED } from '@/contextes/cmg'
import { FlexCenter } from '@/design-system'
import { ChangeHandler } from '@/utils/ChangeHandler'

import DeleteButton from '../DeleteButton'
import DéclarationGEDInput from './DéclarationGEDInput'

type Props = {
	idSuffix: string
	salariée: SalariéeGED
	onChange: ChangeHandler<SalariéeGED>
	onDelete: () => void
}

export default function GEDInput({
	idSuffix,
	salariée,
	onChange,
	onDelete,
}: Props) {
	return (
		<Container>
			<InputsContainer>
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
			<ButtonContainer>
				<DeleteButton onDelete={onDelete} />
			</ButtonContainer>
		</Container>
	)
}

const Container = styled.div`
	background-color: ${({ theme }) => theme.colors.extended.grey['200']};
	border-radius: ${({ theme }) => theme.box.borderRadius};
	padding: ${({ theme }) => `${theme.spacings.sm} ${theme.spacings.lg}`};
	margin-bottom: ${({ theme }) => theme.spacings.sm};
`
const InputsContainer = styled.div`
	${FlexCenter};
	justify-content: space-between;
`
const ButtonContainer = styled.div`
	margin-top: ${({ theme }) => theme.spacings.sm};
	display: flex;
	justify-content: flex-end;
`
