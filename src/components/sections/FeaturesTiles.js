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
    title: 'My Skills',
    paragraph: 'Take a look at my most prominent skills!'
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
                    AWS
                    </h4>
                  <p className="m-0 text-sm">
                    After learning several front-end skills I turned my attention to learning skills in the cloud. Having my recent internship at SWBC I was able to acquire a load of knew knowledge.
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
                    HTML5/CSS
                    </h4>
                  <p className="m-0 text-sm">
                    After winning the Learner's Track at RowdyHacks 2020 with a basic understanding of HTML and CSS, I continued to learn about front-end web development in my free time and starting up several projects.
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
                    JavaScript/Node/npm
                    </h4>
                  <p className="m-0 text-sm">
                    After learning the fundamentals I advanced my skills by taking more classes and learning about the future of web development!
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
                    Linux Administration
                    </h4>
                  <p className="m-0 text-sm">
                    It is where I first started my interest in computer science, the command line. First learning about basic commands and later learning how to go from new OS installations and start up my own home servers.
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
                    Git/GitLab
                    </h4>
                  <p className="m-0 text-sm">
                    Learning about Version Control was crucial, not only have I utilized it in my own personal projects but learned the importance of it while working with git at a enterprise level.
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