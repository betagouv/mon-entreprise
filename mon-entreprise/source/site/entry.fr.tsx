// We disable Speedy mode for Styled-Component in production because it created a bug for overlay appearance
// https://stackoverflow.com/questions/53486470/react-styled-components-stripped-out-from-production-build
global.SC_DISABLE_SPEEDY = true

import { hot } from 'react-hot-loader/root'
import 'core-js/stable'
import 'react-hot-loader'
import { render } from 'react-dom'
import 'regenerator-runtime/runtime'
import rules from 'modele-social'
import App from './App'
import i18next from '../locales/i18n'

i18next.changeLanguage('fr')

const Root = hot(() => <App basename="mon-entreprise" rules={rules} />)

const anchor = document.querySelector('#js')
render(<Root />, anchor)
