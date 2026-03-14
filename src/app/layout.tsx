import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'TaskRhythm - Recurring Team Task Manager',
  description: 'Automate recurring tasks and team accountability. Simple task creation, automatic reminders, and completion tracking for small teams.',
  keywords: ['task management', 'recurring tasks', 'team productivity', 'small business', 'automation'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}