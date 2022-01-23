import React, { useEffect, useState } from "react";
import { Layout, Card, Button, Spin, Input, PageHeader } from "antd";
import { Link } from "react-router-dom";
import { API, Auth } from "aws-amplify";
import CommentsList from "../components/CommentsList";

const { Content } = Layout;

const EditTodoPage = ({ location, history }) => {
  // form state
  const initialFormState = { name: "", description: "" };
  const [formState, setFormState] = useState(initialFormState);

  // todo state
  const initialIssueState = { name: "", description: "" };
  const [issue, setTodo] = useState(initialIssueState);

  // loading state
  const [loadingComplete, setLoadingComplete] = useState(false);

  // current username state
  const [currnetUsername, setCurrnetUsername] = useState("");

  const issueId = location.pathname.split("/")[2];

  async function fetchTodo() {
    try {
      const res = await API.get("issues", `/issues/${issueId}`);
      const todo = res.Item;
      const name = todo.name.S;
      const description = todo.description.S;
      setTodo({ name, description });
      setLoadingComplete({ loadingComplete: true });
    } catch (err) {
      console.log("error fetching todo");
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

  async function editTodo() {
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
      console.log("error updating todo:", err);
    }
  }

  function setInput(key, value) {
    setFormState({ ...formState, [key]: value });
  }

  // When component mounts, fetchTodo by todoId
  useEffect(() => {
    fetchCurrnetUsername();
    fetchTodo();
  }, []);

  // When todo updates, set form state
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
              <Button onClick={editTodo} type="primary" style={styles.submit}>
                Save
              </Button>
            </div>

            <Card title={issue.name} style={{ wtodoIdth: 300 }}>
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

export default EditTodoPage;
