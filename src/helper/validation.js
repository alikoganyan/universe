export const validateEmail = (value, that) => {
  const emailReg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  if (emailReg.test(value)) {
    that.setState({ emailError: '' })
    return false
  }
  that.setState({ emailError: 'Неправильный электронная почта' })
  return true
}

export const passwordLevel = [
  {
    label: 'Слабый',
    labelColor: '#ff2900',
    activeBarColor: '#ff2900',
  },
  {
    label: 'Средний',
    labelColor: '#ff6900',
    activeBarColor: '#ff6900',
  },
  {
    label: 'Сильный',
    labelColor: '#f2cf1f',
    activeBarColor: '#f2cf1f',
  },
  {
    label: 'Очень сильный',
    labelColor: '#0af56d',
    activeBarColor: '#0af56d',
  },
]
