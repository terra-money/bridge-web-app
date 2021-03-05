import { ReactElement } from 'react'

import { Text } from 'components'

const FormLabel = ({ title }: { title: string }): ReactElement => {
  return <Text style={{ marginBottom: 4, fontSize: 12 }}>{title}</Text>
}

export default FormLabel
