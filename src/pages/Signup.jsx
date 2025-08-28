import React from 'react'
import { Formik, useFormik } from 'formik'
import * as yup from 'yup'

const Signup = () => {
  let formik = useFormik({
    initialValues:{
      firstname: "",
      lastname: "",
      email: "",
      password: "",
    },
    onSubmit:(values)=>{
      console.log(values)
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
    <div>
      <form action="" onSubmit={formik.handleSubmit}>
        <input type="text" placeholder="First Name" name="firstname" id="firstName" onChange={formik.handleChange} onBlur={formik.handleBlur} />
        <small className='text-danger'>{formik.touched.firstname && formik.errors.firstname }</small> <br />

        <input type="text" placeholder="Last Name" name="" id="lastName" onChange={formik.handleChange} onBlur={formik.handleBlur}/>
        <small className='text-danger'>{formik.touched.lastname && formik.errors.lastname}</small> <br />

        <input type="text" placeholder="Email" name="email" id="email" onChange={formik.handleChange} onBlur={formik.handleBlur}/>
        <small className='text-danger'>{formik.touched.email && formik.errors.email }</small> <br />

        <input type="text" placeholder="Password" name="password" id="password" onChange={formik.handleChange} onBlur={formik.handleBlur}/>
        <small className='text-danger'>{formik.touched.password && formik.errors.password }</small> <br />

        <button type="submit">SignUp</button>
      </form>
    </div>
  )
}

export default Signup