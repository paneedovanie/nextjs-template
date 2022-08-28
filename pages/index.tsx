import {
	styled,
	Box,
	Typography,
	Card,
	CardMedia,
	CardContent,
	CardActions,
	Button,
	Grid,
	TypographyProps,
} from '@mui/material';
import { company } from '@prisma/client';
import { NextPageWithLayout, Layout } from '../components/layouts';
import { useGetAllCompanies } from '../lib/company/hooks/useGetAllCompanies';

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

const StyledCard = styled(Card)`
	&& {
		border-radius: 8px;
		box-shadow: 0 0 2px #00000030;
	}
`;

const HomePage: NextPageWithLayout = () => {
	const { data, error } = useGetAllCompanies();

	const companies = data?.data;

	return (
		<PageContainer>
			<section>
				<SectionTitle>Companies</SectionTitle>
				<Grid container spacing={2}>
					{companies?.map((company: company, i: number) => (
						<Grid item key={i} xs={12} sm={6} md={4}>
							<StyledCard>
								<CardMedia
									component='img'
									height='140'
									image='https://picsum.photos/200'
									alt='company'
								/>
								<CardContent>
									<Typography gutterBottom variant='h5' component='div'>
										{company.name}
									</Typography>
									<Typography variant='body2' color='text.secondary'>
										{company.description}
									</Typography>
								</CardContent>
								<CardActions>
									<Button size='small'>Share</Button>
									<Button size='small'>Learn More</Button>
								</CardActions>
							</StyledCard>
						</Grid>
					))}
				</Grid>
			</section>
		</PageContainer>
	);
};

HomePage.layout = Layout.Public;

export default HomePage;
