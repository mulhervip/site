import * as yup from 'yup'
import { useState } from 'react'
import { useSnackbar } from 'notistack'
import { useForm } from 'react-hook-form'
import { Close } from '@mui/icons-material'
import { useIsMobile } from '../../../../hooks'
import { Item, Size } from '../../../../types/item'
import { ModalProps } from '../../../../types/util'
import { yupResolver } from '@hookform/resolvers/yup'
import { getDatabase, ref, set, child, push } from 'firebase/database'
import { categoryOptions, codeOptions } from '../../../../utils/options'
import { Drawer, Stack, Typography, FormGroup, FormControl } from '@mui/material'
import { uploadBytes, ref as storageRef, getStorage, getDownloadURL } from 'firebase/storage'
import { HfField, TextInput, SelectInput, CheckBox, Button, DropInput } from '../../../../components'

type SizeOptions = {
  sizeP?: boolean
  sizeM?: boolean
  sizeG?: boolean
  sizePS?: boolean
  sizeTU?: boolean
}

type InsertItemFormValues = Partial<Omit<Item, 'imageUrl'>> & SizeOptions & { image: File | null }

export const InsertItemModal: React.FC<ModalProps> = ({ isOpen, closeModal }) => {
  const db = getDatabase()
  const storage = getStorage()
  const isMobile = useIsMobile()
  const { enqueueSnackbar } = useSnackbar()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [newProductImageUrl, setProductImageUrl] = useState<string>()
  const isAvailableOptions = [{ value: 1, label: 'Disponível' }, { value: 2, label: 'Indisponível' }]

  const DEFAULT_FORM_VALUES: InsertItemFormValues = {
    category: 'CLOTHES',
    code: 'BLUSA',
    description: '',
    name: '',
    price: '',
    isAvailable: 1,
    image: null
  }

  const validationSchema: yup.SchemaOf<InsertItemFormValues> = yup.object().shape({
    category: yup.mixed().required('Campo obrigatório'),
    image: yup.mixed()
      .test(
        'haveDocument',
        'Campo obrigatório',
        (document) => document
      ).required('Campo obrigatório'),
    code: yup.mixed().required('Campo obrigatório'),
    description: yup.string().required('Campo obrigatório'),
    name: yup.string().required('Campo obrigatório'),
    price: yup.number().required('Campo obrigatório'),
    id: yup.string(),
    arraySize: yup.mixed(),
    isAvailable: yup.mixed().required('Campo obrigatório'),
    sizeP: yup.boolean(),
    sizeM: yup.boolean(),
    sizeG: yup.boolean(),
    sizePS: yup.boolean(),
    sizeTU: yup.boolean(),
  })

  const { control, handleSubmit, watch, formState: { errors } } = useForm<InsertItemFormValues>({
    defaultValues: DEFAULT_FORM_VALUES,
    resolver: yupResolver(validationSchema)
  })

  const sizeP = watch('sizeP')
  const sizeM = watch('sizeM')
  const sizeG = watch('sizeG')
  const sizePS = watch('sizePS')
  const sizeTU = watch('sizeTU')

  const onSubmit = (formValues: InsertItemFormValues) => {

    const arraySize = [!!sizeP, !!sizeM, !!sizeG, !!sizePS, !!sizeTU]

    if (!arraySize.find(item => item === true)) {
      return enqueueSnackbar('É necessário informar as opções de tamanho', {
        variant: 'error',
        autoHideDuration: 3000
      })
    }

    setIsLoading(true)

    generateImageUrl(formValues.image)
      .then(() => {
        const key = push(child(ref(db), 'products')).key

        set(ref(db, 'products/' + key), { ...formValues, id: key, arraySize, imageUrl: newProductImageUrl })
          .then(() => {
            window.document.location.reload()
            return enqueueSnackbar('Item inserido com sucesso', {
              variant: 'success',
              autoHideDuration: 3000
            })
          })
          .catch(() => {
            setIsLoading(false)
            return enqueueSnackbar('Ops, ocorreu um problema ao inserir item', {
              variant: 'error',
              autoHideDuration: 3000
            })
          })
      })

    setIsLoading(false)
  }

  const generateImageUrl = async (image: any) => {
    const imageRef = storageRef(storage, `productsImages/${image.name.trim()}`)

    uploadBytes(imageRef, image)
      .then(() => getDownloadURL(storageRef(imageRef))
        .then((downloadURL) => setProductImageUrl(downloadURL))
        .catch(() => enqueueSnackbar('Ops, ocorreu um problema ao inserir item', {
          variant: 'error',
          autoHideDuration: 3000
        }))
      )
  }

  return (
    <Drawer
      variant='temporary'
      anchor='bottom'
      open={isOpen}
      PaperProps={{
        sx: {
          paddingY: 2,
          height: '90vh',
          maxHeight: '90vh',
          paddingX: isMobile ? 1 : 4,
          borderTopLeftRadius: '20px',
          borderTopRightRadius: '20px',
        }
      }}
    >
      <Stack alignItems='flex-end'>
        <Close sx={{ cursor: 'pointer', marginX: 1 }} onClick={closeModal} />
      </Stack>
      <Typography variant='h2' fontWeight={500} textAlign='center' >Inserir item</Typography>

      <Stack>
        <form id='insertItemForm' onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2}>
            <HfField
              name='name'
              label='Nome'
              inputType='flat'
              control={control}
              component={TextInput}
              errorMessage={errors.name?.message}
            />
            <HfField
              inputType='flat'
              control={control}
              label='Descrição'
              name='description'
              component={TextInput}
              errorMessage={errors.description?.message}
            />
            <HfField
              name='price'
              label='Preço'
              inputType='flat'
              control={control}
              component={TextInput}
              errorMessage={errors.price?.message}
            />
            <HfField
              name='category'
              inputType='flat'
              control={control}
              label='Categoria'
              options={categoryOptions}
              component={SelectInput}
              errorMessage={errors.category?.message}
            />
            <HfField
              name='code'
              inputType='flat'
              control={control}
              options={codeOptions}
              label='Código'
              component={SelectInput}
              errorMessage={errors.code?.message}
            />
            <HfField
              sx={{ mb: 3 }}
              inputType='flat'
              control={control}
              name='isAvailable'
              label='Disponibilidade'
              component={SelectInput}
              options={isAvailableOptions}
              errorMessage={errors.isAvailable?.message as string}
            />
            <Stack py={2} sx={{ borderTop: '1px dashed #9CADBF' }} spacing={2} mt={5} mb={5}>
              <Typography typography={{ xs: 'h6', lg: 'h4' }} sx={{ color: '#9CADBF', marginRight: 2 }}>Escolha a imagem do produto: </Typography>

              <HfField
                name='image'
                control={control}
                component={DropInput}
                label='Imagem do produto'
                errorMessage={errors.image?.message}
                fileTypes={['image/jpeg', 'image/jpg', 'image/png']}
              />
            </Stack>
            <Stack py={2} sx={{ borderTop: '1px dashed #9CADBF' }}>
              <Typography mb={2} typography={{ xs: 'h6', lg: 'h4' }} sx={{ color: '#9CADBF' }}>Tamanhos disponíveis: </Typography>
              <FormControl>
                <FormGroup sx={{ display: 'flex' }} row>
                  <HfField
                    name='sizeP'
                    label={Size.P}
                    checked={sizeP}
                    control={control}
                    color='secondary'
                    component={CheckBox}
                  />
                  <HfField
                    name='sizeM'
                    label={Size.M}
                    checked={sizeM}
                    control={control}
                    color='secondary'
                    component={CheckBox}
                  />
                  <HfField
                    component={CheckBox}
                    control={control}
                    checked={sizeG}
                    name='sizeG'
                    label={Size.G}
                    color='secondary'
                  />
                  <HfField
                    component={CheckBox}
                    control={control}
                    checked={sizePS}
                    name='sizePS'
                    label={Size.PS}
                    color='secondary'
                  />
                  <HfField
                    component={CheckBox}
                    control={control}
                    checked={sizeTU}
                    name='sizeTU'
                    label={Size.TU}
                    color='secondary'
                  />
                </FormGroup>
              </FormControl>
            </Stack>
            <Button
              type='submit'
              variant='primary'
              isLoading={isLoading}
              form='insertItemForm'
              sx={{ marginTop: 5 }}
            >
              Inserir
            </Button>
          </Stack>
        </form>
      </Stack>
    </Drawer>
  )
}
