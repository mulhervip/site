import { SectionMenu } from '../'
import { useHistory } from 'react-router'
import FeedIcon from '@mui/icons-material/Feed'
import { AccountCircle, ShoppingCart } from '@mui/icons-material'
import Logo from '../../../../../../assets/images/logoMulherVip.png'
import { Link, Stack, AppBar, Avatar, Toolbar, } from '@mui/material'
import { useAccountStore } from '../../../../../../store/account/reducer'
import { Categories, CategoriesTitle } from '../../../../../../types/categories'

export const DesktopHeader: React.FC = () => {
  const history = useHistory()
  const { storeState: { account } } = useAccountStore()

  return (
    <AppBar
      position='sticky'
      sx={{
        zIndex: 200,
        paddingY: 1,
        backgroundColor: '#FFF',
        boxShadow: '0px 5px 3px rgba(0,0,0,.1)'
      }}
    >
      <Toolbar
        sx={{
          height: 70,
          display: 'flex',
          color: 'rgba(0,0,0,.6)',
          justifyContent: 'space-between',
        }}
      >
        <Link
          href='/'
          sx={{
            height: '100%',
            borderRadius: 2,
            bgcolor: 'rgba(169, 207, 70,1)',
          }}
        >
          <Avatar
            src={Logo}
            variant='square'
            alt='Logo mulher vip'
            sx={{ height: '80%', width: '100%' }}
            imgProps={{ style: { objectFit: 'contain' } }}
          />
        </Link>
        <Stack direction='row' justifyContent='space-between' sx={{ width: '55%' }}>
          <SectionMenu category={Categories.CLOTHES} title={CategoriesTitle[Categories.CLOTHES]} />
          <SectionMenu category={Categories.ACCESSORIES} title={CategoriesTitle[Categories.ACCESSORIES]} />
          <SectionMenu category={Categories.FOOTWEAR} title={CategoriesTitle[Categories.FOOTWEAR]} />
          <SectionMenu category={Categories.KIDS} title={CategoriesTitle[Categories.KIDS]} />
          <SectionMenu category={Categories.PLUS_SIZE} title={CategoriesTitle[Categories.PLUS_SIZE]} />
        </Stack>
        <Stack
          px={1}
          spacing={2}
          // color='#FFF'
          height='100%'
          direction='row'
          borderRadius={2}
          // bgcolor='rgba(169, 207, 70, 1)'
        >
          <Stack
            direction='row'
            alignItems='center'
            sx={{ cursor: 'pointer' }}
            onClick={() => {
              account && account.isAdmin ?
                history.push('/admin') :
                history.push('/account')
            }}
          >
            <AccountCircle />
            {account && account.isAdmin ? 'Admin' : 'Conta'}
          </Stack>
          <Stack
            direction='row'
            alignItems='center'
            sx={{ cursor: 'pointer' }}
            onClick={() => history.push('/cart')}
          >
            <ShoppingCart />
            Carrinho
          </Stack>
          <Stack
            direction='row'
            alignItems='center'
            sx={{ cursor: 'pointer' }}
            onClick={() => history.push('/purchase')}
          >
            <FeedIcon />
            Compras
          </Stack>
        </Stack>
      </Toolbar>
    </AppBar>
  )
}
