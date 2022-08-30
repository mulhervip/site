import React from 'react'
import prettyBytes from 'pretty-bytes'
import { Typography, Box } from '@mui/material'

interface InputNameHandlerProps {
  file?: File,
  completedAt?: Date,
  label?: string,
  tooltip?: string
}

export const InputNameHandler: React.FC<InputNameHandlerProps> = (props) => {
  const { label, file, tooltip } = props

  if (file) {
    return (
      <Box sx={{ marginLeft: 2, display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start', wordBreak: 'break-word' }} >
        <Typography >{file.name.length < 15 ? file.name : `${file.name.substr(0, 10)}...${file.name.substr(-3)}`} - {prettyBytes(file.size)}</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, marginLeft: 2, alignItems: 'flex-start' }}>
      <Typography >{label}</Typography>
      {tooltip && (
        <Typography color='info.main' >{tooltip}</Typography>
      )}
    </Box>
  )
}
