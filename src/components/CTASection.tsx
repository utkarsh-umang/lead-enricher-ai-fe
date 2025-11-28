import { useNavigate } from 'react-router-dom';
import { useTheme } from '../theme';
import BackgroundImage from './BackgroundImage';
import enleadBadge from '../assets/enlead_badge.png';

const CTASection = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const handleSignup = () => {
    navigate('/signup');
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-20">
      <BackgroundImage />
      <div className="max-w-4xl mx-auto relative z-10 w-full">
        <div className="text-center">
          {/* Single CTA Card with all content */}
          <div 
            className="mx-auto p-8 md:p-12 rounded-2xl shadow-2xl"
            style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #fafafa 100%)',
              opacity: 0.9
            }}
          >
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <div className="h-16 rounded-full overflow-hidden flex items-center justify-center">
                <img 
                  src={enleadBadge} 
                  alt="EnLead Logo" 
                  className="h-full w-full object-contain"
                />
              </div>
            </div>
            
            {/* Heading */}
            <p 
              className="text-lg md:text-xl lg:text-2xl mb-8 max-w-3xl mx-auto"
              style={{ color: theme.palette.text.secondary }}
            >
              Enrich your leads with AI-powered intelligence!
              <br />
              Automate your outreach campaigns!
            </p>
            
            {/* Subheading */}
            <p 
              className="text-base md:text-lg mb-8 max-w-2xl mx-auto"
              style={{ color: theme.palette.text.secondary }}
            >
              Supercharge your lead generation
            </p>
            
            {/* CTA Button */}
            <button
              onClick={handleSignup}
              className="mx-auto flex items-center justify-center gap-2 py-4 px-8 rounded-lg font-semibold text-white transition-all duration-200 shadow-md hover:shadow-lg"
              style={{
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = theme.palette.primary.dark;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = theme.palette.primary.main;
              }}
            >
              Let's Begin
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;

