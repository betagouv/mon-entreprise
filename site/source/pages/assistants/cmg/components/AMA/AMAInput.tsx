import { useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import { SalariéeAMA } from '@/contextes/cmg'
import { Body, FlexCenter, Strong } from '@/design-system'
import { ChangeHandler } from '@/utils/ChangeHandler'

import DeleteButton from '../DeleteButton'
import DéclarationAMAInput from './DéclarationAMAInput'

type Props = {
	idSuffix: string
	salariée: SalariéeAMA<string>
	onChange: ChangeHandler<SalariéeAMA<string>>
	onDelete: () => void
}

export default function AMAInput({
	idSuffix,
	salariée,
	onChange,
	onDelete,
}: Props) {
	const { t } = useTranslation()

	return (
		<Container>
			<Body>
				<Strong>
					{t(
						'pages.assistants.cmg.déclarations.titre',
						'Déclaration(s) sur la période de référence pour la salariée :'
					)}
				</Strong>
			</Body>
			<InputsContainer>
				{Object.keys(salariée).map((month) => (
					<DéclarationAMAInput
						key={month}
						idSuffix={`${idSuffix}-${month}`}
						month={month}
						déclaration={salariée[month as keyof SalariéeAMA<string>]}
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
	display: flex;
	justify-content: flex-end;
	margin-top: ${({ theme }) => theme.spacings.sm};
`
