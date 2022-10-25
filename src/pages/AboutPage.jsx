import React from 'react';
import { PageHeader, Layout } from 'antd';

const { Content } = Layout;

function AboutPage() {
  return (
    <div>
      <Content style={{ padding: '0 50px' }}>
        <div className="site-layout-content">
          <PageHeader
            className="site-page-header"
            title="About"
            style={styles.header}
          />
        </div>
        <h1>This demo demostrates aws serverless pipeline flow using React frontend and DynamoDB database backend. It will also use cognito as access control and api gateway, lambdas, and queue service as backend api.</h1>

      </Content>
    </div>
  );
}

const styles = {
  input: {
    margin: '10px 0',
  },
  submit: {
    margin: '10px 0',
    marginBottom: '20px',
  },
  header: {
    paddingLeft: '0px',
  },
};

export default AboutPage;
