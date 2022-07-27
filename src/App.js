import logo from "./logo.svg";
import "./App.css";
import { API, graphqlOperation } from "aws-amplify";
import { listTodos } from "./graphql/queries";
import { Button, Container, Table } from "react-bootstrap";
import { useState, useEffect } from "react";

function App() {
  const [data, setData] = useState(null);
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

  return (
    <div className="App">
      <Container>
        <h1>Full stack React app with AWS Amplify and DynamoDB</h1>
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
                  <td>{Date(item.createdAt)}</td>
                  <td>{item.name}</td>
                  <td>{item.description}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Container>
    </div>
  );
}

export default App;
