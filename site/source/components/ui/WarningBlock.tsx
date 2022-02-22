import Emoji from '~/components/utils/Emoji'
import { usePersistingState } from '~/components/utils/persistState'
import { Button } from '~/design-system/buttons'
import { Spacing } from '~/design-system/layout'
import { Link } from '~/design-system/typography/link'
import { Intro } from '~/design-system/typography/paragraphs'
import { ReactNode } from 'react'
import { Trans } from 'react-i18next'
import styled from 'styled-components'
import { FromTop } from './animate'

type WarningProps = {
	localStorageKey: string
	children: ReactNode
}

const WarningSection = styled.section`
	background-color: ${({ theme }) => theme.colors.extended.info[100]};
	color: ${({ theme }) => theme.colors.extended.info[600]};
	padding: 1rem;
	border-radius: ${({ theme }) => theme.box.borderRadius};
`

export default function Warning({ localStorageKey, children }: WarningProps) {
	const [folded, fold] = usePersistingState(localStorageKey, false)
	return (
		<>
			<WarningSection>
				<Intro className={folded ? 'print-hidden' : ''}>
					<Emoji emoji="🚩 " />
					<Trans i18nKey="simulateurs.warning.titre">
						Avant de commencer...
					</Trans>{' '}
					{folded && (
						<Link onPress={() => fold(false)}>
							<Trans i18nKey="simulateurs.warning.plus">
								Lire les précisions
							</Trans>
						</Link>
					)}
				</Intro>
				{!folded && (
					<FromTop>
						{children}
						<div className="ui__ answer-group print-hidden">
							<Button
								size="XS"
								light
								color="tertiary"
								onPress={() => fold(true)}
							>
								<Trans>J'ai compris</Trans>
							</Button>
						</div>
					</FromTop>
				)}
			</WarningSection>
			<Spacing lg />
		</>
	)
}
