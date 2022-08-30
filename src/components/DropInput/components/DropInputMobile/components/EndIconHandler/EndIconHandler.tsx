import React from 'react'
import { Box } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import CloudDoneIcon from '@mui/icons-material/CloudDone'

export type EndIconHandlerProps = {
  isCompleted: boolean,
  hasFile: boolean
}

export const EndIconHandler: React.FC<EndIconHandlerProps> = ({ isCompleted, hasFile }) => {

  return (
    <Box sx={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', paddingRight: 1, paddingLeft: 1 }}>
      {
        isCompleted && !hasFile ? 
          <DeleteIcon />
          : <CloudDoneIcon />
      }
    </Box>
  )
}
