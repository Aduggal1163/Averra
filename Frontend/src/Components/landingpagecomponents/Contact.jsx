import React, { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import axios from 'axios';
import Swal from 'sweetalert2';

const Contact = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    feedback: '',
    ratings: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:8080/api/v1/contact/feedback', form);
      Swal.fire({
        icon: 'success',
        title: 'Thank You!',
        text: res.data.message || 'Feedback submitted successfully!',
      });
      setForm({ name: '', email: '', phone: '', feedback: '', ratings: '' });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.response?.data?.message || 'Something went wrong. Please try again.',
      });
    }
  };

  return (
    <>
      <Header />
      <div style={styles.container}>
        <h2>Submit Your Feedback</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input type="text" name="name" placeholder="Your Name" value={form.name} onChange={handleChange} required style={styles.input} />
          <input type="email" name="email" placeholder="Your Email" value={form.email} onChange={handleChange} required style={styles.input} />
          <input type="tel" name="phone" placeholder="Your Phone" maxLength={10} minLength={10} value={form.phone} onChange={handleChange} required style={styles.input} />
          <textarea name="feedback" placeholder="Your Feedback" value={form.feedback} onChange={handleChange} required style={styles.textarea}></textarea>
          <input type="number" name="ratings" placeholder="Rating (1-5)" min={1} max={5} value={form.ratings} onChange={handleChange} required style={styles.input} />
          <button type="submit" style={styles.button}>Submit</button>
        </form>
      </div>
      <Footer />
    </>
  );
};

const styles = {
  container: {
    maxWidth: '500px',
    margin: '50px auto',
    padding: '30px',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
    fontFamily: 'sans-serif',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  input: {
    marginBottom: '15px',
    padding: '10px',
    fontSize: '16px',
  },
  textarea: {
    marginBottom: '15px',
    padding: '10px',
    minHeight: '100px',
    fontSize: '16px',
  },
  button: {
    padding: '12px',
    backgroundColor: '#4CAF50',
    color: '#fff',
    border: 'none',
    fontSize: '16px',
    cursor: 'pointer',
  },
};

export default Contact;
