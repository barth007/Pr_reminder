"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle, Github, Mail, MessageSquare } from "lucide-react"

interface LandingPageProps {
  onGetStarted: () => void
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center mr-3">
                <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <span className="font-bold text-xl">PR Reminder</span>
            </div>
            <div>
              <Button onClick={onGetStarted} variant="default">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 z-0">
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%239C92AC' fillOpacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-6">
                Never miss a <span className="text-blue-600">Pull Request</span> review again
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Get timely Slack reminders for your open GitHub PRs and keep your development workflow smooth and
                efficient.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button onClick={onGetStarted} size="lg" className="text-base">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="outline" size="lg" className="text-base">
                  <Github className="mr-2 h-4 w-4" />
                  View on GitHub
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -top-8 -left-8 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob"></div>
              <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob animation-delay-2000"></div>
              <div className="absolute inset-0 w-64 h-64 mx-auto my-auto bg-pink-200 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob animation-delay-4000"></div>

              {/* Dashboard Preview */}
              <div className="relative bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                <div className="h-8 bg-gray-100 flex items-center px-4 border-b border-gray-200">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="h-10 bg-blue-600 rounded-md mb-4 flex items-center px-4">
                    <div className="w-4 h-4 bg-white rounded-sm mr-2 opacity-70"></div>
                    <div className="h-3 w-24 bg-white rounded-sm opacity-70"></div>
                    <div className="ml-auto h-6 w-6 bg-white rounded-full opacity-50"></div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-20 bg-gray-100 rounded-md p-3">
                      <div className="h-3 w-3/4 bg-gray-300 rounded-sm mb-2"></div>
                      <div className="h-3 w-1/2 bg-gray-300 rounded-sm mb-2"></div>
                      <div className="h-3 w-1/4 bg-blue-300 rounded-sm"></div>
                    </div>
                    <div className="h-20 bg-gray-100 rounded-md p-3">
                      <div className="h-3 w-3/4 bg-gray-300 rounded-sm mb-2"></div>
                      <div className="h-3 w-1/2 bg-gray-300 rounded-sm mb-2"></div>
                      <div className="h-3 w-1/4 bg-green-300 rounded-sm"></div>
                    </div>
                    <div className="h-20 bg-gray-100 rounded-md p-3">
                      <div className="h-3 w-3/4 bg-gray-300 rounded-sm mb-2"></div>
                      <div className="h-3 w-1/2 bg-gray-300 rounded-sm mb-2"></div>
                      <div className="h-3 w-1/4 bg-purple-300 rounded-sm"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              PR Reminder connects your GitHub repositories with Slack to keep you updated on your pull requests.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Github className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Connect GitHub</h3>
              <p className="text-gray-600">Link your GitHub account to track pull requests across your repositories.</p>
            </div>

            {/* Step 2 */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <MessageSquare className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Connect Slack</h3>
              <p className="text-gray-600">Integrate with your Slack workspace to receive timely notifications.</p>
            </div>

            {/* Step 3 */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Mail className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Set Up Email</h3>
              <p className="text-gray-600">Configure your unique email address to receive PR notifications directly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Use PR Reminder?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our tool helps development teams stay on top of their code review process.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: "Never Miss a Review",
                description: "Get timely reminders about open PRs that need your attention.",
              },
              {
                title: "Reduce Bottlenecks",
                description: "Keep your development workflow moving by addressing PRs promptly.",
              },
              {
                title: "Team Visibility",
                description: "Everyone stays informed about the status of important code changes.",
              },
              {
                title: "Customizable Alerts",
                description: "Configure when and how you receive notifications based on your preferences.",
              },
            ].map((benefit, index) => (
              <div key={index} className="flex items-start">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">{benefit.title}</h3>
                  <p className="mt-1 text-gray-600">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to streamline your PR workflow?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join thousands of developers who use PR Reminder to keep their code review process efficient.
          </p>
          <Button onClick={onGetStarted} size="lg" variant="secondary" className="text-base">
            Get Started Now
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center mr-3">
                <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <span className="font-bold text-xl text-white">PR Reminder</span>
            </div>
            <div className="text-sm">&copy; {new Date().getFullYear()} PR Reminder. All rights reserved.</div>
          </div>
        </div>
      </footer>

      {/* Animation styles */}
      <style jsx global>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}
