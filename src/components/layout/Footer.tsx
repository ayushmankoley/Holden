import "./Footer.css";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__content">
        <div className="footer__logo">
          HOLDEN
          <span className="footer__glyph" aria-hidden="true">
            ✶
          </span>
        </div>



        <p className="footer__copyright">
          © {currentYear} Holden. All rights reserved.
          <br />
          Regulated real-world asset issuance on Stellar.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
