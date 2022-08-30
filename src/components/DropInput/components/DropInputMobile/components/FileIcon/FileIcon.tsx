import React from 'react'
import { Box } from '@mui/material'
import DoneAllIcon from '@mui/icons-material/DoneAll'
import AttachFileIcon from '@mui/icons-material/AttachFile'

interface FileIconProps {
  hasFile: boolean
  isCompleted: boolean
}

export const FileIcon: React.FC<FileIconProps> = ({ hasFile, isCompleted }) => {

  if (isCompleted && !hasFile) {
    return <DoneAllIcon />
  }

  return (
    <Box sx={{ minWidth: 40, backgroundColor: 'grey.50', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
      <AttachFileIcon />
    </Box>
  )
}
