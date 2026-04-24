import { Lock, Mail, User2Icon } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {

    const query = new URLSearchParams(window.location.search);
    const urlState = query.get("state")
  const [state, setState] = React.useState(urlState || "login");

  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const [error, setError] = React.useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const endpoint = state === "login" ? "/api/auth/login" : "/api/auth/register";
      const response = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        if (state === "login") {
          localStorage.setItem("resume-token", data.token);
          localStorage.setItem("resume-user", JSON.stringify(data.user));
          window.location.href = "/app";
        } else {
          alert("Registration successful! Please login.");
          setState("login");
        }
      } else {
        alert(data.error || "Something went wrong");
      }
    } catch (error) {
      console.error("Auth error:", error);
      alert("Failed to connect to the server");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <form
          onSubmit={handleSubmit}
          className="sm:w-[350px] w-full text-center border border-gray-300/60 rounded-2xl px-8 bg-white"
        >
          <h1 className="text-gray-900 text-3xl mt-10 font-medium">
            {state === "login" ? "Login" : "Sign up"}
          </h1>
          <p className="text-gray-500 text-sm mt-2 mb-4">
            Please {state} to continue
          </p>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          {state !== "login" && (
            <div className="flex items-center mt-6 w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
             <User2Icon size={16} color="#6B7280"/>
              <input
                type="text"
                name="name"
                placeholder="Name"
                className="border-none outline-none ring-0"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          )}
          <div className="flex items-center w-full mt-4 bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
            <Mail size={13} color="#6B7280"/>
            <input
              type="email"
              name="email"
              placeholder="Email id"
              className="border-none outline-none ring-0"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex items-center mt-4 w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
         <Lock size={13} color="#6B7280"/>
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="border-none outline-none ring-0"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mt-4 text-left text-green-500">
            <button className="text-sm" type="reset">
              Forget password?
            </button>
          </div>
          <button
            type="submit"
            className="mt-2 w-full h-11 rounded-full text-white bg-green-500 hover:opacity-90 transition-opacity"
          >
            {state === "login" ? "Login" : "Sign up"}
          </button>
          <p
            onClick={() =>
              setState((prev) => (prev === "login" ? "register" : "login"))
            }
            className="text-gray-500 text-sm mt-3 mb-11"
          >
            {state === "login"
              ? "Don't have an account?"
              : "Already have an account?"}{" "}
            <a href="#" className="text-green-500 hover:underline">
              click here
            </a>
          </p>
        </form>
      </div>
    </>
  );
};

export default Login;
