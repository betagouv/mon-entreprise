import { useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import { useCMG } from '@/contextes/cmg'
import { Button, FlexCenter } from '@/design-system'
import { useGetPath } from '@/hooks/useGetPath'
import { RelativeSitePaths } from '@/sitePaths'

type CMGPage = keyof RelativeSitePaths['assistants']['cmg']

type Props = {
	précédent?: CMGPage
	suivant?: CMGPage
	isSuivantDisabled?: boolean
}

export default function Navigation({
	précédent,
	suivant,
	isSuivantDisabled,
}: Props) {
	const { submit } = useCMG()
	const { t } = useTranslation()
	const getPath = useGetPath()

	const getCMGPath = (page: CMGPage) =>
		getPath(`assistants.cmg.${page}` as const)

	return (
		<Container>
			{précédent && (
				<Button size="XS" light to={getCMGPath(précédent)}>
					{t('Précédent')}
				</Button>
			)}
			{suivant && (
				<Button
					size="XS"
					onPress={submit}
					to={getCMGPath(suivant)}
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
	justify-content: end;
	gap: ${({ theme }) => theme.spacings.md};
`
