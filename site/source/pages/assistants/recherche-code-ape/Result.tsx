import { useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { css, styled } from 'styled-components'

import { Appear } from '@/components/ui/animate'
import { Chip } from '@/design-system'
import { Button, HelpButtonWithPopover } from '@/design-system/buttons'
import { ChevronIcon } from '@/design-system/icons'
import { Grid } from '@/design-system/layout'
import { H4, H5, H6 } from '@/design-system/typography/heading'
import { Link } from '@/design-system/typography/link'
import { Li, Ul } from '@/design-system/typography/list'
import { Body, SmallBody } from '@/design-system/typography/paragraphs'

import GuichetInfo from './GuichetInfo'

interface ResultProps {
	debug: string | null
	item: {
		title: string
		codeApe: string
		contenuCentral: string[]
		contenuAnnexe: string[]
		contenuExclu: string[]
	}
	hideGuichetUnique: boolean
}

export const Result = ({ item, hideGuichetUnique }: ResultProps) => {
	const { title, codeApe, contenuCentral, contenuAnnexe, contenuExclu } = item
	const [open, setOpen] = useState(false)
	const { t } = useTranslation()

	return (
		<>
			<H5 as="h3">{title}</H5>
			<SmallBody>
				<Grid
					container
					css={`
						align-items: center;
						justify-content: space-between;
					`}
				>
					<Grid item>
						<Chip>Code : {codeApe}</Chip>
					</Grid>
					<Grid item>
						<Button
							size="XXS"
							light
							color="secondary"
							onPress={() => setOpen((x) => !x)}
							aria-expanded={open}
							aria-controls={`info-${codeApe}`}
							aria-label={!open ? t('En savoir plus') : t('Replier')}
						>
							{!open ? t('En savoir plus') : t('Replier')}&nbsp;
							<StyledChevron aria-hidden $isOpen={open} />
						</Button>
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
		</>
	)
}

const StyledChevron = styled(ChevronIcon)<{ $isOpen: boolean }>`
	vertical-align: middle;
	transform: rotate(-90deg);
	transition: transform 0.3s;
	${({ $isOpen }) =>
		!$isOpen &&
		css`
			transform: rotate(90deg);
		`}
`

export function HelpGuichetUnique() {
	return (
		<HelpButtonWithPopover
			type="info"
			title="Qu'est-ce que le guichet unique ?"
		>
			<Body>
				Le{' '}
				<Link href="https://procedures.inpi.fr/">
					Guichet électronique des formalités d’entreprises
				</Link>{' '}
				(Guichet unique) est un portail internet sécurisé, auprès duquel toute
				entreprise est tenue de déclarer sa création, depuis le 1er janvier
				2023.
			</Body>
			<Body>
				Il utilise une classification des activités différente de celle utilisée
				par l'INSEE pour code APE.
			</Body>
		</HelpButtonWithPopover>
	)
}
