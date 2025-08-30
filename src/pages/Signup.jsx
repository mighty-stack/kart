import React, { useState } from 'react'
import { Formik, useFormik } from 'formik'
import * as yup from 'yup'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'


const Signup = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()

  let formik = useFormik({
    initialValues:{
      firstname: "",
      lastname: "",
      email: "",
      password: "",
    },
    onSubmit:(values) => {
      setError('');
      setLoading(true);
      axios.post('http://localhost:3001/user/signin', values)
        .then(res => {
          // Handle successful signup (e.g., redirect or show message)
           navigate('/dashboard')
        })
        .catch(err => {
          if (err.response && err.response.data && err.response.data.message) {
            setError(err.response.data.message);
          } else {
            setError('Signup failed');
          }
        })
        .finally(() => setLoading(false));
    },
    validationSchema: yup.object ({
      firstname:yup.string().required("This field is required"),
      lastname:yup.string().required("This field is required"),
      email:yup.string().email("Invalid email").required("This field is required"),
      password: yup.string()
        .required("This field is required")
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&._#^-])[A-Za-z\d@$!%*?&._#^-]{8,}$/,
          "Password must be at least 8 characters, include uppercase, lowercase, number, and special character"
        ),
    })
  })
   console.log(formik.errors)

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow">
            <div className="card-body">
              <h3 className="card-title mb-4 text-center">Sign Up</h3>
              <form onSubmit={formik.handleSubmit}>
                <div className="mb-3">
                  <input
                    type="text"
                    className={`form-control ${formik.touched.firstname && formik.errors.firstname ? 'is-invalid' : ''}`}
                    placeholder="First Name"
                    name="firstname"
                    id="firstName"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  <small className='text-danger'>
                    {formik.touched.firstname && formik.errors.firstname}
                  </small>
                </div>

                <div className="mb-3">
                  <input
                    type="text"
                    className={`form-control ${formik.touched.lastname && formik.errors.lastname ? 'is-invalid' : ''}`}
                    placeholder="Last Name"
                    name="lastname"
                    id="lastName"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  <small className='text-danger'>
                    {formik.touched.lastname && formik.errors.lastname}
                  </small>
                </div>

                <div className="mb-3">
                  <input
                    type="email"
                    className={`form-control ${formik.touched.email && formik.errors.email ? 'is-invalid' : ''}`}
                    placeholder="Email"
                    name="email"
                    id="email"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  <small className='text-danger'>
                    {formik.touched.email && formik.errors.email}
                  </small>
                </div>

                <div className="mb-3">
                  <input
                    type="password"
                    className={`form-control ${formik.touched.password && formik.errors.password ? 'is-invalid' : ''}`}
                    placeholder="Password"
                    name="password"
                    id="password"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  <small className='text-danger'>
                    {formik.touched.password && formik.errors.password}
                  </small>
                </div>
                {error && <div className="alert alert-danger py-2">{error}</div>}
                <div className="d-grid">
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Signing up...' : 'Sign Up'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup