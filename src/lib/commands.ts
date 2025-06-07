import { useModalStore } from '@/store/useModalStore'

const commands = {
  help: () => `available commands:
  help - show this help message
  clear - clear terminal
  launch <project> - open specific project details
  mint resume() - open zkresume modal
  deploy projects - show projects directory
  view hackathons - show hackathon timeline
  sudo origin reveal - easter egg
  connect wallet - wallet connection
  switch network - network selector
  whoami - system info
  ls - list directories
  pwd - current directory
  git log - show genesis timeline`,

  clear: () => 'CLEAR_TERMINAL',
  
  whoami: () => `user: nytrixis
system: dos v1.0.0
shell: /bin/zsh
web3: enabled
location: ~/portfolio`,

  pwd: () => '/home/nytrixis/portfolio',
  
  ls: () => `projects/    hackathons/    zkresume/
genesis-log/    blog/    vault/    dev-mode/

available projects:
- nyvex (defi platform)
- credvault (zk identity)
- dhanvantari (healthcare)
- wildx (conservation)
- ruche (e-commerce)
- vedvaani (education)`,

  'mint resume()': () => {
    useModalStore.getState().openModal('zkresume')
    return 'minting zkresume nft...'
  },

  'deploy projects': () => {
    useModalStore.getState().openModal('projects')
    return 'deploying projects to mainnet...\ngas fee: 0.001 ETH\ntransaction confirmed ✓'
  },

  'open projects': () => {
    useModalStore.getState().openModal('projects')
    return 'opening projects folder...'
  },

  'view hackathons': () => {
    useModalStore.getState().openModal('hackathons')
    return 'loading hackathon timeline...'
  },

  'git log': () => {
    useModalStore.getState().openModal('genesis-log')
    return 'fetching commit history from genesis block...'
  },

  'sudo origin reveal': () => {
    useModalStore.getState().openModal('vedvaani')
    return 'accessing vedvaani archives...'
  },

  'connect wallet': () => {
    useModalStore.getState().showToast('wallet already connected', 'info')
    return 'wallet: nytrixis.eth (connected)'
  },

  'switch network': () => {
    return 'current network: ethereum mainnet\navailable: polygon, arbitrum, optimism'
  }
}

// Project mapping for direct launches
const projectMap: { [key: string]: string } = {
  'nyvex': '1',
  'credvault': '2', 
  'dhanvantari': '3',
  'wildx': '4',
  'ruche': '5',
  'vedvaani': '6'
}

export const processCommand = (input: string): string => {
  const command = input.toLowerCase().trim()
  
  if (command === 'clear') {
    return 'CLEAR_TERMINAL'
  }
  
  if (commands[command as keyof typeof commands]) {
    return commands[command as keyof typeof commands]()
  }

  // Web3-themed project commands
  if (command === 'deploy projects' || command === 'projects.deploy()') {
    useModalStore.getState().openModal('projects')
    return 'deploying projects to mainnet...\ngas fee: 0.001 ETH\ntransaction confirmed ✓'
  }

  if (command === 'mint resume()' || command === 'mint resume') {
    useModalStore.getState().openModal('zkresume')
    return 'opening zkresume viewer...'
  }

  if (command === 'show hackathons()' || command === 'show hackathons') {
    useModalStore.getState().openModal('hackathons')
    return 'opening hackathon logs...'
  }

  // Launch specific project commands
  if (command.startsWith('launch ')) {
    const projectName = command.replace('launch ', '').toLowerCase()
    
    if (projectMap[projectName]) {
      // Open projects modal with specific project selected
      useModalStore.getState().openModal('projects')
      // Set the selected project in the modal store
      useModalStore.getState().setSelectedProject(projectMap[projectName])
      return `launching ${projectName}...\ninitializing smart contracts\nconnecting to web3 provider\nproject loaded ✓`
    } else {
      return `project '${projectName}' not found\navailable projects: ${Object.keys(projectMap).join(', ')}`
    }
  }

  if (command.startsWith('deploy ')) {
    const projectName = command.replace('deploy ', '').toLowerCase()
    
    if (projectMap[projectName]) {
      useModalStore.getState().openModal('projects')
      useModalStore.getState().setSelectedProject(projectMap[projectName])
      return `deploying ${projectName} to mainnet...\nestimating gas: 21000 gwei\ntransaction confirmed ✓\ncontract address: 0x${Math.random().toString(16).substr(2, 40)}`
    } else {
      return `project '${projectName}' not found\navailable projects: ${Object.keys(projectMap).join(', ')}`
    }
  }

// Vault commands
if (command === 'vault' || command === 'vault.dir') {
  useModalStore.getState().openModal('vault')
  return `accessing secure vault...\nverifying blockchain credentials\nloading encrypted entries\nvault initialized ✓`
}

if (command === 'vault --list' || command === 'ls vault') {
  return `vault contents:\n├── research/\n│   └── disaster-management-paper.pdf\n├── certificates/\n│   ├── aws-cloud-practitioner.cert\n│   ├── blockchain-dev.nft\n│   └── techgig-finalist.nft\n├── achievements/\n│   ├── myntra-weforshe.cert\n│   ├── rnmc-top20.cert\n│   └── mun-outstanding-3x.cert\n└── credentials/\n    └── gsoc-mentor.nft\n\ntotal: 8 verified entries`
}

if (command === 'vault --verify' || command === 'verify vault') {
  return `initiating blockchain verification...\n\nchecking hashes against ethereum mainnet\n✓ disaster-management-paper: verified\n✓ techgig-finalist: verified on polygon\n✓ blockchain-certification: verified on ethereum\n✓ gsoc-mentor: verified on ipfs\n✓ aws-practitioner: verified via api\n\nverification complete: 8/8 entries valid`
}

if (command.startsWith('vault --search ')) {
  const searchTerm = command.replace('vault --search ', '')
  return `searching vault for "${searchTerm}"...\n\nmatching entries:\n├── blockchain-dev.nft (tags: blockchain, web3, defi)\n├── techgig-finalist.cert (tags: competitive programming)\n└── gsoc-mentor.nft (tags: mentorship, open source)\n\nfound 3 matching entries`
}

if (command === 'vault --stats') {
  return `vault statistics:\n\ntotal entries: 8\nverified: 8 (100%)\ncertificates: 3\nachievements: 4\nresearch papers: 1\n\nblockchain distribution:\n├── ethereum: 4 entries\n├── polygon: 2 entries\n├── ipfs: 3 entries\n└── traditional: 1 entry\n\nlast verification: ${new Date().toISOString().split('T')[0]}`
}

if (command.startsWith('mint ')) {
  const credential = command.replace('mint ', '')
  return `minting new credential: ${credential}\n\ngenerating metadata...\nuploading to ipfs...\ndeploying smart contract...\n\ntransaction hash: 0x${Math.random().toString(16).substr(2, 64)}\ngas used: 84,532 gwei\n\ncredential minted successfully ✓\nadded to vault with verification hash`
}

if (command.startsWith('verify ')) {
  const hash = command.replace('verify ', '')
  if (hash.startsWith('0x')) {
    return `verifying credential hash: ${hash}\n\nquerying ethereum mainnet...\nblock number: ${Math.floor(Math.random() * 1000000) + 18000000}\nconfirmations: ${Math.floor(Math.random() * 100) + 50}\n\n✓ credential verified\n✓ issuer authenticated\n✓ timestamp valid\n✓ not revoked\n\nverification status: VALID`
  } else {
    return `invalid hash format\nexpected: 0x[64 hex characters]\nreceived: ${hash}`
  }
}

if (command === 'backup vault' || command === 'vault --backup') {
  return `creating encrypted vault backup...\n\ngenerating encryption keys\ncompressing credential data\nuploading to distributed storage\n\nbackup locations:\n├── ipfs: QmX7Hn8k2aL9p3B4c5D6e7F8g9H0i1J2k3L4m5N6o7P8q9R0s\n├── arweave: ar://abc123def456ghi789jkl012mno345pqr678stu901vwx234yz\n└── local: ~/.nytrixis/vault/backup_${new Date().toISOString().split('T')[0]}.enc\n\nbackup completed ✓`
}

if (command === 'restore vault' || command === 'vault --restore') {
  return `restoring vault from backup...\n\nlocating backup files\ndecrypting credential data\nverifying integrity\nrestoring entries\n\nrestored entries:\n├── 8 certificates\n├── 4 achievements  \n├── 1 research paper\n└── 2 credentials\n\nvault restoration completed ✓`
}

if (command === 'export vault' || command === 'vault --export') {
  return `exporting vault credentials...\n\ngenerating portable format\nincluding verification proofs\ncreating qr codes for mobile\n\nexport formats:\n├── json: vault_export.json\n├── pdf: credential_portfolio.pdf\n├── csv: vault_data.csv\n└── blockchain: deployed to 0x${Math.random().toString(16).substr(2, 40)}\n\nexport completed ✓`
}

// Credential-specific commands
if (command === 'issue credential' || command === 'credential --new') {
  return `credential issuance protocol initiated\n\nselect credential type:\n1. academic certificate\n2. professional certification  \n3. achievement badge\n4. skill verification\n5. custom credential\n\nuse: issue --type [1-5] --data [json]`
}

if (command.startsWith('revoke ')) {
  const credentialId = command.replace('revoke ', '')
  return `revoking credential: ${credentialId}\n\nlocating on blockchain\nverifying ownership\nsubmitting revocation transaction\n\ntransaction hash: 0x${Math.random().toString(16).substr(2, 64)}\nrevocation registry updated\n\ncredential revoked ✓\nnote: this action cannot be undone`
}


  // Additional web3 project commands
  if (command === 'npm run build' || command === 'yarn build') {
    useModalStore.getState().openModal('projects')
    return 'building projects...\noptimizing smart contracts\nbundle size: 420.69kb\nbuild successful ✓'
  }

  if (command === 'truffle migrate' || command === 'hardhat deploy') {
    useModalStore.getState().openModal('projects')
    return 'migrating contracts to blockchain...\ndeploying to ethereum mainnet\nconfirming transactions...\ndeployment complete ✓'
  }

  if (command === 'web3.projects.list()' || command === 'projects.list()') {
    useModalStore.getState().openModal('projects')
    return 'querying blockchain for project registry...\nfetching from IPFS...\nloading project metadata...'
  }

  return `command not found: ${input}
type 'help' for available commands`
}
