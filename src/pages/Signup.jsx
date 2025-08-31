// import React, { useState } from 'react'
// import { Formik, useFormik } from 'formik'
// import * as yup from 'yup'
// import axios from 'axios'
// import { useNavigate } from 'react-router-dom'


// const Signup = () => {
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate()

//   let formik = useFormik({
//     initialValues:{
//       firstname: "",
//       lastname: "",
//       email: "",
//       password: "",
//     },
//     onSubmit:(values) => {
//       setError('');
//       setLoading(true);
//       axios.post('https://kart-backend.onrender.com/user/signup', values)
//         .then(res => {
//           // Handle successful signup (e.g., redirect or show message)
//            navigate('/dashboard')
//         })
//         .catch(err => {
//           if (err.response && err.response.data && err.response.data.message) {
//             setError(err.response.data.message);
//           } else {
//             setError('Signup failed');
//           }
//         })
//         .finally(() => setLoading(false));
//     },
//     validationSchema: yup.object ({
//       firstname:yup.string().required("This field is required"),
//       lastname:yup.string().required("This field is required"),
//       email:yup.string().email("Invalid email").required("This field is required"),
//       password: yup.string()
//         .required("This field is required")
//         .matches(
//           /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&._#^-])[A-Za-z\d@$!%*?&._#^-]{8,}$/,
//           "Password must be at least 8 characters, include uppercase, lowercase, number, and special character"
//         ),
//     })
//   })
//    console.log(formik.errors)

//   return (
//     <div className="container mt-5 mb-5">
//       <div className="row justify-content-center">
//         <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5">
//           <div className="card shadow border-0">
//             <div className="card-body p-4">
//               <h3 className="card-title mb-4 text-center fw-bold">Sign Up</h3>
//               <form onSubmit={formik.handleSubmit}>
//                 <div className="mb-3">
//                   <input
//                     type="text"
//                     className={`form-control py-2 ${formik.touched.firstname && formik.errors.firstname ? 'is-invalid' : ''}`}
//                     placeholder="First Name"
//                     name="firstname"
//                     id="firstName"
//                     onChange={formik.handleChange}
//                     onBlur={formik.handleBlur}
//                   />
//                   <small className='text-danger'>
//                     {formik.touched.firstname && formik.errors.firstname}
//                   </small>
//                 </div>

//                 <div className="mb-3">
//                   <input
//                     type="text"
//                     className={`form-control py-2 ${formik.touched.lastname && formik.errors.lastname ? 'is-invalid' : ''}`}
//                     placeholder="Last Name"
//                     name="lastname"
//                     id="lastName"
//                     onChange={formik.handleChange}
//                     onBlur={formik.handleBlur}
//                   />
//                   <small className='text-danger'>
//                     {formik.touched.lastname && formik.errors.lastname}
//                   </small>
//                 </div>

//                 <div className="mb-3">
//                   <input
//                     type="email"
//                     className={`form-control py-2 ${formik.touched.email && formik.errors.email ? 'is-invalid' : ''}`}
//                     placeholder="Email"
//                     name="email"
//                     id="email"
//                     onChange={formik.handleChange}
//                     onBlur={formik.handleBlur}
//                   />
//                   <small className='text-danger'>
//                     {formik.touched.email && formik.errors.email}
//                   </small>
//                 </div>

//                 <div className="mb-3">
//                   <input
//                     type="password"
//                     className={`form-control py-2 ${formik.touched.password && formik.errors.password ? 'is-invalid' : ''}`}
//                     placeholder="Password"
//                     name="password"
//                     id="password"
//                     onChange={formik.handleChange}
//                     onBlur={formik.handleBlur}
//                   />
//                   <small className='text-danger'>
//                     {formik.touched.password && formik.errors.password}
//                   </small>
//                 </div>
//                 {error && <div className="alert alert-danger py-2 mb-3">{error}</div>}
//                 <div className="d-grid gap-2">
//                   <button type="submit" className="btn btn-primary py-2" disabled={loading}>
//                     {loading ? 'Signing up...' : 'Sign Up'}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Signup



import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ Validation schema (clear & reusable)
  const validationSchema = yup.object({
    firstname: yup
      .string()
      .trim()
      .required('First name is required'),
    lastname: yup
      .string()
      .trim()
      .required('Last name is required'),
    email: yup
      .string()
      .email('Invalid email address')
      .required('Email is required'),
    password: yup
      .string()
      .required('Password is required')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&._#^-])[A-Za-z\d@$!%*?&._#^-]{8,}$/,
        'Min 8 chars, with uppercase, lowercase, number & special character'
      ),
  });

  // ✅ Formik setup
  const formik = useFormik({
    initialValues: {
      firstname: '',
      lastname: '',
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setServerError('');
      setLoading(true);
      try {
        const res = await axios.post(
          'https://kart-backend.onrender.com/user/register',
          values
        );
        if (res.status === 201 || res.status === 200) {
          navigate('/dashboard');
        }
      } catch (err) {
        const message =
          err?.response?.data?.message || 'Signup failed. Please try again.';
        setServerError(message);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="container mt-5 mb-5">
      <div className="row justify-content-center">
        <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5">
          <div className="card shadow border-0">
            <div className="card-body p-4">
              <h3 className="card-title mb-4 text-center fw-bold">Sign Up</h3>

              <form onSubmit={formik.handleSubmit} noValidate>
                {/* First Name */}
                <div className="mb-3">
                  <label htmlFor="firstname" className="form-label fw-semibold">
                    First Name
                  </label>
                  <input
                    type="text"
                    className={`form-control py-2 ${
                      formik.touched.firstname && formik.errors.firstname
                        ? 'is-invalid'
                        : ''
                    }`}
                    placeholder="Enter first name"
                    {...formik.getFieldProps('firstname')}
                  />
                  {formik.touched.firstname && formik.errors.firstname && (
                    <div className="invalid-feedback">
                      {formik.errors.firstname}
                    </div>
                  )}
                </div>

                {/* Last Name */}
                <div className="mb-3">
                  <label htmlFor="lastname" className="form-label fw-semibold">
                    Last Name
                  </label>
                  <input
                    type="text"
                    className={`form-control py-2 ${
                      formik.touched.lastname && formik.errors.lastname
                        ? 'is-invalid'
                        : ''
                    }`}
                    placeholder="Enter last name"
                    {...formik.getFieldProps('lastname')}
                  />
                  {formik.touched.lastname && formik.errors.lastname && (
                    <div className="invalid-feedback">
                      {formik.errors.lastname}
                    </div>
                  )}
                </div>

                {/* Email */}
                <div className="mb-3">
                  <label htmlFor="email" className="form-label fw-semibold">
                    Email
                  </label>
                  <input
                    type="email"
                    className={`form-control py-2 ${
                      formik.touched.email && formik.errors.email
                        ? 'is-invalid'
                        : ''
                    }`}
                    placeholder="Enter email address"
                    {...formik.getFieldProps('email')}
                  />
                  {formik.touched.email && formik.errors.email && (
                    <div className="invalid-feedback">{formik.errors.email}</div>
                  )}
                </div>

                {/* Password */}
                <div className="mb-3">
                  <label htmlFor="password" className="form-label fw-semibold">
                    Password
                  </label>
                  <input
                    type="password"
                    className={`form-control py-2 ${
                      formik.touched.password && formik.errors.password
                        ? 'is-invalid'
                        : ''
                    }`}
                    placeholder="Enter password"
                    {...formik.getFieldProps('password')}
                  />
                  {formik.touched.password && formik.errors.password && (
                    <div className="invalid-feedback">
                      {formik.errors.password}
                    </div>
                  )}
                </div>

                {/* Server Error */}
                {serverError && (
                  <div className="alert alert-danger py-2 mb-3">
                    {serverError}
                  </div>
                )}

                {/* Submit */}
                <div className="d-grid gap-2">
                  <button
                    type="submit"
                    className="btn btn-primary py-2 fw-semibold"
                    disabled={loading}
                  >
                    {loading ? 'Signing up...' : 'Sign Up'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
