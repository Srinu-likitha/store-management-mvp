import { 
  FiArrowRight, 
  FiClipboard, 
  FiFileText, 
  FiPieChart, 
  FiShield, 
  FiTruck,
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto">
        <div className="flex items-center space-x-2">
          <FiTruck className="h-8 w-8 text-blue-600" />
          <span className="text-2xl font-bold text-gray-800">BuildMaterial</span>
        </div>
        <div className="hidden md:flex space-x-8">
          <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">Features</a>
          <a href="#how-it-works" className="text-gray-600 hover:text-blue-600 transition-colors">How It Works</a>
          <a href="#testimonials" className="text-gray-600 hover:text-blue-600 transition-colors">Testimonials</a>
        </div>
        <button 
          onClick={() => navigate('/login')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
        >
          Get Started
        </button>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-16 md:py-24 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-10 md:mb-0">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            Streamline Your Construction Material Management
          </h1>
          <p className="text-xl text-gray-600 mt-6">
            Efficiently manage materials, invoices, and deliveries with our all-in-one platform designed specifically for construction companies.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <button 
              onClick={() => navigate('/login')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-medium transition-colors flex items-center justify-center"
            >
              Get Started <FiArrowRight className="ml-2" />
            </button>
            <button className="border border-gray-300 hover:border-gray-400 text-gray-700 px-8 py-4 rounded-lg text-lg font-medium transition-colors">
              Learn More
            </button>
          </div>
        </div>
        <div className="md:w-1/2 flex justify-center">
          <div className="bg-white p-4 rounded-xl shadow-xl">
            <img 
              src="https://images.unsplash.com/photo-1605106702734-205df224ecce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
              alt="Construction material management dashboard" 
              className="rounded-lg w-full h-auto max-w-md"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Powerful Features for Construction Management</h2>
            <p className="text-xl text-gray-600 mt-4">
              Everything you need to manage materials efficiently and keep your projects on track
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
            <FeatureCard 
              icon={<FiShield className="h-8 w-8 text-blue-600" />}
              title="Role-Based Permissions"
              description="Control access with customizable roles and permissions for different team members."
            />
            <FeatureCard 
              icon={<FiFileText className="h-8 w-8 text-blue-600" />}
              title="Material Invoices"
              description="Create, track, and approve material invoices with our streamlined workflow."
            />
            <FeatureCard 
              icon={<FiClipboard className="h-8 w-8 text-blue-600" />}
              title="Delivery Challans"
              description="Generate and manage delivery challans with real-time tracking and approval system."
            />
            <FeatureCard 
              icon={<FiPieChart className="h-8 w-8 text-blue-600" />}
              title="Analytics Dashboard"
              description="Gain insights with comprehensive analytics on material usage, costs, and trends."
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">How It Works</h2>
            <p className="text-xl text-gray-600 mt-4">
              Streamline your material management process in four simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
            <StepCard 
              step="1"
              title="Add Materials"
              description="Input material details, quantities, and specifications into the system."
            />
            <StepCard 
              step="2"
              title="Create Requests"
              description="Generate material requests or invoices for approval based on project needs."
            />
            <StepCard 
              step="3"
              title="Approve & Track"
              description="Managers approve requests and track material status in real-time."
            />
            <StepCard 
              step="4"
              title="Analyze & Optimize"
              description="Use dashboard analytics to optimize material usage and reduce costs."
            />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Trusted by Construction Companies</h2>
            <p className="text-xl text-gray-600 mt-4">
              See what industry professionals are saying about our material management solution
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <TestimonialCard 
              name="Michael Rodriguez"
              company="Skyline Construction"
              text="This platform has reduced our material waste by 23% and improved our project timelines significantly."
              avatar="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80"
            />
            <TestimonialCard 
              name="Sarah Johnson"
              company="Urban Builders Inc."
              text="The approval workflow for invoices and DCs has streamlined our operations and reduced errors dramatically."
              avatar="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80"
            />
            <TestimonialCard 
              name="James Wilson"
              company="Foundation Constructors"
              text="The dashboard analytics have given us insights we never had before, helping us optimize material purchasing."
              avatar="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold">Ready to Transform Your Material Management?</h2>
          <p className="text-xl mt-4 opacity-90">
            Join thousands of construction companies that have streamlined their operations with our platform
          </p>
          <button 
            onClick={() => navigate('/login')}
            className="mt-8 bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-lg text-lg font-medium transition-colors"
          >
            Get Started Today
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2">
              <FiTruck className="h-8 w-8 text-blue-500" />
              <span className="text-2xl font-bold text-white">BuildMaterial</span>
            </div>
            <p className="mt-4">
              Streamlining construction material management for companies of all sizes.
            </p>
          </div>
          <div>
            <h3 className="text-white text-lg font-semibold">Product</h3>
            <ul className="mt-4 space-y-2">
              <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
              <li><a href="#testimonials" className="hover:text-white transition-colors">Testimonials</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white text-lg font-semibold">Company</h3>
            <ul className="mt-4 space-y-2">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white text-lg font-semibold">Legal</h3>
            <ul className="mt-4 space-y-2">
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-8 pt-8 border-t border-gray-800 text-center">
          <p>© {new Date().getFullYear()} BuildMaterial. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

// Feature Card Component
function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-gray-50 p-6 rounded-xl hover:shadow-md transition-shadow">
      <div className="bg-blue-100 p-3 rounded-lg w-fit">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mt-4">{title}</h3>
      <p className="text-gray-600 mt-2">{description}</p>
    </div>
  );
}

// Step Card Component
function StepCard({ step, title, description }: { step: string, title: string, description: string }) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="bg-blue-600 h-14 w-14 rounded-full flex items-center justify-center text-white font-bold text-xl mb-4">
        {step}
      </div>
      <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
      <p className="text-gray-600 mt-2">{description}</p>
    </div>
  );
}

// Testimonial Card Component
function TestimonialCard({ name, company, text, avatar }: { name: string, company: string, text: string, avatar: string }) {
  return (
    <div className="bg-gray-50 p-6 rounded-xl">
      <div className="flex items-center">
        <img src={avatar} alt={name} className="h-12 w-12 rounded-full object-cover" />
        <div className="ml-4">
          <h4 className="font-semibold text-gray-900">{name}</h4>
          <p className="text-blue-600">{company}</p>
        </div>
      </div>
      <p className="mt-4 text-gray-600 italic">"{text}"</p>
    </div>
  );
}