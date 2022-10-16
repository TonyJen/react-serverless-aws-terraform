import React, { useEffect, useState } from "react";
import { PageHeader, Spin, Card, Input, Button } from "antd";
import { API } from "aws-amplify";
import Likes from "./Likes";
import styled from 'styled-components';

const CommentsList = ({ todoId, username }) => {
  const initialFormState = { content: "" };
  const [formState, setFormState] = useState(initialFormState);
  const [comments, setComments] = useState([]);
  const [loadingComplete, setloadingComplete] = useState(true);
  useEffect(() => {
    fetchComments();
  }, []);

  const SubmitButton = styled.div`
    margin: 10px 0;
    margin-bottom : 20px;
  `;

  const InputStyle = styled.div`
    margin: 10px 0;
  `;

  const HeaderStyle = styled.div`
    padding-left: 0px;
  `;

  const CommentStyle = styled.div`
    width: 300;
    margin-bottom: 50px;
  `;

  function setInput(key, value) {
    setFormState({ ...formState, [key]: value });
  }

  async function fetchComments() {
    try {
      const res = await API.get("todos", `/comments?todoId=${todoId}`);
      setComments(res.Items);
      setloadingComplete({ loadingComplete: true });
    } catch (err) {
      console.log("error fetching comments");
    }
  }

  async function addComment() {
    try {
      if (!formState.content) return;
      const comment = {
        ...formState,
        todoId,
        username
      };
      setFormState(initialFormState);

      const config = {
        body: comment,
        headers: {
          "Content-Type": "application/json"
        }
      };
      await API.post("todos", "/comments", config);
      fetchComments();
    } catch (err) {
      console.log("error creating comment:", err);
    }
  }

  async function removeComment(id) {
    try {
      setComments(comments.filter(comment => comment.commentId.S !== id));
      await API.del("todos", `/comments/${id}`);
    } catch (err) {
      console.log("error removing comment:", err);
    }
  }

  return (
    <div>
      <HeaderStyle>
        <PageHeader
          className="site-page-header"
          title="Comments"
        />
      </HeaderStyle>
      <div>
        <InputStyle>
          <Input
            onChange={event => setInput("content", event.target.value)}
            value={formState.content}
            placeholder="Comment"
          />
        </InputStyle>
        <SubmitButton>
          <Button onClick={addComment} type="primary">
            Add
          </Button>
        </SubmitButton>
      </div>
      {loadingComplete ? (
        <div>
          {comments.map((comment, index) => (
            <CommentStyle>
              <Card
                key={comment.commentId ? comment.commentId.S : index}
                title={comment.content.S}
              >
                <p>{comment.username.S}</p>
                {comment.username.S === username && (
                  <Button
                    type="primary"
                    onClick={() => removeComment(comment.commentId.S)}
                  >
                    Delete
                  </Button>
                )}
                <Likes commentId={comment.commentId.S} username={username} />
              </Card>
            </CommentStyle>
          ))}
        </div>
      ) : (
        <Spin />
      )}
    </div>
  );
};


export default CommentsList;
