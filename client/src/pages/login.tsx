import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/context/auth-context";
import { AuthForm } from "@/components/auth/auth-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building, ArrowLeft } from "lucide-react";

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const [_, setLocation] = useLocation();

  const handleLogin = async (name: string, email: string, password: string, role: string) => {
    setIsLoading(true);
    try {
      const success = await login(email, password);
      if (success) {
        setLocation("/dashboard");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-primary-50 to-white p-4">
      <div className="container mx-auto mt-6">
        <Button 
          variant="ghost" 
          className="flex items-center text-neutral-600 hover:text-primary-600"
          onClick={() => setLocation("/")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to home
        </Button>
      </div>
      
      <div className="flex-1 flex items-center justify-center">
        <Card className="w-full max-w-md shadow-lg border-none">
          <CardHeader className="text-center pb-8">
            <div className="flex justify-center mb-6">
              <div className="flex items-center gap-2">
                <Building className="h-8 w-8 text-primary-600" />
                <h1 className="font-heading font-bold text-2xl text-neutral-900">PropertyPulse</h1>
              </div>
            </div>
            <CardTitle className="text-2xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-800">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-neutral-600 mt-2">
              Sign in to your account to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AuthForm 
              type="login"
              onSubmit={handleLogin}
              isLoading={isLoading}
            />
            <div className="mt-8 text-center">
              <p className="text-sm text-neutral-600">
                Don't have an account?{" "}
                <Button variant="link" className="p-0 font-medium text-primary-600 hover:text-primary-700" onClick={() => setLocation("/register")}>
                  Sign up
                </Button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="container mx-auto text-center text-neutral-500 text-sm py-6">
        <p>© {new Date().getFullYear()} PropertyPulse. All rights reserved.</p>
      </div>
    </div>
  );
}
