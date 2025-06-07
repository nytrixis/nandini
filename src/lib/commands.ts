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
