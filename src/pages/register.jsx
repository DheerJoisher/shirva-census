import { supabase } from '../supabaseClient';
import { useState } from 'react';

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone_number: ''
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, password, firstName, lastName, phone_number } = formData;

    const { data, error } = await supabase.auth.signUp({ email, password });
    console.log('Signup data:', data);
    console.log('Signup error:', error);
    if (error) {
      console.error('Signup error:', error.message);
      setError(error.message);
      return;
    }

    const userId = data.user?.id;
    if (!userId) {
      console.error('User ID not found after signup');
      setError('User ID not found after signup');
      return;
    }

    const { data: userData, error: insertError } = await supabase.from('pending_users').insert([
      {
        id: userId,
        first_name: firstName,
        last_name: lastName,
        email: email,
        phone_number: phone_number,
        registered_at: new Date().toISOString(),
    
      },
    ]);

    if (insertError) {
      console.error('Error inserting user into database:', insertError.message);
      setError(insertError.message);
      return;
    }

    console.log('User signed up successfully. Awaiting verification:', userData);
  };

  return (
    <section className="bg-base-300">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-base-100 rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-base-content md:text-2xl">
              Create an account
            </h1>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="firstName" className="block mb-2 text-sm font-medium text-base-content">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  id="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-base-content rounded-lg block w-full p-2.5"
                  placeholder="John"
                  required
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block mb-2 text-sm font-medium text-base-content">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  id="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-base-content rounded-lg block w-full p-2.5"
                  placeholder="Doe"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-base-content">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-base-content rounded-lg block w-full p-2.5"
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-base-content">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-base-content rounded-lg block w-full p-2.5"
                  required
                />
              </div>
              <div>
                <label htmlFor="phone_number" className="block mb-2 text-sm font-medium text-base-content">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone_number"
                  id="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-base-content rounded-lg block w-full p-2.5"
                  placeholder="1234567890"
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-primary w-full text-white hover:bg-primary-200 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                Sign up
              </button>
              <p className="text-sm font-light text-gray-500">
                Already have an account?{' '}
                <a href="#" className="font-medium text-primary-600 hover:underline">
                  Sign in
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Signup;
