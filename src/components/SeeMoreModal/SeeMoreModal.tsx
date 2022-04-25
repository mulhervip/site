import { useMemo, useState } from 'react'
import { useSnackbar } from 'notistack'
import { HfField, TextInput } from '..'
import { Size } from '../../types/item'
import { useForm } from 'react-hook-form'
import { useIsMobile } from '../../hooks'
import { Button } from '../../components'
import { useHistory } from 'react-router'
import { Close } from '@mui/icons-material'
import { CartItem, Item } from '../../types/item'
import { formatToRealStr } from '../../utils/format'
import { useAccountStore } from '../../store/account/reducer'
import { getDatabase, ref, set, child, get } from 'firebase/database'
import { Drawer, Avatar, Stack, Typography, Box,InputLabel, Grid } from '@mui/material'

export interface SeeMoreModalProps {
  item: Item
  isOpen: boolean
  onClose: () => void
}

export interface selectOptionProps {
  value: string
  label: string
}


export const SeeMoreModal: React.FC<SeeMoreModalProps> = ({ item, isOpen, onClose }) => {
  const db = getDatabase()
  const history = useHistory()
  const isMobile = useIsMobile()
  const { enqueueSnackbar } = useSnackbar()
  const [amount, setAmount] = useState<number>(1)
  const { storeState: { account } } = useAccountStore()
  const [isSelectedSize, setIsSelectedSize] = useState<number>()

  const getCartProducts = () => {
    if(account){
      const cartProductsRef = ref(db)
      get(child(cartProductsRef, 'cart/' + account.id)).then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val() as CartItem[]
          var items = Object.keys(data).map((key: any) => data[key])
          if(items.length > 0 ){
            addToCart(items)
            return
          }
        } else addToCart([])
      }).catch(() => {
        return enqueueSnackbar('Ocorreu um erro ao recuperar seus itens do carrinho', { 
          variant: 'error',
          autoHideDuration: 3000
        })
      })
      return
    }
    enqueueSnackbar('Você precisa estar logado para adicionar itens', { 
      variant: 'error',
      autoHideDuration: 3000
    })
    history.push('/signUp')
  }

  const selectedSize = useMemo(()=>{
    switch (isSelectedSize) {
      case 0:
        return Size.P
      case 1:
        return Size.M
      case 2:
        return Size.G
      case 3:
        return Size.PS
      case 4:
        return Size.TU
      default:
        return null
    }
    // switch (isSelectedSize)
  },[isSelectedSize])

  const addToCart = (items: CartItem[] | []) => {
    if(selectedSize === null) {
      return enqueueSnackbar('Você precisa escolher uma opção de tamanho', { 
        variant: 'error',
        autoHideDuration: 3000
      })
    }
    const cartItem = { ...item, amount, note, selectedSize }
    set(ref(db, 'cart/' + account!.id), items.length > 0 ? [...items, cartItem] : [cartItem])
      .then(()=>{
        onClose()
        return enqueueSnackbar('Item adicionado ao carrinho', { 
          variant: 'success',
          autoHideDuration: 3000
        })
      })
      .catch(() => {
        return enqueueSnackbar('Ops! ocorreu um erro ao realizar o cadastro', { 
          variant: 'error',
          autoHideDuration: 3000
        })
      })
  }

  const { control, watch } = useForm()

  const note = watch('note') || ''

  const decreaseAmount = () => {
    if(amount > 1)
      setAmount(amount - 1)
  }
  
  const testSizeLabel = ['P','M','G','PS','TU']

  return (
    <Drawer
      variant='temporary'
      anchor='bottom'
      open={isOpen}
      PaperProps={{ sx: {
        paddingY: 2,
        height: '90vh',
        maxHeight: '90vh',
        paddingX: isMobile ? 1 : 4,
        borderTopLeftRadius: '20px',
        borderTopRightRadius: '20px',
      } }}
    >

      <Stack alignItems='flex-end'>
        <Close sx={{ cursor: 'pointer', marginX: 1 }} onClick={onClose} />
      </Stack>

      <Stack direction={isMobile ? 'column' : 'row'} sx={{ flex: 1, height: '98%', }}>
        <Stack sx={{ flex: 1, }}>
          <Avatar
            imgProps={{ style: { objectFit: 'contain', borderRadius: '30px' } }}
            sx={{ height: '100%', width: '100%', borderRadius: '30px' }}
            variant='rounded'
            src={item.imageUrl}
          />
        </Stack>

        <Stack justifyContent='space-between' sx={{ flex: 1, height: '100%',  paddingX: 2 }}>
          <Box>
            <Typography variant={isMobile ? 'h4' : 'h3'} sx={{ textAlign: 'center' }}>{(item.name).toUpperCase()}</Typography>
            <Typography sx={{ marginTop: 5, opacity: .7, textIndent: '2em' }}>{item.description}</Typography>
          </Box>
          <Box>
            <Stack mt={isMobile ? 3 : 0} mb={3} sx={{ width: '100%' }}>
              <Typography sx={{ marginRight: 2 }}>Observações (opcional):</Typography>
              <HfField
                multiline
                name='note'
                inputType='flat'
                defaultValue=' '
                control={control}
                component={TextInput}
                sx={{ display: 'flex', flex: 1, width: '100%', marginBottom: 2 }}
                placeholder='Insira aqui alguma observação sobre o produto'
              />
            </Stack>
            <Stack direction={isMobile ? 'column' : 'row'} justifyContent='space-between'>
              <Stack spacing={1} justifyContent='space-between'>
                <InputLabel id='payment-method-label'>Selecionar Tamanho</InputLabel>
                <Grid spacing={1} container>
                  {item.arraySize && item.arraySize.map((isSizeAvailable: boolean, index: number) => {
                    return (
                      <Grid item xs={4} md={4} lg={4}>
                        <Button
                          sx={{
                            padding: 1,
                            bgcolor: index === isSelectedSize ? 'rgba(169, 207, 70, .7)' : 'initial',
                            color: index === isSelectedSize ? 'white' : 'initial',
                            '&:hover': { backgroundColor: index === isSelectedSize ? 'rgba(169, 207, 70, .7)' : 'initial', },
                          }}
                          variant='secondary'
                          disabled={!isSizeAvailable}
                          onClick={()=>setIsSelectedSize(index)}
                        >
                          <Typography>{testSizeLabel[index]}</Typography>
                        </Button>
                      </Grid>
                    )
                  })}
                </Grid>
                {/* <Select
                  id='payment-method'
                  label='Forma de pagamento'
                  value={selectedPaymentOption}
                  labelId='payment-method-label'
                  onChange={(option)=>setSelectedPaymentOption(option.target.value as unknown as selectOptionProps)}
                >
                  {selectOption.map((option, key) => <MenuItem key={key} value={option.value}>{option.label}</MenuItem>)}
                </Select> */}
              </Stack>
              <Stack justifyContent={isMobile ? 'center' : 'flex-start'} sx={{ marginTop: isMobile ? 3 : 0 }} direction='row' alignItems='center'>
                <Stack
                  alignItems='center'
                  onClick={decreaseAmount}
                  sx={{
                    width: '20px',
                    height: '20px',
                    color: 'white',
                    padding: '10px',
                    cursor: 'pointer',
                    userSelect: 'none',
                    borderRadius: '100%',
                    boxShadow: '0px 0px 10px rgba(169, 207, 70, .5)',
                    backgroundColor: 'rgba(169, 207, 70, .7)',
                  }}>
                  <b> - </b>
                </Stack>
                <Typography variant='subtitle1' sx={{ marginX: 1.5 }}>Qtd.: <b>{amount}</b></Typography>
                <Stack
                  alignItems='center'
                  onClick={()=>setAmount(amount + 1)}
                  sx={{
                    width: '20px',
                    height: '20px',
                    color: 'white',
                    padding: '10px',
                    cursor: 'pointer',
                    userSelect: 'none',
                    borderRadius: '100%',
                    boxShadow: '0px 0px 10px rgba(169, 207, 70, .5)',
                    backgroundColor: 'rgba(169, 207, 70, .7)',
                  }}>
                  <b> + </b>
                </Stack>
              </Stack>
            </Stack>
            <Stack
              direction='row'
              alignItems='center'
              justifyContent='space-between'
              sx={{
                padding: 2,
                marginTop: 5,
                borderRadius: 3,
                minHeight: '100px',
                backgroundColor: 'rgba(169, 207, 70, .7)',
                boxShadow: '0px 0px 10px rgba(169, 207, 70, .5)',
              }}
            >
              <Typography sx={{ fontSize: isMobile ? '1.2em' : '2em', whiteSpace: 'nowrap' }} variant='h4' color='white'>{formatToRealStr(Number(item.price))}</Typography>
              <Box
                sx={{
                  padding: 2,
                  borderRadius: 3,
                  color: '#a9cf46',
                  bgcolor: 'white',
                  cursor: 'pointer',
                  boxShadow: '0px 0px 5px rgba(255, 255, 255, 0.3)'
                }}
                onClick={getCartProducts}>Adicionar ao carrinho</Box>
            </Stack>
            <Typography variant='body2' color='gray'>*O pagamento é realizado no momento da entrega</Typography>
          </Box>
        </Stack>
      </Stack>
    </Drawer>
  )
}
