import { useState, useEffect } from "react";
import {
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  styled,
  Typography,
  TextField,
  Paper,
  Modal,
  Backdrop,
  Fade,
  Button
} from "@mui/material";
import axios from 'axios';
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

const Users = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [open, setOpen] = useState(false);

  const API_URL = "https://3trjcyhdla.execute-api.eu-north-1.amazonaws.com/Dev";

  useEffect(() => {
    const getData = async () => {
      const response = await axios.get(API_URL);
      setUsers(JSON.parse(response.data.body));
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

  return (
    <Component>
      <Typography variant="h4">Dynamo DB Data</Typography>
      <TextField
        label="Search"
        variant="outlined"
        fullWidth
        className="search-box"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <Button variant="contained" color="primary" className="export-button" onClick={exportToExcel}>
        Export to Excel
      </Button>
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
            {filteredUsers.map((user, index) => (
              <TableRow key={user.id || index} onClick={() => handleRowClick(user)}>
                <TableCell>{user.URL}</TableCell>
                <TableCell>{user.Account}</TableCell>
                <TableCell>{user.Date}</TableCell>
                <TableCell>{user.Region}</TableCell>
                <TableCell>{user.DBHostname}</TableCell>
                <TableCell>{user.LoadBalancer}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Modal
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }}
      >
        <Fade in={open}>
          <ModalContent>
            <Typography variant="h6" gutterBottom>User Details</Typography>
            <Table>
              <TableBody>
                {selectedUser &&
                  Object.entries(selectedUser).map(([key, value]) => (
                    <TableRow key={key}>
                      <TableCell><strong>{key}</strong></TableCell>
                      <TableCell>{value}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </ModalContent>
        </Fade>
      </Modal>
    </Component>
  );
};

export default Users;
