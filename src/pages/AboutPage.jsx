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
          This demo demostrates aws serverless pipeline flow using React
          frontend and DynamoDB database backend.{" "}</h1>

        <h1>Technologies used:</h1>  
        <ul>
          <li> Cognito as access control.</li>
          <li> Api gateway</li>
          <li> Lambda</li>
          <li> Simple Queue Service</li>
          <li> DynamoDB</li>
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
