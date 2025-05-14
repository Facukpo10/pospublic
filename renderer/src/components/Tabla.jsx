import React, { useState } from 'react';
import { Table, Pagination, Button } from 'react-bootstrap';

function Tabla({ data, rowsPerPage = 5, onEdit, onDelete }) {
  if (!data || data.length === 0) {
    return <p>No hay datos para mostrar.</p>;
  }

  const headers = Object.keys(data[0]);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentData = data.slice(startIndex, startIndex + rowsPerPage);
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <Table striped bordered hover >
        <thead className='table-dark'>
          <tr>
            {headers.map((header, index) => (
              <th key={index}>{header}</th>
            ))}
            <th>Acciones</th> {/* Nueva columna para los botones */}
          </tr>
        </thead>
        <tbody>
          {currentData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {headers.map((header, colIndex) => (
                <td key={colIndex}>{row[header]}</td>
              ))}
              <td>
                <Button
                  variant="warning"
                  size="sm"
                  onClick={() => onEdit(row)}
                  className="me-2"
                >
                  Editar
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => onDelete(row)}
                >
                  Borrar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Pagination>
        {[...Array(totalPages)].map((_, index) => (
          <Pagination.Item
            key={index}
            active={index + 1 === currentPage}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </Pagination.Item>
        ))}
      </Pagination>
    </div>
  );
}

export default Tabla;