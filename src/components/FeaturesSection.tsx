import { Sparkles, Target, Zap } from 'lucide-react';
import { useTheme } from '../theme';

const FeaturesSection = () => {
  const { theme } = useTheme();

  const features = [
    {
      icon: <Sparkles className="h-8 w-8" />,
      title: 'AI-Powered Enrichment',
      description: 'Automatically enrich your leads with accurate data using advanced AI algorithms.'
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: 'Smart Campaigns',
      description: 'Create and manage outreach campaigns with intelligent automation.'
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: 'Real-time Insights',
      description: 'Get instant insights into your lead generation and campaign performance.'
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 
          className="text-3xl md:text-4xl font-bold text-center mb-12"
          style={{ color: theme.palette.text.primary }}
        >
          Why Choose EnLead AI?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 rounded-xl border hover:shadow-lg transition-shadow"
              style={{
                backgroundColor: theme.palette.background.default,
                borderColor: theme.palette.divider
              }}
            >
              <div 
                className="mb-4"
                style={{ color: theme.palette.primary.main }}
              >
                {feature.icon}
              </div>
              <h3 
                className="text-xl font-semibold mb-2"
                style={{ color: theme.palette.text.primary }}
              >
                {feature.title}
              </h3>
              <p 
                className="text-sm"
                style={{ color: theme.palette.text.secondary }}
              >
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;

