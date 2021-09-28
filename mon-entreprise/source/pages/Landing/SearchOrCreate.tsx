import { CompanySearchField } from 'Components/companySearchField'
import Emoji from 'Components/utils/Emoji'
import { SitePathsContext } from 'Components/utils/SitePathsContext'
import { useContext, useState } from 'react'
import { Trans } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { RootState } from 'Reducers/rootReducer'

export default function SearchOrCreate() {
	const sitePaths = useContext(SitePathsContext)
	const statutChoisi = useSelector(
		(state: RootState) => state.inFranceApp.companyStatusChoice
	)
	const [fullWidthSearch, setFullwidthSearch] = useState(true)

	return (
		<div
			className="ui__ container"
			css={`
				display: flex;
				flex-wrap: wrap;
				gap: 1rem;
				align-items: end;
				padding-bottom: 1rem;
				justify-content: start;
				> * {
					margin: 0rem !important;
				}
			`}
		>
			<div
				css={`
					min-width: min(20rem, 100%);
					flex: 1.2;
				`}
				style={fullWidthSearch ? { minWidth: '100%' } : {}}
			>
				<h2 className="ui__ h h4">
					<Trans>Rechercher une entreprise</Trans>
				</h2>
				<CompanySearchField
					onValue={() => setFullwidthSearch(true)}
					onClear={() => setFullwidthSearch(false)}
				/>
			</div>
			<>
				<div
					className="ui__ h h4 notice cta"
					css={`
						flex: 0;
						flex-shrink: 0;
						box-sizing: border-box;
						text-align: center;
						padding: 1rem 0 !important;
						align-self: end !important;
					`}
				>
					ou
				</div>

				<h2>
					<Link
						className="ui__ button cta h h4"
						css={`
							white-space: nowrap;
							text-transform: none !important;
							margin: 0 !important;
						`}
						to={
							statutChoisi
								? sitePaths.créer[statutChoisi]
								: sitePaths.créer.index
						}
					>
						<span>
							<Trans i18nKey="landing.choice.create">
								Créer une entreprise
							</Trans>
						</span>{' '}
						<Emoji emoji="💡" />
					</Link>
				</h2>
			</>
		</div>
	)
}
