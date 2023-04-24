import { useTranslation } from 'react-i18next'
import { connectSearchBox } from 'react-instantsearch-dom'

import { SearchField } from '@/design-system/field'

export const SearchBox = connectSearchBox(
	({ currentRefinement, isSearchStalled, refine, ...props }) => {
		const { t } = useTranslation()

		return (
			<form noValidate role="search">
				<SearchField
					type="search"
					autoFocus
					value={currentRefinement}
					onChange={refine}
					onClear={() => refine('')}
					placeholder={t(
						'recherche-globale.placeholder',
						'Mot-clé ou acronyme (exemple : CSG)'
					)}
					aria-label={t('Rechercher une règle de calcul dans la documentation')}
					id="input-recherche-globale"
					isSearchStalled={isSearchStalled}
					{...props}
				/>
			</form>
		)
	}
)
