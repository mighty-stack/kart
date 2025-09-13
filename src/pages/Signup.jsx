import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const navigate = useNavigate()

  const validationSchema = yup.object({
    firstname: yup
      .string()
      .min(2)
      .max(15)
      .matches(/^[a-zA-Z\s]+$/)
      .required('First name is required'),
    lastname: yup
      .string()
      .min(2)
      .max(15)
      .matches(/^[a-zA-Z\s]+$/)
      .required('Last name is required'),
    email: yup
      .string()
      .email('Invalid email address')
      .required('Email is required'),
    password: yup
      .string()
      .required('Password is required')
      .min(8, 'Password must be at least 8 characters')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&._#^-])[A-Za-z\d@$!%*?&._#^-]{8,}$/,
        'Min 8 chars, with uppercase, lowercase, number & special character'
      ),
    confirmPassword: yup
      .string()
      .required('Please confirm your password')
      .oneOf([yup.ref('password')], 'Passwords must match'),
  })

  const formik = useFormik({
    initialValues: {
      firstname: '',
      lastname: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema,
    onSubmit: (values) => {
      setServerError('')
      setSuccessMessage('')
      setLoading(true)

      const { confirmPassword, ...submitData } = values

      axios
        .post('https://kart-backend.onrender.com/user/register', submitData, {
          timeout: 10000,
          headers: { 'Content-Type': 'application/json' },
        })
        .then((res) => {
          if (res.status === 201 || res.status === 200) {
            setSuccessMessage('Account created successfully! Redirecting...')

            if (res.data.token) {
              localStorage.setItem('token', res.data.token)
            }

            setTimeout(() => {
              navigate('/dashboard')
            }, 1500)
          } else {
            setServerError('Signup failed. Please try again.')
          }
        })
        .catch((err) => {
          if (err.code === 'ECONNABORTED') {
            setServerError('Request timed out. Please try again.')
          } else if (err.response) {
            const message =
              err.response.data?.message ||
              err.response.data?.error ||
              `Signup failed (${err.response.status})`
            setServerError(message)
          } else if (err.request) {
            setServerError(
              'Network error. Please check your connection and try again.'
            )
          } else {
            setServerError('An unexpected error occurred. Please try again.')
          }
        })
        .finally(() => {
          setLoading(false)
        })
    },
  })

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className="container mt-5 mb-5">
      <div className="row justify-content-center">
        <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5">
          <div className="card shadow-lg border-0 rounded-3">
            <div className="card-body p-4">
              <div className="text-center mb-4">
                <h3 className="card-title fw-bold text-primary">Create Account</h3>
                <p className="text-muted">Join Kart and start shopping!</p>
              </div>

              <form onSubmit={formik.handleSubmit} noValidate>
                <div className="mb-3">
                  <label htmlFor="firstname" className="form-label fw-semibold">
                    First Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    id="firstname"
                    className={`form-control py-2 ${
                      formik.touched.firstname && formik.errors.firstname
                        ? 'is-invalid'
                        : formik.touched.firstname && !formik.errors.firstname
                        ? 'is-valid'
                        : ''
                    }`}
                    placeholder="Enter your first name"
                    {...formik.getFieldProps('firstname')}
                  />
                  {formik.touched.firstname && formik.errors.firstname && (
                    <div className="invalid-feedback">
                      {formik.errors.firstname}
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="lastname" className="form-label fw-semibold">
                    Last Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    id="lastname"
                    className={`form-control py-2 ${
                      formik.touched.lastname && formik.errors.lastname
                        ? 'is-invalid'
                        : formik.touched.lastname && !formik.errors.lastname
                        ? 'is-valid'
                        : ''
                    }`}
                    placeholder="Enter your last name"
                    {...formik.getFieldProps('lastname')}
                  />
                  {formik.touched.lastname && formik.errors.lastname && (
                    <div className="invalid-feedback">
                      {formik.errors.lastname}
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label fw-semibold">
                    Email Address <span className="text-danger">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    className={`form-control py-2 ${
                      formik.touched.email && formik.errors.email
                        ? 'is-invalid'
                        : formik.touched.email && !formik.errors.email
                        ? 'is-valid'
                        : ''
                    }`}
                    placeholder="Enter your email address"
                    {...formik.getFieldProps('email')}
                  />
                  {formik.touched.email && formik.errors.email && (
                    <div className="invalid-feedback">{formik.errors.email}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label fw-semibold">
                    Password <span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      className={`form-control py-2 ${
                        formik.touched.password && formik.errors.password
                          ? 'is-invalid'
                          : formik.touched.password && !formik.errors.password
                          ? 'is-valid'
                          : ''
                      }`}
                      placeholder="Enter your password"
                      {...formik.getFieldProps('password')}
                    />
                  </div>
                  {formik.touched.password && formik.errors.password && (
                    <div className="invalid-feedback d-block">
                      {formik.errors.password}
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="confirmPassword" className="form-label fw-semibold">
                    Confirm Password <span className="text-danger">*</span>
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    className={`form-control py-2 ${
                      formik.touched.confirmPassword && formik.errors.confirmPassword
                        ? 'is-invalid'
                        : formik.touched.confirmPassword && !formik.errors.confirmPassword
                        ? 'is-valid'
                        : ''
                    }`}
                    placeholder="Confirm your password"
                    {...formik.getFieldProps('confirmPassword')}
                  />
                  {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                    <div className="invalid-feedback">
                      {formik.errors.confirmPassword}
                    </div>
                  )}
                </div>

                {successMessage && (
                  <div className="alert alert-success py-2 mb-3">
                    <i className="bi bi-check-circle me-2"></i>
                    {successMessage}
                  </div>
                )}

                {serverError && (
                  <div className="alert alert-danger py-2 mb-3">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    {serverError}
                  </div>
                )}

                <div className="d-grid gap-2 mb-3">
                  <button
                    type="submit"
                    className="btn btn-primary py-2 fw-semibold"
                    disabled={loading || !formik.isValid}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Creating Account...
                      </>
                    ) : (
                      'Create Account'
                    )}
                  </button>
                </div>

                <div className="text-center">
                  <p className="mb-0">
                    Already have an account?{' '}
                    <Link to="/signin" className="text-decoration-none">
                      Sign In
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};

export default Signup;
