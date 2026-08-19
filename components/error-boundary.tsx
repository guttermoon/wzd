"use client"

import { Component, ReactNode } from "react"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error("Error caught by boundary:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="text-center py-16">
            <h3 className="text-2xl font-black mb-4 border-4 border-black dark:border-white inline-block px-4 py-2 bg-red-400 text-black transform -rotate-1">
              SOMETHING WENT WRONG
            </h3>
            <p className="text-muted-foreground">
              There was an error loading this content. Please refresh the page
              or try again later.
            </p>
          </div>
        )
      )
    }

    return this.props.children
  }
}
