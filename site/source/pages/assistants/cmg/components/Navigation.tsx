import { styled } from 'styled-components'

import { Button, FlexCenter } from '@/design-system'
import { RelativeSitePaths, useSitePaths } from '@/sitePaths'

type Props = {
	précédent?: keyof RelativeSitePaths['assistants']['cmg']
	suivant?: keyof RelativeSitePaths['assistants']['cmg']
}

export default function Navigation({ précédent, suivant }: Props) {
	const { absoluteSitePaths } = useSitePaths()
	const cmgPaths = absoluteSitePaths.assistants.cmg

	return (
		<Container>
			{précédent && (
				<Button size="XS" light to={cmgPaths[précédent]}>
					Précédent
				</Button>
			)}
			{suivant && (
				<Button size="XS" to={cmgPaths[suivant]}>
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
