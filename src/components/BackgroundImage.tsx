import enleadBg from "../assets/enlead_bg.png";

interface BackgroundImageProps {
  imageOpacity?: number;
  overlayColor?: string;
  className?: string;
}

const BackgroundImage = ({ 
  imageOpacity = 0.5, 
  overlayColor = 'rgba(0, 0, 0, 0.25)',
  className = ''
}: BackgroundImageProps) => {
  return (
    <>
      {/* Background image with opacity */}
      <div 
        className={`absolute inset-0 ${className}`}
        style={{
          backgroundImage: `url(${enleadBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: imageOpacity
        }}
      ></div>
      
      {/* Background overlay for better readability */}
      <div 
        className={`absolute inset-0 ${className}`}
        style={{ backgroundColor: overlayColor }}
      ></div>
    </>
  );
};

export default BackgroundImage;

