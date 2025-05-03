'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const formSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type FormData = z.infer<typeof formSchema>;

export default function SubscribeForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    setStatus('loading');
    setErrorMessage('');

    try {
      if (typeof window === 'undefined' || !window.grecaptcha) {
        throw new Error('reCAPTCHA not loaded');
      }

      // Get reCAPTCHA token
      const token = await window.grecaptcha.execute(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!, {
        action: 'subscribe',
      });

      console.log('Form data:', data);
      console.log('reCAPTCHA token:', token);

      const requestBody = { ...data, token };
      console.log('Request body:', requestBody);

      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log('Response status:', response.status);
      const result = await response.json();
      console.log('Response data:', result);

      if (!response.ok) {
        throw new Error(result.error || 'Something went wrong');
      }

      setStatus('success');
      reset();
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Something went wrong');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-2 text-text">
          Email
        </label>
        <input
          id="email"
          type="email"
          placeholder="Enter your email"
          {...register('email')}
          className="w-full px-4 py-2 rounded-md bg-secondary border border-gray-700 text-text placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      {status === 'error' && (
        <div className="text-red-500 text-sm">{errorMessage}</div>
      )}

      {status === 'success' && (
        <div className="text-green-500 text-sm">
          Thanks for subscribing! You'll receive updates when new content is published.
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full px-6 py-3 bg-accent text-white rounded-md hover:bg-accent/80 transition-colors disabled:opacity-50"
      >
        {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
      </button>
    </form>
  );
} 