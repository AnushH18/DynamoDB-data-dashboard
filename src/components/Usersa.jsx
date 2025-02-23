import { useState, useEffect } from "react";
import {
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  TextField,
  Paper,
  Modal,
  Button,
  styled
} from "@mui/material";
import * as XLSX from 'xlsx';

const Component = styled(Box)`
  width: 90%;
  margin: auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  & > h4 {
    text-align: center;
    margin-bottom: 20px;
  }
  & .search-box {
    margin-bottom: 20px;
  }
  & .table-container {
    overflow-x: auto;
    border-radius: 10px;
  }
  & table {
    min-width: 1000px;
  }
  & thead {
    background-color: #000;
  }
  & thead th {
    color: #ffffff;
    font-size: 16px;
    font-weight: 600;
  }
  & tbody td {
    font-size: 16px;
    cursor: pointer;
  }
  & .export-button {
    margin-bottom: 20px;
  }
`;

const ModalContent = styled(Box)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50%;
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  max-height: 80vh;
  overflow-y: auto;
`;

const DynamoTable = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = "https://3trjcyhdla.execute-api.eu-north-1.amazonaws.com/Dev";

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setUsers(JSON.parse(data.body));
        setError(null);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

  const handleRowClick = (user) => {
    setSelectedUser(user);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(users);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users Data");
    XLSX.writeFile(workbook, "users_data.xlsx");
  };

  const filteredUsers = users.filter(user =>
    Object.values(user).some(value =>
      value?.toString().toLowerCase().includes(search.toLowerCase())
    )
  );

  if (error) {
    return (
      <Box sx={{ width: '90%', margin: 'auto', p: 2.5, textAlign: 'center', color: 'error.main' }}>
        <Typography variant="h6">{error}</Typography>
      </Box>
    );
  }

  return (
    <Component>
      <Typography variant="h4">Dynamo DB Data</Typography>
      
      <Box sx={{ mb: 2.5, display: 'flex', gap: 2 }}>
        <TextField
          label="Search"
          variant="outlined"
          fullWidth
          className="search-box"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        
        <Button
          variant="contained"
          color="primary"
          className="export-button"
          onClick={exportToExcel}
          disabled={loading || users.length === 0}
        >
          Export to Excel
        </Button>
      </Box>

      <Paper className="table-container">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>URL</TableCell>
              <TableCell>Account</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Region</TableCell>
              <TableCell>DBHostname</TableCell>
              <TableCell>LoadBalancer</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">Loading...</TableCell>
              </TableRow>
            ) : filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">No data found</TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user, index) => (
                <TableRow key={user.id || index} onClick={() => handleRowClick(user)} hover>
                  <TableCell>{user.URL}</TableCell>
                  <TableCell>{user.Account}</TableCell>
                  <TableCell>{user.Date}</TableCell>
                  <TableCell>{user.Region}</TableCell>
                  <TableCell>{user.DBHostname}</TableCell>
                  <TableCell>{user.LoadBalancer}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Paper>

      <Modal
        open={open}
        onClose={handleClose}
      >
        <ModalContent>
          <Typography variant="h6" gutterBottom>User Details</Typography>
          <Table>
            <TableBody>
              {selectedUser &&
                Object.entries(selectedUser).map(([key, value]) => (
                  <TableRow key={key}>
                    <TableCell sx={{ fontWeight: 'bold' }}>{key}</TableCell>
                    <TableCell>{value}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </ModalContent>
      </Modal>
    </Component>
  );
};

export default DynamoTable;