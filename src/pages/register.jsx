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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const { email, password, firstName, lastName, phone_number } = formData;

      const { data, error } = await supabase.auth.signUp({ email, password });
      
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

      const { error: insertError } = await supabase.from('pending_users').insert([
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

      // Set registration success
      setRegistrationSuccess(true);
      // Clear form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phone_number: ''
      });
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (registrationSuccess) {
    return (
      <section className="bg-base-300 min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md bg-base-100 rounded-lg shadow p-8 text-center">
          <div className="mb-4 mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-4 text-base-content">Registration Successful!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for registering. We've sent a confirmation link to your email address. 
            Please check your inbox and verify your email to complete the registration process.
            And wait for the admin to approve your account. The account will be approved in a period of 1-31 Days.
          </p>
          <div className="flex flex-col space-y-3">
            <a href="/signin" className="btn btn-primary text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg">
              Go to Sign In
            </a>
            <button 
              onClick={() => setRegistrationSuccess(false)} 
              className="btn btn-outline hover:shadow-lg text-base-content border-gray-300 bg-base-100 hover:bg-base-200 px-4 py-2 rounded-lg"
            >
              Register Another Account
            </button>
          </div>
        </div>
      </section>
    );
  }

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
                disabled={isSubmitting}
                className="bg-blue-500 w-full text-white hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  "Sign up"
                )}
              </button>
              <p className="text-sm font-light text-gray-500">
                Already have an account?{' '}
                <a href="/signin" className="font-medium text-primary-600 hover:underline">
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
