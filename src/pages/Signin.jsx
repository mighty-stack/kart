import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const Signin = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    axios.post('http://localhost:3001/user/signin', form)
      .then(res => {
        let token = res.data.token
        localStorage.setItem('token',token)
        if(token){
          navigate('/dashboard')
        }
        // Handle successful signin (e.g., save token, redirect)
        // 
      console.log(token)
      })
      .catch(err => {
        if (err.response && err.response.data && err.response.data.message) {
          setError(err.response.data.message);
        } else if (err.response && err.response.status === 404) {
          setError('Signin endpoint not found. Please check your backend route.');
        } else {
          setError('Signin failed');
        }
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow">
            <div className="card-body">
              <h3 className="card-title mb-4 text-center">Sign In</h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                {error && <div className="alert alert-danger py-2">{error}</div>}
                <div className="d-grid">
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Signing in...' : 'Sign In'}
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

export default Signin;