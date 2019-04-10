import { NavigationActions } from 'react-navigation'

let _navigator

function setTopLevelNavigator(navigatorRef) {
	_navigator = navigatorRef
}

/**
 * Navigate to any screen
 * @param routeName {string}
 * @param params {Object}
 */
function navigate(routeName, params) {
	_navigator.dispatch(
		NavigationActions.navigate({
			routeName,
			params
		})
	)
}

/**
 * navigate on Login screen
 */
function logoutNavigation() {
	_navigator.dispatch(
		NavigationActions.navigate({
			routeName : 'Login',
		})
	)
}
// add other navigation functions that you need and export them

export default {
	navigate,
	logoutNavigation,
	setTopLevelNavigator
}
