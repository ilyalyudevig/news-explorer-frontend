import ghIconSrc from "../images/github.svg";
import fbIconSrc from "../images/facebook.svg";
import { Link } from "react-router-dom";

function Footer() {
  const date = new Date();

  return (
    <footer className="footer" aria-label="Footer">
      <p className="footer__copyright">
        &copy; {`${date.getFullYear()}`} Supersite, Powered by News API
      </p>
      <div className="footer__links-container">
        <ul className="footer__links-list links links--main">
          <li className="links__item">
            <a className="links__link" href="#header">
              Home
            </a>
          </li>
          <li className="links__item">
            <a
              className="links__link"
              href="https://tripleten.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              TripleTen
            </a>
          </li>
        </ul>
        <ul className="footer__links-list links links--social">
          <li className="links__item">
            <a
              className="links__link"
              href="https://github.com/ilyalyudevig"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub profile"
            >
              <img src={ghIconSrc} alt="GitHub" />
            </a>
          </li>
          <li className="links__item">
            <a
              className="links__link"
              href="https://www.facebook.com/ilya.lyudevig"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook profile"
            >
              <img src={fbIconSrc} alt="Facebook" />
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
export default Footer;
