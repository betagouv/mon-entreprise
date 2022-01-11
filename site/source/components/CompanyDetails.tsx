import { FabriqueSocialEntreprise } from 'API/fabrique-social'
import { Strong } from 'DesignSystem/typography'
import { H3 } from 'DesignSystem/typography/heading'
import { Body } from 'DesignSystem/typography/paragraphs'
import { useMemo } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Company } from 'Reducers/inFranceAppReducer'
import styled from 'styled-components'


export default function CompanyDetails({
	entreprise,
}: {
	entreprise: FabriqueSocialEntreprise | Company
}) {
	const { i18n } = useTranslation()

	const {
		siren,
		label,
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
	console.log(allMatchingEtablissements)
	return (
		<CompanyContainer>
			<H3
				css={`
					margin-top: 0;
				`}
			>
				<>
					{'highlightLabel' in entreprise ? highlightLabelToJSX(entreprise.highlightLabel) : label}{' '}
					<small>({siren})</small>
				</>{' '}
			</H3>

			<InfoContainer>
				{dateCreationUniteLegale && (
					<div>
						<Trans>Crée le</Trans>{' '}
						<Strong>
							{DateFormatter.format(new Date(dateCreationUniteLegale))}
						</Strong>
					</div>
				)}
				<div>{firstMatchingEtablissement.address}</div>
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

const InfoContainer = styled(Body)`
	display: flex;
	flex-direction: column;
`
