import types from './actions'

const initialState = false

export default function errorReducer(state = initialState, { type, payload }) {
	switch (type) {
		case types.SET_ERROR:
			return payload
		default:
			return state
	}
}
