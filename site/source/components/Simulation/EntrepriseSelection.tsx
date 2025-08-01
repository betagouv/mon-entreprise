import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { css, styled } from 'styled-components'

import {
	CarretDownIcon,
	CarretUpIcon,
	Grid,
	SearchIcon,
	typography,
} from '@/design-system'

import EntrepriseInput from '../conversation/EntrepriseInput'
import Value from '../EngineValue/Value'
import LectureGuide from '../LectureGuide'
import { Appear } from '../ui/animate'
import { useEngine } from '../utils/EngineContext'
import WrongSimulateurWarning from '../WrongSimulateurWarning'

const { Body } = typography

export default function EntrepriseSelection() {
	const { t } = useTranslation()
	const companySIREN = useEngine().evaluate('entreprise . SIREN').nodeValue
	const [isSearchVisible, setIsSearchVisible] = useState(false)

	return (
		<Container>
			<EntrepriseRecap>
				<Grid
					container
					style={{
						alignItems: 'baseline',
						justifyContent: 'space-between',
					}}
					spacing={2}
				>
					<Grid item>
						<TitleBody>{t('Votre entreprise')}</TitleBody>
					</Grid>

					<LectureGuide />

					<Grid item>
						<DisclosureButton
							as="button"
							onClick={() => setIsSearchVisible(!isSearchVisible)}
							aria-expanded={isSearchVisible}
							aria-controls="entreprise-search-panel"
						>
							{companySIREN ? (
								<>
									<Value expression="entreprise . nom" linkToRule={false} />
									{isSearchVisible ? <ShowLessIcon /> : <ShowMoreIcon />}
								</>
							) : (
								<>
									<span
										aria-label={t(
											"Rechercher, afficher le champ de recherche d'entreprise."
										)}
									>
										{t('Rechercher')}
									</span>
									<SearchIcon aria-hidden />
								</>
							)}
						</DisclosureButton>
					</Grid>
				</Grid>
				<WrongSimulateurWarning />
			</EntrepriseRecap>
			<div id="entreprise-search-panel">
				{isSearchVisible && (
					<Appear>
						<EntrepriseInput onSubmit={() => setIsSearchVisible(false)} />
					</Appear>
				)}
			</div>
		</Container>
	)
}

const ShowLessIcon = () => {
	const { t } = useTranslation()

	return (
		<>
			<span className="sr-only">
				{t("Masquer les détails de l'entreprise.")}
			</span>
			<StyledCarretUpIcon />
		</>
	)
}

const ShowMoreIcon = () => {
	const { t } = useTranslation()

	return (
		<>
			<span className="sr-only">
				{t(
					"Afficher les détails de l'entreprise, la modifier ou la supprimer."
				)}
			</span>
			<StyledCarretDownIcon />
		</>
	)
}

const Container = styled.div`
	z-index: 2;
	position: relative;
	padding: ${({ theme }) => `${theme.spacings.sm} ${theme.spacings.lg}`};
	background-color: ${({ theme }) =>
		theme.darkMode
			? theme.colors.extended.dark[500]
			: theme.colors.bases.primary[100]};

	@media print {
		background: initial;
		padding: 0;
	}
`

const EntrepriseRecap = styled.div`
	position: relative;
	z-index: 1;
`

const TitleBody = styled(Body)`
	color: ${({ theme }) =>
		theme.darkMode
			? theme.colors.extended.grey[100]
			: theme.colors.bases.primary[800]};
	font-weight: bold;
`

const DisclosureButton = styled(Body)`
	color: ${({ theme }) =>
		theme.darkMode
			? theme.colors.extended.grey[100]
			: theme.colors.bases.primary[800]};
	display: flex;
	align-items: center;
	gap: ${({ theme }) => theme.spacings.xs};
	border: none;
	background: transparent;
	cursor: pointer;
`

const IconStyle = css`
	margin-bottom: ${({ theme }) => theme.spacings.xxxs};
`
const StyledCarretDownIcon = styled(CarretDownIcon)`
	${IconStyle}
`
const StyledCarretUpIcon = styled(CarretUpIcon)`
	${IconStyle}
`
