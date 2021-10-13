import React from 'react';
import classNames from 'classnames';

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
          <a href="https://drive.google.com/file/d/1BaO6_zvsUadRQ8kNX5aBOaWNnBrjAUCs/view?usp=sharing">Resume</a>
        </li>
        <li>
          <a href="https://github.com/Zaqttack">GitHub</a>
        </li>
        <li>
          <a href="https://www.linkedin.com/in/zaquariah-holland/">LinkdIn</a>
        </li>
        <li>
          <a href="mailto:zaquariah@gmail.com">Email Me</a>
        </li>
      </ul>
    </nav>
  );
}

export default FooterNav;