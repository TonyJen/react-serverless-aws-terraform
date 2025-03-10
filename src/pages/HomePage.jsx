import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PageHeader } from "antd";
import { Card, Button, Input } from "antd";
import "antd/dist/antd.css";
import { Layout, Spin } from "antd";
import { API, Auth } from "aws-amplify";

const { Content } = Layout;

const HomePage = () => {
  const [todos, setTodos] = useState([]);
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [currentUsername, setCurrentUsername] = useState("");
  const initialFormState = { name: "", description: "" };
  const [formState, setFormState] = useState(initialFormState);

  useEffect(() => {
    fetchCurrentUsername();
    fetchTodos();
  }, []);

  function setInput(key, value) {
    setFormState({ ...formState, [key]: value });
  }

  async function fetchTodos() {
    try {
      const res = await API.get("todos", "/todos");
      setTodos(res.Items);
      setLoadingComplete({ loadingComplete: true });
    } catch (err) {
      console.log(err);
      console.log("error fetching todos");
    }
  }

  async function fetchCurrentUsername() {
    try {
      const res = await Auth.currentUserInfo();
      setCurrentUsername(res.username);
    } catch (err) {
      console.log(err);
      console.log("error fetching current username");
    }
  }

  async function addTodo() {
    try {
      if (!formState.name || !formState.description) return;
      const todo = { ...formState, username: currentUsername };
      setTodos([...todos, todo]);
      setFormState(initialFormState);

      const config = {
        body: todo,
        headers: {
          "Content-Type": "application/json"
        }
      };
      await API.post("todos", "/todos", config);
      fetchTodos();
    } catch (err) {
      console.log("error creating todo:", err);
    }
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter') {
      addTodo();
    }
  }

  async function removeTodo(id) {
    try {
      setTodos(todos.filter(todo => todo.todoId.S !== id));
      await API.del("todos", `/todos/${id}`);
    } catch (err) {
      console.log("error removing todo:", err);
    }
  }

  return (
    <div>
      <Content style={{ padding: "0 50px" }}>
        <div className="site-layout-content">
          <PageHeader
            className="site-page-header"
            title={`Welcome ${currentUsername}`}
            subTitle="To-do list powered by AWS serverless architecture"
            style={styles.header}
          />
        </div>
        <div>
          <Input
            onChange={event => setInput("name", event.target.value)}
            onKeyDown={handleKeyDown} 
            value={formState.name}
            placeholder="Name"
            style={styles.input}
          />
          <Input
            onChange={event => setInput("description", event.target.value)}
            onKeyDown={handleKeyDown} 
            value={formState.description}
            placeholder="Description"
            style={styles.input}
          />
          <Button onClick={addTodo} type="primary" style={styles.submit}>
            Add
          </Button>
        </div>
        {loadingComplete ? (
          <div>
            {todos.map((todo, index) => (
              <Card
                key={todo.todoId ? todo.todoId.S : index}
                title={todo.name.S ? todo.name.S : todo.name}
                style={styles.card}
              >
                <p>
                  {todo.description.S ? todo.description.S : todo.description}
                </p>
                {todo.todoId && todo.username.S === currentUsername && (
                  <Button
                    type="primary"
                    onClick={() => removeTodo(todo.todoId.S)}
                  >
                    Done
                  </Button>
                )}
                <Button>
                  {todo.todoId && (
                    <Link className="button" to={`/edit/${todo.todoId.S}`}>
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
  },
  card: {
    width: 300,
    marginBottom: "50px"
  }
};

export default HomePage;
