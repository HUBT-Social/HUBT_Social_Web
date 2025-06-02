import { Layout, Typography } from 'antd';
import { FC, ReactNode } from 'react';

const { Header, Content } = Layout;
const { Title } = Typography;

interface PageContainerProps {
  header: {
    title: string | ReactNode;
    breadcrumb?: ReactNode;
  };
  children: ReactNode;
}

const PageContainer: FC<PageContainerProps> = ({ header, children }) => {
  return (
    <Layout className="min-h-screen bg-gray-100">
      <Header className="bg-gray-100 px-6 py-4 border-b border-gray-200" style={ {backgroundColor: '#FFFFFF'}}>
        {typeof header.title === 'string' ? (
          <Title level={2} className="!mb-0 text-gray-800">
            {header.title}
          </Title>
        ) : (
          header.title
        )}
        {header.breadcrumb && <div className="mt-2">{header.breadcrumb}</div>}
      </Header>
      <Content className="p-6">{children}</Content>
    </Layout>
  );
};

export default PageContainer;