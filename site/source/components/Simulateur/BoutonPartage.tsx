import { useTranslation } from 'react-i18next'

import {
	BorderlessButton,
	PaperClip,
	PopoverWithTrigger,
} from '@/design-system'
import { useUrl } from '@/hooks/useUrl'

import { usePianoTracking } from '../ATInternetTracking'
import { ShareSimulationPopup } from '../ShareSimulationBanner/ShareSimulationPopup'

export const BoutonPartage = () => {
	const { t } = useTranslation()
	const tracker = usePianoTracking()
	const url = useUrl()
	const shareAPIAvailable = !!window?.navigator?.share
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
		<PopoverWithTrigger
			title={t(
				'components.simulateur.partage.modale.titre',
				'Votre lien de partage'
			)}
			trigger={(buttonProps) => (
				<BorderlessButton
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
					<PaperClip />
					{t(
						'components.simulateur.partage.bouton',
						'Générer un lien de partage'
					)}
				</BorderlessButton>
			)}
			small
		>
			<ShareSimulationPopup url={url} />
		</PopoverWithTrigger>
	)
}
