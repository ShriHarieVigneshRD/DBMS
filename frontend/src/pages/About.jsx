import React from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

const About = () => {
  const navigate = useNavigate();
  const teamMembers = [
    { role: 'Dinesh Kumarun', focus: 'React & UI/UX' },
    { role: 'Shri Harie Vignesh', focus: 'Integration & Testing' },
    { role: 'Sharon David', focus: 'Node.js & REST API' },
    { role: 'Syed Farhan', focus: 'MySQL & AWS & UI/UX' },
    { role: 'Mohamed Amjad', focus: 'Authentication & Backend & Testing' }
  ];

  const features = [
    { title: 'Real-Time Data', description: 'Live cryptocurrency market data simulation' },
    { title: 'Secure Trading', description: 'Protected transactions with JWT authentication' },
    { title: 'Portfolio Tracking', description: 'Comprehensive investment monitoring' },
    { title: 'Risk-Free Learning', description: 'Practice trading without real money' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <Navbar />
      <main className="container mx-auto px-4 py-22 space-y-16">
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-6xl font-bold text-slate-900 mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">
            About Us
          </h1>
          <p className="text-xl text-slate-700 mb-8 leading-relaxed">
            Welcome to our project! This platform is a crypto stock simulation and trading web app built as a CS project by 5 students at IIITDM. We've created a safe space for you to learn and practice cryptocurrency trading without any real financial risk.
          </p>
        </div>

        {/* Tech Stack Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-800 mb-6 text-center">Our Tech Stack</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: 'MySQL Database',
                description: 'Hosted on AWS RDS for reliable data storage',
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
                  />
                ),
              },
              {
                title: 'Node.js Backend',
                description: 'Powerful and scalable server implementation',
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                ),
              },
              {
                title: 'React Frontend',
                description: 'Modern and responsive user interface',
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                  />
                ),
              },
              {
                title: 'JWT Authentication',
                description: 'Secure route protection and user sessions',
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                ),
              }
            ].map((tech, index) => (
              <div key={index} className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg h-full">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {tech.icon}
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{tech.title}</h3>
                  <p className="text-slate-600">{tech.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Features Grid */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">Key Features</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold text-slate-800 mb-2">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center max-w-3xl mx-auto bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl p-8 text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Trading?</h2>
          <p className="text-xl mb-6">
            Explore our app and simulate your crypto investments safely and intuitively!
          </p>
          <button onClick={() => navigate("/")} className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-blue-50 transition-colors">
            Get Started
          </button>
        </div>

        {/* Team Section */}
        <div className="max-w-5xl mx-auto">
  <h2 className="text-3xl font-bold text-slate-800 mb-6 text-center">Meet the Team</h2>

  {/* First Row (2 cards) */}
  <div className="flex justify-center gap-6 mb-6 flex-wrap">
    {teamMembers.slice(0, 3).map((member, index) => (
      <div
        key={index}
        className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow text-center w-[300px]"
      >
        <h3 className="text-xl font-semibold text-slate-800 mb-2">{member.role}</h3>
        <p className="text-slate-600">{member.focus}</p>
      </div>
    ))}
  </div>

  {/* Second Row (2 cards centered) */}
  <div className="flex justify-center gap-6 flex-wrap">
    {teamMembers.slice(3, 5).map((member, index) => (
      <div
        key={index}
        className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow text-center w-[350px]"
      >
        <h3 className="text-xl font-semibold text-slate-800 mb-2">{member.role}</h3>
        <p className="text-slate-600">{member.focus}</p>
      </div>
    ))}
  </div>
</div>
{/* End of team section*/}
      </main>
    </div>

    
  );
};

export default About;
