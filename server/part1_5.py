import networkx as nx
import matplotlib.pyplot as plt
import random
import math

# --- Constants for Simulation ---
SWAP_SUCCESS_PROBABILITY = 0.9
QUBIT_LOSS_ALPHA = 0.05
CLASSICAL_PACKET_LOSS = 0.005

# ==============================================================================
# SECTION A: CORE NETWORK AND SIMULATION FUNCTIONS
# ==============================================================================

def setup_fixed_network():
    """Creates the fixed 12-node network for demonstrations in Parts 1-3 & 5."""
    G = nx.Graph()
    quantum_nodes = ["Q_Node_1", "Q_Node_2", "Q_Hub_A", "Q_Hub_B", "Q_Node_3", "Q_Node_4"]
    classical_nodes = ["C_Node_A", "C_Node_B", "C_Node_C", "C_Node_D", "C_Node_E", "C_Node_F"]
    
    for node_name in quantum_nodes:
        G.add_node(node_name, node_type="quantum", color="skyblue")
    for node_name in classical_nodes:
        G.add_node(node_name, node_type="classical", color="lightgreen")
        
    edges_with_attributes = [
        ("Q_Hub_A", "Q_Hub_B", {'distance': 50}), ("Q_Hub_A", "Q_Node_1", {'distance': 20}),
        ("Q_Hub_A", "Q_Node_2", {'distance': 20}), ("Q_Hub_B", "Q_Node_3", {'distance': 30}),
        ("Q_Hub_B", "Q_Node_4", {'distance': 30}),
        ("Q_Hub_A", "C_Node_A", {'distance': 5, 'latency': 2, 'packet_loss_prob': CLASSICAL_PACKET_LOSS}),
        ("Q_Hub_B", "C_Node_B", {'distance': 5, 'latency': 2, 'packet_loss_prob': CLASSICAL_PACKET_LOSS}),
        ("C_Node_A", "C_Node_C", {'distance': 100, 'latency': 10, 'packet_loss_prob': CLASSICAL_PACKET_LOSS}),
        ("C_Node_B", "C_Node_D", {'distance': 100, 'latency': 10, 'packet_loss_prob': CLASSICAL_PACKET_LOSS}),
        ("C_Node_C", "C_Node_D", {'distance': 40, 'latency': 4, 'packet_loss_prob': CLASSICAL_PACKET_LOSS}),
        ("C_Node_C", "C_Node_E", {'distance': 40, 'latency': 4, 'packet_loss_prob': CLASSICAL_PACKET_LOSS}),
        ("C_Node_D", "C_Node_F", {'distance': 40, 'latency': 4, 'packet_loss_prob': CLASSICAL_PACKET_LOSS}),
    ]
    G.add_edges_from(edges_with_attributes)
    return G

def create_scalable_network(num_hubs):
    """Creates a scalable network topology for the Part 4 analysis."""
    G = nx.Graph()
    for i in range(num_hubs):
        hub_name = f"Q_Hub_{i}"
        G.add_node(hub_name, node_type="quantum")
        if i > 0:
            G.add_edge(f"Q_Hub_{i-1}", hub_name, distance=50)
    source, destination = "Source_Node", "Destination_Node"
    G.add_node(source, node_type="quantum")
    G.add_node(destination, node_type="quantum")
    if num_hubs > 0:
        G.add_edge(source, "Q_Hub_0", distance=25)
        G.add_edge(f"Q_Hub_{num_hubs-1}", destination, distance=25)
    else:
        G.add_edge(source, destination, distance=50)
    return G

def transmit_quantum_info(graph, path):
    """Original protocol: Simulates an all-or-nothing quantum transmission."""
    for i in range(len(path) - 1):
        edge_data = graph.get_edge_data(path[i], path[i+1])
        distance = edge_data.get('distance', 1)
        qubit_loss_probability = 1 - (1 - QUBIT_LOSS_ALPHA) ** distance
        if random.random() < qubit_loss_probability: return False
        if i < len(path) - 2:
            node_data = graph.nodes[path[i+1]]
            if node_data['node_type'] == 'classical': return False
            if node_data['node_type'] == 'quantum':
                if random.random() > SWAP_SUCCESS_PROBABILITY: return False
    return True

def transmit_with_purification(graph, path, max_retries=10):
    """Part 5 innovative protocol: Localizes failures and retries."""
    # 1. Establish each link individually with retries
    for i in range(len(path) - 1):
        link_success = False
        for _ in range(max_retries):
            edge_data = graph.get_edge_data(path[i], path[i+1])
            distance = edge_data.get('distance', 1)
            qubit_loss_probability = 1 - (1 - QUBIT_LOSS_ALPHA) ** distance
            if random.random() > qubit_loss_probability:
                link_success = True
                break # Link established, move to next link
        if not link_success:
            return False # Failed to establish a link even with retries

    # 2. If all links are established, attempt the swaps
    num_swaps = len(path) - 2
    if num_swaps > 0:
        swap_chain_success_prob = SWAP_SUCCESS_PROBABILITY ** num_swaps
        if random.random() > swap_chain_success_prob:
            return False # A failure occurred in the swap chain

    return True

def calculate_edge_costs(graph):
    """Calculates edge costs for the routing protocol."""
    for u, v, data in graph.edges(data=True):
        distance = data['distance']
        link_success_prob = (1 - QUBIT_LOSS_ALPHA) ** distance
        graph[u][v]['quantum_cost'] = distance / (link_success_prob + 1e-9)
        graph[u][v]['classical_cost'] = distance

# ==============================================================================
# SECTION B: DELIVERABLE-SPECIFIC FUNCTIONS
# ==============================================================================

def show_part1_deliverable(graph):
    """Generates and displays the network topology diagram from Part 1."""
    print("--- Generating Part 1 Deliverable: Network Topology Diagram ---")
    pos = nx.spring_layout(graph, seed=42)
    node_colors = [data['color'] for node, data in graph.nodes(data=True)]
    plt.figure(figsize=(12, 8))
    nx.draw(graph, pos, with_labels=True, node_color=node_colors, node_size=2500, font_size=8, width=1.5)
    plt.title("Part 1: Scalable Quantum-Classical Hybrid Network Topology")
    plt.show()

def show_part2_deliverable(graph):
    """Generates and displays the link behavior analysis from Part 2."""
    print("\n--- Generating Part 2 Deliverable: Link Behavior Analysis Plot ---")
    num_trials = 1000
    paths_to_test = {
        "Short_Quantum_Path": ["Q_Node_1", "Q_Hub_A", "Q_Node_2"],
        "Long_Quantum_Path": ["Q_Node_1", "Q_Hub_A", "Q_Hub_B", "Q_Node_3"],
        "Invalid_Quantum_Path": ["Q_Node_1", "Q_Hub_A", "C_Node_A", "C_Node_C"],
        "Classical_Path": ["C_Node_E", "C_Node_C", "C_Node_D", "C_Node_F"]
    }
    results = {}
    for name, path in paths_to_test.items():
        success_count = 0
        for _ in range(num_trials):
            if "Quantum" in name:
                if transmit_quantum_info(graph, path): success_count += 1
            else:
                if random.random() > CLASSICAL_PACKET_LOSS * (len(path) - 1): success_count += 1
        results[name] = (success_count / num_trials) * 100
    
    path_names = list(results.keys())
    success_rates = list(results.values())
    plt.figure(figsize=(10, 6))
    bars = plt.bar(path_names, success_rates, color=['skyblue', 'deepskyblue', 'lightcoral', 'lightgreen'])
    plt.ylabel('Success Rate (%)')
    plt.title('Part 2: Network Transmission Success Rate Over 1000 Trials')
    plt.xticks(rotation=15, ha="right")
    plt.ylim(0, 100)
    for bar in bars:
        yval = bar.get_height()
        plt.text(bar.get_x() + bar.get_width()/2.0, yval, f'{yval:.1f}%', va='bottom', ha='center')
    plt.tight_layout()
    plt.show()

def show_part3_deliverable(graph):
    """Runs and prints the output of the routing protocol from Part 3."""
    print("\n--- Generating Part 3 Deliverable: Routing Protocol Demonstration ---")
    source_node = "Q_Node_1"
    destination_node = "Q_Node_4"
    calculate_edge_costs(graph)
    print(f"Demonstrating routing from {source_node} to {destination_node}...")
    quantum_path = nx.shortest_path(graph, source_node, destination_node, weight='quantum_cost')
    classical_path = nx.shortest_path(graph, source_node, destination_node, weight='classical_cost')
    print(f"Optimal Quantum-Aware Path: {quantum_path}")
    print(f"Optimal Classical Fallback Path: {classical_path}")


def show_part4_deliverable():
    """Runs the scalability analysis and plots the trend from Part 4."""
    print("\n--- Generating Part 4 Deliverable: Scalability Analysis ---")
    num_trials = 1000
    network_sizes = range(0, 11)
    success_rates = []

    for num_hubs in network_sizes:
        network = create_scalable_network(num_hubs)
        path = nx.shortest_path(network, "Source_Node", "Destination_Node")
        success_count = 0
        for _ in range(num_trials):
            if transmit_quantum_info(network, path): success_count += 1
        rate = (success_count / num_trials) * 100
        success_rates.append(rate)
        total_distance = sum(network.get_edge_data(path[i], path[i+1])['distance'] for i in range(len(path)-1))
        print(f"Network with {num_hubs} repeaters (Path: {total_distance}km): Success Rate = {rate:.2f}%")

    plt.figure(figsize=(10, 6))
    plt.plot(network_sizes, success_rates, marker='o', linestyle='-', color='b')
    plt.xlabel("Number of Quantum Repeaters in Path")
    plt.ylabel("End-to-End Success Rate (%)")
    plt.title("Part 4: Scalability of Quantum Communication vs. Number of Repeaters")
    plt.grid(True)
    plt.xticks(network_sizes)
    plt.ylim(0, 100)
    plt.show()

def show_part5_deliverable(graph):
    """Runs the comparative analysis for the Part 5 innovative solution."""
    print("\n--- Generating Part 5 Deliverable: Creative Extension Analysis ---")
    num_trials = 1000
    long_path = ["Q_Node_1", "Q_Hub_A", "Q_Hub_B", "Q_Node_4"]
    
    # "Before" analysis with the original protocol
    before_success_count = 0
    for _ in range(num_trials):
        if transmit_quantum_info(graph, long_path):
            before_success_count += 1
    before_rate = (before_success_count / num_trials) * 100
    
    # "After" analysis with the new purification protocol
    after_success_count = 0
    for _ in range(num_trials):
        if transmit_with_purification(graph, long_path):
            after_success_count += 1
    after_rate = (after_success_count / num_trials) * 100

    print("\n--- Comparative Results ---")
    print(f"Path Tested: {' -> '.join(long_path)}")
    print(f"Original Protocol Success Rate: {before_rate:.2f}%")
    print(f"Adaptive Purification Protocol Success Rate: {after_rate:.2f}%")
    
    # Plotting the comparison
    labels = ['Original Protocol', 'Adaptive Purification']
    rates = [before_rate, after_rate]
    plt.figure(figsize=(8, 6))
    bars = plt.bar(labels, rates, color=['lightcoral', 'lightgreen'])
    plt.ylabel('Success Rate (%)')
    plt.title('Part 5: Impact of Adaptive Purification Protocol')
    plt.ylim(0, 100)
    for bar in bars:
        yval = bar.get_height()
        plt.text(bar.get_x() + bar.get_width()/2.0, yval, f'{yval:.1f}%', va='bottom', ha='center')
    plt.show()

# ==============================================================================
# SECTION C: MAIN EXECUTION BLOCK
# ==============================================================================

if __name__ == "__main__":
    # Setup the fixed network for Parts 1, 2, 3, and 5
    fixed_network = setup_fixed_network()

    # Show the output for each part sequentially.
    show_part1_deliverable(fixed_network)
    show_part2_deliverable(fixed_network)
    show_part3_deliverable(fixed_network)
    show_part4_deliverable()
    show_part5_deliverable(fixed_network)