import React, { useState } from 'react';
import Header from './Header';
import Footer from './Footer'
const AboutMe = () => {
  const [factIndex, setFactIndex] = useState(0);
  const [showFact, setShowFact] = useState(false);

  const facts = [
    "🚀 I built a real-time video calling app using the MERN stack!",
    "🎯 I love building UIs with React and Tailwind CSS.",
    "📚 I'm always learning — currently diving deeper into system design.",
    "🌍 I believe in using tech to create meaningful impact.",
  ];



  return (
    <>
    <Header/>
    <div style={styles.wrapper} >
      <div style={styles.container}>
        {/* Left Side: Image */}
        <div style={styles.left}>
          <img
            src="https://res.cloudinary.com/desmscq2h/image/upload/v1751702869/WhatsApp_Image_2024-11-06_at_23.35.05_ea9b4e01_jgw5g6.jpg"
            alt="Profile"
            style={styles.image}
          />
        </div>

        {/* Right Side: Content */}
        <div style={styles.right}>
          <h1 style={styles.heading}>Hi, I'm Abhishek Duggal 👋</h1>
          <p style={styles.text}>
            I'm a full-stack developer who loves building responsive, fast, and accessible web applications using the MERN stack.
          </p>

          <div style={styles.section}>
            <h3 style={styles.subheading}>🎓 Education</h3>
            <p>B.Tech in Computer Science from chitkara univeristy- passionate about scalable systems and clean architecture.</p>
          </div>

          <div style={styles.section}>
            <h3 style={styles.subheading}>🎯 Interests</h3>
            <ul>
              <li>Full Stack</li>
              <li>MYSQL</li>
              <li>UI/UX Design</li>
              <li>AWS</li>
              <li>JAVA</li>
            </ul>
          </div>

          <div style={styles.section}>
            <h3 style={styles.subheading}>💬 My Belief</h3>
            <p>
              I believe great things are built through curiosity, consistency, and collaboration.
            </p>
          </div>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
};

const styles = {
  wrapper: {
    background: '#F6F5ED',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '30px',
  },
  container: {
    display: 'flex',
    backgroundColor: '#fff',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
    maxWidth: '1100px',
    width: '100%',
  },
  left: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '30px',
  },
  image: {
    width: '280px',
    height: '280px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '4px solid #ccc',
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
  },
  right: {
    flex: 2,
    padding: '40px',
  },
  heading: {
    fontSize: '2rem',
    marginBottom: '15px',
    color: '#333',
  },
  text: {
    fontSize: '1.05rem',
    color: '#555',
    marginBottom: '25px',
  },
  subheading: {
    fontSize: '1.3rem',
    marginBottom: '8px',
    color: '#222',
  },
  section: {
    marginBottom: '20px',
    color: '#444',
    fontSize: '1rem',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#f5a623',
    color: '#fff',
    border: 'none',
    borderRadius: '25px',
    cursor: 'pointer',
    fontWeight: 'bold',
    marginTop: '10px',
  },
  fact: {
    marginTop: '15px',
    fontStyle: 'italic',
    color: '#555',
  },
};

export default AboutMe;
