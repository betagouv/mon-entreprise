import LangSwitcher from 'Components/LangSwitcher'
import NewsletterRegister from 'Components/NewsletterRegister'
import marianneSvg from 'Images/marianne.svg'
import urssafSvg from 'Images/urssaf.svg'
import React, { useEffect, useState } from 'react'
import emoji from 'react-easy-emoji'
import { Trans } from 'react-i18next'
import screenfull from 'screenfull'
import { isIE } from '../../../../utils'
import Privacy from '../../layout/Footer/Privacy'

export default function IframeFooter() {
	const [isFullscreen, setIsFullscreen] = useState(screenfull.isFullscreen)
	useEffect(() => {
		screenfull.enabled &&
			screenfull.onchange(() => setIsFullscreen(screenfull.isFullscreen))
	}, [])

	return (
		<>
			<NewsletterRegister />
			<div
				style={{
					textAlign: 'center',
					margin: '2rem 0'
				}}>
				<a href="https://www.urssaf.fr" target="_blank">
					<img
						style={{ height: '2.5rem', marginRight: '1rem' }}
						src={urssafSvg}
						alt="un service fourni par l'Urssaf"
					/>
				</a>
				<a href="https://beta.gouv.fr" target="_blank">
					<img
						style={{ height: '2.5rem' }}
						src={marianneSvg}
						alt="un service de l’Etat français incubé par beta.gouv.fr"
					/>
				</a>
			</div>
			<div
				className="ui__ container"
				style={{
					textAlign: 'right',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between'
				}}>
				<LangSwitcher className="ui__ button simple" />
				{screenfull.enabled && !isFullscreen && !isIE() && (
					<button
						className="ui__ button small"
						onClick={() => {
							screenfull.toggle()
						}}>
						{emoji('🖵')}&nbsp;
						<Trans>Plein écran</Trans>
					</button>
				)}
				<button className="ui__ button small" onClick={() => window.print()}>
					{emoji('🖨')}
					<Trans>Imprimer</Trans>
				</button>
				<Privacy />
			</div>
		</>
	)
}
