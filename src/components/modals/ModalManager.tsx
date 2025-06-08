'use client'

import { useModalStore } from '@/store/useModalStore'
import GenesisLogModal from './GenesisLogModal'
import ZkResumeModal from './zkResumeModal'
import HackathonModal from './HackathonsModal'
import ProjectsModal from './ProjectsModal'
import VaultModal from './VaultModal'
import GitHubProfileModal from './GithubProfileModal'
import ResumeModal from './ResumeModal'
import ContactModal from './ContactModal'

export default function ModalManager() {
  const { activeModal } = useModalStore()

  return (
    <>
      {activeModal === 'genesis-log' && <GenesisLogModal />}
      {activeModal === 'projects' && <ProjectsModal />}
      {activeModal === 'zkresume' && <ZkResumeModal />}
      {activeModal === 'github' && <GitHubProfileModal />}
      {activeModal === 'hackathons' && <HackathonModal />}
      {activeModal === 'vault' && <VaultModal />}
      {activeModal === 'resume' && <ResumeModal />}
      {activeModal === 'email' && <ContactModal />}
      {activeModal === 'skillmap' && <div>Skillmap Modal (Coming Soon)</div>}
    </>
  )
}
