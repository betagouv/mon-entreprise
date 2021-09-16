import { useSetEntreprise } from 'Actions/companyStatusActions'
import { Etablissement } from 'api/sirene'
import { CompanySearchField } from 'Components/CompanySearchField'
import Emoji from 'Components/utils/Emoji'
import { SitePathsContext } from 'Components/utils/SitePathsContext'
import { useInitialRender } from 'Components/utils/useInitialRender'
import { useCallback, useContext, useEffect, useState } from 'react'
import { Trans } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'
import { animated, config, useSpring } from 'react-spring'
import { RootState } from 'Reducers/rootReducer'

export default function SearchOrCreate() {
	const sitePaths = useContext(SitePathsContext)
	const statutChoisi = useSelector(
		(state: RootState) => state.inFranceApp.companyStatusChoice
	)
	const { fullWidthSearch, handleValue, handleClear, createButtonStyle } =
		useChangeLayoutOnValue()
	const handleCompanySubmit = useHandleCompanySubmit()

	return (
		<div
			css={`
				display: flex;
				flex-wrap: wrap;
				gap: 0.6rem;
				align-items: end;
				padding-bottom: 1rem;
				justify-content: end;
				> * {
					margin: 0rem !important;
				}
			`}
		>
			<div
				style={fullWidthSearch ? { minWidth: '100%' } : {}}
				css={`
					min-width: min(20rem, 100%);
					flex: 1.2;
					z-index: 1;
					position: relative;
				`}
			>
				<h2 className="ui__ h h4">
					<Trans>Rechercher une entreprise</Trans>
				</h2>
				<CompanySearchField
					onSubmit={handleCompanySubmit}
					onValue={handleValue}
					onClear={handleClear}
				/>
			</div>

			<animated.div
				style={createButtonStyle}
				className="ui__ h h4 notice"
				css={`
					display: flex;
					align-items: baseline;
					> * {
						margin: 0 !important;
					}
				`}
			>
				<div
					className="ui__ h h4"
					css={`
						padding-right: 0.6rem;
						color: var(--lighterTextColor) !important;
					`}
				>
					<Trans>ou</Trans>
				</div>
				<h2 className="ui__ h h4">
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
							<Trans i18nKey="landing.choice.create.title">
								Créer une entreprise
							</Trans>
						</span>{' '}
						<Emoji emoji="💡" />
					</Link>
				</h2>
			</animated.div>
		</div>
	)
}

function useChangeLayoutOnValue() {
	const [fullWidthSearch, setFullwidthSearch] = useState(false)
	const [{ value }, api] = useSpring(() => ({
		value: 0,
		config: config.stiff,
	}))
	const createButtonStyle = {
		y: value.to((v) => v + '%'),
		zIndex: 0,
	}
	const isInitialRender = useInitialRender()
	useEffect(() => {
		if (isInitialRender) {
			return
		}
		api({
			value: (fullWidthSearch ? -1 : 1) * 100,
			immediate: true,
		})
		api({ value: 0 })
	}, [fullWidthSearch, api])
	const handleValue = useCallback(
		() => setFullwidthSearch(true),
		[setFullwidthSearch]
	)
	const handleClear = useCallback(
		() => setFullwidthSearch(false),
		[setFullwidthSearch]
	)
	return { fullWidthSearch, handleValue, handleClear, createButtonStyle }
}

function useHandleCompanySubmit() {
	const history = useHistory()
	const sitePaths = useContext(SitePathsContext)
	const setEntreprise = useSetEntreprise()
	const handleCompanySubmit = useCallback(
		(établissement: Etablissement) => {
			setEntreprise(établissement.siren)
			history.push(sitePaths.gérer.index)
		},
		[history, setEntreprise]
	)
	return handleCompanySubmit
}

function CompanyButton() {}
