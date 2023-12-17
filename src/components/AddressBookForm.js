import React, {useEffect} from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from '../services/api';
import { getUser } from '../services/authUtils';

const validationSchema = yup.object({
    name: yup.string().required('Name is required'),
    phone: yup.number().required('Phone is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    website: yup.string().required('Website is required'),
    gender: yup.string().oneOf(['male', 'female', 'other']).required('Gender is required'),
    age: yup.number().required('Age is required'),
    nationality: yup.string().required('Nationality is required'),
});

const AddressBookForm = ({ show, onHide, item, fetchData }) => {
    const userId = getUser().id;
    const formik = useFormik({
        initialValues: {
            id: '',
            name: '',
            phone: '',
            email: '',
            website: '',
            gender: '',
            age: '',
            nationality: '',
            created_by: userId,
        },
        validationSchema,
        onSubmit: async (values,{ resetForm }) => {
            try {
                const response = await axios.post('/address-book/store', values);
                if (response.data.status === 'success') {
                    onHide();
                    fetchData({ page: 1, perPage: 10 });
                    toast.success(response.data.data);
                    resetForm();
                } else {
                    toast.error(response.data.message);
                }
            } catch (error) {
                if (error.response && error.response.status === 422) {
                    const validationErrors = error.response.data.data;
                    Object.keys(validationErrors).forEach((fieldName) => {
                        const errors = validationErrors[fieldName];
                        errors.forEach((error) => {
                            toast.error(`${error}`);
                        });
                    });
                }
            }
        },
    });

    useEffect(() => {
        if (item) {
            formik.setValues({
                id: item.id,
                name: item.name,
                phone: item.phone,
                email: item.email,
                website: item.website,
                gender: item.gender,
                age: item.age,
                nationality: item.nationality,
                created_by: userId,
            });
        } else {
            formik.resetForm();
        }
    }, [item]);

    return (
        <Modal show={show} onHide={onHide} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>{item ? 'Edit' : 'Create'}</Modal.Title>
            </Modal.Header>
            <Form onSubmit={formik.handleSubmit}>
            <Modal.Body>
                    <div className="row">
                        <Form.Group controlId="formName" className="col-md-6">
                            <Form.Label>Name <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter name"
                                name="name"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            <div className="error text-danger">{formik.touched.name && formik.errors.name}</div>
                        </Form.Group>
                        <Form.Group controlId="formPhone" className="col-md-6">
                            <Form.Label>Phone <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter phone"
                                name="phone"
                                value={formik.values.phone}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            <div className="error text-danger">{formik.touched.phone && formik.errors.phone}</div>
                        </Form.Group>

                        <Form.Group controlId="formEmail" className="col-md-6">
                            <Form.Label>Email <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter email"
                                name="email"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            <div className="error text-danger">{formik.touched.email && formik.errors.email}</div>
                        </Form.Group>

                        <Form.Group controlId="formWebsite" className="col-md-6">
                            <Form.Label>Website <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter website"
                                name="website"
                                value={formik.values.website}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            <div className="error text-danger">{formik.touched.website && formik.errors.website}</div>
                        </Form.Group>
                        <Form.Group controlId="formGender" className="col-md-4">
                            <Form.Label>Gender <span className="text-danger">*</span></Form.Label>
                            <Form.Control as="select" name="gender" value={formik.values.gender} onChange={formik.handleChange} onBlur={formik.handleBlur}>
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </Form.Control>
                            <div className="error text-danger">{formik.touched.gender && formik.errors.gender}</div>
                        </Form.Group>
                        <Form.Group controlId="formAge" className="col-md-4">
                            <Form.Label>Age <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter age"
                                name="age"
                                value={formik.values.age}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            <div className="error text-danger">{formik.touched.age && formik.errors.age}</div>
                        </Form.Group>
                        <Form.Group controlId="formNationality" className="col-md-4">
                            <Form.Label>Nationality <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter nationality"
                                name="nationality"
                                value={formik.values.nationality}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            <div className="error text-danger">{formik.touched.nationality && formik.errors.nationality}</div>
                        </Form.Group>
                    </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" type="submit" disabled={formik.isSubmitting}>
                    Save Changes
                </Button>
                <Button variant="secondary" onClick={onHide}>
                    Close
                </Button>
            </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default AddressBookForm;
