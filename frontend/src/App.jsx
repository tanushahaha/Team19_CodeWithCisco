import { useState } from 'react'
import './App.css'
import img1 from './assets/1.png'
import img2 from './assets/2.png'
import img4 from './assets/3.png'
import img5 from './assets/4.png'

function App() {
  const [activeSection, setActiveSection] = useState('overview')

  const sections = [
    { id: 'overview', title: 'Overview' },
    { id: 'background', title: 'Background' },
    { id: 'problem', title: 'Problem Statement' },
    { id: 'part1', title: 'Part 1: Network Topology' },
    { id: 'part2', title: 'Part 2: Quantum Challenges' },
    { id: 'part3', title: 'Part 3: Protocol Design' },
    { id: 'part4', title: 'Part 4: Scalability Analysis' },
    { id: 'part5', title: 'Part 5: Creative Extension' },
    { id: 'part6', title: 'Part 6: PKI System' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/90 backdrop-blur border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-lg md:text-xl font-semibold">Quantum-Classical Hybrid Network</h1>
            <div className="hidden md:flex space-x-4">
              {sections.map(section => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`text-sm px-3 py-1 rounded transition-all ${activeSection === section.id ? 'bg-blue-600' : 'hover:bg-slate-700 text-gray-300'}`}
                >
                  {section.title}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-20 max-w-7xl mx-auto px-4 pb-20 space-y-16">
        <section id="overview" className="text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Design and Simulate a Scalable Quantum-Classical Hybrid Network for the Future Internet</h2>
          <div className="h-1 w-24 mx-auto bg-gradient-to-r from-blue-500 to-purple-500" />
        </section>

        <section id="background" className="bg-slate-800/40 p-8 rounded-xl">
          <h3 className="text-3xl font-semibold mb-6">🔹 Background: Quantum Networking</h3>
          <p className="text-lg mb-6 text-gray-300">Quantum networking is the future of fast and secure communication. But building it is hard. It faces many challenges like:</p>
          <ul className="space-y-3 text-gray-300">
            <li><strong>Fragile qubits:</strong> Qubits are very delicate and can lose their data easily.</li>
            <li><strong>Signal loss:</strong> Quantum signals can't travel far and can't be boosted.</li>
            <li><strong>Hard to grow:</strong> Large quantum networks are complex and expensive to build.</li>
            <li><strong>Works differently:</strong> Quantum systems don't integrate easily with classical networks.</li>
            <li><strong>No common rules:</strong> There are no universal standards for quantum networking.</li>
          </ul>
          <div className="mt-6 bg-blue-800/40 p-4 rounded border border-blue-600">
            <p className="text-blue-300">Because of this, real-world systems will be hybrid—mixing quantum and classical technologies for practicality.</p>
          </div>
        </section>

        <section id="problem" className="bg-slate-800/40 p-8 rounded-xl">
          <h3 className="text-3xl font-semibold mb-6">Problem Statement</h3>
          <p className="text-gray-300 mb-4">Design and analyze a scalable hybrid network combining quantum and classical nodes. Pure quantum networks are not yet viable, so hybrid systems are key. We aim to address:</p>
          <ul className="list-disc list-inside space-y-2 text-gray-300">
            <li>Signal loss over distance</li>
            <li>Qubit decoherence from noise</li>
            <li>Quantum-classical interoperability</li>
            <li>Scalable, reliable network design</li>
          </ul>
        </section>

        <section id="part1" className="bg-slate-800/40 p-8 rounded-xl">
          <h3 className="text-3xl font-semibold mb-6">Part 1: Network Topology and Node Simulation</h3>
          <p className="text-gray-300 mb-4">Simulate a 10-node network (quantum and classical). Use Python (e.g., networkx) and mark quantum capabilities.</p>
          <ul className="list-disc list-inside space-y-2 text-gray-300">
            <li>Python code for topology simulation</li>
            <li>Nodes with simple quantum attributes (e.g., entanglement)</li>
            <li>Visualized topology (see below)</li>
          </ul>
          <img src={img1} alt="Topology Diagram" className="mt-6 rounded shadow border border-slate-600" />
        </section>

        <section id="part2" className="bg-slate-800/40 p-8 rounded-xl">
          <h3 className="text-3xl font-semibold mb-6">Part 2: Simulating Quantum Networking Challenges</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-300">
            <li>Simulate qubit loss (decoherence)</li>
            <li>Prevent quantum amplification (no-cloning)</li>
            <li>Test entanglement swapping (with failure probability)</li>
            <li>Simulate classical link packet loss and latency</li>
          </ul>
          <img src={img2} alt="Quantum Challenges" className="mt-6 rounded shadow border border-slate-600" />
        </section>

        <section id="part3" className="bg-slate-800/40 p-8 rounded-xl">
          <h3 className="text-3xl font-semibold mb-6">Part 3: Protocol Design for Hybrid Routing</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-300">
            <li>Use quantum links if reliable, else fallback to classical</li>
            <li>Prefer shortest path but consider quantum link quality</li>
            <li>Handle protocol translation between classical and quantum</li>
            <li>Example routing: Node A to Node H with fallback logic</li>
          </ul>
        </section>

        <section id="part4" className="bg-slate-800/40 p-8 rounded-xl">
          <h3 className="text-3xl font-semibold mb-6">Part 4: Scalability and Standardization Analysis</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-300">
            <li>Simulate increasing number of nodes/links</li>
            <li>Analyze end-to-end success rate</li>
            <li>Identify scalability bottlenecks</li>
            <li>Report interoperability and standards gaps</li>
          </ul>
          <img src={img4} alt="Scalability Analysis" className="mt-6 rounded shadow border border-slate-600" />
        </section>

        <section id="part5" className="bg-slate-800/40 p-8 rounded-xl">
          <h3 className="text-3xl font-semibold mb-6">Part 5: Creative Extension (Bonus)</h3>
          <p className="text-gray-300 mb-4">Add innovation like quantum repeaters or error correction.</p>
          <ul className="list-disc list-inside space-y-2 text-gray-300">
            <li>Implement the enhancement in simulation</li>
            <li>Compare results before/after</li>
          </ul>
          <img src={img5} alt="Creative Extension" className="mt-6 rounded shadow border border-slate-600" />
        </section>

        <section id="part6" className="bg-slate-800/40 p-8 rounded-xl">
          <h3 className="text-3xl font-semibold mb-6">Part 6: Design a Simple Key PKI Without Public Keys</h3>
          <p className="text-gray-300 mb-4">With quantum computers, classical public key cryptography is obsolete. Design a new symmetric key solution:</p>
          <ul className="list-disc list-inside space-y-2 text-gray-300">
            <li>Option 1: Key Distribution Center (KDC)</li>
            <li>Option 2: Quantum Key Distribution (QKD)</li>
            <li>Option 3: Hybrid Scheme (KDC + QKD)</li>
          </ul>
          <p className="text-gray-300 mt-4">Implement one of these for a 25-member private group, ensuring pairwise security.</p>
        </section>

        <footer className="text-center text-gray-400 mt-12">
          <p>Quantum-Classical Hybrid Network © 2025</p>
        </footer>
      </main>
    </div>
  )
}

export default App
