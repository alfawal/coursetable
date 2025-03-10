import React from 'react';
import styles from './Join.module.css';
import { TextComponent } from '../components/StyledComponents';

/**
 * Renders the Join Us page
 */

const Join: React.VFC = () => {
  return (
    <div className={`${styles.container} mx-auto`}>
      <h1 className={`${styles.join_header} mt-5 mb-3`}>Join Us!</h1>
      <p className={`${styles.join_description} mb-5`}>
        <TextComponent type={1}>
          Applications for 2023-24 opening soon! Check back later.
        </TextComponent>
      </p>
      <p className={`${styles.join_description} mb-5`}>
        <TextComponent type={2}>
         CourseTable is open source, feel free to contribute to our{' '}
          <a href="https://github.com/coursetable/coursetable">GitHub</a>!
          And <a href="mailto:coursetable.at.yale@gmail.com"> email us</a> 
          {' '} if you have any questions.
        </TextComponent>
      </p>
    
    </div>
  );
};

export default Join;
