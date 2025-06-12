import { useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import { useCMG } from '@/contextes/cmg'
import { Button, FlexCenter } from '@/design-system'
import { RelativeSitePaths, useSitePaths } from '@/sitePaths'

type Props = {
	précédent?: keyof RelativeSitePaths['assistants']['cmg']
	suivant?: keyof RelativeSitePaths['assistants']['cmg']
	isSuivantDisabled?: boolean
}

export default function Navigation({
	précédent,
	suivant,
	isSuivantDisabled,
}: Props) {
	const { absoluteSitePaths } = useSitePaths()
	const cmgPaths = absoluteSitePaths.assistants.cmg
	const { submit } = useCMG()
	const { t } = useTranslation()

	return (
		<Container>
			{précédent && (
				<Button size="XS" light to={cmgPaths[précédent]}>
					{t('Précédent')}
				</Button>
			)}
			{suivant && (
				<Button
					size="XS"
					onClick={submit}
					to={cmgPaths[suivant]}
					isDisabled={isSuivantDisabled}
				>
					{t('Suivant')}
				</Button>
			)}
		</Container>
	)
}

const Container = styled.div`
	margin-top: ${({ theme }) => theme.spacings.xl};
	${FlexCenter}
	justify-content: space-between;
`
