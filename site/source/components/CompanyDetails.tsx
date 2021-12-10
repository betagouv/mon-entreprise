import { FabriqueSocialEntreprise } from 'API/fabrique-social'
import { Strong } from 'DesignSystem/typography'
import { H3 } from 'DesignSystem/typography/heading'
import { SmallBody } from 'DesignSystem/typography/paragraphs'
import { useMemo } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import styled from 'styled-components'

type Company = {
	activite_principale: string
	denomination: string
	prenom_usuel: string
	nom: string
	date_creation: string
	etablissement_siege: {
		libelle_commune: string
		code_postal: string
	}
}

export default function CompanyDetails({
	entreprise,
}: {
	entreprise: FabriqueSocialEntreprise
}) {
	const { i18n } = useTranslation()

	const {
		siren,
		highlightLabel,
		dateCreationUniteLegale,
		firstMatchingEtablissement,
		allMatchingEtablissements,
	} = entreprise

	const DateFormatter = useMemo(
		() =>
			new Intl.DateTimeFormat(i18n.language, {
				month: 'short',
				day: 'numeric',
				year: 'numeric',
			}),
		[i18n.language]
	)

	// if (company === null) {
	// 	return (
	// 		<SmallBody>
	// 			{siren}
	// 			<Trans>est un SIREN non diffusible</Trans>
	// 		</SmallBody>
	// 	)
	// }
	const siege = allMatchingEtablissements.find((e) => e.is_siege)

	return (
		<CompanyContainer>
			<H3
				css={`
					margin-top: 0;
				`}
			>
				<>
					<div>{highlightLabel ? highlightLabelToJSX(highlightLabel) : ''}</div>
					<small>({siren})</small>
				</>
				){' '}
			</H3>

			<InfoContainer as="div">
				{dateCreationUniteLegale && (
					<div>
						<Trans>Crée le</Trans>{' '}
						<Strong>
							{DateFormatter.format(new Date(dateCreationUniteLegale))}
						</Strong>
					</div>
				)}
				<div>
					<Trans>Domiciliation :</Trans> {firstMatchingEtablissement.address}
				</div>
				{siege &&
					allMatchingEtablissements.length > 1 &&
					siege.address !== firstMatchingEtablissement.address && (
						<div>
							<Trans>Siège :</Trans> {siege.address}
						</div>
					)}
			</InfoContainer>
		</CompanyContainer>
	)
}

function highlightLabelToJSX(highlightLabel: string) {
	const highlightRE = /(.*?)<b><u>(\w+)<\/u><\/b>/gm
	let parsedLength = 0
	const result = []
	let matches
	while ((matches = highlightRE.exec(highlightLabel)) !== null) {
		parsedLength += matches[0].length
		result.push(
			<>
				{matches[1]}
				<Highlight>{matches[2]}</Highlight>
			</>
		)
	}
	result.push(highlightLabel.slice(parsedLength))
	return result
}

const Highlight = styled.strong`
	text-decoration: underline;
`

const CompanyContainer = styled.div`
	margin-top: 0.5rem;
	margin-bottom: 0.5rem;
	text-align: left;
`

const InfoContainer = styled(SmallBody)`
	display: flex;
	flex-direction: column;
`
