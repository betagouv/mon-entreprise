import { Trans, useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import {
	Button,
	Emoji,
	Grid,
	PopoverWithTrigger,
	Spacing,
} from '@/design-system'
import { useUrl } from '@/hooks/useUrl'

import { useTracking } from '../ATInternetTracking'
import { ConseillersEntreprisesButton } from '../ConseillersEntreprisesButton'
import { ShareSimulationPopup } from './ShareSimulationPopup'

export interface CustomSimulationButton {
	href: string
	title: string
}

export default function ShareOrSaveSimulationBanner({
	share,
	print,
	conseillersEntreprises,
	customSimulationbutton,
}: {
	share?: boolean
	print?: boolean
	conseillersEntreprises?: boolean
	customSimulationbutton?: CustomSimulationButton
}) {
	const { t } = useTranslation()
	const tracker = useTracking()
	const shareAPIAvailable = !!window?.navigator?.share
	const url = useUrl()
	const startSharing = async () => {
		if (shareAPIAvailable) {
			try {
				await window.navigator.share({
					title: document.title,
					text: t(
						'shareSimulation.navigatorShare',
						'Ma simulation Mon Entreprise'
					),
					url,
				})
			} catch (e) {
				if (
					e instanceof Error &&
					(e.toString().includes('AbortError') || /permission/i.test(e.message))
				) {
					return
				}
				// eslint-disable-next-line no-console
				console.error(e)
			}
		}
	}

	return (
		<>
			<Spacing lg />
			<Grid
				as={LinksList}
				container
				className=" print-hidden"
				spacing={4}
				style={{
					justifyContent: 'center',
				}}
			>
				{customSimulationbutton && (
					<Grid item xs={12} sm="auto" role="listitem">
						<Button light size="XS" href={customSimulationbutton.href}>
							{customSimulationbutton.title}
						</Button>
					</Grid>
				)}

				{share && (
					<Grid as="li" item xs={12} sm="auto">
						<PopoverWithTrigger
							title={t('shareSimulation.modal.title', 'Votre lien de partage')}
							trigger={(buttonProps) => (
								<Button
									{...buttonProps}
									light
									size="XS"
									onPress={(e) => {
										tracker?.sendEvent('click.action', {
											click_chapter1: 'feature:partage',
											click: 'démarré',
										})
										startSharing().catch(
											// eslint-disable-next-line no-console
											(err) => console.error(err)
										)

										buttonProps?.onPress?.(e)
									}}
									aria-haspopup="dialog"
								>
									<Emoji emoji="🔗" />
									<ButtonLabel>
										<Trans i18nKey="shareSimulation.banner">
											Générer un lien de partage
										</Trans>
									</ButtonLabel>
								</Button>
							)}
							small
						>
							<ShareSimulationPopup url={url} />
						</PopoverWithTrigger>
					</Grid>
				)}

				{print && typeof window.print === 'function' && (
					<Grid as="li" item xs={12} sm="auto">
						<Button
							light
							size="XS"
							onPress={() => window.print()}
							aria-haspopup="dialog"
						>
							<Emoji emoji="🖨" />
							<ButtonLabel>
								<Trans i18nKey="ExportSimulation.Banner">
									Imprimer ou sauvegarder en PDF
								</Trans>
							</ButtonLabel>
						</Button>
					</Grid>
				)}

				{conseillersEntreprises && (
					<Grid as="li" item xs={12} sm="auto">
						<ConseillersEntreprisesButton variant="recrutement" />
					</Grid>
				)}
			</Grid>
		</>
	)
}

const ButtonLabel = styled.span`
	margin-left: 1rem;
`

const LinksList = styled.ul`
	list-style: none;
`
