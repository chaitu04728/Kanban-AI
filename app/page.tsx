import Link from "next/link";
import {
  ArrowRight,
  LayoutDashboard,
  Sparkles,
  Zap,
  CheckCircle2,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-blue-600 p-1">
              <LayoutDashboard className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">AI Kanban</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/signin"
              className="text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <div className="relative isolate overflow-hidden pt-14">
          <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
            <div
              className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
            />
          </div>

          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl py-20 sm:py-28 lg:py-32 text-center">
              <div className="mb-8 flex justify-center">
                <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
                  <span className="flex items-center gap-1">
                    <Sparkles className="h-4 w-4 text-yellow-500" />
                    Powered by AI
                  </span>
                </div>
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                Project management reimagined with AI
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Streamline your workflow with our intelligent Kanban board. Let
                AI handle task descriptions, subtasks, and sprint planning while
                you focus on shipping.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Link
                  href="/signup"
                  className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                  Start for free
                </Link>
                <Link
                  href="#features"
                  className="text-sm font-semibold leading-6 text-gray-900 flex items-center gap-1"
                >
                  Learn more <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div id="features" className="bg-gray-50 py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:text-center">
              <h2 className="text-base font-semibold leading-7 text-blue-600">
                Faster Workflow
              </h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Everything you need to manage projects
              </p>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Built for modern engineering teams who want to move fast and
                stay organized.
              </p>
            </div>
            <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
              <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
                <div className="relative pl-16">
                  <dt className="text-base font-semibold leading-7 text-gray-900">
                    <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                      <Sparkles
                        className="h-6 w-6 text-white"
                        aria-hidden="true"
                      />
                    </div>
                    AI-Powered Assistance
                  </dt>
                  <dd className="mt-2 text-base leading-7 text-gray-600">
                    Automatically generate detailed task descriptions and break
                    down complex tasks into subtasks with one click.
                  </dd>
                </div>
                <div className="relative pl-16">
                  <dt className="text-base font-semibold leading-7 text-gray-900">
                    <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                      <Zap className="h-6 w-6 text-white" aria-hidden="true" />
                    </div>
                    Sprints & Backlog
                  </dt>
                  <dd className="mt-2 text-base leading-7 text-gray-600">
                    Organize work into sprints, manage a backlog, and track
                    progress with ease.
                  </dd>
                </div>
                <div className="relative pl-16">
                  <dt className="text-base font-semibold leading-7 text-gray-900">
                    <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                      <LayoutDashboard
                        className="h-6 w-6 text-white"
                        aria-hidden="true"
                      />
                    </div>
                    Intuitive Kanban
                  </dt>
                  <dd className="mt-2 text-base leading-7 text-gray-600">
                    Drag and drop interface that feels natural and responsive.
                    Visualize your workflow instantly.
                  </dd>
                </div>
                <div className="relative pl-16">
                  <dt className="text-base font-semibold leading-7 text-gray-900">
                    <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                      <CheckCircle2
                        className="h-6 w-6 text-white"
                        aria-hidden="true"
                      />
                    </div>
                    Task Tracking
                  </dt>
                  <dd className="mt-2 text-base leading-7 text-gray-600">
                    Keep track of priorities, due dates, and assignees. Never
                    let a task slip through the cracks.
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        {/* How it Works Section */}
        <div className="bg-white py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:text-center">
              <h2 className="text-base font-semibold leading-7 text-blue-600">
                Simple Process
              </h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                How AI Kanban works
              </p>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Get started in minutes and let AI handle the heavy lifting.
              </p>
            </div>
            <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
              <div className="grid grid-cols-1 gap-y-16 lg:grid-cols-3 lg:gap-x-8">
                <div className="flex flex-col items-center text-center">
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    <span className="text-2xl font-bold">1</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Create a Board
                  </h3>
                  <p className="mt-4 text-base leading-7 text-gray-600">
                    Start by creating a board for your project. Define your
                    columns and workflow structure.
                  </p>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    <span className="text-2xl font-bold">2</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Add Tasks with AI
                  </h3>
                  <p className="mt-4 text-base leading-7 text-gray-600">
                    Create tasks and let our AI generate detailed descriptions,
                    acceptance criteria, and subtasks instantly.
                  </p>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    <span className="text-2xl font-bold">3</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Track & Ship
                  </h3>
                  <p className="mt-4 text-base leading-7 text-gray-600">
                    Move tasks across the board, manage sprints, and track your
                    team's velocity to ship faster.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="bg-gray-50 py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:text-center">
              <h2 className="text-base font-semibold leading-7 text-blue-600">
                Testimonials
              </h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Loved by developers
              </p>
            </div>
            <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
              <div className="flex flex-col justify-between rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-200">
                <div>
                  <p className="text-lg leading-7 text-gray-600">
                    "The AI features are a game changer. I spend way less time
                    writing tickets and more time coding."
                  </p>
                </div>
                <div className="mt-8 flex items-center gap-x-4">
                  <div className="h-10 w-10 rounded-full bg-gray-200" />
                  <div>
                    <h3 className="text-sm font-semibold leading-6 text-gray-900">
                      Sarah Chen
                    </h3>
                    <p className="text-sm leading-6 text-gray-600">
                      Senior Engineer
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-between rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-200">
                <div>
                  <p className="text-lg leading-7 text-gray-600">
                    "Finally, a project management tool that doesn't feel like a
                    chore. The interface is snappy and clean."
                  </p>
                </div>
                <div className="mt-8 flex items-center gap-x-4">
                  <div className="h-10 w-10 rounded-full bg-gray-200" />
                  <div>
                    <h3 className="text-sm font-semibold leading-6 text-gray-900">
                      Alex Miller
                    </h3>
                    <p className="text-sm leading-6 text-gray-600">
                      Product Manager
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-between rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-200">
                <div>
                  <p className="text-lg leading-7 text-gray-600">
                    "The sprint planning features helped our team increase
                    velocity by 20% in just two weeks."
                  </p>
                </div>
                <div className="mt-8 flex items-center gap-x-4">
                  <div className="h-10 w-10 rounded-full bg-gray-200" />
                  <div>
                    <h3 className="text-sm font-semibold leading-6 text-gray-900">
                      Jordan Davis
                    </h3>
                    <p className="text-sm leading-6 text-gray-600">Tech Lead</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-white">
          <div className="mx-auto max-w-7xl py-16 sm:px-6 sm:py-24 lg:px-8">
            <div className="relative isolate overflow-hidden bg-gray-900 px-6 py-16 text-center shadow-2xl sm:rounded-3xl sm:px-16">
              <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Ready to boost your productivity?
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-300">
                Join thousands of developers who are shipping faster with AI
                Kanban.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Link
                  href="/signup"
                  className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  Get started for free
                </Link>
                <Link
                  href="#features"
                  className="text-sm font-semibold leading-6 text-white"
                >
                  Learn more <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t">
        <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
          <div className="mt-8 md:order-1 md:mt-0">
            <p className="text-center text-xs leading-5 text-gray-500">
              &copy; 2025 AI Kanban. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
