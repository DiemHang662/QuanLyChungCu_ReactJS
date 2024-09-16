import React from 'react';
import FmdGoodIcon from '@mui/icons-material/FmdGood';
import PhoneIcon from '@mui/icons-material/Phone';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import { MDBFooter, MDBContainer, MDBRow, MDBCol } from 'mdb-react-ui-kit';
import './Footer.css';  // Importing custom CSS for footer

const Footer = () => {
  return (
    <MDBFooter className='footer bg-light'>
      <MDBContainer className='p-3 ms-8 bg-light'>
        <MDBRow>
          {/* Company Info Section */}
          <MDBCol md='5'>
            <h5 className='text-uppercase company-title'>CHUNG CƯ GOLDEN SEA</h5>
            <p className='company-info'>
              <FmdGoodIcon className="footer-icon" /> Địa chỉ: 172 Hoàng Hoa Thám, Phường 2, Thành phố Vũng Tàu
            </p>
            <p className='company-info'>
              <PhoneIcon className="footer-icon" /> Số điện thoại: 0933 615 915
            </p>
          </MDBCol>

          {/* Quick Links or Contact Section */}
          <MDBCol md='2'>
            <h5 className='text-uppercase company-title'>Liên Hệ</h5>
            <ul className='list-unstyled'>
              <li><a href='https://goldseavungtau.com/' className='footer-link'><GoogleIcon className="footer-icon" />Google</a></li>
              <li><a href='https://www.facebook.com/profile.php?id=100057359203270&__cft__[0]=AZVrcjVl0fdL_6RROacvRb-AmTEz1m3MxIiaBli3WcnpzIzWOSh3g9UJAVi0C3Vz76rDM9MYRyFtXq5wbwl169Vn1oDgWtclf69mhdu6eIfZaw&__tn__=-]C%2CP-R' className='footer-link'><FacebookIcon className="footer-icon"/>Facebook</a></li>
            </ul>
          </MDBCol>

          {/* Map Section */}
          <MDBCol md='4'>
            <h5 className='text-uppercase company-title'>Bản đồ</h5>
            <div className="map-container">
              <iframe
                title="Google Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3916.4190659469595!2d107.07555847554705!3d10.354088392586927!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752393fc8e292b%3A0x60e22e1a9ff66b8b!2s172%20Ho%C3%A0ng%20Hoa%20Th%C3%A1m%2C%20Ph%C6%B0%E1%BB%9Dng%202%2C%20Th%C3%A0nh%20ph%E1%BB%91%20V%C5%A9ng%20T%C3%A0u!5e0!3m2!1sen!2s!4v1694794265691!5m2!1sen!2s"
                width="100%"
                height="120"
                style={{ border: '0' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </MDBCol>

        </MDBRow>
      </MDBContainer>

      {/* Bottom copyright section */}
      <div className='text-center p-3 footer-bottom bg-primary'>
        <a className='text-white' href='#'>
          <strong>© 2024 copyright GOLDEN SEA</strong>
        </a>
      </div>
    </MDBFooter>
  );
}

export default Footer;
