import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Cross, 
  Heart, 
  Users, 
  Globe, 
  BookOpen, 
  HandHelping,
  Target,
  Eye
} from "lucide-react";

export default function About() {
  return (
    <div className="p-6 lg:p-8 bg-slate-50">
      {/* Header */}
      <div className="text-center mb-16">
        <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
          <Cross className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl lg:text-5xl font-bold text-slate-800 mb-6">
          About <span className="text-amber-500">Shalom Vision Ministries</span>
        </h1>
        <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
          Founded on the principles of God's love, peace, and community, we are dedicated to 
          sharing the Gospel and building meaningful relationships that transform lives.
        </p>
      </div>

      {/* Our Story */}
      <section className="mb-20">
        <Card className="bg-white/80 backdrop-blur-sm border-slate-100 shadow-lg">
          <CardContent className="p-8 lg:p-12">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                  <BookOpen className="w-8 h-8 text-amber-500" />
                  Our Story
                </h2>
                <div className="space-y-4 text-slate-600 leading-relaxed">
                  <p>
                    Shalom Vision Ministries was birthed from a divine calling to create a space where 
                    people from all walks of life can experience the transformative power of God's love. 
                    Our name "Shalom" represents the Hebrew word for peace, wholeness, and completeness 
                    that comes only through a relationship with Jesus Christ.
                  </p>
                  <p>
                    What began as a small gathering of believers has grown into a vibrant community 
                    committed to worship, discipleship, and service. We believe that every person has 
                    infinite worth and potential in God's eyes, and our ministry exists to help people 
                    discover and walk in their divine purpose.
                  </p>
                  <p>
                    Through the years, we have witnessed countless lives transformed by the Gospel, 
                    families restored, and communities impacted by the love of Christ. Our vision 
                    continues to expand as we reach out to New Zealand and beyond with the message 
                    of hope and salvation.
                  </p>
                </div>
              </div>
              <div className="space-y-6">
                <div className="bg-amber-50/70 rounded-xl p-6">
                  <h3 className="font-semibold text-slate-800 mb-3">Founded</h3>
                  <p className="text-slate-600">Established with a heart for community and spiritual growth</p>
                </div>
                <div className="bg-slate-100 rounded-xl p-6">
                  <h3 className="font-semibold text-slate-800 mb-3">Location</h3>
                  <p className="text-slate-600">Serving communities throughout New Zealand</p>
                </div>
                <div className="bg-amber-50/70 rounded-xl p-6">
                  <h3 className="font-semibold text-slate-800 mb-3">Focus</h3>
                  <p className="text-slate-600">Biblical teaching, fellowship, and community outreach</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Mission & Vision */}
      <section className="mb-20">
        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="bg-white border-slate-100 shadow-lg">
            <CardContent className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                  <Target className="w-6 h-6 text-amber-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800">Our Mission</h2>
              </div>
              <p className="text-slate-700 leading-relaxed">
                To create a welcoming community where people encounter the love of Jesus Christ, 
                grow in their faith, and are equipped to serve others. We are committed to 
                biblical teaching, authentic worship, and practical ministry that meets the 
                needs of our community and beyond.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-100 shadow-lg">
            <CardContent className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <Eye className="w-6 h-6 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800">Our Vision</h2>
              </div>
              <p className="text-slate-700 leading-relaxed">
                To see transformed lives that transform communities. We envision a movement of 
                believers who are passionate about God, connected to each other, and committed 
                to reaching the lost with the hope of the Gospel throughout New Zealand and 
                the nations.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Core Values */}
      <section className="mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-800 mb-4">Our Core Values</h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            These values guide everything we do as a ministry and shape our community culture.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-white border-slate-100 shadow-md hover:shadow-lg transition-all duration-300">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Cross className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-4">Christ-Centered</h3>
              <p className="text-slate-600">
                Jesus is the foundation of our faith and the center of all we do.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-100 shadow-md hover:shadow-lg transition-all duration-300">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-slate-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-4">Community</h3>
              <p className="text-slate-600">
                We believe in the power of authentic relationships and fellowship.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-100 shadow-md hover:shadow-lg transition-all duration-300">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-4">Compassion</h3>
              <p className="text-slate-600">
                We extend God's love and grace to all people with open hearts.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-100 shadow-md hover:shadow-lg transition-all duration-300">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-4">Biblical Truth</h3>
              <p className="text-slate-600">
                God's Word is our guide for life, faith, and ministry decisions.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-100 shadow-md hover:shadow-lg transition-all duration-300">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Globe className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-4">Global Vision</h3>
              <p className="text-slate-600">
                We are committed to sharing the Gospel locally and globally.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-100 shadow-md hover:shadow-lg transition-all duration-300">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <HandHelping className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-4">Service</h3>
              <p className="text-slate-600">
                We are called to serve others as Christ served us.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* What We Believe Section */}
      <section className="mb-20">
        <Card className="bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-xl">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl font-bold mb-6">What We Believe</h2>
            <p className="text-xl mb-8 text-red-100 max-w-3xl mx-auto">
              Our faith is built on the solid foundation of Biblical truth and the 
              transformative power of the Gospel of Jesus Christ.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-4 py-2">
                Trinity
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-4 py-2">
                Salvation by Grace
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-4 py-2">
                Biblical Authority
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-4 py-2">
                Great Commission
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-4 py-2">
                Holy Spirit
              </Badge>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}