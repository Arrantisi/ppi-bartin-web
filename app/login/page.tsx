import { GoogleProvider } from "@/components/buttons";

const RegisterPage = () => {
  return (
    <div className="w-full h-screen max-w-xl md:max-w-3xl xl:max-w-6xl mx-auto flex items-center justify-center">
      <GoogleProvider />
    </div>
  );
};

export default RegisterPage;
