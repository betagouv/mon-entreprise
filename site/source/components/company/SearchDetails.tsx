import { FabriqueSocialEntreprise } from '@/api/fabrique-social'
import { Spacing } from '@/design-system/layout'
import { Strong } from '@/design-system/typography'
import { H4 } from '@/design-system/typography/heading'
import { useMemo } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import styled from 'styled-components'

export default function CompanySearchDetails({
	entreprise,
}: {
	entreprise: FabriqueSocialEntreprise
}) {
	const { i18n } = useTranslation()

	const { siren, label, dateCreationUniteLegale, firstMatchingEtablissement } =
		entreprise

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
	return (
		<CompanyContainer>
			<H4
				as="div"
				css={`
					margin: 0;
				`}
			>
				<>
					{'highlightLabel' in entreprise
						? highlightLabelToJSX(entreprise.highlightLabel)
						: label}{' '}
					<small>({siren})</small>
				</>
			</H4>
			<Spacing sm />
			<Trans>Crée le :</Trans>{' '}
			<Strong>{DateFormatter.format(new Date(dateCreationUniteLegale))}</Strong>
			<br />
			<Trans>Domiciliée à l'adresse :</Trans>{' '}
			<Strong>{firstMatchingEtablissement.address}</Strong>
		</CompanyContainer>
	)
}

function highlightLabelToJSX(highlightLabel: string) {
	const highlightRE = /(.*?)<b><u>(.+?)<\/u><\/b>/gm
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
	background-color: ${({ theme }) => theme.colors.bases.secondary[100]};
`

const CompanyContainer = styled.div`
	text-align: left;
`
