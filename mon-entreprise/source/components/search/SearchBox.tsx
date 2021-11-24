import { SearchField } from 'DesignSystem/field'
import { useTranslation } from 'react-i18next'
import { connectSearchBox } from 'react-instantsearch-dom'

export const SearchBox = connectSearchBox(
	({ currentRefinement, isSearchStalled, refine }) => {
		const { t } = useTranslation()
		return (
			<form noValidate action="" role="search">
				<SearchField
					type="search"
					autoFocus
					value={currentRefinement}
					onChange={refine}
					onClear={() => refine('')}
					placeholder={t(
						'recherche-globale.placeholder',
						'Mot-clé ou acronyme (ex : CSG)'
					)}
					isSearchStalled={isSearchStalled}
				/>
			</form>
		)
	}
)
