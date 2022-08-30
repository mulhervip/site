import React from 'react'
import prettyBytes from 'pretty-bytes'
import { Typography } from '@mui/material'
import { useIsMobile } from '../../../../../../hooks'
import { FileType } from '../../../../DropInput'

const generateFileTypeLabel = (fileTypes: FileType[]) => {
  const typeLabel = fileTypes.reduce((acc, fileType, index) => {
    const formatedFileType = fileType.split('/')[1].toUpperCase()
    if (index === 0) {
      return `${formatedFileType}`
    }
    if (index !== fileTypes.length - 1) {
      return `${acc}, ${formatedFileType}`
    }
    return `${acc} ou ${formatedFileType}`

  }, '')

  return `(somente ${typeLabel})`
}

export type InfoTextProps = {
  file?: File,
  completedAt?: Date,
  fileTypes: FileType[]
}

export const InfoText: React.FC<InfoTextProps> = (props) => {
  const { file, completedAt, fileTypes } = props
  const isMobile = useIsMobile()

  if (!file && !!completedAt) {
    return (
      <Typography sx={{ display: 'flex' }}>
        Salvo • <Typography ml={1} sx={{ color: 'primary.main' }}>Enviar novamente</Typography>
      </Typography>
    )
  }

  if (file) {
    return <Typography>{file.name.length < 15 ? file.name : `${file.name.substr(0, 10)}...${file.name.substr(-3)}`} - {prettyBytes(file.size)}</Typography>
  }

  return (
    <Typography sx={{ display: isMobile ? 'none' : 'block' }} >
      Arraste e solte ou <Typography sx={{ color: 'secondary.main', display: 'inline', fontWeight: 'bold' }}>selecione o arquivo</Typography> {generateFileTypeLabel(fileTypes)}
    </Typography>
  )
}
