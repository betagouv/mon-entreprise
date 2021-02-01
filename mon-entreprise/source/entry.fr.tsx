import { hot } from 'react-hot-loader/root'
import 'core-js/stable'
import 'react-hot-loader'
import { render } from 'react-dom'
import 'regenerator-runtime/runtime'
import rules from 'modele-social'
import App from './App'
import i18next from './locales/i18n'

i18next.changeLanguage('fr')

const Root = hot(() => <App basename="mon-entreprise" rules={rules} />)

const anchor = document.querySelector('#js')
render(<Root />, anchor)
