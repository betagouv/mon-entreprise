import Emoji from 'Components/utils/Emoji'
import { usePersistingState } from 'Components/utils/persistState'
import { Button } from 'DesignSystem/buttons'
import { Link } from 'DesignSystem/typography/link'
import { Intro } from 'DesignSystem/typography/paragraphs'
import { ReactNode } from 'react'
import { Trans } from 'react-i18next'
import styled from 'styled-components'

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
				<div>
					{children}
					<div className="ui__ answer-group print-display-none">
						<Button size="XS" light color="tertiary" onPress={() => fold(true)}>
							<Trans>J'ai compris</Trans>
						</Button>
					</div>
				</div>
			)}
		</WarningSection>
	)
}
