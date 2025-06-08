'use client'

import { Fragment, useState } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { motion, AnimatePresence } from 'framer-motion'
import { useModalStore } from '@/store/useModalStore'

const walletOptions = [
  { id: 'nytrixis.eth', name: 'nytrixis.eth', icon: '👤' },
  { id: 'metamask', name: 'metamask wallet', icon: '🦊' },
  { id: 'coinbase', name: 'coinbase wallet', icon: '🔵' },
  { id: 'walletconnect', name: 'walletconnect', icon: '🔗' },
  { id: 'rainbow', name: 'rainbow wallet', icon: '🌈' }
]

const networkOptions = [
  { id: 'ethereum', name: 'ethereum mainnet', icon: '⟠' },
  { id: 'polygon', name: 'polygon mainnet', icon: '⬟' },
  { id: 'arbitrum', name: 'arbitrum one', icon: '🔷' },
  { id: 'optimism', name: 'optimism mainnet', icon: '🔴' },
  { id: 'base', name: 'base mainnet', icon: '🔵' }
]

export default function WalletDropdown() {
  const [isConnected, setIsConnected] = useState(true)
  const [currentNetwork, setCurrentNetwork] = useState('ethereum mainnet')
  const [currentWallet, setCurrentWallet] = useState('nytrixis.eth')
  const [showWalletSelector, setShowWalletSelector] = useState(false)
  const [showNetworkSelector, setShowNetworkSelector] = useState(false)
  const { showToast } = useModalStore()

  const copyAddress = () => {
    navigator.clipboard.writeText('0x742d35Cc6634C0532925a3b8D4C9db96590b5b6e')
    showToast('address copied to clipboard', 'success')
  }

  const viewProfile = () => {
    window.open('https://github.com/nytrixis', '_blank')
    showToast('opening profile...', 'info')
  }

  const handleWalletSwitchClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setShowNetworkSelector(false)
    setShowWalletSelector(!showWalletSelector)
  }

  const handleNetworkSwitchClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setShowWalletSelector(false)
    setShowNetworkSelector(!showNetworkSelector)
  }

  const selectWallet = (wallet: typeof walletOptions[0]) => {
    setCurrentWallet(wallet.name)
    setShowWalletSelector(false)
    showToast(`switched to ${wallet.name}`, 'success')
  }

  const selectNetwork = (network: typeof networkOptions[0]) => {
    setCurrentNetwork(network.name)
    setShowNetworkSelector(false)
    showToast(`switched to ${network.name}`, 'success')
  }

  const disconnect = () => {
    setIsConnected(false)
    setShowWalletSelector(false)
    setShowNetworkSelector(false)
    showToast('wallet disconnected', 'info')
  }

  const reconnect = () => {
    setIsConnected(true)
    showToast('wallet connected', 'success')
  }

  if (!isConnected) {
    return (
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={reconnect}
        className="glass rounded-xl px-4 py-2 flex items-center gap-3 hover:bg-slate-800/40 transition-all duration-300"
      >
        <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center">
          <span className="text-white text-sm orbitron">🔌</span>
        </div>
        <div className="text-left">
          <div className="orbitron text-sm text-slate-400">connect wallet</div>
          <div className="text-xs text-slate-500">click to connect</div>
        </div>
      </motion.button>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="relative"
    >
      <Menu as="div" className="relative">
        {({ open }) => (
          <>
            <Menu.Button className="glass rounded-xl px-4 py-2 flex items-center gap-3 hover:bg-slate-800/40 transition-all duration-300">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-amber-500 flex items-center justify-center">
                <span className="text-white text-sm orbitron">n</span>
              </div>
              <div className="text-left">
                <div className="orbitron text-sm text-white">{currentWallet}</div>
                <div className="text-xs text-slate-400">{currentNetwork}</div>
              </div>
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </Menu.Button>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items 
                className="absolute right-0 mt-2 w-64 glass rounded-xl p-2 focus:outline-none z-[100]"
                static={open}
              >
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={viewProfile}
                      className={`${
                        active ? 'bg-slate-700/50' : ''
                      } group flex w-full items-center rounded-lg px-3 py-2 text-sm text-slate-300`}
                    >
                      <span className="mr-3">👤</span>
                      view ens profile
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={copyAddress}
                      className={`${
                        active ? 'bg-slate-700/50' : ''
                      } group flex w-full items-center rounded-lg px-3 py-2 text-sm text-slate-300`}
                    >
                      <span className="mr-3">📋</span>
                      copy address
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <div className="relative">
                      <button
                        onClick={handleWalletSwitchClick}
                        className={`${
                          active || showWalletSelector ? 'bg-slate-700/50' : ''
                        } group flex w-full items-center rounded-lg px-3 py-2 text-sm text-slate-300 justify-between`}
                      >
                        <div className="flex items-center">
                          <span className="mr-3">🔄</span>
                          switch wallet
                        </div>
                        <svg 
                          className={`w-4 h-4 transition-transform ${showWalletSelector ? 'rotate-180' : ''}`} 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>
                  )}
                </Menu.Item>

                <Menu.Item>
                  {({ active }) => (
                    <div className="relative">
                      <button
                        onClick={handleNetworkSwitchClick}
                        className={`${
                          active || showNetworkSelector ? 'bg-slate-700/50' : ''
                        } group flex w-full items-center rounded-lg px-3 py-2 text-sm text-slate-300 justify-between`}
                      >
                        <div className="flex items-center">
                          <span className="mr-3">🌐</span>
                          switch network
                        </div>
                        <svg 
                          className={`w-4 h-4 transition-transform ${showNetworkSelector ? 'rotate-180' : ''}`} 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>
                  )}
                </Menu.Item>

                <div className="border-t border-slate-700/50 my-2"></div>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={disconnect}
                      className={`${
                        active ? 'bg-red-900/30' : ''
                      } group flex w-full items-center rounded-lg px-3 py-2 text-sm text-red-400`}
                    >
                      <span className="mr-3">🔌</span>
                      disconnect
                    </button>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </>
        )}
      </Menu>

      {/* Wallet Selector - Separate dropdown to the left */}
      <AnimatePresence>
        {showWalletSelector && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.95, x: 20 }}
            transition={{ duration: 0.15 }}
            className="absolute right-full mr-2 top-0 w-56 glass rounded-xl p-2 z-[101]"
          >
            <div className="p-2 border-b border-slate-700/30 mb-2">
              <h3 className="text-sm font-medium text-slate-300 orbitron">select wallet</h3>
            </div>
            <div className="space-y-1">
              {walletOptions.map((wallet) => (
                <button
                  key={wallet.id}
                  onClick={() => selectWallet(wallet)}
                  className={`w-full flex items-center rounded-lg px-3 py-2 text-sm transition-colors ${
                    currentWallet === wallet.name
                      ? 'bg-violet-500/20 text-violet-300'
                      : 'text-slate-400 hover:bg-slate-700/30 hover:text-slate-300'
                  }`}
                >
                  <span className="mr-3">{wallet.icon}</span>
                  <span className="flex-1 text-left">{wallet.name}</span>
                  {currentWallet === wallet.name && (
                    <span className="text-violet-400">✓</span>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Network Selector - Separate dropdown to the left */}
      <AnimatePresence>
        {showNetworkSelector && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.95, x: 20 }}
            transition={{ duration: 0.15 }}
            className="absolute right-full mr-2 top-0 w-56 glass rounded-xl p-2 z-[101]"
          >
            <div className="p-2 border-b border-slate-700/30 mb-2">
              <h3 className="text-sm font-medium text-slate-300 orbitron">select network</h3>
            </div>
            <div className="space-y-1">
              {networkOptions.map((network) => (
                <button
                  key={network.id}
                  onClick={() => selectNetwork(network)}
                  className={`w-full flex items-center rounded-lg px-3 py-2 text-sm transition-colors ${
                    currentNetwork === network.name
                      ? 'bg-violet-500/20 text-violet-300'
                      : 'text-slate-400 hover:bg-slate-700/30 hover:text-slate-300'
                  }`}
                >
                  <span className="mr-3">{network.icon}</span>
                  <span className="flex-1 text-left">{network.name}</span>
                  {currentNetwork === network.name && (
                    <span className="text-violet-400">✓</span>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
