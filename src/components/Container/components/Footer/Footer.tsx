/* eslint-disable react/jsx-no-target-blank */
import {
  Box,
  Link,
  Stack,
  AppBar,
  Toolbar,
  Typography,
} from '@mui/material'
import StoreIcon from '@mui/icons-material/Store'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import InstagramIcon from '@mui/icons-material/Instagram'

interface ImageWithLinkProps {
  url: string,
  desc?: string,
  icon?: JSX.Element,
}

export const Footer: React.FC = () => {

  const ImageWithLink: React.FC<ImageWithLinkProps> = ({ url, icon, desc }) => (
    <Box
      mx={2}
      href={url}
      display='flex'
      target='_blank'
      component={Link}
      alignItems='center'
      color='rgba(0,0,0,.6)'
      sx={{ textDecoration: 'none' }}
    >
      {icon}
      {desc && <Typography sx={{ fontWeight: 600 }}>{desc}</Typography>}
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
        backgroundColor: 'transparent',
      }}
    >
      <Toolbar
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Stack flexDirection='row' alignItems='center'>
          <ImageWithLink url='https://wa.me/5522999737269' icon={<WhatsAppIcon />} />
          <ImageWithLink url='https://www.instagram.com/mulhervipcamposrj/' icon={<InstagramIcon />} />
          <ImageWithLink
            icon={<StoreIcon />}
            url='https://www.google.com.br/maps/place/R.+Jo%C3%A3o+Pessoa,+157+-+Centro,+Campos+dos+Goytacazes+-+RJ,+25620-190/@-21.7583249,-41.3260637,17z/data=!3m1!4b1!4m5!3m4!1s0xbdd44c78a46989:0x4661e2bd53e818e5!8m2!3d-21.7583299!4d-41.323875'
          />
          <ImageWithLink
            icon={<StoreIcon />}
            url='https://www.google.com.br/maps/place/Rua+Bar%C3%A3o+do+Amazonas,+116+-+Centro,+Campos+dos+Goytacazes+-+RJ,+28010-030/@-21.7573029,-41.3273847,17z/data=!3m1!4b1!4m5!3m4!1s0xbdd44c11cfe143:0x91ce49fbcd587e03!8m2!3d-21.7573079!4d-41.325196'
          />
        </Stack>
      </Toolbar>
      <Stack direction='row' alignItems='center' justifyContent='center'
        sx={{
          height: '15px',
          width: '100vw',
          backgroundColor: '#a9cf46',
        }}>
        <Typography
          color='#000'
          component={Link}
          sx={{ opacity: .5, fontSize: '.7rem', display: 'flex', alignItems: 'center', textDecoration: 'none' }}
        >
          Desenvolvido por
          <Typography
            ml={.5}
            target='_blank'
            component={Link}
            sx={{
              color: 'black',
              fontSize: '.7rem',
              fontWeight: 'bold',
              textDecoration: 'none'
            }}
            href='https://www.aureaej.com/'
          >
            © Aurea Soluções e Projetos
          </Typography>
        </Typography>
      </Stack>
    </AppBar>
  )
}
