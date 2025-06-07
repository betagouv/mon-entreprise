import { styled } from 'styled-components'

import { Enfant } from '@/contextes/cmg'
import { FlexCenter } from '@/design-system'
import { ChangeHandler } from '@/utils/ChangeHandler'

import DeleteButton from '../DeleteButton'
import DateDeNaissanceInput from './DateDeNaissanceInput'
import PrénomInput from './PrénomInput'

type Props = {
	idSuffix: string
	enfant: Enfant
	onChange: ChangeHandler<Enfant>
	onDelete?: () => void
}

export default function EnfantInput({
	idSuffix,
	enfant,
	onChange,
	onDelete,
}: Props) {
	return (
		<Container>
			<InputsContainer>
				<PrénomInput
					idSuffix={idSuffix}
					valeur={enfant.prénom}
					onChange={(prénom) =>
						onChange({
							...enfant,
							prénom,
						})
					}
				/>
				<DateDeNaissanceInput
					idSuffix={idSuffix}
					valeur={enfant.dateDeNaissance}
					onChange={(dateDeNaissance) =>
						dateDeNaissance &&
						onChange({
							...enfant,
							dateDeNaissance,
						})
					}
				/>
			</InputsContainer>
			{onDelete && <DeleteButton onDelete={onDelete} />}
		</Container>
	)
}

const Container = styled.div`
	${FlexCenter};
	justify-content: space-between;
	background-color: ${({ theme }) => theme.colors.extended.grey['200']};
	border-radius: ${({ theme }) => theme.box.borderRadius};
	padding: ${({ theme }) => `${theme.spacings.sm} ${theme.spacings.lg}`};
	margin-bottom: ${({ theme }) => theme.spacings.sm};
`
const InputsContainer = styled.div`
	${FlexCenter};
	gap: ${({ theme }) => theme.spacings.xl};
`
