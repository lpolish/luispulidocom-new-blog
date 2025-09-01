'use client'

import Link from 'next/link'

export default function AuthCodeError() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl text-center">
      <h1 className="text-3xl font-bold text-text mb-4">
        Authentication Error
      </h1>
      
      <p className="text-textMuted mb-8">
        There was an error processing your authentication request. This could happen if:
      </p>
      
      <ul className="text-left text-textMuted mb-8 space-y-2">
        <li>• The verification link has expired</li>
        <li>• The link has already been used</li>
        <li>• There was a network error</li>
      </ul>
      
      <div className="space-y-4">
        <Link 
          href="/chess"
          className="inline-block bg-accent text-white px-6 py-3 rounded-lg hover:bg-accent/90 transition-colors font-medium"
        >
          Go to Chess Game
        </Link>
        
        <div>
          <Link 
            href="/"
            className="text-accent hover:underline"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  )
}