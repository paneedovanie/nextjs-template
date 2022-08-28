import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from 'react-query';
import { NextPageWithLayout, LayoutProvider } from '../components/layouts';
import { ThemeProvider } from '@mui/material';
import { theme } from '../styles/themes';

const queryClient = new QueryClient();

type AppPropsWithLayout = AppProps & {
	Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
	return (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider theme={theme}>
				<LayoutProvider>
					<Component {...pageProps} />
				</LayoutProvider>
			</ThemeProvider>
		</QueryClientProvider>
	);
}

export default MyApp;
