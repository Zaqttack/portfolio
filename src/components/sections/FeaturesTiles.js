import React from 'react';
import classNames from 'classnames';
import { SectionTilesProps } from '../../utils/SectionProps';
import SectionHeader from './partials/SectionHeader';
import Image from '../elements/Image';

const propTypes = {
  ...SectionTilesProps.types
}

const defaultProps = {
  ...SectionTilesProps.defaults
}
const FeaturesTiles = ({
  className,
  topOuterDivider,
  bottomOuterDivider,
  topDivider,
  bottomDivider,
  hasBgColor,
  invertColor,
  pushLeft,
  ...props
}) => {

  const outerClasses = classNames(
    'features-tiles section',
    topOuterDivider && 'has-top-divider',
    bottomOuterDivider && 'has-bottom-divider',
    hasBgColor && 'has-bg-color',
    invertColor && 'invert-color',
    className
  );

  const innerClasses = classNames(
    'features-tiles-inner section-inner pt-0',
    topDivider && 'has-top-divider',
    bottomDivider && 'has-bottom-divider'
  );

  const tilesClasses = classNames(
    'tiles-wrap center-content',
    pushLeft && 'push-left'
  );

  const sectionHeader = {
    title: 'Know my background',
    paragraph: 'Take a peek into the leadership that I can offer. These skills all came with the support of my team and with them, I will help lead!'
  };

  return (
    <section
      {...props}
      className={outerClasses}
    >
      <div className="container">
        <div className={innerClasses}>
          <SectionHeader data={sectionHeader} className="center-content" />
          <div className={tilesClasses}>

            <div className="tiles-item reveal-from-bottom">
              <div className="tiles-item-inner">
                <div className="features-tiles-item-header">
                  <div className="features-tiles-item-image mb-16">
                    <Image
                      src={require('./../../assets/images/feature-tile-icon-01.svg')}
                      alt="Features tile icon 01"
                      width={64}
                      height={64} />
                  </div>
                </div>
                <div className="features-tiles-item-content">
                  <h4 className="mt-0 mb-8">
                    Leadership
                    </h4>
                  <p className="m-0 text-sm">
                    Whether it is a group project in class or creating a Wiki for the largest CS club on campus, you can always rely on me to get the ball rolling!
                    </p>
                </div>
              </div>
            </div>

            <div className="tiles-item reveal-from-bottom" data-reveal-delay="200">
              <div className="tiles-item-inner">
                <div className="features-tiles-item-header">
                  <div className="features-tiles-item-image mb-16">
                    <Image
                      src={require('./../../assets/images/feature-tile-icon-03.svg')}
                      alt="Features tile icon 02"
                      width={64}
                      height={64} />
                  </div>
                </div>
                <div className="features-tiles-item-content">
                  <h4 className="mt-0 mb-8">
                    Teamwork
                    </h4>
                  <p className="m-0 text-sm">
                    Effectively and efficiently setting and completing task is my status quo.
                    </p>
                </div>
              </div>
            </div>

            <div className="tiles-item reveal-from-bottom" data-reveal-delay="400">
              <div className="tiles-item-inner">
                <div className="features-tiles-item-header">
                  <div className="features-tiles-item-image mb-16">
                    <Image
                      src={require('./../../assets/images/feature-tile-icon-02.svg')}
                      alt="Features tile icon 03"
                      width={64}
                      height={64} />
                  </div>
                </div>
                <div className="features-tiles-item-content">
                  <h4 className="mt-0 mb-8">
                    Coding Skills
                    </h4>
                  <p className="m-0 text-sm">
                    Although I am still growing, this is my future and it is what I am passionate about now.
                    </p>
                </div>
              </div>
            </div>

            <div className="tiles-item reveal-from-bottom">
              <div className="tiles-item-inner">
                <div className="features-tiles-item-header">
                  <div className="features-tiles-item-image mb-16">
                    <Image
                      src={require('./../../assets/images/feature-tile-icon-04.svg')}
                      alt="Features tile icon 04"
                      width={64}
                      height={64} />
                  </div>
                </div>
                <div className="features-tiles-item-content">
                  <h4 className="mt-0 mb-8">
                    Self Learner
                    </h4>
                  <p className="m-0 text-sm">
                    I would not be here now if it was not for need to be constantly acquiring new skills to help myself and my friends succeed.
                    </p>
                </div>
              </div>
            </div>

            {/*<div className="tiles-item reveal-from-bottom" data-reveal-delay="200">*/}
            {/*  <div className="tiles-item-inner">*/}
            {/*    <div className="features-tiles-item-header">*/}
            {/*      <div className="features-tiles-item-image mb-16">*/}
            {/*        <Image*/}
            {/*          src={require('./../../assets/images/feature-tile-icon-05.svg')}*/}
            {/*          alt="Features tile icon 05"*/}
            {/*          width={64}*/}
            {/*          height={64} />*/}
            {/*      </div>*/}
            {/*    </div>*/}
            {/*    <div className="features-tiles-item-content">*/}
            {/*      <h4 className="mt-0 mb-8">*/}
            {/*        Robust Workflow*/}
            {/*        </h4>*/}
            {/*      <p className="m-0 text-sm">*/}
            {/*        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat.*/}
            {/*        </p>*/}
            {/*    </div>*/}
            {/*  </div>*/}
            {/*</div>*/}

            <div className="tiles-item reveal-from-bottom" data-reveal-delay="200">
              <div className="tiles-item-inner">
                <div className="features-tiles-item-header">
                  <div className="features-tiles-item-image mb-16">
                    <Image
                      src={require('./../../assets/images/feature-tile-icon-06.svg')}
                      alt="Features tile icon 06"
                      width={64}
                      height={64} />
                  </div>
                </div>
                <div className="features-tiles-item-content">
                  <h4 className="mt-0 mb-8">
                    Dependable
                    </h4>
                  <p className="m-0 text-sm">
                    Always around when a task needs to be completed and will ensure that time can be set aside for just about any problem.
                    </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

FeaturesTiles.propTypes = propTypes;
FeaturesTiles.defaultProps = defaultProps;

export default FeaturesTiles;