import "./App.css";
import { API, graphqlOperation, Auth } from "aws-amplify";
import { Authenticator, withAuthenticator } from "@aws-amplify/ui-react";
import { listTodos } from "./graphql/queries";
import { Button, Container, Table, Form, Col, Row } from "react-bootstrap";
import { useState, useEffect } from "react";
import * as mutations from "./graphql/mutations";
import "@aws-amplify/ui-react/styles.css";

function App() {
  const [data, setData] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isError, setError] = useState(false);
  const [isloading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    todos();
  }, []);

  const todos = async () => {
    try {
      const { data } = await API.graphql(graphqlOperation(listTodos));
      setData(data.listTodos.items);
    } catch (error) {
      setError(error);
    }
  };

  const sendItem = async (event) => {
    event.preventDefault();
    const { itemName, itemDescription } = event.currentTarget;
    setName("");
    setDescription("");
    const todoDetails = {
      name: itemName.value,
      description: itemDescription.value,
    };
    const newTodo = await API.graphql({
      query: mutations.createTodo,
      variables: { input: todoDetails },
    });
    todos();
  };

  const deleteItem = async (itemId) => {
    const todoDetails = {
      id: itemId,
    };
    const deletedTodo = await API.graphql({
      query: mutations.deleteTodo,
      variables: { input: todoDetails },
    });
    todos();
  };

  return (
    <div className="App">
      <Container>
        <div className="section">
          <h1>Full stack React app with AWS Amplify and DynamoDB!</h1>
          {data !== null && (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>created</th>
                  <th>name</th>
                  <th>description</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr key={item.id}>
                    <td>{item.createdAt}</td>
                    <td>{item.name}</td>
                    <td>{item.description}</td>
                    <td>
                      <Button
                        variant="danger"
                        onClick={() => {
                          deleteItem(item.id);
                        }}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </div>
        <div className="section">
          <h2>Create list item</h2>
          <Form onSubmit={sendItem}>
            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>name</Form.Label>
                  <Form.Control
                    value={name}
                    name="itemName"
                    placeholder="just anything tbh"
                    onChange={(event) => {
                      setName(event.currentTarget.value);
                    }}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>description</Form.Label>
                  <Form.Control
                    value={description}
                    name="itemDescription"
                    placeholder="also anything here tbh"
                    onChange={(event) => {
                      setDescription(event.currentTarget.value);
                    }}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Button
              variant="primary"
              type="submit"
              disabled={name.length === 0 || description.length === 0}
            >
              Submit
            </Button>
          </Form>
        </div>

        <Authenticator></Authenticator>
        {Auth.user && (
          <div className="section">
            <span>
              <p>signed in as {Auth.user.attributes.email}</p>{" "}
              <Button
                onClick={async () => {
                  Auth.signOut();
                }}
              >
                sign out
              </Button>
            </span>
          </div>
        )}
      </Container>
    </div>
  );
}

export default withAuthenticator(App);
