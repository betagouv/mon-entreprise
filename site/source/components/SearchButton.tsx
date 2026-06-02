import { lazy, Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import { Button, PopoverWithTrigger, SearchIcon } from '@/design-system'

import Loader from './utils/Loader'

const LazySearchRulesAndSimulators = lazy(
	() => import('./search/SearchRulesAndSimulators')
)

export default function SearchButton() {
	const { t } = useTranslation()

	return (
		<PopoverWithTrigger
			title={t('components.recherche.modale.title', 'Recherche sur le site')}
			trigger={(buttonProps) => (
				<StyledButton
					size="XS"
					className="print-hidden"
					light
					{...buttonProps}
					aria-haspopup="dialog"
					aria-label={t(
						'components.recherche.button.aria-label',
						'Ouvrir la boite de dialogue pour rechercher'
					)}
				>
					<SearchIcon />
					{t('components.recherche.button.text', 'Rechercher')}
				</StyledButton>
			)}
		>
			{(closePopover) => (
				<Suspense fallback={<Loader />}>
					<LazySearchRulesAndSimulators closePopover={closePopover} />
				</Suspense>
			)}
		</PopoverWithTrigger>
	)
}
const StyledButton = styled(Button)`
	display: flex;
	flex: 0;
	align-items: center;
	margin-right: ${({ theme }) => theme.spacings.md};
`
