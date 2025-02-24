import { LoginForm } from "@/components/auth/login-form";

export default function Home() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div 
        className="hidden lg:block bg-cover bg-center" 
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=2070&auto=format&fit=crop')",
          backgroundPosition: "center",
        }}
      >
        <div className="h-full w-full bg-black/50 p-8 flex items-end">
          <div className="text-white">
            <h1 className="text-4xl font-bold mb-4">Driver License Management System</h1>
            <p className="text-lg opacity-90">Streamline your license management process with our comprehensive solution.</p>
          </div>
        </div>
      </div>
      <LoginForm />
    </div>
  );
}