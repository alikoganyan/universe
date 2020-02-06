export const filterAllContacts = (val, state, props, that) => {
  const { options, allContacts, userContactsAll } = state
  const { dialogs } = props
  const { active } = options
  if (active === 0 && allContacts && allContacts.length) {
    const filtredAllContacts = allContacts.filter(
      e =>
        (e.first_name &&
          e.last_name &&
          (e.first_name.toLowerCase() + e.last_name.toLowerCase()).indexOf(
            val.replace(/\s/g, '').toLowerCase(),
          ) !== -1) ||
        (e.name &&
          e.name
            .toLowerCase()
            .replace(/\s/g, '')
            .indexOf(val.replace(/\s/g, '').toLowerCase()) !== -1) ||
        (e.phone_number &&
          e.phone_number
            .toLowerCase()
            .indexOf(val.replace(/\s/g, '').toLowerCase()) !== -1),
    )
    that.setState({ filtredAllContacts: val ? filtredAllContacts : null })
  } else if (active === 1 && userContactsAll && userContactsAll.length) {
    const filtredAllContacts = userContactsAll.filter(
      e =>
        (e.first_name &&
          e.last_name &&
          (e.first_name.toLowerCase() + e.last_name.toLowerCase()).indexOf(
            val.replace(/\s/g, '').toLowerCase(),
          ) !== -1) ||
        (e.phone_number &&
          e.phone_number
            .toLowerCase()
            .indexOf(val.replace(/\s/g, '').toLowerCase()) !== -1),
    )
    that.setState({
      filteredUserContactsAll: val ? filtredAllContacts : null,
    })
  } else if (active === 2 && dialogs && dialogs.length) {
    const filtredGroups = dialogs.filter(
      e =>
        e.isGroup &&
        e.name &&
        e.name
          .replace(/\s/g, '')
          .toLowerCase()
          .indexOf(val.replace(/\s/g, '').toLowerCase()) !== -1,
    )
    that.setState({ filteredGroups: val ? filtredGroups : null })
  }
}

export const filterWithDepartaments = (val, state, that) => {
  const { userContacts } = state
  const filteredUserContacts = userContacts.map(d => {
    if (d.data && d.data.length) {
      const filtredDep = d.data.filter(
        e =>
          (e.first_name &&
            e.last_name &&
            (e.first_name.toLowerCase() + e.last_name.toLowerCase()).indexOf(
              val.replace(/\s/g, '').toLowerCase(),
            ) !== -1) ||
          (e.name &&
            e.name
              .toLowerCase()
              .replace(/\s/g, '')
              .indexOf(val.replace(/\s/g, '').toLowerCase()) !== -1) ||
          (e.phone_number &&
            e.phone_number
              .toLowerCase()
              .indexOf(val.replace(/\s/g, '').toLowerCase()) !== -1),
      )
      return { ...d, data: [...filtredDep] }
    }
    return d
  })
  that.setState({ filteredUserContacts })
}
