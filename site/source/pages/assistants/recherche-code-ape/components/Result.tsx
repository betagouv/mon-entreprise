import { useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { css, styled } from 'styled-components'

import GuichetInfo from '@/components/GuichetInfo'
import { Appear } from '@/components/ui/animate'
import {
	Button,
	Chip,
	Grid,
	H4,
	H5,
	H6,
	Li,
	RadioCardSkeleton,
	RotatingChevronIcon,
	SmallBody,
	Ul,
} from '@/design-system'

import { HelpGuichetUnique } from './HelpGuichetUnique'

interface ResultProps {
	debug: string | null
	item: {
		title: string
		codeApe: string
		contenuCentral: string[]
		contenuAnnexe: string[]
		contenuExclu: string[]
	}
	disabled?: boolean
	hideGuichetUnique: boolean
}

export const Result = ({ item, disabled, hideGuichetUnique }: ResultProps) => {
	const { title, codeApe, contenuCentral, contenuAnnexe, contenuExclu } = item
	const [open, setOpen] = useState(false)
	const { t } = useTranslation()

	return (
		<StyledRadioCardSkeleton
			isDisabled={disabled}
			value={item.codeApe}
			key={item.codeApe}
			visibleRadioAs="div"
		>
			<StyledH5 as="h3">{title}</StyledH5>
			<SmallBody>
				<Grid
					container
					style={{
						alignItems: 'center',
						justifyContent: 'space-between',
					}}
				>
					<Grid item>
						<Chip>Code : {codeApe}</Chip>
					</Grid>
					<Grid item>
						<StyledButton
							size="XXS"
							light
							color="secondary"
							onPress={() => setOpen((x) => !x)}
							aria-expanded={open}
							aria-controls={`info-${codeApe}`}
							aria-label={!open ? t('En savoir plus') : t('Replier')}
						>
							{!open ? t('En savoir plus') : t('Replier')}&nbsp;
							<StyledChevron aria-hidden isOpen={open} />
						</StyledButton>
					</Grid>
				</Grid>
			</SmallBody>

			{open && (
				<Appear id={`info-${codeApe}`}>
					{contenuCentral.length ? (
						<>
							<H6 as="h4">Contenu central de cette activité :</H6>
							<Ul>
								{contenuCentral.map((contenu, i) => (
									<Li key={i}>{contenu}</Li>
								))}
							</Ul>
						</>
					) : null}

					{contenuAnnexe.length ? (
						<>
							<H6 as="h4">Contenu annexe de cette activité :</H6>
							<Ul>
								{contenuAnnexe.map((contenu, i) => (
									<Li key={i}>{contenu}</Li>
								))}
							</Ul>
						</>
					) : null}

					{contenuExclu.length ? (
						<>
							<H6 as="h4">Contenu exclu de cette activité :</H6>
							<Ul>
								{contenuExclu.map((contenu, i) => (
									<Li key={i}>{contenu}</Li>
								))}
							</Ul>
						</>
					) : null}
					{!hideGuichetUnique && (
						<>
							<Trans i18nKey={'codeApe.catégorie-guichet'}>
								<H4>
									Catégories du Guichet unique
									<HelpGuichetUnique />
								</H4>
							</Trans>
							<GuichetInfo codeApe={codeApe} />
						</>
					)}
				</Appear>
			)}
		</StyledRadioCardSkeleton>
	)
}

const StyledRadioCardSkeleton = styled(RadioCardSkeleton)``

const StyledH5 = styled(H5)`
	${StyledRadioCardSkeleton}:hover & {
		${({ theme }) =>
			theme.darkMode &&
			css`
				color: ${({ theme }) => theme.colors.bases.primary[700]};
			`}
	}
`
const StyledButton = styled(Button)`
	${({ theme }) =>
		theme.darkMode &&
		css`
			${StyledRadioCardSkeleton}:hover & {
				color: ${theme.colors.bases.secondary[700]};
				border-color: ${theme.colors.bases.secondary[500]};
			}
		`}
`
const StyledChevron = styled(RotatingChevronIcon)`
	${({ theme }) =>
		theme.darkMode &&
		css`
			${StyledRadioCardSkeleton}:hover & {
				fill: ${theme.colors.bases.primary[800]} !important;
			}
		`}
`
