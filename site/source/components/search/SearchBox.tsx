import { useTranslation } from 'react-i18next'
import { SearchBoxProvided } from 'react-instantsearch-core'
import { connectSearchBox } from 'react-instantsearch-dom'

import { SearchField } from '@/design-system'

interface Props extends SearchBoxProvided {
	label: string
	'aria-label'?: string
}

export const SearchBox = connectSearchBox<Props>(
	({ currentRefinement, isSearchStalled, refine, ...props }) => {
		const { t } = useTranslation()

		return (
			<form noValidate role="search">
				<SearchField
					autoFocus
					type="search"
					value={currentRefinement}
					onChange={refine}
					onClear={() => {
						refine('')
					}}
					placeholder={t(
						'recherche-globale.placeholder',
						'Mot-clé ou acronyme (exemple : CSG)'
					)}
					id="input-recherche-globale"
					isSearchStalled={isSearchStalled}
					label={props.label}
				/>
			</form>
		)
	}
)
