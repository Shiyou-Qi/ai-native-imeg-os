'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sidebar } from './sidebar'
import { MainContent } from './main-content'
import { TemplatesPage } from './templates-page'
import { ChatHistoryPage } from './chat-history-page'
import { MyImagesPage } from './my-images-page'
import { CollectionsPage } from './collections-page'
import { LikesPage } from './likes-page'
import { CanvasPage } from './canvas-page'
import { ProfilePage } from './profile-page'
import { SettingsPage } from './settings-page'
import { SubscriptionPage } from './subscription-page'
import { useWorkspaceStore } from '@/stores'

export function WorkspaceLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { currentPage } = useWorkspaceStore()

  const renderContent = () => {
    // Check if it's a chat history page
    if (currentPage.startsWith('chat-')) {
      const chatId = currentPage.replace('chat-', '')
      return <ChatHistoryPage chatId={chatId} />
    }

    switch (currentPage) {
      case 'templates':
        return <TemplatesPage />
      case 'canvas':
        return <CanvasPage />
      case 'my-images':
        return <MyImagesPage />
      case 'collections':
        return <CollectionsPage />
      case 'likes':
        return <LikesPage />
      case 'profile':
        return <ProfilePage />
      case 'settings':
        return <SettingsPage />
      case 'subscription':
        return <SubscriptionPage />
      case 'home':
      default:
        return <MainContent />
    }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed left-4 top-4 z-50 lg:hidden"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? (
          <X className="size-5" />
        ) : (
          <Menu className="size-5" />
        )}
      </Button>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
            />
            
            {/* Mobile Sidebar */}
            <motion.div
              initial={{ x: -240 }}
              animate={{ x: 0 }}
              exit={{ x: -240 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed inset-y-0 left-0 z-50 lg:hidden"
            >
              <Sidebar />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      {renderContent()}
    </div>
  )
}
