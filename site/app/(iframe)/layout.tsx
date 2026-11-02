import { ReactNode } from 'react'

/**
 * Les pages intégrées en iframe se passent de l'en-tête et du pied de page du
 * site : seul le simulateur et le pied de page d'iframe sont affichés.
 */
export default function IframeLayout({ children }: { children: ReactNode }) {
	return (
		<>
			{/*
			 * Ouvre les liens externes dans la page parente. Les liens internes
			 * restent gérés par le routeur et ne sont pas concernés. `<base>` n'est
			 * pas couvert par l'API Metadata de Next, qui demande de le rendre
			 * depuis le layout.
			 */}
			<base target="_parent" />
			{children}
		</>
	)
}
