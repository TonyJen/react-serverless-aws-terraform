import React from "react";
import { PageHeader } from "antd";
import { Layout } from "antd";

const { Content } = Layout;

const AboutPage = () => {
  return (
    <div>
      <Content style={{ padding: "0 50px" }}>
        <div className="site-layout-content">
          <PageHeader
            className="site-page-header"
            title="About"
            style={styles.header}
          />
        </div>
        <h1>
        This demo showcases an AWS serverless pipeline with a React frontend and a DynamoDB backend. 
        It utilizes technologies including Cognito for access control, API Gateway, Lambda, Simple Queue Service, and DynamoDB.</h1>
        <h1>Technologies Used:</h1>
        <ul>
          <li>Amazon Cognito: Utilized for access control and authentication.</li>
          <li>API Gateway: Manages and routes API calls.</li>
          <li>AWS Lambda: Provides serverless compute capabilities, executing code in response to events.</li>
          <li>Simple Queue Service (SQS): Ensures efficient and reliable message handling in distributed systems.</li>
          <li>DynamoDB: Acts as the NoSQL database backend for storing application data.</li>
        </ul>
      </Content>
    </div>
  );
};

const styles = {
  input: {
    margin: "10px 0",
  },
  submit: {
    margin: "10px 0",
    marginBottom: "20px",
  },
  header: {
    paddingLeft: "0px",
  },
};

export default AboutPage;
