import { createGlobalStyle, css } from 'styled-components'

import { isIframe } from '@/hooks/useIframeResizer'

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

/*
 * Les @font-face sont généré avec https://google-webfonts-helper.herokuapp.com/
 * Les fonts sont stockées dans source/static/fonts
 */
export const GlobalStyle = createGlobalStyle`
/* roboto-regular - latin */
@font-face {
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 400;
  src: local(''),
       url('/fonts/roboto-v29-latin-regular.woff2') format('woff2'), /* Chrome 26+, Opera 23+, Firefox 39+ */
       url('/fonts/roboto-v29-latin-regular.woff') format('woff'); /* Chrome 6+, Firefox 3.6+, IE 9+, Safari 5.1+ */
	font-display: swap;
}

/* roboto-italic - latin */
@font-face {
  font-family: 'Roboto';
  font-style: italic;
  font-weight: 400;
  src: local(''),
       url('/fonts/roboto-v29-latin-italic.woff2') format('woff2'), /* Chrome 26+, Opera 23+, Firefox 39+ */
       url('/fonts/roboto-v29-latin-italic.woff') format('woff'); /* Chrome 6+, Firefox 3.6+, IE 9+, Safari 5.1+ */
	font-display: swap;
}

/* roboto-500 - latin */
@font-face {
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 500;
  src: local(''),
       url('/fonts/roboto-v29-latin-500.woff2') format('woff2'), /* Chrome 26+, Opera 23+, Firefox 39+ */
       url('/fonts/roboto-v29-latin-500.woff') format('woff'); /* Chrome 6+, Firefox 3.6+, IE 9+, Safari 5.1+ */
	font-display: swap;
}

/* roboto-500italic - latin */
@font-face {
  font-family: 'Roboto';
  font-style: italic;
  font-weight: 500;
  src: local(''),
       url('/fonts/roboto-v29-latin-500italic.woff2') format('woff2'), /* Chrome 26+, Opera 23+, Firefox 39+ */
       url('/fonts/roboto-v29-latin-500italic.woff') format('woff'); /* Chrome 6+, Firefox 3.6+, IE 9+, Safari 5.1+ */
	font-display: swap;
}

/* roboto-700 - latin */
@font-face {
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 700;
  src: local(''),
       url('/fonts/roboto-v29-latin-700.woff2') format('woff2'), /* Chrome 26+, Opera 23+, Firefox 39+ */
       url('/fonts/roboto-v29-latin-700.woff') format('woff'); /* Chrome 6+, Firefox 3.6+, IE 9+, Safari 5.1+ */
	font-display: swap;
}

/* roboto-700italic - latin */
@font-face {
  font-family: 'Roboto';
  font-style: italic;
  font-weight: 700;
  src: local(''),
       url('/fonts/roboto-v29-latin-700italic.woff2') format('woff2'), /* Chrome 26+, Opera 23+, Firefox 39+ */
       url('/fonts/roboto-v29-latin-700italic.woff') format('woff'); /* Chrome 6+, Firefox 3.6+, IE 9+, Safari 5.1+ */
	font-display: swap;
}

/* montserrat-700 - latin */
@font-face {
  font-family: 'Montserrat';
  font-style: normal;
  font-weight: 700;
  src: local(''),
       url('/fonts/montserrat-v18-latin-700.woff2') format('woff2'), /* Chrome 26+, Opera 23+, Firefox 39+ */
       url('/fonts/montserrat-v18-latin-700.woff') format('woff'); /* Chrome 6+, Firefox 3.6+, IE 9+, Safari 5.1+ */
	font-display: swap;
}

html {
	transition: none !important;
	box-sizing: border-box;
	font-size: 16px;
	overflow-y: auto;
	overflow-x: hidden;
}

html, body, #js, #js > *, [data-overlay-container] {
	${
		isIframe()
			? css`
					min-height: 100%;
			  `
			: css`
					height: 100%;
			  `
	}
	
}

*,
*:before,
*:after {
	box-sizing: inherit;
	transition: color 0.15s, background-color 0.15s;
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


.sr-only {
	${SROnly}
}



.skip-link {
	position: absolute;
	width: 1px;
	height: 1px;
	margin: 0;
	overflow: hidden;
	clip: rect(1px, 1px, 1px, 1px);
	font-family: 'Roboto';
	font-weight: bold;
}

.skip-link:focus {
	z-index: 999;
	width: auto;
	height: auto;
	clip: auto;
	background-color: #2E5FB6;
	color: #FFFFFF;
	padding: 1rem;
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
`
