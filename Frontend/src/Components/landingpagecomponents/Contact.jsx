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

  const [hoveredStar, setHoveredStar] = useState(0);

  const handleStarClick = (rating) => {
    setForm({ ...form, ratings: rating });
  };

  const handleStarHover = (rating) => {
    setHoveredStar(rating);
  };

  const handleStarLeave = () => {
    setHoveredStar(0);
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
      <div style={styles.backgroundContainer}>
        {/* Animated Background Elements */}
        <div style={styles.animatedBg}>
          <div style={{ ...styles.floatingCircle, ...styles.circle1 }}></div>
          <div style={{ ...styles.floatingCircle, ...styles.circle2 }}></div>
          <div style={{ ...styles.floatingCircle, ...styles.circle3 }}></div>
          <div style={{ ...styles.floatingCircle, ...styles.circle4 }}></div>
          <div style={{ ...styles.floatingCircle, ...styles.circle5 }}></div>
          <div style={{ ...styles.floatingCircle, ...styles.circle6 }}></div>

          {/* Floating geometric shapes */}
          <div style={{ ...styles.floatingShape, ...styles.triangle1 }}></div>
          <div style={{ ...styles.floatingShape, ...styles.triangle2 }}></div>
          <div style={{ ...styles.floatingShape, ...styles.square1 }}></div>
          <div style={{ ...styles.floatingShape, ...styles.square2 }}></div>
        </div>

        {/* Main Content */}
        <div style={styles.container}>
          <h2 style={styles.title}>Submit Your Feedback</h2>
          <div style={styles.form}>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={form.name}
              onChange={handleChange}
              required
              style={styles.input}
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={form.email}
              onChange={handleChange}
              required
              style={styles.input}
            />
            <input
              type="tel"
              name="phone"
              placeholder="Your Phone"
              maxLength={10}
              minLength={10}
              value={form.phone}
              onChange={handleChange}
              required
              style={styles.input}
            />
            <textarea
              name="feedback"
              placeholder="Your Feedback"
              value={form.feedback}
              onChange={handleChange}
              required
              style={styles.textarea}
            ></textarea>

            {/* Star Rating */}
            <div style={styles.ratingContainer}>
              <label style={styles.ratingLabel}><b>Rating:</b></label>
              <div style={styles.starsContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    style={{
                      ...styles.star,
                      color: (hoveredStar >= star || form.ratings >= star) ? '#FFD700' : '#D3D3D3'
                    }}
                    onClick={() => handleStarClick(star)}
                    onMouseEnter={() => handleStarHover(star)}
                    onMouseLeave={handleStarLeave}
                  >
                    ★
                  </span>
                ))}
              </div>
              {form.ratings > 0 && (
                <span style={styles.ratingText}>
                  {form.ratings} star{form.ratings !== 1 ? 's' : ''}
                </span>
              )}
            </div>
            <button type="button" onClick={handleSubmit} style={styles.button}>Submit Feedback</button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

const styles = {
  backgroundContainer: {
    position: 'relative',
    minHeight: '100vh',
    backgroundColor: '#F6F5ED',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  animatedBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    zIndex: 1,
  },
  floatingCircle: {
    position: 'absolute',
    borderRadius: '50%',
    background: 'rgba(139, 125, 107, 0.1)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(139, 125, 107, 0.2)',
  },
  circle1: {
    width: '100px',
    height: '100px',
    top: '10%',
    left: '10%',
    animation: 'float 6s ease-in-out infinite',
  },
  circle2: {
    width: '80px',
    height: '80px',
    top: '20%',
    right: '15%',
    animation: 'float 8s ease-in-out infinite reverse',
  },
  circle3: {
    width: '120px',
    height: '120px',
    bottom: '20%',
    left: '5%',
    animation: 'float 10s ease-in-out infinite',
  },
  circle4: {
    width: '60px',
    height: '60px',
    bottom: '10%',
    right: '20%',
    animation: 'float 7s ease-in-out infinite reverse',
  },
  circle5: {
    width: '90px',
    height: '90px',
    top: '60%',
    left: '80%',
    animation: 'float 9s ease-in-out infinite',
  },
  circle6: {
    width: '70px',
    height: '70px',
    top: '80%',
    left: '60%',
    animation: 'float 5s ease-in-out infinite reverse',
  },
  floatingShape: {
    position: 'absolute',
    background: 'rgba(139, 125, 107, 0.08)',
    backdropFilter: 'blur(5px)',
    border: '1px solid rgba(139, 125, 107, 0.15)',
  },
  triangle1: {
    width: '0',
    height: '0',
    borderLeft: '25px solid transparent',
    borderRight: '25px solid transparent',
    borderBottom: '43px solid rgba(139, 125, 107, 0.15)',
    top: '30%',
    left: '20%',
    animation: 'rotate 15s linear infinite',
    background: 'none',
    border: 'none',
  },
  triangle2: {
    width: '0',
    height: '0',
    borderLeft: '20px solid transparent',
    borderRight: '20px solid transparent',
    borderBottom: '35px solid rgba(139, 125, 107, 0.12)',
    bottom: '30%',
    right: '10%',
    animation: 'rotate 20s linear infinite reverse',
    background: 'none',
    border: 'none',
  },
  square1: {
    width: '40px',
    height: '40px',
    top: '50%',
    left: '5%',
    animation: 'float 12s ease-in-out infinite, rotate 8s linear infinite',
    transform: 'rotate(45deg)',
  },
  square2: {
    width: '30px',
    height: '30px',
    top: '70%',
    right: '5%',
    animation: 'float 14s ease-in-out infinite reverse, rotate 10s linear infinite reverse',
    transform: 'rotate(45deg)',
  },
  container: {
    maxWidth: '500px',
    width: '100%',
    padding: '40px',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(20px)',
    borderRadius: '20px',
    boxShadow: '0 20px 40px rgba(139, 125, 107, 0.15)',
    fontFamily: 'sans-serif',
    position: 'relative',
    zIndex: 2,
    border: '1px solid rgba(139, 125, 107, 0.2)',
  },
  title: {
    textAlign: 'center',
    marginBottom: '30px',
    color: 'green',
    fontSize: '28px',
    fontWeight: '600',
    background: 'green',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  input: {
    marginBottom: '20px',
    padding: '15px',
    fontSize: '16px',
    border: '2px solid rgba(139, 125, 107, 0.3)',
    borderRadius: '10px',
    background: 'rgba(255, 255, 255, 0.9)',
    transition: 'all 0.3s ease',
    outline: 'none',
  },
  textarea: {
    marginBottom: '20px',
    padding: '15px',
    minHeight: '120px',
    fontSize: '16px',
    border: '2px solid rgba(139, 125, 107, 0.3)',
    borderRadius: '10px',
    background: 'rgba(255, 255, 255, 0.9)',
    transition: 'all 0.3s ease',
    outline: 'none',
    resize: 'vertical',
  },
  button: {
    padding: '15px',
    background:  'green',
    color: '#fff',
    border: 'none',
    fontSize: '18px',
    fontWeight: '600',
    cursor: 'pointer',
    borderRadius: '10px',
    transition: 'all 0.3s ease',
    boxShadow: '0 8px 20px rgba(139, 125, 107, 0.3)',
  },
  ratingContainer: {
    marginBottom: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  ratingLabel: {
    fontSize: '16px',
    fontWeight: '500',
    color: 'green',
    marginBottom: '10px',
  },
  starsContainer: {
    display: 'flex',
    gap: '5px',
    marginBottom: '8px',
  },
  star: {
    fontSize: '32px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    userSelect: 'none',
  },
  ratingText: {
    fontSize: '14px',
    color: '#8B7D6B',
    fontWeight: '500',
  },
};

// Add CSS animations
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes float {
    0%, 100% { transform: translateY(0px) translateX(0px); }
    25% { transform: translateY(-20px) translateX(10px); }
    50% { transform: translateY(-40px) translateX(-5px); }
    75% { transform: translateY(-20px) translateX(-10px); }
  }
  
  @keyframes rotate {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  input:focus, textarea:focus {
    border-color: #8B7D6B !important;
    box-shadow: 0 0 0 3px rgba(139, 125, 107, 0.1) !important;
    transform: translateY(-2px);
  }
  
  button:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 25px rgba(139, 125, 107, 0.4) !important;
  }
  
  button:active {
    transform: translateY(0px);
  }
  
  .star:hover {
    transform: scale(1.1);
  }
`;
document.head.appendChild(styleSheet);

export default Contact;