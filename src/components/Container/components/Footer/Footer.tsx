/* eslint-disable react/jsx-no-target-blank */
import {
  AppBar,
  Avatar,
  Box,
  Divider,
  Link,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material'
import MapPin from '../../../../assets/images/pin.png'
import Whatsapp from '../../../../assets/images/whatsapp.svg'
import Instagram from '../../../../assets/images/instagram.svg'
import LogoMulherVip from '../../../../assets/images/logoMulherVip.png'

interface ImageWithLinkProps {
  url: string,
  path?: string,
  desc?: string,
  invertColor?: boolean
}

export const Footer: React.FC = () => {

  const ImageWithLink: React.FC<ImageWithLinkProps> = ({ url, invertColor, path, desc }) => (
    <Box
      mx={2}
      color='#FFF'
      display='flex'
      target='_blank'
      component={Link}
      alignItems='center'
      sx={{ textDecoration: 'none' }}
      href={url}
    >
      {path && (
        <Avatar
          src={path}
          variant='square'
          alt='Logo mulher vip'
          sx={{ height: 'auto', width: '30px', marginRight: 1 }}
          imgProps={{ style: { objectFit: 'contain', filter: invertColor ? 'invert(100%)' : 'none' } }}
        />
      )}
      {desc && <Typography>{desc}</Typography>}
    </Box>
  )

  return (
    <AppBar
      position='relative'
      elevation={2}
      sx={{
        bottom: 0,
        zIndex: 200,
        marginTop: 10,
        backgroundColor: '#a9cf46',
      }}
    >
      <Stack sx={{
        marginY: 1.5,
        height: '15px',
        width: '100vw',
        backgroundColor: 'white',
      }}></Stack>
      <Toolbar
        sx={{
          display: 'flex',
          marginBottom: 2,
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <Stack
          mb={2}
          width='150px'
          height='150px'
          marginRight={2}
          bgcolor='#86a82d'
          borderRadius='50%'
          alignItems='center'
          justifyContent='center'
          boxShadow='0px 0px 10px rgba(0, 0, 0, 0.1)'
        >
          <Avatar
            src={LogoMulherVip}
            variant='square'
            alt='Logo mulher vip'
            sx={{ height: 'auto', width: '150px' }}
            imgProps={{ style: { objectFit: 'contain' } }}
          />
        </Stack>
        <Stack flexDirection='row' alignItems='center'>
          <ImageWithLink url='https://wa.me/5522999737269' path={Whatsapp} />
          <ImageWithLink url='https://www.instagram.com/mulhervipcamposrj/' path={Instagram} />
          <ImageWithLink
            invertColor
            desc='Loja 1'
            url='https://www.google.com.br/maps/place/R.+Jo%C3%A3o+Pessoa,+157+-+Centro,+Campos+dos+Goytacazes+-+RJ,+25620-190/@-21.7583249,-41.3260637,17z/data=!3m1!4b1!4m5!3m4!1s0xbdd44c78a46989:0x4661e2bd53e818e5!8m2!3d-21.7583299!4d-41.323875'
          />
          <ImageWithLink
            invertColor
            desc='Loja 2'
            url='https://www.google.com.br/maps/place/Rua+Bar%C3%A3o+do+Amazonas,+116+-+Centro,+Campos+dos+Goytacazes+-+RJ,+28010-030/@-21.7573029,-41.3273847,17z/data=!3m1!4b1!4m5!3m4!1s0xbdd44c11cfe143:0x91ce49fbcd587e03!8m2!3d-21.7573079!4d-41.325196'
          />
        </Stack>
      </Toolbar>
      <Stack direction='row' alignItems='center' justifyContent='center'
        sx={{
          marginY: 1.5,
          height: '15px',
          width: '100vw',
          backgroundColor: 'white',
        }}>
        <Typography
          color='#000'
          component={Link}
          sx={{ opacity: .5, fontSize: '.7rem', display: 'flex', alignItems: 'center', textDecoration: 'none' }}
        >Desenvolvido por <Typography ml={.5} sx={{ fontSize: '.7rem' }} color='#55008f'> ©Aurea Soluções e Projetos</Typography></Typography>
      </Stack>
    </AppBar>
  )
}
