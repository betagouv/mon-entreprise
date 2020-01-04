import LangSwitcher from 'Components/LangSwitcher'
import NewsletterRegister from 'Components/NewsletterRegister'
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
				className="ui__ container"
				style={{
					textAlign: 'right',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between'
				}}
			>
				<LangSwitcher className="ui__ button simple" />
				{screenfull.enabled && !isFullscreen && !isIE() && (
					<button
						className="ui__ button small"
						onClick={() => {
							screenfull.toggle()
						}}
					>
						{emoji('🖵')}&nbsp;
						<Trans>Plein écran</Trans>
					</button>
				)}
				{window?.print && (
					<button className="ui__ button small" onClick={() => window.print()}>
						{emoji('🖨')}
						<Trans>Imprimer</Trans>
					</button>
				)}
				<Privacy />
			</div>
		</>
	)
}
