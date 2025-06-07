'use client'

import { useModalStore } from '@/store/useModalStore'
import GenesisLogModal from './GenesisLogModal'
import ZkResumeModal from './zkResumeModal'
import HackathonModal from './HackathonsModal'
import ProjectsModal from './ProjectsModal'

export default function ModalManager() {
  const { activeModal } = useModalStore()

  return (
    <>
      {activeModal === 'genesis-log' && <GenesisLogModal />}
      {activeModal === 'projects' && <ProjectsModal />}
      {activeModal === 'zkresume' && <ZkResumeModal />}
      {/* dev-mode is handled by Terminal component directly */}
      {activeModal === 'hackathons' && <HackathonModal />}
      {activeModal === 'vault' && <div>Vault Modal (Coming Soon)</div>}
      {activeModal === 'resume' && <div>Resume Modal (Coming Soon)</div>}
      {activeModal === 'email' && <div>Contact Modal (Coming Soon)</div>}
      {activeModal === 'skillmap' && <div>Skillmap Modal (Coming Soon)</div>}
    </>
  )
}
