const Login = () => {
  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <form>
        <input
          type="email"
          placeholder="Email"
          className="border rounded w-full p-2 mb-4"
        />
        <input
          type="password"
          placeholder="Password"
          className="border rounded w-full p-2 mb-4"
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded">
          Login
        </button>
      </form>
    </div>
  )
}

export default Login
