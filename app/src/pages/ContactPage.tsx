import { useState } from 'react';
import { FadeIn } from '@/components/FadeIn';
import { Send, Check } from 'lucide-react';

export function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="contact-page pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <FadeIn className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl mb-6 sm:mb-8" style={{ fontFamily: 'var(--header)' }}>
            Contact
          </h2>
          <p className="text-white text-base sm:text-lg tracking-wide max-w-md mx-auto">
            <span className="block">Questions about ASCEND?</span>
            <span className="block mt-3">We're here.</span>
          </p>
        </FadeIn>

        <FadeIn>
          {!submitted ? (
            <form onSubmit={handleSubmit} className="glass-card">
              {[
                { key: 'name', label: 'NAME', type: 'text', placeholder: 'Your name' },
                { key: 'email', label: 'EMAIL', type: 'email', placeholder: 'your@email.com' },
                { key: 'subject', label: 'SUBJECT', type: 'text', placeholder: 'How can we help?' }
              ].map((field) => (
                <div key={field.key} className="mb-5">
                  <label className="block text-xs text-[#E2CDB9] mb-2 tracking-widest">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    required
                    value={formData[field.key as keyof typeof formData]}
                    onChange={(e) => setFormData({...formData, [field.key]: e.target.value})}
                    placeholder={field.placeholder}
                  />
                </div>
              ))}

              <div className="mb-6">
                <label className="block text-xs text-[#E2CDB9] mb-2 tracking-widest">MESSAGE</label>
                <textarea
                  rows={6}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  placeholder="Your message..."
                />
              </div>

              <button type="submit" className="w-full btn-gold justify-center">
                Send Message <Send className="w-5 h-5" />
              </button>
            </form>
          ) : (
            <div className="glass-card text-center py-12">
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                <Check className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-2xl mb-3" style={{ fontFamily: 'var(--header)' }}>
                Thanks for reaching out
              </h3>
              <p className="text-white/60">
                We will get back to you as soon as we can.
              </p>
            </div>
          )}
        </FadeIn>

        {/* Contact Info */}
        <FadeIn className="mt-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-center">
            {[
              { label: 'Email', value: 'ascendskinlabs@gmail.com' },
              { label: 'Hours', value: 'Mon-Fri 9am-6pm EST' }
            ].map((item, i) => (
              <div key={i}>
                <p className="text-xs text-[#E2CDB9] tracking-widest mb-1">{item.label}</p>
                <p className="text-white text-sm">{item.value}</p>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
