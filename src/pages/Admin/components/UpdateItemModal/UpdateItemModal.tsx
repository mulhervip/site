import { useMemo, useEffect, useState } from 'react'
import * as yup from 'yup'
import { useSnackbar } from 'notistack'
import { useForm } from 'react-hook-form'
import { Close } from '@mui/icons-material'
import { Size } from '../../../../types/item'
import { Item } from '../../../../types/item'
import { useIsMobile } from '../../../../hooks'
import { ModalProps } from '../../../../types/util'
import { yupResolver } from '@hookform/resolvers/yup'
import { getDatabase, ref, update } from 'firebase/database'
import { getProducts } from '../../../../hooks/useGetProducts'
import { useItemsStore } from '../../../../store/items/reducer'
import { categoryOptions, codeOptions } from '../../../../utils/options'
import { Drawer, Stack, Typography, FormControl, FormGroup } from '@mui/material'
import { uploadBytes, ref as storageRef, getStorage, getDownloadURL } from 'firebase/storage'
import { HfField, TextInput, SelectInput, Button, CheckBox, DropInput } from '../../../../components'


type SizeOptions = {
  sizeP?: boolean
  sizeM?: boolean
  sizeG?: boolean
  sizePS?: boolean
  sizeTU?: boolean
}

type InsertItemFormValues = Partial<Item> & SizeOptions & {
  item?: any
} & { image?: File | null }

export const UpdateItemModal: React.FC<ModalProps> = ({ isOpen, closeModal }) => {
  const db = getDatabase()
  const storage = getStorage()
  const isMobile = useIsMobile()
  const { enqueueSnackbar } = useSnackbar()
  const [isUpdating, setIsUpdating] = useState<boolean>(false)
  const { storeState: { items }, operations: { updateItems } } = useItemsStore()
  const isAvailableOptions = [{ value: 0, label: '---' }, { value: 1, label: 'Disponível' }, { value: 2, label: 'Indisponível' }]

  const ItemsOptions = useMemo(() => {
    return [{ value: '', label: '---' }, ...Object.entries(items).map(item => ({ value: item[1].id, label: item[1].name }))]
  }, [items])

  const validationSchema: yup.SchemaOf<InsertItemFormValues> = yup.object().shape({
    category: yup.mixed().required('Campo obrigatório'),
    code: yup.mixed().required('Campo obrigatório'),
    description: yup.string(),
    imageUrl: yup.string(),
    name: yup.string(),
    price: yup.number(),
    id: yup.string(),
    arraySize: yup.mixed(),
    isAvailable: yup.mixed()
      .test('', 'Opção inválida', (item) => item > 0),
    image: yup.mixed(),
    // .test(
    //   'haveDocument',
    //   'Campo obrigatório',
    //   (document) => document || 
    // ),
    item: yup.mixed(),
    sizeP: yup.boolean(),
    sizeM: yup.boolean(),
    sizeG: yup.boolean(),
    sizePS: yup.boolean(),
    sizeTU: yup.boolean(),
  })

  const { control, handleSubmit, watch, formState: { errors }, setValue } = useForm<InsertItemFormValues>({
    resolver: yupResolver(validationSchema)
  })

  const selectedItemWatch = watch('item')
  const sizeP = watch('sizeP')
  const sizeM = watch('sizeM')
  const sizeG = watch('sizeG')
  const sizePS = watch('sizePS')
  const sizeTU = watch('sizeTU')

  const onSubmit = (form: InsertItemFormValues) => {
    setIsUpdating(true)

    if (form.image) {
      generateImageUrl(form.image, form)
      return
    }
    updateProduct(selectedItem.imageUrl, form)
  }

  const updateProduct = (imageUrl: string, form: InsertItemFormValues) => {
    const arraySize = [!!sizeP, !!sizeM, !!sizeG, !!sizePS, !!sizeTU]
    update(ref(db, '/products/' + selectedItemWatch), { ...form, arraySize, imageUrl }).then(() => {
      setIsUpdating(false)
      window.document.location.reload()
      return enqueueSnackbar('Item atualizado com sucesso!', {
        variant: 'success',
        autoHideDuration: 3000
      })
    }).catch(() => {
      setIsUpdating(false)
      return enqueueSnackbar('Ops! ocorreu um erro ao tentar atualizar o item', {
        variant: 'error',
        autoHideDuration: 3000
      })
    })
  }

  const generateImageUrl = async (image: any, form: InsertItemFormValues) => {
    const imageRef = storageRef(storage, `productsImages/${image.name.trim()}`)

    uploadBytes(imageRef, image)
      .then(() => getDownloadURL(storageRef(imageRef))
        .then((downloadURL) => updateProduct(downloadURL, form))
        .catch(() => enqueueSnackbar('Ops, ocorreu um problema ao inserir item', {
          variant: 'error',
          autoHideDuration: 3000
        }))
      )
  }

  const selectedItem = useMemo(() => {
    const item: Item = items.filter(item => item.id === selectedItemWatch)[0]
    return item
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedItemWatch])

  useEffect(() => {
    if (selectedItem) {
      setValue('name', selectedItem.name)
      setValue('description', selectedItem.description)
      setValue('price', selectedItem.price)
      setValue('category', selectedItem.category)
      setValue('code', selectedItem.code)
      setValue('sizeP', selectedItem.arraySize[0])
      setValue('sizeM', selectedItem.arraySize[1])
      setValue('sizeG', selectedItem.arraySize[2])
      setValue('sizePS', selectedItem.arraySize[3])
      setValue('sizeTU', selectedItem.arraySize[4])
      setValue('isAvailable', selectedItem.isAvailable)
    }
  }, [selectedItem, setValue])

  useEffect(() => {
    if (items.length === 0) {
      getProducts(updateItems)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
      <Typography variant='h2' fontWeight={500} textAlign='center'>Atualizar item</Typography>

      <Stack>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2}>
            <HfField
              name='item'
              label='Selecionar item'
              inputType='flat'
              control={control}
              options={ItemsOptions}
              component={SelectInput}
            />
            <HfField
              name='name'
              label='Nome'
              inputType='flat'
              control={control}
              component={TextInput}
              errorMessage={errors.name?.message}
            />
            <HfField
              name='description'
              inputType='flat'
              control={control}
              label='Descrição'
              component={TextInput}
              errorMessage={errors.description?.message}
            />
            <HfField
              name='price'
              inputType='flat'
              control={control}
              label='Preço'
              component={TextInput}
              errorMessage={errors.price?.message}
            />
            <HfField
              name='category'
              inputType='flat'
              control={control}
              label='Categoria'
              component={SelectInput}
              options={categoryOptions}
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
              name='isAvailable'
              inputType='flat'
              control={control}
              options={isAvailableOptions}
              label='Disponibilidade'
              component={SelectInput}
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
            <Stack>
              <Typography>Tamanhos disponíveis:</Typography>
              <FormControl>
                <FormGroup sx={{ display: 'flex' }} row>
                  <HfField
                    name='sizeP'
                    label={Size.P}
                    color='secondary'
                    control={control}
                    component={CheckBox}
                    checked={sizeP}
                  />
                  <HfField
                    name='sizeM'
                    label={Size.M}
                    control={control}
                    color='secondary'
                    component={CheckBox}
                    checked={sizeM}
                  />
                  <HfField
                    name='sizeG'
                    label={Size.G}
                    control={control}
                    color='secondary'
                    component={CheckBox}
                    checked={sizeG}
                  />
                  <HfField
                    name='sizePS'
                    label={Size.PS}
                    control={control}
                    color='secondary'
                    component={CheckBox}
                    checked={sizePS}
                  />
                  <HfField
                    name='sizeTU'
                    label={Size.TU}
                    color='secondary'
                    control={control}
                    component={CheckBox}
                    checked={sizeTU}
                  />
                </FormGroup>
              </FormControl>
            </Stack>
            <Button sx={{ marginTop: 5 }} variant='primary' disabled={!selectedItemWatch} isLoading={isUpdating} type='submit'>Atualizar</Button>
          </Stack>
        </form>
      </Stack>
    </Drawer>
  )
}
