import 'firebase/auth'
import 'firebase/database'
import * as yup from 'yup'
import { useState } from 'react'
import { useSnackbar } from 'notistack'
import { useForm } from 'react-hook-form'
import { useHistory } from 'react-router'
import { User } from '../../../../types/user'
import { useIsMobile } from '../../../../hooks'
import { app } from '../../../../FIREBASECONFIG.js'
import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Stack, Typography } from '@mui/material'
import { getDatabase, ref, onValue } from 'firebase/database'
import { useUserStore } from '../../../../store/user/reducer'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { useAccountStore } from '../../../../store/account/reducer'
import { Container, HfField, TextInput, PasswordInput, Button } from '../../../../components'

interface SignInformValues {
  email: string
  password: string
}

export const SignIn: React.FC = () => {
  const auth = getAuth()
  const db = getDatabase(app)
  const history = useHistory()
  const isMobile = useIsMobile()
  const { enqueueSnackbar } = useSnackbar()
  const [isLoading, setIsLoading] = useState(false)
  const { operations: { updateUser } } = useUserStore()
  const { operations: { updateAccount } } = useAccountStore()


  const onSubmit = (formValues: SignInformValues) => {
    setIsLoading(true)
    signInWithEmailAndPassword(auth, formValues.email, formValues.password)
      .then((userCredential) => {
        const user = userCredential.user as unknown as User
        updateUser(user)
        getUserInfos(user)
        setIsLoading(false)
      })
      .catch((error) => {
        setIsLoading(false)
        return enqueueSnackbar(error.message, {
          variant: 'error',
          autoHideDuration: 6000
        })
      })
  }

  const getUserInfos = (user: User) => {
    const userInfosRef = ref(db, 'userInfos/' + user.uid)
    onValue(userInfosRef, (snapshot) => {
      const data = snapshot.val()
      // var account = Object.keys(data).map((key: any) => data[key])
      if (data) {
        updateAccount(data)
        return history.push('account')
      }
      return enqueueSnackbar('Ops! ocorreu um erro ao tentar buscar suas informações', {
        variant: 'error',
        autoHideDuration: 3000
      })
    })
  }

  const validationSchema: yup.SchemaOf<SignInformValues> = yup.object().shape({
    email: yup.string().required('Campo obrigatório'),
    password: yup.string().required('Campo obrigatório'),
  })

  const { control, handleSubmit, formState: { errors } } = useForm<SignInformValues>({
    resolver: yupResolver(validationSchema)
  })

  return (
    <Box>
      <Container>
        <form style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }} onSubmit={handleSubmit(onSubmit)}>
          <Stack justifyContent='center' alignItems='center' sx={{ height: '60%', width: '100%' }}>
            <Typography sx={{ textAlign: 'center' }} variant='h4'>LOGIN</Typography>
            <HfField
              name='email'
              type='email'
              inputType='flat'
              control={control}
              label='Seu e-mail'
              component={TextInput}
              errorMessage={errors.email?.message}
              sx={{ width: isMobile ? '80vw' : '40vw', marginBottom: 2 }}
            />
            <HfField
              label='Senha'
              name='password'
              inputType='flat'
              control={control}
              component={PasswordInput}
              errorMessage={errors.password?.message}
              sx={{ width: isMobile ? '80vw' : '40vw' }}
            />
            <Stack mt={3} spacing={2} direction={isMobile ? 'column-reverse' : 'row'}>
              <Button onClick={() => history.push('/signUp')}>
                Cadastrar
              </Button>
              <Button
                type='submit'
                variant='primary'
                disabled={isLoading}
                isLoading={isLoading}
              >Entrar</Button>
            </Stack>
          </Stack>
        </form>
      </Container>
    </Box>
  )
}
