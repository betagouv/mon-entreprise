import { useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import { Link, SmallBody } from '@/design-system'

export interface Raccourci {
	id: string
	libellé: string
}

type Props = {
	raccourcis: Raccourci[]
	goTo: (id: string) => void
	idQuestionCourante: string
}

export default function Raccourcis({
	raccourcis,
	goTo,
	idQuestionCourante,
}: Props) {
	const { t } = useTranslation()

	if (!raccourcis.length) {
		return
	}

	return (
		<Container>
			<StyledSmallBody>
				{t('pages.simulateurs.raccourcis.titre', 'Aller à la question :')}
			</StyledSmallBody>

			<StyledList>
				{raccourcis.map(({ id, libellé }) => (
					<li key={id}>
						<StyledLink
							$active={id === idQuestionCourante}
							onPress={() => goTo(id)}
							aria-label={t(
								'pages.simulateurs.raccourcis.aria-label',
								'Aller à la question : {{question}}',
								{
									question: libellé,
								}
							)}
						>
							{libellé}
						</StyledLink>
					</li>
				))}
			</StyledList>
		</Container>
	)
}

const Container = styled.div`
	display: inline-flex;
	flex-wrap: wrap;
	gap: ${({ theme }) => theme.spacings.sm};
	margin: ${({ theme }) => theme.spacings.xl} 0;
`

const StyledSmallBody = styled(SmallBody)`
	margin: 0;
`

const StyledList = styled.ul`
	display: flex;
	gap: ${({ theme }) => theme.spacings.sm};
	margin: 0;
	font-size: 90%;
	padding: 0;
	list-style: none;
`

const StyledLink = styled(Link)<{ $active: boolean }>`
	text-decoration: ${({ $active }) => ($active ? 'none' : 'underline')};
`
