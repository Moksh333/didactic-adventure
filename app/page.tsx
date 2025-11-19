"use client";

import { useState, useEffect } from "react";
import { Zap, Users, Brain, CheckCircle, Clock, TrendingUp, Sparkles, ArrowRight } from "lucide-react";

// Mock AuthButtons component since we don't have access to the actual one
const AuthButtons = () => (
  <div className="flex gap-4">
    <button className="px-8 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl">
      Sign In
    </button>
    <button className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
      Start Free Trial
    </button>
  </div>
);

export default function LandingPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Automation",
      description: "Let AI intelligently prioritize, delegate, and optimize your team's workflow automatically.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Users,
      title: "Smart Team Coordination",
      description: "Seamlessly assign tasks with deadlines and track real-time status updates across your organization.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: TrendingUp,
      title: "Predictive Insights",
      description: "Get AI-driven forecasts on project completion and bottleneck identification before they happen.",
      color: "from-orange-500 to-red-500"
    }
  ];

  const stats = [
    { label: "Time Saved", value: "45%", icon: Clock },
    { label: "Task Completion", value: "92%", icon: CheckCircle },
    { label: "Team Efficiency", value: "3x", icon: Zap }
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      {/* Hero Section */}
      <div className="relative z-10 container mx-auto px-6 pt-20 pb-32">
        <div className={`text-center transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6 border border-white/20">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-medium">Powered by Advanced AI</span>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent leading-tight">
            Work Smarter,
            <br />
            Not Harder
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            The first truly autonomous task manager that uses AI to assign, optimize, and track your team's work—automatically.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <button className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold text-lg hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-purple-500/50 flex items-center gap-2">
              Get Started Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-8 py-4 bg-white/10 backdrop-blur-sm rounded-xl font-semibold text-lg hover:bg-white/20 transition-all duration-300 border border-white/20">
              Watch Demo
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105"
              >
                <stat.icon className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Powered by Intelligence
          </h2>
          <p className="text-xl text-gray-400">
            Experience the future of task management
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group relative bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-500 hover:scale-105 ${
                activeFeature === index ? 'ring-2 ring-purple-500' : ''
              }`}
            >
              <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              
              {/* Hover effect line */}
              <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.color} transform origin-left transition-transform duration-300 scale-x-0 group-hover:scale-x-100`}></div>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works Section */}
      <div className="relative z-10 container mx-auto px-6 py-20">
        <div className="max-w-5xl mx-auto bg-white/5 backdrop-blur-sm rounded-3xl p-12 border border-white/10">
          <h2 className="text-4xl font-bold mb-12 text-center">How It Works</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Assign Tasks", desc: "Managers create tasks with deadlines and requirements" },
              { step: "02", title: "AI Optimizes", desc: "Our AI automatically prioritizes and delegates efficiently" },
              { step: "03", title: "Track Progress", desc: "Team members update status in real-time with insights" }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="text-6xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative z-10 container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-12 shadow-2xl">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform Your Workflow?
          </h2>
          <p className="text-xl mb-8 text-purple-100">
            Join thousands of teams already working smarter with AI-powered task management.
          </p>
          <AuthButtons />
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-8">
        <div className="container mx-auto px-6 text-center text-gray-400">
          <p>© 2024 Autonomous Task Manager. Built with AI for the future of work.</p>
        </div>
      </footer>
    </main>
  );
}