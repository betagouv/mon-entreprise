import { useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { css, styled } from 'styled-components'

import GuichetInfo from '@/components/GuichetInfo'
import { Appear } from '@/components/ui/animate'
import { Chip } from '@/design-system'
import { Button } from '@/design-system/buttons'
import { RadioCardSkeleton } from '@/design-system/field/Radio/RadioCard'
import { ChevronIcon } from '@/design-system/icons'
import { Grid } from '@/design-system/layout'
import { H4, H5, H6 } from '@/design-system/typography/heading'
import { Li, Ul } from '@/design-system/typography/list'
import { SmallBody } from '@/design-system/typography/paragraphs'

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
		<RadioCardSkeleton
			isDisabled={disabled}
			value={item.codeApe}
			key={item.codeApe}
			visibleRadioAs="div"
		>
			<H5 as="h3">{title}</H5>
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
		</RadioCardSkeleton>
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
