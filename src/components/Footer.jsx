import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <>
      <footer className="footer">
        <div className="footer-top">
          <div className="container">
            <div className="row">
              {/* Follow Us */}
              <div className="col-lg-3 col-md-6 mb-4">
                <div className="footer-widget">
                  <img src="https://citywala.com/assets/images/city-wala-logo.png"
                    alt="CityWala" style={{ height: 40, filter: 'brightness(10)' }} className="mb-3" />
                  <p style={{ fontSize: 13, color: '#aaa' }}>Find Global Experts & Services Anyone, Anywhere, Anytime.</p>
                  <h3 className="mt-3">Follow Us</h3>
                  <div className="social-icon mt-2">
                    <ul>
                      <li><a href="#"><i className="fab fa-facebook-f"></i></a></li>
                      <li><a href="#"><i className="fab fa-instagram"></i></a></li>
                      <li><a href="#"><i className="fab fa-linkedin-in"></i></a></li>
                      <li><a href="https://web.whatsapp.com/send?phone=8368741739" target="_blank"><i className="fab fa-whatsapp"></i></a></li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="col-lg-2 col-md-6 col-6 mb-4">
                <div className="footer-widget footer-menu">
                  <h2>Quick Links</h2>
                  <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><a href="#">About Us</a></li>
                    <li><a href="#">Contact Us</a></li>
                    <li><a href="#">Help</a></li>
                  </ul>
                </div>
              </div>

              {/* Useful Links */}
              <div className="col-lg-2 col-md-6 col-6 mb-4">
                <div className="footer-widget footer-menu">
                  <h2>Useful Links</h2>
                  <ul>
                    <li><a href="#">Cookie Policy</a></li>
                    <li><a href="#">Privacy Policy</a></li>
                    <li><a href="#">Terms & Conditions</a></li>
                    <li><Link to="/plan">Business Plan</Link></li>
                  </ul>
                </div>
              </div>

              {/* Popular Cities */}
              <div className="col-lg-2 col-md-6 col-6 mb-4">
                <div className="footer-widget footer-menu">
                  <h2>Popular Cities</h2>
                  <ul>
                    {['Bangalore', 'Mumbai', 'Chennai', 'Delhi', 'Hyderabad', 'Pune', 'Lucknow', 'Patna'].map(c => (
                      <li key={c}><a href="#">{c}</a></li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Contact */}
              <div className="col-lg-3 col-md-6 mb-4">
                <div className="footer-widget">
                  <h2>Communication</h2>
                  <div style={{ fontSize: 14 }}>
                    <div className="d-flex gap-2 align-items-start mb-3">
                      <i className="fa-solid fa-phone mt-1" style={{ color: '#1075be' }}></i>
                      <div>
                        <div style={{ color: '#888', fontSize: 12 }}>Call Us</div>
                        <a href="tel:8368741739" style={{ color: '#ccc' }}>+91 836 874 1739</a>
                      </div>
                    </div>
                    <div className="d-flex gap-2 align-items-start">
                      <i className="fa-solid fa-envelope mt-1" style={{ color: '#1075be' }}></i>
                      <div>
                        <div style={{ color: '#888', fontSize: 12 }}>Send Message</div>
                        <a href="mailto:citywala1959@gmail.com" style={{ color: '#ccc' }}>citywala1959@gmail.com</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-md-6">
                <p className="mb-0" style={{ fontSize: 13, color: '#888' }}>
                  © Copyright 2025 City Wala. All Rights Reserved.
                </p>
              </div>
              <div className="col-md-6 text-md-end">
                <div className="d-flex gap-2 justify-content-md-end mt-2 mt-md-0">
                  {[1, 2, 3, 4, 5, 6].map(n => (
                    <img key={n} src={`https://citywala.com/assets/images/${n}.svg`}
                      alt="payment" style={{ height: 20 }} onError={e => e.target.style.display = 'none'} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Buttons */}
      <a href="https://web.whatsapp.com/send?phone=8368741739" target="_blank" className="whatsapp-button">
        <i className="fab fa-whatsapp"></i>
      </a>
      <a href="tel:8368741739" className="call-button">
        <i className="fa-solid fa-phone"></i>
      </a>
    </>
  )
}
