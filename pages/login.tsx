import {
	styled,
	Box,
	Typography,
	TypographyProps,
	Button,
} from '@mui/material';
import { NextPageWithLayout, Layout } from '../components/layouts';
import { TextField } from '../components/inputs';
import { useFormik } from 'formik';
import { LoginDto, LoginSchema } from '../lib/auth/schemas/login.schema';
import { useLogin } from '../lib/auth/hooks/useLogin';

const PageContainer = styled(Box)`
	padding: 100px 16px 16px;
	margin-inline: auto;
	max-width: 1152px;
`;

const SectionTitle = styled((props: TypographyProps) => (
	<Typography {...props} variant='h5' />
))`
	margin-bottom: 16px;
`;

const InputContainer = styled('div')`
	&& {
		margin-bottom: 16px;
	}
`;

const LoginPage: NextPageWithLayout = () => {
	const { mutate: login, error } = useLogin();
	const { values, touched, errors, handleChange, handleSubmit } = useFormik({
		initialValues: {
			email: '',
			password: '',
		},
		validationSchema: LoginSchema,
		onSubmit: (data) => {
			login(data);
		},
	});

	return (
		<PageContainer>
			<section>
				<form onSubmit={handleSubmit}>
					<SectionTitle>Login</SectionTitle>
					<InputContainer>
						<TextField
							name='email'
							size='small'
							placeholder='Email'
							value={values.email}
							error={!!errors.email}
							onChange={handleChange}
							helperText={touched.email && errors.email}
						></TextField>
					</InputContainer>
					<InputContainer>
						<TextField
							name='password'
							type='password'
							size='small'
							placeholder='Password'
							value={values.password}
							error={!!errors.password}
							onChange={handleChange}
							helperText={touched.password && errors.password}
						></TextField>
					</InputContainer>
					<InputContainer>
						<Button
							onClick={() => {
								window.open(
									'http://localhost:3000/wallets/app-login?message=LogIn0&redirect=http://localhost:3001',
									undefined,
									'_blank'
								);
							}}
						>
							Login using HiPeso
						</Button>
						<Button variant='contained' disableElevation type='submit'>
							Submit
						</Button>
						<Typography color='error' component='span' sx={{ pl: 1 }}>
							{error?.message}
						</Typography>
					</InputContainer>
				</form>
			</section>
		</PageContainer>
	);
};

LoginPage.layout = Layout.Public;

export default LoginPage;
