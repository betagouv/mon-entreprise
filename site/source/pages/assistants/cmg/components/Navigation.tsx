import { styled } from 'styled-components'

import { useCMG } from '@/contextes/cmg'
import { Button, FlexCenter } from '@/design-system'
import { RelativeSitePaths, useSitePaths } from '@/sitePaths'

type Props = {
	précédent?: keyof RelativeSitePaths['assistants']['cmg']
	suivant?: keyof RelativeSitePaths['assistants']['cmg']
}

export default function Navigation({ précédent, suivant }: Props) {
	const { absoluteSitePaths } = useSitePaths()
	const cmgPaths = absoluteSitePaths.assistants.cmg
	const { submit } = useCMG()

	return (
		<Container>
			{précédent && (
				<Button size="XS" light onClick={submit} to={cmgPaths[précédent]}>
					Précédent
				</Button>
			)}
			{suivant && (
				<Button size="XS" onClick={submit} to={cmgPaths[suivant]}>
					Suivant
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
