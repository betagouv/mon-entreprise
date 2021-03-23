import 'core-js/stable'
import rules from 'modele-social'
import { render } from 'react-dom'
import 'react-hot-loader'
import { hot } from 'react-hot-loader/root'
import 'regenerator-runtime/runtime'
import App from './App'
import i18next from './locales/i18n'

i18next.changeLanguage('fr')

const Root = hot(() => <App basename="mon-entreprise" rules={rules} />)

const anchor = document.querySelector('#js')
render(<Root />, anchor)
