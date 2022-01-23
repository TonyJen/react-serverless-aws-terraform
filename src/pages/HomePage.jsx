import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PageHeader } from "antd";
import { Card, Button, Input } from "antd";
import "antd/dist/antd.css";
import { Layout, Spin } from "antd";
import { API, Auth } from "aws-amplify";

const { Content } = Layout;

const HomePage = () => {
  const [issues, setIssues] = useState([]);
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [currnetUsername, setCurrnetUsername] = useState("");
  const initialFormState = { issue: "", description: "" };
  const [formState, setFormState] = useState(initialFormState);

  useEffect(() => {
    fetchCurrnetUsername();
    fetchIssues();
  }, []);

  function setInput(key, value) {
    setFormState({ ...formState, [key]: value });
  }

  async function fetchIssues() {
    try {
      const res = await API.get("issues", "/issues");
      setIssues(res.Items);
      setLoadingComplete({ loadingComplete: true });
    } catch (err) {
      console.log(err);
      console.log("error fetching issues");
    }
  }

  async function fetchCurrnetUsername() {
    try {
      const res = await Auth.currentUserInfo();
      setCurrnetUsername(res.username);
    } catch (err) {
      console.log(err);
      console.log("error fetching current username");
    }
  }

  async function addIssue() {
    try {
      if (!formState.name || !formState.description) return;
      const issue = { ...formState, username: currnetUsername };
      setIssues([...issues, issue]);
      setFormState(initialFormState);

      const config = {
        body: issue,
        headers: {
          "Content-Type": "application/json"
        }
      };
      await API.post("issue", "/issues", config);
      fetchIssues();
    } catch (err) {
      console.log("error creating issue:", err);
    }
  }

  async function removeIssue(id) {
    try {
      setIssues(issues.filter(issue => issue.issueId.S !== id));
      await API.del("issues", `/issues/${id}`);
    } catch (err) {
      console.log("error removing issue:", err);
    }
  }

  return (
    <div>
      <Content style={{ padding: "0 50px" }}>
        <div className="site-layout-content">
          <PageHeader
            className="site-page-header"
            title={`Welcome ${currnetUsername}`}
            subTitle="Issue tracking list powered by AWS serverless architecture"
            style={styles.header}
          />
        </div>
        <div>
          <Input
            onChange={event => setInput("issue", event.target.value)}
            value={formState.issue}
            placeholder="issue"
            style={styles.input}
          />
          <Input
            onChange={event => setInput("description", event.target.value)}
            value={formState.description}
            placeholder="Description"
            style={styles.input}
          />
          <Button onClick={addIssue} type="primary" style={styles.submit}>
            Add
          </Button>
        </div>
        {loadingComplete ? (
          <div>
            {issues.map((issues, index) => (
              <Card
                key={issues.issuesId ? issues.issuesId.S : index}
                title={issues.issue.S ? issues.issue.S : issues.issue}
                style={{ width: 300 }}
              >
                <p>
                  {issues.description.S ? issues.description.S : issues.description}
                </p>
                {issues.issuesId && issues.username.S === currnetUsername && (
                  <Button
                    type="primary"
                    onClick={() => removeIssue(issues.issuesId.S)}
                  >
                    Done
                  </Button>
                )}
                <Button>
                  {issues.issuesId && (
                    <Link className="button" to={`/edit/${issues.issueId.S}`}>
                      More
                    </Link>
                  )}
                </Button>
              </Card>
            ))}
          </div>
        ) : (
          <Spin />
        )}
      </Content>
    </div>
  );
};

const styles = {
  input: {
    margin: "10px 0"
  },
  submit: {
    margin: "10px 0",
    marginBottom: "20px"
  },
  header: {
    paddingLeft: "0px"
  }
};

export default HomePage;
