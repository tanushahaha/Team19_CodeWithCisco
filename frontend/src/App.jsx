import './App.css'
import img1 from './assets/1.png'
import img2 from './assets/2.png'
import img3 from './assets/3.png'
import img4 from './assets/4.png'

function App() {
  return (
    <div className="app-container">
      <header className="header">
        <h1>Design and Simulate a Scalable Quantum-Classical Hybrid Network for the Future Internet</h1>
        <p className="subtitle">
          A comprehensive simulation and analysis framework for next-generation quantum networking infrastructure
        </p>
      </header>

      <section className="section">
        <h2>Background</h2>
        <div className="content-block">
          <p>
            Quantum networking is poised to revolutionize communication, but faces major challenges: qubit fragility, 
            signal loss, scalability, integration with classical networks, and lack of standardization. Most real-world 
            quantum networks will be hybrid—combining quantum and classical elements. Understanding these challenges is 
            crucial, even for those with only basic knowledge of qubits and superposition.
          </p>
        </div>
      </section>

      <section className="section">
        <h2>Problem Statement</h2>
        <div className="content-block">
          <p>
            Design, simulate, and analyze a scalable hybrid network architecture that integrates quantum and classical nodes. 
            This project addresses practical networking challenges like signal loss, decoherence, interoperability, and 
            scalability using simulation and creative protocol design.
          </p>
          <div className="note">
            <strong>Note:</strong> No QKD or advanced quantum protocol implementation is required. Only an introduction to 
            qubits, entanglement, and superposition is assumed.
          </div>
        </div>
      </section>

      <section className="section">
        <h2>Simulation Outputs</h2>
        <div className="image-grid">
          <div className="image-card">
            <img src={img1} alt="Network Topology" />
            <h3>Network Topology</h3>
            <p>Hybrid network with quantum and classical nodes</p>
          </div>
          <div className="image-card">
            <img src={img2} alt="Link Behavior Analysis" />
            <h3>Link Behavior Analysis</h3>
            <p>Quantum vs classical link performance comparison</p>
          </div>
          <div className="image-card">
            <img src={img3} alt="Routing Demonstration" />
            <h3>Routing Demonstration</h3>
            <p>Adaptive routing with fallback mechanisms</p>
          </div>
          <div className="image-card">
            <img src={img4} alt="Purification Protocol Comparison" />
            <h3>Purification Protocol</h3>
            <p>Custom adaptive purification implementation</p>
          </div>
        </div>
      </section>

      <section className="section">
        <h2>Project Implementation</h2>
        <div className="parts-grid">
          <div className="part-card">
            <h3>Part 1: Network Topology and Node Simulation</h3>
            <div className="part-content">
              <p><strong>Objective:</strong> Design a network with at least 10 nodes (classical and quantum-capable)</p>
              <ul>
                <li>Simulate using Python and NetworkX for topology and routing</li>
                <li>Add quantum attributes to nodes (entanglement storage capability)</li>
                <li>Visualize topology with labeled quantum and classical nodes</li>
              </ul>
              <p><strong>Deliverable:</strong> Python code for network creation and visualization, hybrid network diagram</p>
            </div>
          </div>

          <div className="part-card">
            <h3>Part 2: Simulating Quantum Networking Challenges</h3>
            <div className="part-content">
              <p><strong>Objective:</strong> Implement realistic quantum link behavior</p>
              <ul>
                <li><strong>Decoherence:</strong> Probability of qubit loss over distance</li>
                <li><strong>No-Cloning:</strong> Simulate failed transmission if amplification is attempted</li>
                <li><strong>Entanglement Distribution:</strong> Entanglement swapping with failure probability</li>
                <li><strong>Classical Links:</strong> Standard packet loss and latency simulation</li>
              </ul>
              <p><strong>Deliverable:</strong> Simulation code and performance analysis plots</p>
            </div>
          </div>

          <div className="part-card">
            <h3>Part 3: Protocol Design for Hybrid Routing</h3>
            <div className="part-content">
              <p><strong>Objective:</strong> Design intelligent routing protocol</p>
              <ul>
                <li>Use quantum links when available, fallback to classical</li>
                <li>Prioritize shortest path considering quantum link reliability</li>
                <li>Handle interoperability between quantum and classical nodes</li>
              </ul>
              <p><strong>Deliverable:</strong> Protocol description and Python implementation</p>
            </div>
          </div>

          <div className="part-card">
            <h3>Part 4: Scalability and Standardization Analysis</h3>
            <div className="part-content">
              <p><strong>Objective:</strong> Analyze network performance at scale</p>
              <ul>
                <li>Probability of successful end-to-end quantum communication</li>
                <li>Identify bottlenecks for scaling up</li>
                <li>Address interoperability and standardization issues</li>
              </ul>
              <p><strong>Deliverable:</strong> Scalability plots and technical analysis</p>
            </div>
          </div>

          <div className="part-card">
            <h3>Part 5: Creative Extension (Bonus)</h3>
            <div className="part-content">
              <p><strong>Objective:</strong> Innovative solution to major bottleneck</p>
              <ul>
                <li>Quantum repeaters, error correction, or new hybrid protocol</li>
                <li>Performance impact analysis</li>
              </ul>
              <p><strong>Deliverable:</strong> Solution description and comparative results</p>
            </div>
          </div>

          <div className="part-card">
            <h3>Part 6: Post-Quantum PKI System</h3>
            <div className="part-content">
              <p><strong>Scenario:</strong> 2030 - Quantum computers have broken public key cryptography</p>
              <ul>
                <li>Design symmetric key exchange system for 25-person group</li>
                <li>Ensure secure communication without eavesdropping</li>
                <li>Compare multiple options and implement optimal solution</li>
              </ul>
              <p><strong>Deliverable:</strong> PKI system design and implementation</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <h2>Technical Challenges Addressed</h2>
        <div className="challenges-grid">
          <div className="challenge-card">
            <h3>Qubit Fragility</h3>
            <p>Implementation of decoherence models and error correction mechanisms</p>
          </div>
          <div className="challenge-card">
            <h3>Signal Loss</h3>
            <p>Distance-based probability models for quantum link failures</p>
          </div>
          <div className="challenge-card">
            <h3>Scalability</h3>
            <p>Performance analysis as network size increases</p>
          </div>
          <div className="challenge-card">
            <h3>Interoperability</h3>
            <p>Protocol translation between quantum and classical nodes</p>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-content">
          <p>&copy; 2025 QuantumNetSim · Designed by Mohnish Panwar</p>
          <p>Comprehensive solution for quantum-classical hybrid networking challenges</p>
        </div>
      </footer>
    </div>
  )
}

export default App



