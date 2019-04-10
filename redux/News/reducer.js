import types from './actions'

const initialState = null

export default function auth(state = initialState, { type, payload }) {
	switch (type) {
		case types.SET_AUTH:
			return payload
		
		default:
			return state
	}
}
