import React from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';

const FooterNav = ({
  className,
  ...props
}) => {

  const classes = classNames(
    'footer-nav',
    className
  );

  return (
    <nav
      {...props}
      className={classes}
    >
      <ul className="list-reset">
        <li>
          <a href="https://tinyurl.com/1gqqzucp">Resume</a>
        </li>
        <li>
          <a href="https://github.com/Zaqttack">GitHub</a>
        </li>
        <li>
          <a href="https://www.linkedin.com/in/zaquariah-holland/">LinkdIn</a>
        </li>
        <li>
          <a href="https://www.instagram.com/president.zaquariah/">Instagram</a>
        </li>
        <li>
          <a href="mailto:president.zaquairah@gmail.com?subject=Contacting you about how great of a President you would be?">Contact</a>
        </li>
      </ul>
    </nav>
  );
}

export default FooterNav;