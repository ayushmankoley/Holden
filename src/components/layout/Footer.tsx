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

        <nav className="footer__links" aria-label="Footer navigation">
          <a href="/account" className="footer__link">
            Account
          </a>
          <a href="/transactions" className="footer__link">
            Transactions
          </a>
          <a href="/admin" className="footer__link">
            Admin
          </a>
          <a href="/debug" className="footer__link">
            Debugger
          </a>
        </nav>

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
