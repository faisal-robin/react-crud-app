import React, {useEffect, useState} from 'react';
import DataTable from 'react-data-table-component';
import axios from '../services/api';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddressBookForm from './AddressBookForm';
import CustomPagination from './CustomPagenation';

const AddressBookListComponent = () => {
    const [data, setData] = useState([]);
    const [totalRows, setTotalRows] = useState(0);
    const [loading, setLoading] = useState(true);
    const [selectedItem, setSelectedItem] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const fetchData = async ({page, perPage}) => {
        try {
            setLoading(true);
            const response = await axios.get('/address-book/list', {
                params: {
                    page,
                    perPage,
                    search: searchText,
                },
            });
            console.log(response.data.data);
            setData(response.data.data.data);
            setTotalRows(response.data.data.total);
            setCurrentPage(page);
            setItemsPerPage(perPage);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData({ page: currentPage, perPage: itemsPerPage });
    }, [searchText, currentPage, itemsPerPage]);

    const openModal = () => {
        setShowModal(true);
    };

    const handleEdit = (item) => {
        setSelectedItem(item);
        setShowModal(true);
    };

    const handleDelete = (id) => {
        axios.post(`/address-book/delete`, {
            id: id, // Pass additional data here
        })
            .then(response => {
                toast.success(response.data.data);
                fetchData({page: 1, perPage: 10});
            })
            .catch(error => {
                console.error(error.response);
            });
    };

    const columns = [
        {
            name: 'Sl No',
            selector: (row, index) => index + 1,
            width: '5%',
        },
        {
            name: 'Name',
            selector: (row) => row.name,
            width: '15%'
        },
        {
            name: 'Phone',
            selector: (row) => row.phone,
            width: '10%'
        },
        {
            name: 'Email',
            selector: (row) => row.email,
            width: '15%'
        },
        {
            name: 'Website',
            selector: (row) => row.website,
            width: '15%'
        },
        {
            name: 'Gender',
            selector: (row) => row.gender,
            width: '8%'
        },
        {
            name: 'Age',
            selector: (row) => row.age,
            width: '6%'
        },
        {
            name: 'Nationality',
            selector: (row) => row.nationality,
            width: '10%'
        },
        {
            name: 'Actions',
            width: '20%',
            cell: (row) => (
                <>
                    <button className="btn btn-primary" onClick={() => handleEdit(row)}>Edit</button>
                    <button className="btn btn-danger" onClick={() => handleDelete(row.id)}>Delete</button>
                </>
            ),
        },
    ];

    const tableStyles = {
        headRow: {
            style: {
                backgroundColor: '#007bff', // Set your desired header color
            },
        },
        headCells: {
            style: {
                color: '#fff', // Set your desired text color in the header
            },
        },
        table: {
            style: {
                border: '1px solid #dee2e6', // Set your desired border color
            },
        },
    };

    return (
        <div className="container mt-2">
            <div className="row">
                <h2 className="text-center">React App</h2>
                <div className="card p-2">
                    <div className="col-md-12">
                        <button className="btn btn-info" onClick={openModal}>
                            Create
                        </button>

                        <input
                            className="float-end"
                            type="text"
                            placeholder="Search..."
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                        />

                        <DataTable
                            columns={columns}
                            data={data}
                            pagination
                            paginationServer
                            paginationTotalRows={totalRows}
                            paginationPerPage={itemsPerPage}
                            paginationRowsPerPageOptions={[10, 20, 30, 50]}
                            paginationComponent={() => (
                                <CustomPagination
                                    currentPage={currentPage}
                                    itemsPerPage={itemsPerPage}
                                    totalRows={totalRows}
                                    onChange={(page, perPage) => {
                                        setCurrentPage(page);
                                        fetchData({ page, perPage });
                                    }}
                                />
                            )}
                            progressPending={loading}
                            customStyles={tableStyles}
                        />

                        <AddressBookForm
                            show={showModal}
                            onHide={() => setShowModal(false)}
                            item={selectedItem}
                            fetchData={fetchData}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddressBookListComponent;
