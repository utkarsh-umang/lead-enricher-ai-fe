import { useNavigate } from 'react-router-dom';
import { Brain, ArrowRight } from 'lucide-react';
import { useTheme } from '../theme';

const CTASection = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const handleSignup = () => {
    navigate('/signup');
  };

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div 
              className="p-4 rounded-2xl shadow-lg"
              style={{ backgroundColor: theme.palette.primary.main }}
            >
              <Brain className="h-16 w-16" style={{ color: theme.palette.primary.contrastText }} />
            </div>
          </div>
          
          {/* Heading */}
          <h1 
            className="text-5xl md:text-6xl font-extrabold mb-6"
            style={{ color: theme.palette.text.primary }}
          >
            Transform Your Lead Generation
          </h1>
          <p 
            className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto"
            style={{ color: theme.palette.text.secondary }}
          >
            Enrich your leads with AI-powered intelligence and automate your outreach campaigns
          </p>
          
          {/* CTA Card */}
          <div 
            className="max-w-md mx-auto mt-12 p-8 rounded-2xl shadow-xl border"
            style={{
              backgroundColor: theme.palette.background.paper,
              borderColor: theme.palette.divider
            }}
          >
            <h2 
              className="text-2xl font-bold mb-4"
              style={{ color: theme.palette.text.primary }}
            >
              Ready to get started?
            </h2>
            <p 
              className="text-sm mb-6"
              style={{ color: theme.palette.text.secondary }}
            >
              Join thousands of businesses using EnLead AI to supercharge their lead generation
            </p>
            <button
              onClick={handleSignup}
              className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-lg font-semibold text-white transition-all duration-200 shadow-md hover:shadow-lg"
              style={{
                backgroundColor: theme.palette.primary.main
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = theme.palette.primary.dark;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = theme.palette.primary.main;
              }}
            >
              Sign up for free
              <ArrowRight className="h-5 w-5" />
            </button>
            <p 
              className="text-xs mt-4 text-center"
              style={{ color: theme.palette.text.secondary }}
            >
              Already have an account?{' '}
              <button
                onClick={() => navigate('/login')}
                className="font-medium hover:underline"
                style={{ color: theme.palette.primary.main }}
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;

