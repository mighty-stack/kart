import { useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Signin = () => {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const navigate = useNavigate()

  const validationSchema = yup.object({
    email: yup
      .string()
      .email('Invalid email address')
      .required('Email is required'),
    password: yup
      .string()
      .required('Password is required')
      .min(8, 'Password must be at least 6 characters'),
  })

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: (values) => {
      setError('')
      setLoading(true)

      fetchProducts()
        .then(() => {
          return axios.post(
            'https://kart-backend.onrender.com/user/signin',
            values,
            {
              timeout: 10000, // 10 second timeout
              headers: {
                'Content-Type': 'application/json',
              },
            }
          )
        })
        .then((response) => {
          if (response.data.success) {
            const token = response.data.token
            const user = response.data.user

            if (rememberMe) {
              localStorage.setItem('token', token)
              localStorage.setItem('user', JSON.stringify(user))
            } else {
              sessionStorage.setItem('token', token)
              sessionStorage.setItem('user', JSON.stringify(user))
            }

            console.log('Signin successful, token stored.')
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
            navigate('/dashboard')
          } else {
            setError(response.data.message || 'Signin failed')
          }
        })
        .catch((err) => {
          console.error('Signin error:', err)

          if (err.code === 'ECONNABORTED') {
            setError('Request timed out. Please try again.')
          } else if (err.response) {
            if (err.response.status === 404) {
              setError('Signin endpoint not found. Please check your backend route.')
            } else if (err.response.status === 401) {
              setError('Invalid email or password.')
            } else if (err.response.status === 403) {
              setError('Account is not verified or suspended.')
            } else {
              const message =
                err.response.data?.message ||
                err.response.data?.error ||
                `Signin failed (${err.response.status})`
              setError(message)
            }
          } else if (err.request) {
            setError('Network error. Please check your connection and try again.')
          } else {
            setError('An unexpected error occurred. Please try again.')
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
                <h3 className="card-title fw-bold text-primary">Welcome Back</h3>
                <p className="text-muted">Sign in to your Kart account</p>
              </div>

              <form onSubmit={formik.handleSubmit} noValidate>
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

                <div className="row mb-3">
                  <div className="col">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="rememberMe"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                      />
                      <label className="form-check-label" htmlFor="rememberMe">
                        Remember me
                      </label>
                    </div>
                  </div>
                  <div className="col-auto">
                    <Link to="/forgot-password" className="text-decoration-none small">
                      Forgot Password?
                    </Link>
                  </div>
                </div>

                {error && (
                  <div className="alert alert-danger py-2 mb-3">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    {error}
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
                        Signing In...
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </button>
                </div>

                <div className="text-center mb-3">
                  <hr className="my-3" />
                  <span className="text-muted small">or</span>
                </div>

                <div className="text-center">
                  <p className="mb-0">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-decoration-none">
                      Create Account
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

export default Signin;
