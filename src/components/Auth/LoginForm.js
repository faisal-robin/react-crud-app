import React, { useState } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import api from '../../services/api';
import { Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { Navigate } from 'react-router-dom';

const LoginForm = () => {
    const [loading, setLoading] = useState(false);
    const [isLoggedIn, setLoggedIn] = useState(false);

    const validationSchema = Yup.object({
        email: Yup.string().email('Invalid email').required('Email is required'),
        password: Yup.string().required('Password is required'),
    });

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                setLoading(true);
                const response = await api.post('/login', values);

                if (response.status === 200) {
                    localStorage.setItem('token',response.data.token);
                    localStorage.setItem('user', JSON.stringify(response.data.user_info));
                    setLoggedIn(true);
                    console.log(isLoggedIn);
                    toast.success('Login successful!');
                } else {
                    toast.error(response.data.message);
                }
            } catch (error) {
                console.error('Login failed:', error);
            } finally {
                setLoading(false);
            }
        },
    });

    if (isLoggedIn) {
        // Redirect to the home page after successful login
        return <Navigate to="/home" />;
    }

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="card col-md-6 offset-3">
                    <h2 className="text-center">Login</h2>
                    <form className="p-5 pt-1" onSubmit={formik.handleSubmit}>
                        <Form.Group controlId="formEmail" className="col-md-12 mb-4">
                            <Form.Control
                                type="text"
                                placeholder="Enter email"
                                name="email"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            <div className="error">{formik.touched.email && formik.errors.email}</div>
                        </Form.Group>

                        <Form.Group controlId="formPassword" className="col-md-12">
                            <Form.Control
                                type="password"
                                placeholder="Enter password"
                                name="password"
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            <div className="error">{formik.touched.password && formik.errors.password}</div>
                        </Form.Group>

                        <button className="btn btn-info col-md-4 offset-4 mt-4" type="submit" disabled={loading}>
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
