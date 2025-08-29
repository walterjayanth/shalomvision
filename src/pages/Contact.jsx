import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  MessageCircle
} from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Form submitted:', formData);
  };

  const handleChange = (field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  return (
    <div className="p-6 lg:p-8 bg-slate-50">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl lg:text-5xl font-bold text-slate-800 mb-6">
          Get in <span className="text-amber-500">Touch</span>
        </h1>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
          We'd love to hear from you! Whether you have questions, prayer requests, 
          or want to get involved, we're here to connect with you.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
        {/* Contact Information */}
        <div className="space-y-8">
          <Card className="bg-white/80 backdrop-blur-sm border-slate-100 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-slate-800">
                <MessageCircle className="w-6 h-6 text-amber-500" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 mb-1">Address</h3>
                  <p className="text-slate-600">
                    Auckland, New Zealand<br />
                    (Specific address available upon request)
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 mb-1">Phone</h3>
                  <p className="text-slate-600">
                    +64 (0) 21 XXX XXXX<br />
                    <span className="text-sm text-slate-500">Available during office hours</span>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 mb-1">Email</h3>
                  <p className="text-slate-600">
                    info@shalomvision.co.nz<br />
                    pastor@shalomvision.co.nz
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 mb-1">Office Hours</h3>
                  <div className="text-slate-600 space-y-1">
                    <p>Monday - Friday: 9:00 AM - 5:00 PM</p>
                    <p>Saturday: 9:00 AM - 2:00 PM</p>
                    <p>Sunday: After Service Hours</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Service Times */}
          <Card className="bg-gradient-to-br from-amber-50 to-yellow-100/50 border-amber-200 shadow-lg">
            <CardHeader>
              <CardTitle className="text-slate-800">Service Times</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-white/60 rounded-lg">
                  <span className="font-medium text-slate-800">Sunday Worship</span>
                  <span className="text-slate-600">10:00 AM - 12:00 PM</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white/60 rounded-lg">
                  <span className="font-medium text-slate-800">Wednesday Bible Study</span>
                  <span className="text-slate-600">7:00 PM - 8:30 PM</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white/60 rounded-lg">
                  <span className="font-medium text-slate-800">Friday Prayer Meeting</span>
                  <span className="text-slate-600">6:30 PM - 8:00 PM</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Form */}
        <Card className="bg-white/80 backdrop-blur-sm border-slate-100 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-slate-800">
              <Send className="w-6 h-6 text-amber-500" />
              Send us a Message
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-slate-700">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={handleChange('name')}
                    placeholder="Your full name"
                    required
                    className="border-slate-200 focus:border-amber-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-700">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange('email')}
                    placeholder="your.email@example.com"
                    required
                    className="border-slate-200 focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-slate-700">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange('phone')}
                    placeholder="+64 21 XXX XXXX"
                    className="border-slate-200 focus:border-amber-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-slate-700">Subject *</Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={handleChange('subject')}
                    placeholder="How can we help you?"
                    required
                    className="border-slate-200 focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-slate-700">Message *</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={handleChange('message')}
                  placeholder="Share your thoughts, questions, or prayer requests with us..."
                  required
                  rows={6}
                  className="border-slate-200 focus:border-amber-400 resize-none"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3"
                size="lg"
              >
                <Send className="w-5 h-5 mr-2" />
                Send Message
              </Button>
            </form>

            <div className="mt-6 p-4 bg-amber-50 rounded-lg">
              <p className="text-sm text-amber-800">
                <strong>Need immediate assistance?</strong> For urgent matters or pastoral care, 
                please call our emergency contact line or visit us during service times.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}