import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Building, Home, Users, Wrench, ChevronRight, CheckCircle, Shield, BarChart3 } from "lucide-react";

export default function Landing() {
  const [_, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-primary-50 to-primary-100">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Building className="h-6 w-6 text-primary-600" />
              <h1 className="font-heading font-bold text-xl text-neutral-900">PropertyPulse</h1>
            </div>
            <div className="space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => setLocation("/login")}
                className="font-medium"
              >
                Sign in
              </Button>
              <Button 
                onClick={() => setLocation("/register")}
                className="bg-primary-600 hover:bg-primary-700"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section Content */}
        <section className="bg-gradient-to-r from-primary-50 to-primary-100 py-20">
          <div className="container mx-auto px-6">
            <div className="flex flex-col lg:flex-row items-center">
              <div className="lg:w-1/2 mb-10 lg:mb-0">
                <h1 className="text-4xl md:text-5xl font-heading font-bold text-neutral-900 mb-6 leading-tight">
                  Streamline Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-primary-700">Property Management</span> Experience
                </h1>
                <p className="text-lg text-neutral-700 mb-8 max-w-xl">
                  An all-in-one platform for landlords, property managers, and tenants to simplify rental management, communications, and maintenance tracking.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    onClick={() => setLocation("/register")}
                    size="lg"
                    className="bg-primary-600 hover:bg-primary-700 font-medium"
                  >
                    Start Free Trial
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="border-primary-600 text-primary-600"
                    onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    Learn More
                  </Button>
                </div>
              </div>
              <div className="lg:w-1/2">
                <div className="relative">
                  <div className="absolute -top-6 -right-6 bg-neutral-200 rounded-lg h-full w-full"></div>
                  <img 
                    src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80" 
                    alt="Modern apartment building" 
                    className="relative rounded-lg shadow-lg transform transition-transform hover:scale-[1.02] hover:shadow-xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-heading font-bold text-neutral-900 mb-4">
                Everything You Need to Manage Your Properties
              </h2>
              <p className="text-neutral-600 max-w-2xl mx-auto">
                Our comprehensive platform helps you save time, reduce stress, and increase efficiency in your property management operations.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-white p-8 rounded-xl shadow-sm border border-neutral-200 hover:shadow-md transition-shadow">
                <div className="bg-primary-100 p-3 w-14 h-14 rounded-lg flex items-center justify-center mb-6">
                  <Home className="h-7 w-7 text-primary-600" />
                </div>
                <h3 className="text-xl font-heading font-semibold text-neutral-900 mb-3">Property Dashboard</h3>
                <p className="text-neutral-600 mb-4">
                  Get a complete overview of all your properties, occupancy rates, and financial performance in one place.
                </p>
                <a className="inline-flex items-center text-primary-600 font-medium">
                  Learn more <ChevronRight className="h-4 w-4 ml-1" />
                </a>
              </div>

              {/* Feature 2 */}
              <div className="bg-white p-8 rounded-xl shadow-sm border border-neutral-200 hover:shadow-md transition-shadow">
                <div className="bg-secondary-100 p-3 w-14 h-14 rounded-lg flex items-center justify-center mb-6">
                  <Users className="h-7 w-7 text-secondary-600" />
                </div>
                <h3 className="text-xl font-heading font-semibold text-neutral-900 mb-3">Tenant Management</h3>
                <p className="text-neutral-600 mb-4">
                  Easily handle tenant applications, leases, communications, and payment collection in one system.
                </p>
                <a className="inline-flex items-center text-primary-600 font-medium">
                  Learn more <ChevronRight className="h-4 w-4 ml-1" />
                </a>
              </div>

              {/* Feature 3 */}
              <div className="bg-white p-8 rounded-xl shadow-sm border border-neutral-200 hover:shadow-md transition-shadow">
                <div className="bg-warning-100 p-3 w-14 h-14 rounded-lg flex items-center justify-center mb-6">
                  <Wrench className="h-7 w-7 text-warning-600" />
                </div>
                <h3 className="text-xl font-heading font-semibold text-neutral-900 mb-3">Maintenance Tracking</h3>
                <p className="text-neutral-600 mb-4">
                  Track maintenance requests, schedule repairs, and manage vendor relationships with ease.
                </p>
                <a className="inline-flex items-center text-primary-600 font-medium">
                  Learn more <ChevronRight className="h-4 w-4 ml-1" />
                </a>
              </div>

              {/* Feature 4 */}
              <div className="bg-white p-8 rounded-xl shadow-sm border border-neutral-200 hover:shadow-md transition-shadow">
                <div className="bg-danger-100 p-3 w-14 h-14 rounded-lg flex items-center justify-center mb-6">
                  <BarChart3 className="h-7 w-7 text-danger-600" />
                </div>
                <h3 className="text-xl font-heading font-semibold text-neutral-900 mb-3">Financial Reports</h3>
                <p className="text-neutral-600 mb-4">
                  Generate comprehensive financial reports, track expenses, and monitor rent collections.
                </p>
                <a className="inline-flex items-center text-primary-600 font-medium">
                  Learn more <ChevronRight className="h-4 w-4 ml-1" />
                </a>
              </div>

              {/* Feature 5 */}
              <div className="bg-white p-8 rounded-xl shadow-sm border border-neutral-200 hover:shadow-md transition-shadow">
                <div className="bg-neutral-100 p-3 w-14 h-14 rounded-lg flex items-center justify-center mb-6">
                  <Shield className="h-7 w-7 text-neutral-600" />
                </div>
                <h3 className="text-xl font-heading font-semibold text-neutral-900 mb-3">Secure Document Storage</h3>
                <p className="text-neutral-600 mb-4">
                  Safely store leases, contracts, inspection reports, and other important documents.
                </p>
                <a className="inline-flex items-center text-primary-600 font-medium">
                  Learn more <ChevronRight className="h-4 w-4 ml-1" />
                </a>
              </div>

              {/* Feature 6 */}
              <div className="bg-white p-8 rounded-xl shadow-sm border border-neutral-200 hover:shadow-md transition-shadow">
                <div className="bg-primary-100 p-3 w-14 h-14 rounded-lg flex items-center justify-center mb-6">
                  <CheckCircle className="h-7 w-7 text-primary-600" />
                </div>
                <h3 className="text-xl font-heading font-semibold text-neutral-900 mb-3">Automated Notifications</h3>
                <p className="text-neutral-600 mb-4">
                  Set up automated reminders for rent payments, lease renewals, and scheduled maintenance.
                </p>
                <a className="inline-flex items-center text-primary-600 font-medium">
                  Learn more <ChevronRight className="h-4 w-4 ml-1" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary-600 py-16">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-heading font-bold text-white mb-4">
              Ready to simplify your property management?
            </h2>
            <p className="text-primary-100 max-w-2xl mx-auto mb-8">
              Join thousands of property owners and managers who are saving time and increasing efficiency with PropertyPulse.
            </p>
            <Button 
              onClick={() => setLocation("/register")}
              size="lg"
              className="bg-white text-primary-600 hover:bg-primary-50"
            >
              Get Started Today
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-neutral-900 text-neutral-300 py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between mb-8">
            <div className="mb-8 md:mb-0">
              <div className="flex items-center gap-2 mb-4">
                <Building className="h-6 w-6 text-primary-500" />
                <h2 className="font-heading font-bold text-xl text-white">PropertyPulse</h2>
              </div>
              <p className="text-neutral-400 max-w-xs">
                The complete property management solution for landlords and property managers.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-white font-medium mb-4">Product</h3>
                <ul className="space-y-2">
                  <li><a className="hover:text-primary-400">Features</a></li>
                  <li><a className="hover:text-primary-400">Pricing</a></li>
                  <li><a className="hover:text-primary-400">Integrations</a></li>
                  <li><a className="hover:text-primary-400">Updates</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-white font-medium mb-4">Company</h3>
                <ul className="space-y-2">
                  <li><a className="hover:text-primary-400">About</a></li>
                  <li><a className="hover:text-primary-400">Blog</a></li>
                  <li><a className="hover:text-primary-400">Careers</a></li>
                  <li><a className="hover:text-primary-400">Contact</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-white font-medium mb-4">Resources</h3>
                <ul className="space-y-2">
                  <li><a className="hover:text-primary-400">Community</a></li>
                  <li><a className="hover:text-primary-400">Help Center</a></li>
                  <li><a className="hover:text-primary-400">Terms of Service</a></li>
                  <li><a className="hover:text-primary-400">Privacy Policy</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-neutral-800 pt-8 text-center text-sm text-neutral-500">
            <p>© {new Date().getFullYear()} PropertyPulse. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}