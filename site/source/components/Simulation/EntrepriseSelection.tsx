import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { css, styled } from 'styled-components'

import { CarretDownIcon, CarretUpIcon, SearchIcon } from '@/design-system/icons'
import { Grid } from '@/design-system/layout'
import { Body } from '@/design-system/typography/paragraphs'

import EntrepriseInput from '../conversation/EntrepriseInput'
import Value from '../EngineValue/Value'
import { Appear } from '../ui/animate'
import { useEngine } from '../utils/EngineContext'
import LectureGuide from './LectureGuide'

export default function EntrepriseSelection() {
	const { t } = useTranslation()
	const companySIREN = useEngine().evaluate('entreprise . SIREN').nodeValue
	const [isSearchVisible, setSearchVisible] = useState(false)

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

					<Grid item onClick={() => setSearchVisible(!isSearchVisible)}>
						<ValueBody>
							{companySIREN ? (
								<>
									<Value expression="entreprise . nom" linkToRule={false} />
									{isSearchVisible ? <ShowLessIcon /> : <ShowMoreIcon />}
								</>
							) : (
								<>
									<span
										role="button"
										aria-label={t(
											"Rechercher, afficher le champ de recherche d'entreprise."
										)}
									>
										{t('Rechercher')}
									</span>
									<SearchIcon aria-hidden />
								</>
							)}
						</ValueBody>
					</Grid>
				</Grid>
			</EntrepriseRecap>
			{isSearchVisible && (
				<Appear>
					<EntrepriseInput onSubmit={() => setSearchVisible(false)} />
				</Appear>
			)}
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

const ValueBody = styled(Body)`
	cursor: pointer;
	color: ${({ theme }) =>
		theme.darkMode
			? theme.colors.extended.grey[100]
			: theme.colors.bases.primary[800]};
	display: flex;
	align-items: center;
	gap: ${({ theme }) => theme.spacings.xs};
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
