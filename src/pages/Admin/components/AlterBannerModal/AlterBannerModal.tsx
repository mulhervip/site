import { useSnackbar } from 'notistack'
import { useForm } from 'react-hook-form'
import { Close } from '@mui/icons-material'
import { useIsMobile } from '../../../../hooks'
import { ModalProps } from '../../../../types/util'
import { useMemo, useEffect, useState } from 'react'
import { Drawer, Stack, Typography } from '@mui/material'
import { HfField, SelectInput, Button, DropInput } from '../../../../components'
import { getStorage, listAll, ref as storageRef, uploadBytes, deleteObject, StorageReference } from 'firebase/storage'

type InsertBannerImageFormValue = {
  image: File | null
}

type DeleteBannerImageFormValue = {
  bannerImageInput?: any
}

interface BannerImages {
  name: string,
  imageRef: any
}

export const AlterBannerModal: React.FC<ModalProps> = ({ isOpen, closeModal }) => {
  const isMobile = useIsMobile()
  const storage = getStorage()
  const { enqueueSnackbar } = useSnackbar()
  const [bannerImages, setBannerImages] = useState<BannerImages[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isAddImageLoading, setIsAddImageLoading] = useState<boolean>(false)

  const { control, handleSubmit, watch } = useForm<InsertBannerImageFormValue>()
  const { control: DeleteControl, watch: deleteWatch } = useForm<DeleteBannerImageFormValue>()

  const selectedItemWatch = deleteWatch('bannerImageInput')
  const selectedImage = watch('image')

  const addBannerImage = (image: File) => {
    const imageRef = storageRef(storage, `bannerImages/${image.name.trim()}`)

    uploadBytes(imageRef, image)
      .then(() => {
        setIsAddImageLoading(false)
        enqueueSnackbar('Imagem adicionada com sucesso', {
          variant: 'success',
          autoHideDuration: 3000
        })
        window.document.location.reload()
      })
      .catch(() => enqueueSnackbar('Ops! ocorreu um problema ao enviar a imagem', {
        variant: 'error',
        autoHideDuration: 3000
      }))
    setIsAddImageLoading(false)
  }

  const onSubmitAddBannerImage = (formValues: InsertBannerImageFormValue) => {
    setIsAddImageLoading(true)
    addBannerImage(formValues.image!)
  }

  const selectedItem = useMemo(() => {
    const item: BannerImages = bannerImages.filter(item => item.imageRef === selectedItemWatch)[0]
    return item
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedItemWatch])

  const removeBannerImage = () => {
    setIsLoading(true)
    deleteObject(selectedItem.imageRef as StorageReference).then(() => {
      setIsLoading(false)
      enqueueSnackbar('Imagem removida com sucesso', {
        variant: 'success',
        autoHideDuration: 3000
      })
      window.location.reload()
      return
    }).catch(() => {
      setIsLoading(false)
      enqueueSnackbar('Erro ao remover imagem', {
        variant: 'error',
        autoHideDuration: 3000
      })
      window.location.reload()
      return
    })
  }

  useEffect(() => {
    const listRef = storageRef(storage, 'bannerImages/')
    listAll(listRef)
      .then((res) => {
        const BannerImagesTemp: BannerImages[] = []
        res.items.map(itemRef => {
          return BannerImagesTemp.push({
            name: itemRef.name,
            imageRef: itemRef
          })
        })
        setBannerImages(BannerImagesTemp)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const setBannerImagesOptions = useMemo(() => {
    return [{ value: '', label: '---' }, ...Object.entries(bannerImages).map(item => ({ value: item[1].imageRef, label: item[1].name }))]
  }, [bannerImages])

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
      <Typography variant='h2' fontWeight={500} textAlign='center'>Banner</Typography>

      <Stack >
        <form id='addBannerForm' onSubmit={handleSubmit(onSubmitAddBannerImage)}>
          <Stack py={2} sx={{ borderBottom: '1px dashed #9CADBF' }} pb={5} spacing={2}>
            <Typography typography={{ xs: 'h6', lg: 'h4' }} sx={{ color: '#9CADBF', marginRight: 2 }}>
              Escolha a imagem do Banner:
            </Typography>

            <HfField
              name='image'
              control={control}
              component={DropInput}
              label='Imagem do Banner'
              fileTypes={['image/jpeg', 'image/jpg', 'image/png']}
            />
            {!!selectedImage && (
              <Button
                type='submit'
                variant='primary'
                form='addBannerForm'
                isLoading={isAddImageLoading}
              >
                Enviar imagem
              </Button>
            )}
          </Stack>
        </form>
        <Stack spacing={2} mt={5}>
          <Typography typography={{ xs: 'h6', lg: 'h4' }} sx={{ color: '#9CADBF', marginRight: 2 }}>
            Escolha a imagem a ser removida:
          </Typography>
          <HfField
            name='bannerImageInput'
            label='Deletar Item'
            inputType='flat'
            control={DeleteControl}
            component={SelectInput}
            options={setBannerImagesOptions}
          />
          {selectedItem && (
            <Stack spacing={2}>
              <Typography sx={{ color: '#9CADBF', marginTop: 2 }}><b>Nome:</b> {selectedItem?.name}</Typography>
              <Button
                sx={{ marginTop: 3 }}
                isLoading={isLoading}
                onClick={removeBannerImage}
                disabled={!selectedItemWatch || isLoading}
              >
                Deletar
              </Button>
            </Stack>
          )}
        </Stack>
      </Stack>
    </Drawer >
  )
}
