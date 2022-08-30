import React from 'react'
import { Box, Typography, alpha, Stack } from '@mui/material'
import { DropzoneRootProps, DropzoneInputProps } from 'react-dropzone'
import { DropInputIcon, InfoText } from './components'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import DoneAllIcon from '@mui/icons-material/DoneAll'

import { FileType } from '../../DropInput'
interface DropInputDesktopProps {
  value?: File
  name: string
  label?: string
  hasFile: boolean
  tooltip?: string
  completedAt?: Date
  onBlur?: () => void
  isCompleted: boolean
  fileTypes: FileType[]
  errorMessage?: string | null
  onlyShowLabelOnCompleted?: boolean
  getRootProps: <T extends DropzoneRootProps>(props?: T) => T
  borderColor?: 'error.main' | 'success.main' | 'success.light' 
  getInputProps: <T extends DropzoneInputProps>(props?: T) => T
}

export const DropInputDesktop: React.FC<DropInputDesktopProps> = (props) => {
  const {
    name,
    label,
    value,
    onBlur,
    hasFile,
    tooltip,
    fileTypes,
    isCompleted,
    borderColor,
    completedAt,
    errorMessage,
    getRootProps,
    getInputProps,
    onlyShowLabelOnCompleted,
  } = props
          
  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          borderRadius: '10px',
          border: (theme) => `2px dashed ${theme.palette.grey.A200}`,
          backgroundColor: (theme) => (isCompleted || hasFile) ? alpha(theme.palette.success.light, 0.75) : undefined,
          borderColor
        }}>
        <Box {...getRootProps()} sx={{ padding: 1,  cursor: 'pointer', width: '100%' }}>
          <input id={name} name={name} aria-invalid={errorMessage ? 'true' : 'false'} aria-errormessage={`drop-input-errormessage-${name}`} onBlur={onBlur} {...getInputProps()} />
          <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', }}>
            <Stack direction='row' justifyContent='start' alignItems='center'>
              <Box sx={{ backgroundColor: 'grey.50', width: 40, height: 40, borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <AttachFileIcon />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography component='label' htmlFor={name} sx={{ marginLeft: 2, whiteSpace: 'nowrap' }} variant='button'>{(!onlyShowLabelOnCompleted || hasFile) && label}</Typography>
                {tooltip && (
                  <Tooltip title={tooltip} placement='top'>
                    <IconButton color='secondary' >
                      <DoneAllIcon />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
            </Stack>
            <Stack ml={2} direction='row' justifyContent='end' alignItems='center' sx={{ maxWidth: (!onlyShowLabelOnCompleted && label) ? '50%' : '100%' }}>
              <DropInputIcon  isCompleted={isCompleted} hasFile={hasFile} />
              {(((onlyShowLabelOnCompleted || true) && !hasFile) ||!onlyShowLabelOnCompleted) && (
                <Box sx={{ marginLeft: 2 }}>
                  <InfoText
                    completedAt={completedAt}
                    file={value}
                    fileTypes={fileTypes}
                  />
                </Box>
              )}
            </Stack>
          </Box>
        </Box>
      </Box>
      {(errorMessage && !isCompleted) && (
        <Typography
          id={`drop-input-errormessage-${name}`}
          // variant='text9'
          sx={{ color: 'error.main' }}>
          {errorMessage}
        </Typography>
      )}
    </Box>
  )
}
