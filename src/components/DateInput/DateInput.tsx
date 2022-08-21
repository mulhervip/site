import React from 'react'
import ptBr from 'date-fns/locale/pt-BR'
import { TextInput, TextInputProps } from '../TextInput'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers'

export interface DateInputProps extends Omit<TextInputProps, 'onChange' | 'value'> {
  value?: Date | null
  onChange?: (value: Date | null) => void
}

export const DateInput = React.forwardRef<HTMLDivElement, DateInputProps>((props, ref) => {
  const { onChange, value, ...rest } = props

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const emptyFn = () => { } // Remove this later. Reason, to fix a type error

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} locale={ptBr}>
      <DesktopDatePicker
        value={value}
        onChange={onChange || emptyFn}
        ref={ref}
        renderInput={(params: any) => {
          return (
            <TextInput
              {...params}
              {...rest}
            />
          )
        }
        }
      />
    </LocalizationProvider>
  )
})
