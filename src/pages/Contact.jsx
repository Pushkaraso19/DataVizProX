import { useState, useRef, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { motion } from 'framer-motion';

const Contact = () => {
  const [status, setStatus] = useState({
    submitting: false,
    submitted: false,
    success: false,
    error: null
  });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const formRef = useRef(null);

  // Check for URL parameters on component mount to detect form submission redirects
  useEffect(() => {
    // Check if there's a "submitted" parameter in the URL
    const urlParams = new URLSearchParams(window.location.search);
    const formSubmitted = urlParams.get('submitted');
  
    if (formSubmitted === 'true') {
      console.log("Submission detected, showing success modal");
      // Show success modal after redirect
      setStatus({
        submitting: false,
        submitted: true,
        success: true,
        error: null
      });
  
      // Clean up URL without reloading the page
      window.history.replaceState({}, document.title, window.location.pathname);
    } else {
      console.log("No submission detected in URL");
    }
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [id]: value
    }));
  };

  // Regular form submission handles everything now
  const handleFormSubmit = (e) => {
    // We're not preventing default - let the form submit naturally
    setStatus({
      submitting: true,
      submitted: false,
      success: false,
      error: null
    });
  };

  const closeModal = () => {
    setStatus(prev => ({
      ...prev,
      submitted: false
    }));
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.4 } }
  };

  const buttonVariants = {
    initial: { scale: 1 },
    hover: { scale: 1 },
    tap: { scale: 0.95 }
  };

  // For debugging - remove in production
  useEffect(() => {
    console.log("Current status:", status);
  }, [status]);

  return (
    <div className="contact-page-wrapper py-5">
      <motion.div
        className="container contact-us mb-5"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
        }}
      >
        <motion.h1 
          className="text-5xl font-bold mb-6 text-[#388e3c] text-center" 
          variants={itemVariants}
        >
          Contact Us
        </motion.h1>
        
        <motion.p 
          className="text-center mb-5" 
          variants={itemVariants}
        >
          If you have any questions or feedback, feel free to reach out to us!
        </motion.p>

        <div className="row">
          {/* Left column */}
          <div className="col-lg-5 mb-4">
            <motion.div 
              className="contact-details p-4 bg-light rounded mb-4" 
              variants={itemVariants}
            >
              <h2 className="mb-4 underline text-center">Get in Touch</h2>

              <motion.div className="d-flex align-items-center mb-3" whileHover={{ scale: 1.03, x: 3 }}>
                <a href="tel:+919172220935">
                  <i className="fas fa-phone me-3 text-success"></i>+91 91722-20935
                </a>
              </motion.div>

              <motion.div className="d-flex align-items-center mb-3" whileHover={{ scale: 1.03, x: 3 }}>
                <a href="mailto:info@datavizpro.com">
                  <i className="fas fa-envelope me-3 text-success"></i>info.datavizpro@gmail.com
                </a>
              </motion.div>

              <motion.div className="location-container mb-4">
                <div className="d-flex align-items-start mb-3">
                  <p className="mb-0">
                    <span><i className="fas fa-map-marker-alt mt-1 me-3 text-success"></i></span>
                    Konkan Gyanpeeth College of Engineering, Sankul, Vengaon Road, 
                    Dahivali, Karjat, Raigad, Maharashtra, India, 410201
                  </p>
                </div>
                <div className="map-container rounded-lg overflow-hidden mt-2">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2244.2412248195205!2d73.34001957902959!3d18.91594905783619!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7fb0353655121%3A0x665102db024b2c9!2sKonkan%20Gyanpeeth%20College%20of%20Engineering%2C%20Karjat%20-%20410201%2C%20Raigad.!5e0!3m2!1sen!2sin!4v1729442122290!5m2!1sen!2sin"
                    width="100%"
                    height="250"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    title="College Location"
                  ></iframe>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Divider */}
          <div className="col-lg-1 d-none d-lg-flex justify-content-center">
            <div style={{ width: '1px', backgroundColor: '#dee2e6', height: '100%' }}></div>
          </div>

          {/* Right column with form */}
          <div className="col-lg-7">
            <div className="position-relative">
              <motion.div 
                className="contact-form p-6 bg-white rounded-lg shadow-sm" 
                variants={itemVariants}
              >
                <h2 className="mb-4 underline text-center">Contact Form</h2>

                {/* Standard HTML form with direct action */}
                <form 
                  id="contactForm" 
                  ref={formRef} 
                  onSubmit={handleFormSubmit}
                  action="https://formsubmit.co/info.datavizpro@gmail.com" 
                  method="POST"
                >
                  {/* Add hidden honeypot field to prevent spam */}
                  <input type="text" name="_honey" style={{ display: 'none' }} />
                  
                  {/* Disable captcha */}
                  <input type="hidden" name="_captcha" value="false" />
                  
                  {/* Add success redirect back to the contact page with a success parameter */}
                  <input 
                    type="hidden" 
                    name="_next" 
                    value={`${window.location.origin}${window.location.pathname}?submitted=true`} 
                  />

                  {/* FormSubmit needs this to avoid template response */}
                  <input type="hidden" name="_template" value="table" />

                  <motion.div className="form-group mb-3" variants={itemVariants}>
                    <label htmlFor="name" className="form-label">Name</label>
                    <div>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        className="form-control"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        disabled={status.submitting}
                      />
                    </div>
                  </motion.div>

                  <motion.div className="form-group mb-3" variants={itemVariants}>
                    <label htmlFor="email" className="form-label">Email</label>
                    <div>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className="form-control"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        disabled={status.submitting}
                      />
                    </div>
                  </motion.div>

                  <motion.div className="form-group mb-4" variants={itemVariants}>
                    <label htmlFor="message" className="form-label">Message</label>
                    <div>
                      <textarea
                        id="message"
                        name="message"
                        className="form-control"
                        rows="5"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        disabled={status.submitting}
                      ></textarea>
                    </div>
                  </motion.div>

                  <motion.div variants={buttonVariants} initial="initial" whileHover="hover" whileTap="tap">
                    <button
                      type="submit"
                      className="btn btn-success px-4 py-2"
                      disabled={status.submitting}
                    >
                      {status.submitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Sending...
                        </>
                      ) : (
                        'Send Message'
                      )}
                    </button>
                  </motion.div>
                </form>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Success Modal - Using separate state tracking to ensure it shows */}
      <Modal 
        show={status.submitted && status.success} 
        onHide={closeModal} 
        centered
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>Message Sent!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center mb-3">
            <i className="fas fa-check-circle text-success" style={{ fontSize: '3rem' }}></i>
          </div>
          <p className="text-center">
            Your message has been received! We will get back to you soon.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={closeModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Error Modal */}
      <Modal 
        show={status.submitted && !status.success} 
        onHide={closeModal} 
        centered
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>Something Went Wrong</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center mb-3">
            <i className="fas fa-exclamation-circle text-danger" style={{ fontSize: '3rem' }}></i>
          </div>
          <p className="text-center">
            {status.error || "We couldn't send your message. Please try again later."}
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Close
          </Button>
          <Button variant="primary" onClick={() => {
            closeModal();
            setTimeout(() => {
              if (formRef.current) {
                formRef.current.scrollIntoView({ behavior: 'smooth' });
              }
            }, 300);
          }}>
            Try Again
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Contact;