import React from 'react'
import CheckIcon from '@mui/icons-material/Check'
import CloudDoneIcon from '@mui/icons-material/CloudDone'
import DeleteIcon from '@mui/icons-material/Delete'

export type DropInputIconProps = {
  isCompleted: boolean,
  hasFile: boolean
}

export const DropInputIcon: React.FC<DropInputIconProps> = (props) => {
  const { isCompleted, hasFile } = props

  if (isCompleted && !hasFile) {
    return <CheckIcon sx={{ color: 'success.main' }} />
  }
  if(hasFile){
    return <DeleteIcon  />
  }
  return <CloudDoneIcon color='disabled' />
}
