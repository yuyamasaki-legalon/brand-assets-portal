import {
  Button,
  Card,
  CardBody,
  CardHeader,
  ContentHeader,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  Table,
  Text,
  TextField,
} from "@legalforce/aegis-react";
import { useCallback, useEffect, useState } from "react";
import type { User } from "./types";

export const ApiExample = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");

  // Fetch users from API
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/users");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  }, []);

  // Create new user
  const createUser = async () => {
    if (!newUserName || !newUserEmail) {
      setError("Name and email are required");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newUserName,
          email: newUserEmail,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Clear form and refresh list
      setNewUserName("");
      setNewUserEmail("");
      await fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  // Delete user
  const deleteUser = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete user");
    } finally {
      setLoading(false);
    }
  };

  // Load users on mount
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeader.Title>API Server Example</ContentHeader.Title>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <Text as="p" variant="body.medium" style={{ marginBottom: "var(--aegis-space-large)" }}>
            This page demonstrates how to use the local API server. The server runs on port 3001 and is proxied through
            Vite.
          </Text>

          {error && (
            <Card
              style={{ marginBottom: "var(--aegis-space-medium)", backgroundColor: "var(--aegis-color-error-subtle)" }}
            >
              <CardBody>
                <Text variant="body.medium" style={{ color: "var(--aegis-color-error)" }}>
                  Error: {error}
                </Text>
              </CardBody>
            </Card>
          )}

          <Card style={{ marginBottom: "var(--aegis-space-large)" }}>
            <CardHeader>
              <Text variant="title.small">Create New User</Text>
            </CardHeader>
            <CardBody>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--aegis-space-medium)",
                }}
              >
                <div>
                  <Text variant="label.medium" style={{ marginBottom: "var(--aegis-space-xSmall)", display: "block" }}>
                    Name
                  </Text>
                  <TextField
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    placeholder="Enter name"
                  />
                </div>
                <div>
                  <Text variant="label.medium" style={{ marginBottom: "var(--aegis-space-xSmall)", display: "block" }}>
                    Email
                  </Text>
                  <TextField
                    type="email"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    placeholder="Enter email"
                  />
                </div>
                <Button onClick={createUser} disabled={loading}>
                  Create User
                </Button>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text variant="title.small">Users</Text>
                <Button onClick={fetchUsers} disabled={loading} variant="subtle">
                  Refresh
                </Button>
              </div>
            </CardHeader>
            <CardBody>
              {loading && users.length === 0 ? (
                <Text variant="body.medium">Loading...</Text>
              ) : users.length === 0 ? (
                <Text variant="body.medium">No users found</Text>
              ) : (
                <Table>
                  <Table.Head>
                    <Table.Row>
                      <Table.Cell>ID</Table.Cell>
                      <Table.Cell>Name</Table.Cell>
                      <Table.Cell>Email</Table.Cell>
                      <Table.Cell>Actions</Table.Cell>
                    </Table.Row>
                  </Table.Head>
                  <Table.Body>
                    {users.map((user) => (
                      <Table.Row key={user.id}>
                        <Table.Cell>{user.id}</Table.Cell>
                        <Table.Cell>{user.name}</Table.Cell>
                        <Table.Cell>{user.email}</Table.Cell>
                        <Table.Cell>
                          <Button onClick={() => deleteUser(user.id)} disabled={loading} variant="subtle" size="small">
                            Delete
                          </Button>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table>
              )}
            </CardBody>
          </Card>
        </PageLayoutBody>
      </PageLayoutContent>
    </PageLayout>
  );
};
