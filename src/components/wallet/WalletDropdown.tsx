'use client'

import { Fragment, useState } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { motion } from 'framer-motion'
import { useModalStore } from '@/store/useModalStore'

export default function WalletDropdown() {
  const [isConnected, setIsConnected] = useState(true)
  const { showToast } = useModalStore()

  const copyAddress = () => {
    navigator.clipboard.writeText('0x742d35Cc6634C0532925a3b8D4C9db96590b5b6e')
    showToast('address copied to clipboard', 'success')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    >
      <Menu as="div" className="relative">
        <Menu.Button className="glass rounded-xl px-4 py-2 flex items-center gap-3 hover:bg-slate-800/40 transition-all duration-300">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-amber-500 flex items-center justify-center">
            <span className="text-white text-sm orbitron">n</span>
          </div>
          <div className="text-left">
            <div className="orbitron text-sm text-white">nytrixis.eth</div>
            <div className="text-xs text-slate-400">ethereum mainnet</div>
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
          <Menu.Items className="absolute right-0 mt-2 w-64 glass rounded-xl p-2 focus:outline-none">
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() => window.open('https://app.ens.domains/nytrixis.eth', '_blank')}
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
                <button
                  className={`${
                    active ? 'bg-slate-700/50' : ''
                  } group flex w-full items-center rounded-lg px-3 py-2 text-sm text-slate-300`}
                >
                  <span className="mr-3">🔄</span>
                  switch wallet
                </button>
              )}
            </Menu.Item>

            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active ? 'bg-slate-700/50' : ''
                  } group flex w-full items-center rounded-lg px-3 py-2 text-sm text-slate-300`}
                >
                  <span className="mr-3">🌐</span>
                  switch network
                </button>
              )}
            </Menu.Item>

            <div className="border-t border-slate-700/50 my-2"></div>

            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() => setIsConnected(false)}
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
      </Menu>
    </motion.div>
  )
}
