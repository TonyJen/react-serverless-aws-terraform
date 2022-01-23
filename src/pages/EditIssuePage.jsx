import React, { useEffect, useState } from "react";
import { Layout, Card, Button, Spin, Input, PageHeader } from "antd";
import { Link } from "react-router-dom";
import { API, Auth } from "aws-amplify";
import CommentsList from "../components/CommentsList";

const { Content } = Layout;

const EditIssuePage = ({ location, history }) => {
  // form state
  const initialFormState = { name: "", description: "" };
  const [formState, setFormState] = useState(initialFormState);

  // issue state
  const initialIssueState = { name: "", description: "" };
  const [issue, setIssue] = useState(initialIssueState);

  // loading state
  const [loadingComplete, setLoadingComplete] = useState(false);

  // current username state
  const [currnetUsername, setCurrnetUsername] = useState("");

  const issueId = location.pathname.split("/")[2];

  async function fetchIssue() {
    try {
      const res = await API.get("issues", `/issues/${issueId}`);
      const issue = res.Item;
      const name = issue.name.S;
      const description = issue.description.S;
      setIssue({ name, description });
      setLoadingComplete({ loadingComplete: true });
    } catch (err) {
      console.log("error fetching issue");
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

  async function editIssue() {
    try {
      if (!formState.name || !formState.description) return;
      const config = {
        body: formState,
        headers: {
          "Content-Type": "application/json"
        }
      };
      await API.put("issue", `/issues/${issueId}`, config);
      history.push("/");
    } catch (err) {
      console.log("error updating issue:", err);
    }
  }

  function setInput(key, value) {
    setFormState({ ...formState, [key]: value });
  }

  // When component mounts, fetchIssue by IssueId
  useEffect(() => {
    fetchCurrnetUsername();
    fetchIssue();
  }, []);

  // When issue updates, set form state
  useEffect(() => {
    if (issue.name) {
      const name = issue.name;
      const description = issue.description;
      setFormState({ name, description });
    }
  }, [issue]);

  return (
    <div>
      <Content style={{ padding: "0 50px" }}>
        <div className="site-layout-content">
          <PageHeader
            className="site-page-header"
            title="Edit To-Do"
            style={styles.header}
          />
        </div>
        {loadingComplete ? (
          <div>
            <div>
              <Input
                onChange={event => setInput("name", event.target.value)}
                value={formState.name}
                placeholder="Name"
                style={styles.input}
              />
              <Input
                onChange={event => setInput("description", event.target.value)}
                value={formState.description}
                placeholder="Description"
                style={styles.input}
              />
              <Button onClick={editIssue} type="primary" style={styles.submit}>
                Save
              </Button>
            </div>

            <Card title={issue.name} style={{ width: 300 }}>
              <p>{issue.description}</p>
              <Button>
                <Link className="button" to="/">
                  Back
                </Link>
              </Button>
            </Card>
            <CommentsList issueId={issueId} username={currnetUsername} />
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

export default EditIssuePage;
