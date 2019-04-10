import types from './actions'

const initialState = null

export default function user(state = initialState, { type, payload }) {
	switch (type) {
		case types.SET_USER:
			return payload
		
		default:
			return state
	}
}
