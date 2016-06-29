import { takeEvery} from 'redux-saga'
import { call, put} from 'redux-saga/effects'
import Promise from 'core-js/fn/promise'


function* handleSubmitStep() {
	console.log('salut')
}

function* watchSteps() {
	yield* takeEvery('SUBMIT_STEP', handleSubmitStep)
}

export default function* rootSaga() {
	yield [ watchSteps() ]
}
