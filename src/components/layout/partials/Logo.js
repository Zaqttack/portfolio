import React from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import Image from '../../elements/Image';

const Logo = ({
  className,
  ...props
}) => {

  const classes = classNames(
    'brand',
    className
  );

  return (
    <div
      {...props}
      className={classes}
    >
      <h1 className="m-0">
        {/*<a href={"https://www.youtube.com/watch?v=e0oQi6nVWfs&feature=youtu.be"}>*/}
          <Image
            src={require('./../../../assets/images/z-logo.svg')}
            alt="Open"
            width={32}
            height={32} />
        {/*</a>*/}
      </h1>
    </div>
  );
}

export default Logo;