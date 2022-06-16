import React, { useState } from 'react';
import { Modal, Table } from 'react-bootstrap';
import { observer, inject } from 'mobx-react';
import CustomButton from '../../../../components/CustomButton';

import { showAckErrorMessage } from '../../../../common/utils';

const PreviewModal = inject('creativesStore')(
  observer((props) => {
    const { creativesStore } = props;

    const [show, setShow] = useState(false);
    const [tableData, setTableData] = useState([]);

    const handleClose = () => setShow(false);
    const handleShow = () => {
      setShow(true);

      fingerprintWatermarkID();
    };

    const fingerprintWatermarkID = () => {
      creativesStore.fingerprintWatermarkID(props.id).then(
        (res) => {
          if (res && res?.status === 200) {
            setTableData(res?.data);
          } else showAckErrorMessage({ message: 'No data available.' });
        },
        () => {
          showAckErrorMessage({ message: 'No Preview data available. Internal error.' });
        }
      );
    };

    return (
      <>
        <CustomButton buttonText="View" buttonClassName="tradebtn ml10" onClick={handleShow}></CustomButton>
        <Modal dialogClassName="modal-75w" show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Preview</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Table striped bordered hover>
              <thead className="table table-striped table-wrapper mt10 wrapped-table">
                <tr>
                  <th>Type</th>

                  <th>Attribute</th>
                  <th>Original File Info</th>
                  <th>Water Marked</th>
                </tr>
              </thead>
              <tbody>
                {tableData && tableData.length > 0 ? (
                  tableData.map((item, i) => (
                    <tr key={i}>
                      <th>{item?.Type}</th>

                      <th>{item?.Attribute}</th>
                      <th>{item['Original File Info']}</th>
                      <th>{item?.['Watermarked File Info']}</th>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} style={{ textAlign: 'center' }}>
                      No Data
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Modal.Body>
          <Modal.Footer></Modal.Footer>
        </Modal>
      </>
    );
  })
);

export default PreviewModal;
