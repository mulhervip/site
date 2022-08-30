import React, { useCallback, useMemo } from 'react'
import { useIsMobile } from '../../hooks'
import { Accept, useDropzone } from 'react-dropzone'
import { DropInputDesktop, DropInputMobile } from './components'

export type FileType = 'application/pdf' | 'image/jpeg' | 'image/jpg' | 'image/png' | 'application/json'

export type DropInputProps = {
  onChange?: (event: { target: { name: string; value: File } }) => void,
  name: string
  value?: File
  label?: string
  tooltip?: string
  completedAt?: Date
  onBlur?: () => void
  maxSizeBytes?: number
  fileTypes: FileType[]
  errorMessage?: string | null
  onlyShowLabelOnCompleted?: boolean
}

export const DropInput: React.FC<DropInputProps> = (props) => {
  const { 
    label,
    name,
    value,
    onBlur,
    tooltip,
    onChange,
    fileTypes,
    completedAt,
    errorMessage,
    onlyShowLabelOnCompleted,
    maxSizeBytes = 20000000, 
  } = props
  const isMobile = useIsMobile()
  const onFileDrop = useCallback((file: File[]) => {
    if (onChange) {
      onChange({
        target: {
          name,
          value: file[0]
        }
      })
    }
  }, [name, onChange])

  const { getRootProps, getInputProps, isDragAccept, isDragReject } = useDropzone({
    accept: fileTypes as unknown as Accept,
    onDropAccepted: onFileDrop,
    maxSize: maxSizeBytes
  })

  const isCompleted = useMemo(() => Boolean(completedAt), [completedAt])

  const hasFile = Boolean(value)

  const borderColor = useMemo(() => {
    if (isDragAccept) {
      return 'success.main'
    }
    if (isDragReject || errorMessage) {
      return 'error.main'
    }
    if (isCompleted && !hasFile) {
      return 'success.light'
    }
    return undefined
  }, [isDragAccept, isDragReject, isCompleted, hasFile, errorMessage])

  return isMobile ? (
    <DropInputMobile 
      name={name}
      value={value}
      label={label}
      onBlur={onBlur}
      hasFile={hasFile}
      tooltip={tooltip}
      isCompleted={isCompleted}
      borderColor={borderColor}
      completedAt={completedAt}
      errorMessage={errorMessage}
      getRootProps={getRootProps}
      getInputProps={getInputProps}
    />
  ) 
    : (
      <DropInputDesktop 
        name={name}
        value={value}
        label={label}
        onBlur={onBlur}
        hasFile={hasFile}
        tooltip={tooltip}
        fileTypes={fileTypes} 
        isCompleted={isCompleted}
        borderColor={borderColor}
        completedAt={completedAt}
        getRootProps={getRootProps}
        errorMessage={errorMessage}
        getInputProps={getInputProps}
        onlyShowLabelOnCompleted={onlyShowLabelOnCompleted}
      />
    )
}
