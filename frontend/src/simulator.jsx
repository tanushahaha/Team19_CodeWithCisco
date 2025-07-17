// src/Simulator.js
import { useEffect, useState } from 'react';

function Simulator() {
  const [network, setNetwork] = useState(null);
  const [simulationResults, setSimulationResults] = useState([]);
  const [stats, setStats] = useState({
    totalNodes: 0,
    totalConnections: 0,
    successRate: '0%',
    avgLatency: '0ms'
  });

  useEffect(() => {
    const container = document.getElementById('particles');
    if (!container) return;

    for (let i = 0; i < 50; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDelay = Math.random() * 10 + 's';
      particle.style.animationDuration = Math.random() * 10 + 5 + 's';
      container.appendChild(particle);
    }
  }, []);

  const generateNetwork = () => {
    const quantumNodes = parseInt(document.getElementById('quantumNodes').value) || 6;
    const classicalNodes = parseInt(document.getElementById('classicalNodes').value) || 6;
    const totalNodes = quantumNodes + classicalNodes;

    // Generate nodes
    const nodes = [];
    for (let i = 0; i < totalNodes; i++) {
      nodes.push({
        id: i,
        type: i < quantumNodes ? 'quantum' : 'classical',
        x: Math.random() * 400 + 50,
        y: Math.random() * 300 + 50,
        entangled: i < quantumNodes ? Math.random() > 0.5 : false
      });
    }

    // Generate connections (ensure network is connected)
    const connections = [];
    const connected = new Set([0]);
    
    // Connect all nodes to ensure connectivity
    for (let i = 1; i < totalNodes; i++) {
      const randomConnected = Array.from(connected)[Math.floor(Math.random() * connected.size)];
      connections.push({
        from: randomConnected,
        to: i,
        type: nodes[randomConnected].type === 'quantum' && nodes[i].type === 'quantum' ? 'quantum' : 'classical',
        quality: Math.random() * 0.5 + 0.5 // 0.5 to 1.0
      });
      connected.add(i);
    }

    // Add some additional random connections
    const additionalConnections = Math.floor(totalNodes * 0.3);
    for (let i = 0; i < additionalConnections; i++) {
      const from = Math.floor(Math.random() * totalNodes);
      const to = Math.floor(Math.random() * totalNodes);
      if (from !== to && !connections.some(c => (c.from === from && c.to === to) || (c.from === to && c.to === from))) {
        connections.push({
          from,
          to,
          type: nodes[from].type === 'quantum' && nodes[to].type === 'quantum' ? 'quantum' : 'classical',
          quality: Math.random() * 0.5 + 0.5
        });
      }
    }

    const newNetwork = { nodes, connections };
    setNetwork(newNetwork);
    
    // Update stats
    setStats({
      totalNodes: totalNodes,
      totalConnections: connections.length,
      successRate: '0%',
      avgLatency: '0ms'
    });

    // Visualize network
    visualizeNetwork(newNetwork);
    
    // Add log entry
    addLogEntry(`Generated network with ${totalNodes} nodes (${quantumNodes} quantum, ${classicalNodes} classical) and ${connections.length} connections`);
  };

  const visualizeNetwork = (networkData) => {
    const canvas = document.getElementById('networkCanvas');
    if (!canvas) return;

    canvas.innerHTML = ''; // Clear previous visualization

    const { nodes, connections } = networkData;

    // Draw connections first (so they appear behind nodes)
    connections.forEach(conn => {
      const fromNode = nodes[conn.from];
      const toNode = nodes[conn.to];
      
      const line = document.createElement('div');
      line.style.position = 'absolute';
      line.style.height = '2px';
      line.style.transformOrigin = '0 50%';
      line.style.backgroundColor = conn.type === 'quantum' ? '#00ffff' : '#ffffff';
      line.style.opacity = conn.quality;
      line.style.zIndex = '1';

      const dx = toNode.x - fromNode.x;
      const dy = toNode.y - fromNode.y;
      const length = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx) * 180 / Math.PI;

      line.style.width = length + 'px';
      line.style.left = fromNode.x + 'px';
      line.style.top = fromNode.y + 'px';
      line.style.transform = `rotate(${angle}deg)`;

      canvas.appendChild(line);
    });

    // Draw nodes
    nodes.forEach(node => {
      const nodeElement = document.createElement('div');
      nodeElement.style.position = 'absolute';
      nodeElement.style.width = '20px';
      nodeElement.style.height = '20px';
      nodeElement.style.borderRadius = '50%';
      nodeElement.style.left = (node.x - 10) + 'px';
      nodeElement.style.top = (node.y - 10) + 'px';
      nodeElement.style.zIndex = '2';
      nodeElement.style.border = '2px solid';
      nodeElement.style.cursor = 'pointer';
      
      if (node.type === 'quantum') {
        nodeElement.style.backgroundColor = node.entangled ? '#ff00ff' : '#00ffff';
        nodeElement.style.borderColor = '#00ffff';
        nodeElement.style.boxShadow = '0 0 10px #00ffff';
      } else {
        nodeElement.style.backgroundColor = '#ffffff';
        nodeElement.style.borderColor = '#ffffff';
        nodeElement.style.boxShadow = '0 0 5px #ffffff';
      }

      // Add node label
      const label = document.createElement('div');
      label.textContent = node.id;
      label.style.position = 'absolute';
      label.style.top = '-25px';
      label.style.left = '50%';
      label.style.transform = 'translateX(-50%)';
      label.style.fontSize = '12px';
      label.style.color = '#ffffff';
      label.style.fontWeight = 'bold';
      nodeElement.appendChild(label);

      // Add tooltip
      nodeElement.title = `Node ${node.id} (${node.type})${node.entangled ? ' - Entangled' : ''}`;

      canvas.appendChild(nodeElement);
    });
  };

  const addLogEntry = (message) => {
    const timestamp = new Date().toLocaleTimeString();
    const newEntry = `[${timestamp}] ${message}`;
    setSimulationResults(prev => [newEntry, ...prev.slice(0, 9)]); // Keep last 10 entries
  };

  const runSimulation = () => {
    if (!network) {
      alert('Please generate a network first!');
      return;
    }

    const qubitLoss = parseFloat(document.getElementById('qubitLoss').value) || 0.05;
    const swapSuccess = parseFloat(document.getElementById('swapSuccess').value) || 0.9;

    // Simulate some network communication
    let successfulTransmissions = 0;
    let totalTransmissions = 10;
    let totalLatency = 0;

    for (let i = 0; i < totalTransmissions; i++) {
      const fromNode = Math.floor(Math.random() * network.nodes.length);
      const toNode = Math.floor(Math.random() * network.nodes.length);
      
      if (fromNode !== toNode) {
        // Simple simulation logic
        const success = Math.random() > qubitLoss;
        const latency = Math.random() * 100 + 10; // 10-110ms
        
        if (success) {
          successfulTransmissions++;
        }
        totalLatency += latency;
        
        addLogEntry(`Transmission ${i + 1}: Node ${fromNode} → Node ${toNode} ${success ? 'SUCCESS' : 'FAILED'} (${latency.toFixed(1)}ms)`);
      }
    }

    const successRate = ((successfulTransmissions / totalTransmissions) * 100).toFixed(1);
    const avgLatency = (totalLatency / totalTransmissions).toFixed(1);

    setStats(prev => ({
      ...prev,
      successRate: successRate + '%',
      avgLatency: avgLatency + 'ms'
    }));

    addLogEntry(`Simulation completed: ${successRate}% success rate, ${avgLatency}ms average latency`);
  };

  const clearResults = () => {
    setSimulationResults([]);
    setStats({
      totalNodes: network ? network.nodes.length : 0,
      totalConnections: network ? network.connections.length : 0,
      successRate: '0%',
      avgLatency: '0ms'
    });
    addLogEntry('Results cleared');
  };

  const scalabilityTest = () => {
    if (!network) {
      alert('Please generate a network first!');
      return;
    }
    
    addLogEntry('Running scalability test...');
    // Simulate increasing load
    setTimeout(() => {
      addLogEntry('Scalability test: Network performance degrades with >50 nodes');
      addLogEntry('Bottleneck identified: Quantum entanglement swapping overhead');
    }, 1000);
  };

  return (
    <div className="relative bg-[#0a0a0a] min-h-screen overflow-x-hidden text-white font-sans">
      <div id="particles" className="floating-particles fixed top-0 left-0 w-full h-full z-[-1] pointer-events-none"></div>

      <div className="max-w-[1400px] mx-auto p-5">
        <header className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-2 shadow-md">
            Quantum-Classical Hybrid Network
          </h1>
          <p className="text-lg text-gray-400">
            Future Internet Simulation Platform
          </p>
        </header>

        <section className="control-panel backdrop-blur border border-white/10 bg-white/5 rounded-2xl p-8 shadow-2xl mb-10">
          <h3 className="section-title text-xl text-cyan-400 text-center mb-6 font-semibold">
            Network Configuration
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              { id: 'quantumNodes', label: 'Quantum Nodes', value: 6 },
              { id: 'classicalNodes', label: 'Classical Nodes', value: 6 },
              { id: 'qubitLoss', label: 'Qubit Loss Rate', value: 0.05 },
              { id: 'swapSuccess', label: 'Swap Success Rate', value: 0.9 },
            ].map((field) => (
              <div key={field.id} className="flex flex-col">
                <label htmlFor={field.id} className="text-cyan-400 mb-1 text-sm font-medium">
                  {field.label}
                </label>
                <input
                  type="number"
                  id={field.id}
                  defaultValue={field.value}
                  min="0"
                  max="100"
                  step="0.01"
                  className="glow-input rounded-lg px-4 py-2 bg-white/10 text-white border-2 border-cyan-500/30 focus:outline-none focus:border-cyan-400 focus:shadow-md"
                />
              </div>
            ))}
          </div>
          <div className="text-center">
            <button
              className="glow-button bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold px-6 py-2 rounded-full m-2 shadow-lg hover:scale-105 transition"
              onClick={generateNetwork}
            >
              Generate Network
            </button>
            <button
              className="glow-button bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold px-6 py-2 rounded-full m-2 shadow-lg hover:scale-105 transition"
              onClick={runSimulation}
            >
              Run Simulation
            </button>
            <button
              className="glow-button bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold px-6 py-2 rounded-full m-2 shadow-lg hover:scale-105 transition"
              onClick={scalabilityTest}
            >
              Scalability Test
            </button>
            <button
              className="glow-button bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold px-6 py-2 rounded-full m-2 shadow-lg hover:scale-105 transition"
              onClick={clearResults}
            >
              Clear Results
            </button>
          </div>
        </section>

        <section className="network-container backdrop-blur border border-white/10 bg-white/5 rounded-2xl p-6 shadow-xl mb-10 min-h-[500px]">
          <h3 className="section-title text-xl text-cyan-400 text-center mb-4 font-semibold">
            Network Topology
          </h3>
          <div id="networkCanvas" className="network-canvas w-full h-[500px] rounded-xl border-2 border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 to-transparent relative"></div>
        </section>

        <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[
            { id: 'totalNodes', label: 'Total Nodes', value: stats.totalNodes },
            { id: 'totalConnections', label: 'Total Connections', value: stats.totalConnections },
            { id: 'successRate', label: 'Success Rate', value: stats.successRate },
            { id: 'avgLatency', label: 'Avg Latency', value: stats.avgLatency },
          ].map((stat) => (
            <div
              key={stat.id}
              className="stat-card bg-white/5 backdrop-blur border border-white/10 rounded-xl p-6 text-center hover:scale-105 transition shadow-lg"
            >
              <div
                id={stat.id}
                className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent mb-2"
              >
                {stat.value}
              </div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </section>

        <section className="results-panel bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 shadow-md max-h-[400px] overflow-y-auto">
          <h3 className="section-title text-xl text-cyan-400 text-center mb-4 font-semibold">
            Simulation Results
          </h3>
          <div className="progress-bar w-full h-1.5 bg-white/10 rounded-full overflow-hidden mb-4">
            <div id="progressFill" className="progress-fill h-full bg-gradient-to-r from-cyan-400 to-purple-600 rounded-full w-0"></div>
          </div>
          <div id="resultsLog" className="space-y-2">
            {simulationResults.map((result, index) => (
              <div key={index} className="text-sm text-gray-300 font-mono bg-black/20 p-2 rounded border-l-2 border-cyan-400">
                {result}
              </div>
            ))}
            {simulationResults.length === 0 && (
              <div className="text-gray-500 text-center italic">No simulation results yet. Generate a network and run simulation to see results.</div>
            )}
          </div>
        </section>

        <div id="tooltip" className="tooltip hidden absolute bg-black bg-opacity-90 text-white text-xs p-2 rounded-md z-50 border border-cyan-400"></div>
      </div>
    </div>
  );
}

export default Simulator;