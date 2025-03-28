const WavyBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Top wave */}
      <svg 
        className="absolute top-0 left-0 w-full opacity-10 text-indigo-600"
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 1440 320"
      >
        <path 
          fill="currentColor" 
          fillOpacity="1" 
          d="M0,224L48,213.3C96,203,192,181,288,154.7C384,128,480,96,576,106.7C672,117,768,171,864,197.3C960,224,1056,224,1152,202.7C1248,181,1344,139,1392,117.3L1440,96L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
        />
      </svg>
      
      {/* Middle wave */}
      <svg 
        className="absolute top-1/3 right-0 w-full opacity-5 text-indigo-800 transform rotate-180"
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 1440 320"
      >
        <path 
          fill="currentColor" 
          fillOpacity="1" 
          d="M0,128L48,122.7C96,117,192,107,288,101.3C384,96,480,96,576,117.3C672,139,768,181,864,170.7C960,160,1056,96,1152,74.7C1248,53,1344,75,1392,85.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        />
      </svg>
      
      {/* Bottom wave */}
      <svg 
        className="absolute bottom-0 left-0 w-full opacity-10 text-indigo-600"
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 1440 320"
      >
        <path 
          fill="currentColor" 
          fillOpacity="1" 
          d="M0,64L48,80C96,96,192,128,288,128C384,128,480,96,576,122.7C672,149,768,235,864,245.3C960,256,1056,192,1152,160C1248,128,1344,128,1392,128L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        />
      </svg>
      
      {/* Floating circles */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-indigo-100 opacity-10 mix-blend-multiply"></div>
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full bg-purple-100 opacity-10 mix-blend-multiply"></div>
    </div>
  );
};

export default WavyBackground;