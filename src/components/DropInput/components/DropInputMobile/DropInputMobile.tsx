import React, { useRef } from 'react'
import { Box, Typography, alpha } from '@mui/material'
import { DropzoneRootProps, DropzoneInputProps } from 'react-dropzone'
import { FileIcon, InputNameHandler, EndIconHandler } from './components'

interface DropInputMobileProps {
  onBlur?: () => void,
  isCompleted: boolean
  hasFile: boolean
  borderColor?: 'error.main' | 'success.main' | 'success.light' 
  errorMessage?: string | null
  getRootProps: <T extends DropzoneRootProps>(props?: T) => T
  getInputProps: <T extends DropzoneInputProps>(props?: T) => T
  tooltip?: string
  name: string
  label?: string
  value?: File
  completedAt?: Date
}

export const DropInputMobile: React.FC<DropInputMobileProps> = (props) => {
  const iconFileHeight = useRef<HTMLDivElement | null>(null)
  const { getInputProps, getRootProps, hasFile, isCompleted, borderColor, errorMessage, onBlur, label, tooltip, name, value, completedAt } = props

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          border: (theme) => `2px dashed ${theme.palette.grey.A200}`,
          borderRadius: '10px',
          height: '100%',
          padding: '5px',
          backgroundColor: (theme) => isCompleted && !hasFile ? alpha(theme.palette.success.light, 0.75) : undefined,
          borderColor
        }}>
        <Box {...getRootProps()} sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center' }}>
          <input name={name} onBlur={onBlur} {...getInputProps()} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', height: '100%' }}>
            <Box sx={{ height: iconFileHeight.current?.clientHeight }}>
              <FileIcon hasFile={hasFile} isCompleted={isCompleted} />
            </Box>
            <Box ref={iconFileHeight} sx={{ flex: 1 }}>
              <InputNameHandler 
                completedAt={completedAt}
                file={value}
                label={label}
                tooltip={tooltip}
              />
            </Box>
            {!hasFile && !label && <Typography>Enviar arquivo</Typography>}
            <EndIconHandler hasFile={hasFile} isCompleted={isCompleted} />
          </Box>
        </Box>
      </Box>
      {(errorMessage && !isCompleted) && (
        <Typography
          sx={{ color: 'error.main' }}>
          {errorMessage}
        </Typography>
      )}
    </Box>
  )
}
