import { useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import { SalariéeAMA } from '@/contextes/cmg'
import { H3 } from '@/design-system'
import { ChangeHandler } from '@/utils/ChangeHandler'

import DeleteButton from '../DeleteButton'
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

	return (
		<>
			<Container>
				<H3>
					{t(
						'pages.assistants.cmg.déclarations.AMA.h3',
						'Assistante maternelle {{ count }} - Déclaration(s) sur la période de référence',
						{ count: number }
					)}
				</H3>
				<DeleteButton onDelete={onDelete} />
			</Container>
			<InputsContainer>
				<AideSaisieAMA />
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
