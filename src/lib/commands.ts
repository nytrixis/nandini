import { useModalStore } from '@/store/useModalStore'

const commands = {
  // Core commands
  help: () => `available commands:

core:
  help          - show this help message
  clear         - clear terminal
  whoami        - system info
  ls            - list directories
  pwd           - current directory

projects:
  deploy projects    - show projects directory
  launch <project>   - open specific project
  npm run build      - build projects
  
credentials:
  mint resume()      - open zkresume modal
  vault             - access secure vault
  vault --list      - list vault contents
  vault --verify    - verify credentials
  
timeline:
  git log           - show genesis timeline
  view hackathons   - show hackathon timeline
  
web3:
  connect wallet    - wallet connection
  
easter eggs:
  sudo origin reveal - ???

type 'help <command>' for detailed info`,

  clear: () => 'CLEAR_TERMINAL',
  
  whoami: () => `user: nytrixis
system: dos v1.0.0
shell: /bin/zsh
web3: enabled
location: ~/portfolio
status: building the future`,

  pwd: () => '/home/nytrixis/portfolio',
  
  ls: () => `total 8 directories

drwxr-xr-x  projects/
drwxr-xr-x  hackathons/
drwxr-xr-x  zkresume/
drwxr-xr-x  genesis-log/
drwxr-xr-x  vault/
drwxr-xr-x  dev-mode/

recent projects:
├── nyvex (defi platform)
├── credvault (zk identity)
├── dhanvantari (healthcare)
├── wildx (conservation)
├── ruche (e-commerce)
└── vedvaani (education)`,

  // Project commands
  'deploy projects': () => {
    useModalStore.getState().openModal('projects')
    return `deploying projects to mainnet...
✓ deployment successful
contract verified on etherscan`
  },

  'npm run build': () => {
    useModalStore.getState().openModal('projects')
    return `building projects...
⚡ optimizing smart contracts
📦 bundling assets
🔍 running security audit
✓ build completed (420.69kb)`
  },

  // Credential commands
  'mint resume()': () => {
    useModalStore.getState().openModal('zkresume')
    return `minting zkresume nft...
generating zero-knowledge proofs
uploading metadata to ipfs
✓ resume minted successfully`
  },

  vault: () => {
    useModalStore.getState().openModal('vault')
    return `accessing secure vault...
🔐 verifying blockchain credentials
📋 loading encrypted entries
✓ vault initialized`
  },

  'vault --list': () => `vault contents:
├── research/
│   └── disaster-management-paper.pdf
├── certificates/
│   ├── aws-cloud-practitioner.cert
│   ├── blockchain-dev.nft
│   └── techgig-finalist.nft
├── achievements/
│   ├── myntra-weforshe.cert
│   ├── rnmc-top20.cert
│   └── mun-outstanding-3x.cert
└── credentials/
    └── gsoc-mentor.nft

total: 8 verified entries`,

  'vault --verify': () => `initiating blockchain verification...
checking hashes against ethereum mainnet
✓ disaster-management-paper: verified
✓ techgig-finalist: verified on polygon
✓ blockchain-certification: verified
✓ gsoc-mentor: verified on ipfs
✓ aws-practitioner: verified via api

verification complete: 8/8 entries valid`,

  // Timeline commands
  'git log': () => {
    useModalStore.getState().openModal('genesis-log')
    return `fetching commit history...
connecting to genesis block
loading development timeline
✓ genesis log opened`
  },

  'view hackathons': () => {
    useModalStore.getState().openModal('hackathons')
    return `loading hackathon timeline...
fetching competition data
calculating win rate: 80%
✓ hackathon logs loaded`
  },

  // Web3 commands
  'connect wallet': () => {
    useModalStore.getState().showToast('wallet already connected', 'info')
    return `wallet status: connected
address: nytrixis.eth
network: ethereum mainnet
balance: 4.20 ETH`
  },

  'switch network': () => `current network: ethereum mainnet
available networks:
├── polygon (matic)
├── arbitrum (layer 2)
├── optimism (layer 2)
└── base (coinbase l2)

use: switch --network <name>`,

  // Easter egg
  'sudo origin reveal': () => {
    useModalStore.getState().openModal('genesis-log')
    return `accessing classified archives...
🔓 security clearance: granted
📜 revealing origin story
✓ genesis protocol activated`
  }
}

// Project mapping
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
  
  // Direct command lookup
  if (commands[command as keyof typeof commands]) {
    return commands[command as keyof typeof commands]()
  }
  
  // Switch network command
  if (command.startsWith('switch --network ') || command.startsWith('switch network ')) {
    const networkName = command.replace(/switch (--network |network )/, '').toLowerCase()
    const networks = ['polygon', 'arbitrum', 'optimism', 'base', 'ethereum']
    
    if (networks.includes(networkName)) {
      useModalStore.getState().showToast(`switched to ${networkName}`, 'success')
      return `switching to ${networkName}...
🔄 disconnecting from ethereum mainnet
🌐 connecting to ${networkName}
⚡ updating rpc endpoints
✓ network switched successfully
current network: ${networkName}`
    } else {
      return `network '${networkName}' not supported
available networks: ${networks.join(', ')}`
    }
  }
  
  // Launch specific project (both "launch" and "launch project")
  if (command.startsWith('launch ')) {
    let projectName = command.replace('launch ', '').toLowerCase()
    
    // Handle "launch project <name>" format
    if (projectName.startsWith('project ')) {
      projectName = projectName.replace('project ', '')
    }
    
    if (projectMap[projectName]) {
      useModalStore.getState().openProjectModal(projectMap[projectName])
      return `launching ${projectName}...
🚀 initializing smart contracts
🌐 connecting to web3 provider
⚡ loading project data
✓ ${projectName} launched successfully`
    } else {
      return `project '${projectName}' not found
available: ${Object.keys(projectMap).join(', ')}

usage:
  launch <project>         - launch project directly
  launch project <project> - alternative syntax`
    }
  }
  
  // Deploy specific project
  if (command.startsWith('deploy ')) {
    let projectName = command.replace('deploy ', '').toLowerCase()
    
    // Handle "deploy project <name>" format  
    if (projectName.startsWith('project ')) {
      projectName = projectName.replace('project ', '')
    }
    
    if (projectMap[projectName]) {
      useModalStore.getState().openModal('projects')
      return `deploying ${projectName} to mainnet...
📋 estimating gas: 21000 gwei
⛽ gas price: 15 gwei
🔄 submitting transaction...
✓ transaction confirmed
📄 contract address: 0x${Math.random().toString(16).substr(2, 40)}
🔍 verified on etherscan`
    } else {
      return `project '${projectName}' not found
available: ${Object.keys(projectMap).join(', ')}`
    }
  }
  
  // Help for specific commands
  if (command.startsWith('help ')) {
    const helpTopic = command.replace('help ', '')
    const helpTexts: { [key: string]: string } = {
      'vault': `vault - secure credential storage
  vault          - open vault interface
  vault --list   - list all credentials
  vault --verify - verify on blockchain
  vault --stats  - show statistics`,
      'launch': `launch - open specific projects
  launch <name>          - open project details
  launch project <name>  - alternative syntax
  
available projects:
  nyvex, credvault, dhanvantari, 
  wildx, ruche, vedvaani`,
      'switch': `switch - change blockchain network
  switch network <name>     - change network
  switch --network <name>   - alternative syntax
  
available networks:
  ethereum, polygon, arbitrum, optimism, base`,
      'deploy': `deploy - deploy projects to blockchain
  deploy <project>          - deploy specific project
  deploy project <project>  - alternative syntax
  deploy projects           - open projects modal`
    }
    
    return helpTexts[helpTopic] || `no help available for '${helpTopic}'`
  }
  
  return `command not found: ${input}
type 'help' for available commands`
}
