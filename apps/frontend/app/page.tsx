export default function AuthPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 via-purple-200 to-blue-300 relative overflow-hidden">

      {/* Background blobs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-400 rounded-full blur-3xl opacity-40"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-cyan-300 rounded-full blur-3xl opacity-40"></div>

      {/* Glass Container */}
      <div className="backdrop-blur-xl bg-white/30 shadow-2xl rounded-3xl p-6 w-[90%] max-w-6xl flex">

        {/* Left Section */}
        <div className="flex-1 flex flex-col justify-center px-10">
          <h1 className="text-3xl font-semibold text-gray-800 mb-4">
            Fast, Efficient and Productive
          </h1>
          <p className="text-gray-600 max-w-md">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
          </p>

          {/* Footer links */}
          <div className="absolute bottom-6 left-10 flex items-center gap-6 text-sm text-gray-600">
            <span>🌐 English</span>
            <span>Terms</span>
            <span>Plans</span>
            <span>Contact Us</span>
          </div>
        </div>

        {/* Right Section (Form Card) */}
        <div className="w-[420px] bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Sign Up
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Your Social Campaigns
          </p>

          {/* Inputs */}
          <div className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="password"
              placeholder="Repeat Password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Terms */}
          <div className="flex items-center gap-2 mt-4 text-sm text-gray-600">
            <input type="checkbox" />
            <span>
              I accept the <span className="text-blue-600">Terms</span>
            </span>
          </div>

          {/* Social buttons */}
          <div className="flex items-center gap-4 mt-6">
            <button className="flex-1 border rounded-lg py-2 text-sm hover:bg-gray-50">
              Google
            </button>
            <button className="flex-1 border rounded-lg py-2 text-sm hover:bg-gray-50">
              Apple
            </button>
          </div>

          {/* Submit */}
          <button className="w-full mt-6 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
            Sign Up
          </button>

          {/* Footer */}
          <p className="text-sm text-center mt-4 text-gray-500">
            Already have an account?{" "}
            <span className="text-blue-600 cursor-pointer">Sign In</span>
          </p>
        </div>
      </div>
    </div>
  );
}