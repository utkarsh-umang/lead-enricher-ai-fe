import { ReactNode } from 'react';
import BackgroundImage from './BackgroundImage';

interface MainContentContainerProps {
  children: ReactNode;
}

const MainContentContainer = ({ children }: MainContentContainerProps) => {
  return (
    <div className="relative min-h-screen">
      {/* Background image with opacity 0.5 */}
      <BackgroundImage imageOpacity={0.25} overlayColor="transparent" />
      
      {/* Content wrapper */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default MainContentContainer;

