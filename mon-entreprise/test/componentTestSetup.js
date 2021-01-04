import chai from 'chai'
import Enzyme from 'enzyme'
// We use a fork of the React adapter because the official one doesn't support
// React 17 yet. See https://github.com/enzymejs/enzyme/issues/2429
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'
import sinonChai from 'sinon-chai'

chai.use(sinonChai)
Enzyme.configure({ adapter: new Adapter() })

// Setup Intl in "en" and "fr" for testing

// var localesMyAppSupports = ['en', 'fr']
import intl from 'intl'
import 'intl/locale-data/jsonp/en.js'
import 'intl/locale-data/jsonp/fr.js'

global.Intl = intl
