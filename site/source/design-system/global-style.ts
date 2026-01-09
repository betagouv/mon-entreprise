import './global.css'

import { createGlobalStyle, css } from 'styled-components'

import { inIframe } from '@/utils'

export const SROnly = css`
	position: absolute !important;
	width: 1px !important;
	height: 1px !important;
	padding: 0 !important;
	margin: -1px !important;
	overflow: hidden !important;
	clip: rect(0, 0, 0, 0) !important;
	white-space: nowrap !important; /* added line */
	border: 0 !important;
`

export const FocusStyle = css`
	outline: 3px solid ${({ theme }) => theme.colors.bases.primary[700]};
	outline-offset: 2px;
	box-shadow: 0 0 0 2px #ffffff;
`

export const FlexCenter = css`
	display: flex;
	align-items: center;
`

export const GlobalStyle = createGlobalStyle`
html {
	transition: none !important;
	box-sizing: border-box;
	overflow-y: auto;
	overflow-x: hidden;
}

html, body, #js, #js > *, [data-overlay-container] {
	${
		inIframe()
			? css`
					min-height: 100%;
			  `
			: css``
	}

}

*,
*:before,
*:after {
	box-sizing: inherit;
}

body {
	margin: 0;
}


/* Reset fieldset style */
fieldset {
	border: 0;
	padding: 0;
	padding-top: 0.01em;
	margin: 0;
	min-width: 0;
}


button:enabled {
	cursor: pointer;
}


/*
  Classe pour masquer complètement un contenu (Screen reader only)
  Le contenu n’est jamais affiché à l’écran mais est disponible poul les lecteurs d’écran
 */
.sr-only {
	${SROnly}
}



.skip-link {
	display: flex;
	gap: 1rem;
	position: absolute;
	width: 1px;
	height: 1px;
	margin: 0;
	overflow: hidden;
	clip: rect(1px, 1px, 1px, 1px);
	font-family: 'Roboto';
	font-weight: bold;
	list-style-type: "";
}

.skip-link:has(a:focus) {
	z-index: 999;
	width: auto;
	height: auto;
	clip: auto;
	background-color: #2E5FB6;
	padding: 1rem;
}

.skip-link a {
	color: #FFFFFF;
}

figure {
	margin: 0;
	padding: 0;
}

.print-only {
	display: none;
}
@media print {
	.print-only {
		display: initial;
	}
	.print-hidden {
		display: none !important;
	}
	.print-background-force {
		color-adjust: exact !important;
	}
	.print-no-break-inside {
		break-inside: avoid;
	}

	body {
		margin: 00mm;
	}

	html {
		line-height: 1.5em;
	}
}
@page {
	margin-top: 0.7cm;
	margin-bottom: 0.7cm;
}

@media (max-width: ${({ theme }) => theme.breakpointsWidth.sm}) {
	html {
		font-size: 0.9rem;
	}
	.hide-mobile {
		display: none;
	}
}

// Cache le slider opacité du ColorPicker
#color-rectangle1 + div {
	&:first-child {
		align-items: center;
	}
	& div[aria-label='Hue slider'] {
		margin-bottom: 0!important;
	}
	& div[aria-label='Alpha slider'] {
		display: none;
	}
}

a:focus {
	${FocusStyle}
}

// Corrige l'affichage du menu mobile de la documentation
#mobile-menu-portal-id {
	& nav {
		background: ${({ theme }) => theme.darkMode && theme.colors.extended.dark[800]};
	}
	& svg {
		fill: ${({ theme }) => theme.darkMode && theme.colors.extended.grey[100]};
	}

	li.active .content {
		background-color: ${({ theme }) =>
			theme.darkMode && theme.colors.extended.dark[600]};
	}
}
#rules-nav-open-nav-button button {
	color: ${({ theme }) => theme.darkMode && theme.colors.extended.grey[100]};
	border-color: ${({ theme }) =>
		theme.darkMode && theme.colors.extended.grey[100]};
	&:hover {
		color: ${({ theme }) => theme.darkMode && theme.colors.extended.grey[800]};
		border-color: ${({ theme }) =>
			theme.darkMode && theme.colors.extended.grey[800]};
	}
}

.recharts-bar-rectangle {
	stroke: white;
  stroke-width: 1px;
}
`
