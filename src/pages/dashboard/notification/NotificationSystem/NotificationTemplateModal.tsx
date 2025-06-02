import React from 'react';
import { Modal, Button, Row, Col, Typography } from 'antd';
import { mockTemplates } from '../data/mockData';
import { useNotificationContext } from '../contexts/NotificationContext';

const { Title, Text } = Typography;

const NotificationTemplateModal = () => {
  const { templateMode, setTemplateMode, setTitle, setBody, setType, setSelectedTemplate } = useNotificationContext();

  const handleTemplateSelect = (template: { id: any; title: any; content: any; type?: any; }) => {
    setTitle(template.title);
    setBody(template.content);
    setType(template.type);
    setSelectedTemplate(template.id);
    setTemplateMode(false);
  };

  return (
    <Modal
      title="Choose Template"
      open={templateMode}
      onCancel={() => setTemplateMode(false)}
      footer={null}
      width={800}
      centered
      className="template-modal"
    >
      <Row gutter={[16, 16]}>
        {mockTemplates.map((template: { id: React.Key | null | undefined; title: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; content: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; }) => (
          <Col xs={24} sm={12} key={template.id}>
            <div 
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer hover:border-blue-300"
              onClick={() => handleTemplateSelect(template)}
            >
              <Title level={5}>{template.title}</Title>
              <Text type="secondary" className="block mb-3">
                {template.content}
              </Text>
              <Button type="primary" ghost size="small" className="w-full">
                Use This Template
              </Button>
            </div>
          </Col>
        ))}
      </Row>
    </Modal>
  );
};

export default NotificationTemplateModal;