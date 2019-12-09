export const SET_MY_PROFILE = 'SET_MY_PROFILE'
export const SET_PROFILE = 'SET_PROFILE'

export const setIsMyProfile = payload => ({
  type: SET_MY_PROFILE,
  payload,
})
export const setProfile = payload => ({
  type: SET_PROFILE,
  payload,
})
