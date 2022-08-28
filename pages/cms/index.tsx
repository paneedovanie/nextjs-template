import { NextPageWithLayout, Layout } from '../../components/layouts';

const CmsPage: NextPageWithLayout = () => {
	return (
		<>
			<h1>Home Page</h1>
		</>
	);
};

CmsPage.layout = Layout.Cms;

export default CmsPage;
