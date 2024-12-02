import React, { useState, useEffect } from "react";
import { Container, Row, Col, Nav, Tab, Table, Button, Modal, Form, Navbar, NavDropdown, Spinner, Pagination } from "react-bootstrap";
import axios from "axios";
//import { useFlag } from '@unleash/proxy-client-react';

const DataTable = ({ endpoint }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true); // Stato di caricamento
  const [showForm, setShowForm] = useState(false); // Stato per il controllo del Modal
  const [formData, setFormData] = useState({ title: "", body: "" }); // Dati del form
  const [selectedRows, setSelectedRows] = useState([]); // Righe selezionate
  const [detailsVisible, setDetailsVisible] = useState(null); // Stato per i dettagli del Modal
  const [activeView, setActiveView] = useState("tabella1"); // Stato per gestire la vista selezionata

  //const isEnabled = useFlag("example-flag");

  const baseUrl = process.env.REACT_APP_BASE_URL || "https://jsonplaceholder.typicode.com";
  const apiUrl = `${baseUrl}/${endpoint || ""}`;
  const itemsPerPage = 10
  // Fetch dei dati dopo il rendering del componente (evento di montaggio)
  useEffect(() => {
    fetchData();
  }, []); // Questo effetto viene eseguito solo una volta dopo il montaggio
  // Calcola gli indici degli elementi visibili
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = data.slice(indexOfFirstItem, indexOfLastItem);
    // Calcola il numero totale di pagine
  const totalPages = Math.ceil(data.length / itemsPerPage);
  // Funzione per fare il fetching dei dati
  const fetchData = async () => {
    try {
      const response = await axios.get(apiUrl);
      setData(response.data);
      setLoading(false); // Impostiamo loading su false quando i dati sono caricati

    } catch (error) {
      console.error("Errore nel fetching dei dati:", error);
      setLoading(false); // Anche se c'è un errore, fermiamo il caricamento
    }
  };

  // Funzione per gestire l'invio del form
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${baseUrl}/posts`, formData);
      setData([...data, response.data]); // Aggiungi i nuovi dati alla tabella
      setShowForm(false); // Chiudi il Modal
      setFormData({ title: "", body: "" }); // Resetta il form
    } catch (error) {
      console.error("Errore invio dati:", error);
    }
  };

  // Funzione per gestire i cambiamenti nei campi del form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Funzione per gestire la selezione delle righe
  const handleRowSelect = (id) => {
    setSelectedRows((prevSelected) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter((rowId) => rowId !== id);
      } else {
        return [...prevSelected, id];
      }
    });
  };

  // Funzione per eliminare le righe selezionate
  const handleDeleteSelected = async () => {
    try {
      await Promise.all(
        selectedRows.map((id) =>
          axios.delete(`${baseUrl}/posts/${id}`).then(() => {
            setData((prevData) => prevData.filter((item) => item.id !== id)); // Rimuove i dati dal UI
          })
        )
      );
      setSelectedRows([]); // Resetta la selezione
    } catch (error) {
      console.error("Errore eliminazione:", error);
    }
  };

  // Funzione per gestire il clic sul bottone "Dettagli"
  const handleDetailsClick = (item) => {
    setDetailsVisible(item); // Memorizza i dettagli da visualizzare nel Modal
  };

  // Se i dati sono in fase di caricamento, mostriamo un'animazione di caricamento
  if (loading) {
    return (
      <Container fluid>
        <Spinner animation="border" variant="primary" />
        <p>Caricamento dati...</p>
      </Container>
    );
  }

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };


  return (
    <Container fluid>
      {/* Toolbar (Navbar) */}
      <Navbar bg="dark" variant="dark" expand="lg">
        <Navbar.Brand href="#home">DataTable App</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#features">Features</Nav.Link>
            <NavDropdown title="Account" id="basic-nav-dropdown">
              <NavDropdown.Item href="#login">Login</NavDropdown.Item>
              <NavDropdown.Item href="#logout">Logout</NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <Form inline>
            <Row className="align-items-center">
                <Col xs="auto">
                    <Form.Control type="text" placeholder="Search" className="mr-sm-2" />
                </Col>
                <Col xs="auto">
                    <Button variant="outline-info">Search</Button>
                </Col>
            </Row>
          </Form>
        </Navbar.Collapse>
      </Navbar>

      <Row>
        <Col xs={3} className="bg-light">
          <h4 className="p-3">Seleziona Vista</h4>
          <Nav variant="pills" className="flex-column">
            <Nav.Item>
              <Nav.Link
                eventKey="tabella1"
                onClick={() => setActiveView("tabella1")}
              >
                Vista 1
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                eventKey="tabella2"
                onClick={() => setActiveView("tabella2")}
              >
                Vista 2
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Col>

        <Col xs={9}>
          <Tab.Content>
            {/* Tabella 1 */}
            {activeView === "tabella1" && (
              <Tab.Pane eventKey="tabella1" active>
                <h2>Tabella 1</h2>
                <Button variant="primary" onClick={() => setShowForm(true)}>
                  Aggiungi Nuovo
                </Button>
                <Button
                  variant="danger"
                  onClick={handleDeleteSelected}
                  disabled={selectedRows.length === 0}
                  className="ms-2"
                >
                  Elimina Selezionati
                </Button>

                <Table striped bordered hover responsive className="mt-3">
                  <thead>
                    <tr>
                      <th>
                        <input
                          type="checkbox"
                          checked={selectedRows.length === data.length}
                          onChange={() => {
                            if (selectedRows.length === data.length) {
                              setSelectedRows([]); // Deseleziona tutte le righe
                            } else {
                              setSelectedRows(data.map((item) => item.id)); // Seleziona tutte le righe
                            }
                          }}
                        />
                      </th>
                      <th>ID</th>
                      <th>Title</th>
                      <th>Body</th>
                      <th>Dettagli</th> {/* Colonna per il bottone dei dettagli */}
                    </tr>
                  </thead>
                  <tbody>
                    {currentData.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <input
                            type="checkbox"
                            checked={selectedRows.includes(item.id)}
                            onChange={() => handleRowSelect(item.id)}
                          />
                        </td>
                        <td>{item.id}</td>
                        <td>{item.title}</td>
                        <td>{item.body}</td>

                        {/* Colonna dei Dettagli */}
                        <td>
                          <Button
                            variant="info"
                            onClick={() => handleDetailsClick(item)}
                          >
                            Mostra Dettagli
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                      {/* Paginazione */}
                <Pagination>
                    <Pagination.First onClick={() => handlePageChange(1)} />
                    <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} />
                    {Array.from({ length: totalPages }, (_, idx) => (
                    <Pagination.Item
                        key={idx + 1}
                        active={currentPage === idx + 1}
                        onClick={() => handlePageChange(idx + 1)}
                    >
                        {idx + 1}
                    </Pagination.Item>
                    ))}
                    <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} />
                    <Pagination.Last onClick={() => handlePageChange(totalPages)} />
                </Pagination>
              </Tab.Pane>
            )}

            {/* Tabella 2 */}
            {activeView === "tabella2" && (
              <Tab.Pane eventKey="tabella2">
                <h2>Vista 2</h2>
                <p>Qui puoi inserire una vista alternativa o un'altra tabella.</p>
                {/* Puoi aggiungere un'altra tabella o qualsiasi altro contenuto per la seconda vista */}
              </Tab.Pane>
            )}
          </Tab.Content>
        </Col>
      </Row>

      {/* Modal per il Form */}
      <Modal show={showForm} onHide={() => setShowForm(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Nuovo Post</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleFormSubmit}>
            <Form.Group controlId="formTitle">
              <Form.Label>Titolo</Form.Label>
              <Form.Control
                type="text"
                placeholder="Inserisci titolo"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formBody">
              <Form.Label>Corpo</Form.Label>
              <Form.Control
                type="text"
                placeholder="Inserisci corpo"
                name="body"
                value={formData.body}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3">
              Invia
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modal per i Dettagli */}
      {detailsVisible && (
        <Modal show={true} onHide={() => setDetailsVisible(null)}>
          <Modal.Header closeButton>
            <Modal.Title>Dettagli ID: {detailsVisible.id}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p><strong>Titolo:</strong> {detailsVisible.title}</p>
            <p><strong>Corpo:</strong> {detailsVisible.body}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setDetailsVisible(null)}>
              Chiudi
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </Container>
  );
};

export default DataTable;
