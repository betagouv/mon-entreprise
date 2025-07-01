import { useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import { Link, SmallBody } from '@/design-system'
import { Raccourci } from '@/hooks/useQuestions'

type Props = {
	raccourcis: Raccourci[]
	goTo: (id: string) => void
	idQuestionCourante: string
}

export default function QuickLinks({
	raccourcis,
	goTo,
	idQuestionCourante,
}: Props) {
	const { t } = useTranslation()

	if (!raccourcis.length) {
		return
	}

	return (
		<StyledLinks as="div">
			<p>Aller à la question : </p>

			<StyledList>
				{raccourcis.map(({ id, libellé }) => (
					<li key={id}>
						<StyledLink
							$active={id === idQuestionCourante}
							onPress={() => goTo(id)}
							aria-label={t(
								'{{question}}, aller à la question : {{question}}',
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
		</StyledLinks>
	)
}

const StyledLinks = styled(SmallBody)`
	display: inline-flex;
	flex-wrap: wrap;
	gap: ${({ theme }) => theme.spacings.sm};
`

const StyledList = styled.ul`
	display: flex;
	gap: 12px;
	margin: 1em 0;
	padding: 0;
	list-style: none;
`

const StyledLink = styled(Link)<{ $active: boolean }>`
	text-decoration: ${({ $active }) => ($active ? 'underline' : '')};
`
