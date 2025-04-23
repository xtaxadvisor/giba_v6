// src/components/client/ProfileForm.tsx
import React, { useState } from 'react'
import { supabase } from '../../lib/supabase/client'

interface ProfileFormProps {
  /** Called when the profile has been successfully saved */
  onComplete: () => void
}

export default function ProfileForm({ onComplete }: ProfileFormProps) {
  const [userType, setUserType] = useState<'personal' | 'business'>('personal')
  const [formData, setFormData] = useState({
    fullName:     '',
    email:        '',
    businessName: '',
    service:      '',
  })
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // 1) get the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()
    if (userError || !user) {
      console.error('Could not get current user:', userError)
      return
    }

    // 2) upsert their profile row
    const { error: upsertError } = await supabase
      .from('profiles')
      .upsert({
        id:               user.id,
        full_name:        formData.fullName,
        email:            formData.email,
        business_name:    formData.businessName || null,
        service_interest: formData.service,
        user_type:        userType,
      })

    if (upsertError) {
      console.error('Failed to save profile:', upsertError)
      return
    }

    // 3) notify parent
    onComplete()
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-full max-w-md">
        <h2 className="text-xl font-semibold text-center mb-4">
          Welcome! Please complete your profile:
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">I am a</label>
            <select
              name="userType"
              value={userType}
              onChange={(e) => setUserType(e.target.value as any)}
              className="w-full border px-4 py-2 rounded"
            >
              <option value="personal">Personal user</option>
              <option value="business">Business user</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              name="fullName"
              type="text"
              required
              placeholder="Your full name"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded"
            />
          </div>
          {userType === 'business' && (
            <div>
              <label className="block text-sm font-medium mb-1">Business Name</label>
              <input
                name="businessName"
                type="text"
                required
                placeholder="Your business name"
                value={formData.businessName}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium mb-1">
              Which service are you interested in?
            </label>
            <select
              name="service"
              required
              value={formData.service}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded"
            >
              <option value="">Select a service</option>
              <option value="tax-planning">Tax Planning</option>
              <option value="financial-review">Financial Review</option>
              <option value="investment-advisory">Investment Advisory</option>
              <option value="business-consulting">Business Consulting</option>
              <option value="other">Other</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  )
}