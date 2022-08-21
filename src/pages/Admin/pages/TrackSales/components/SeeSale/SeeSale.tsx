import { Close } from '@mui/icons-material'
import { useIsMobile } from '../../../../../../hooks'
import { ModalProps } from '../../../../../../types/util'
import { getDatabase, ref, set } from 'firebase/database'
import { Drawer, Stack, Typography } from '@mui/material'
import { PaymentMethodTitle } from '../../../../../../types/payment'
import { FullScreenItemCard, Button } from '../../../../../../components'
import { CartItem, SaleByProps, SaleStatus } from '../../../../../../types/item'

export type SeeSaleModalProps = ModalProps & SaleByProps

export const SeeSale: React.FC<SeeSaleModalProps> = ({ sale, isOpen, closeModal }) => {
  const db = getDatabase()
  const isMobile = useIsMobile()

  const finishOrder = (clientPhone: string) => {
    const alertConfirmation = window.confirm('Tem certeza que deseja FINALIZAR este pedido?')
    if (alertConfirmation) {
      set(ref(db, 'sales/' + sale.id), { ...sale, status: SaleStatus.DELIVERED })
    }
    const sendMailConfirmation = window.confirm('Deseja avisar ao cliente via Whatsapp?')
    if (alertConfirmation && sendMailConfirmation) {
      window.open(`https://api.whatsapp.com/send?phone=${clientPhone}&text=Olá! obrigado por comprar na Mulher Vip!. Viemos confirmar que seu pedido foi finalizado. Esperamos que aproveite muito! 💚`, '_blank')
    }
    closeModal()
  }

  const outForDelivery = (clientPhone: string) => {
    const alertConfirmation = window.confirm('Confirmar que o item SAIU PARA ENTREGA?')
    if (alertConfirmation) {
      set(ref(db, 'sales/' + sale.id), { ...sale, status: SaleStatus.OUT_FOR_DELIVERY })
    }
    const sendMailConfirmation = window.confirm('Deseja avisar ao cliente via Whatsapp?')
    if (alertConfirmation && sendMailConfirmation) {
      window.open(`https://api.whatsapp.com/send?phone=${clientPhone}&text=Olá! aqui é da Mulher Vip 😄. Viemos avisar que seu pedido saiu para entrega!.`, '_blank')
    }
    closeModal()
  }

  return (
    <Drawer
      anchor='bottom'
      variant='temporary'
      open={isOpen}
      PaperProps={{
        sx: {
          paddingY: 2,
          height: '90vh',
          maxHeight: '90vh',
          overflowX: 'hidden',
          paddingX: isMobile ? 1 : 4,
          borderTopLeftRadius: '20px',
          borderTopRightRadius: '20px',
        }
      }}
    >

      <Stack alignItems='flex-end'>
        <Close sx={{ cursor: 'pointer', marginX: 1 }} onClick={closeModal} />
      </Stack>

      <Typography variant='h4' mb={3} sx={{ textAlign: 'center' }}>{sale.account.name}</Typography>

      <Typography variant='h6' sx={{ color: '#9CADBF' }}><b>Telefone:</b> {sale.account.phone}</Typography>
      <Typography variant='h6' sx={{ color: '#9CADBF' }}><b>E-mail:</b> {sale.account.email}</Typography>
      <Typography variant='h6' sx={{ color: '#9CADBF' }}><b>Endereço:</b> {sale.account.address}, {sale.account.district} - {sale.account.houseNumber}</Typography>
      <Typography variant='h6' sx={{ color: '#9CADBF' }}><b>Pagamento:</b> {PaymentMethodTitle[sale.paymentMethod]}</Typography>

      <Stack mt={2} sx={{ flexWrap: 'wrap' }} direction='row' alignItems='flex-start'>
        {sale.items.map((item: CartItem, index) => (
          <FullScreenItemCard item={item} key={index} />
        ))}
      </Stack>

      <Stack
        marginY={3}
        spacing={3}
        width='100%'
        direction='row'
        alignItems='center'
        justifyContent='center'
      >
        <Button
          variant='secondary'
          onClick={() => outForDelivery(sale.account.phone)}
          disabled={sale.status !== SaleStatus.IN_PREPARATION}
        >
          Saiu para entrega
        </Button>
        <Button
          variant='primary'
          onClick={() => finishOrder(sale.account.phone)}
          disabled={sale.status === SaleStatus.DELIVERED}
        >
          Finalizar pedido
        </Button>
      </Stack>
    </Drawer>
  )
}
