import random

def generate_random_sequence(length):
    """Generates a random sequence of bits (0s and 1s)."""
    return [random.randint(0, 1) for _ in range(length)]

def encode_qubits(bits, bases):
    """Conceptually encodes bits into qubits based on chosen bases."""
    print(f"Alice's original bits:  {''.join(map(str, bits))}")
    print(f"Alice's random bases: {''.join(map(str, bases))} (0='+', 1='x')")
    return bits

def measure_qubits(qubits, alice_bases, bob_bases):
    """Simulates Bob measuring the qubits with his own random bases."""
    measured_bits = []
    for i in range(len(qubits)):
        if alice_bases[i] == bob_bases[i]:
            # Correct basis used, measurement is accurate
            measured_bits.append(qubits[i])
        else:
            # Incorrect basis used, measurement is random
            measured_bits.append(random.randint(0, 1))
    print(f"Bob's random bases:   {''.join(map(str, bob_bases))}")
    print(f"Bob's measured bits:  {''.join(map(str, measured_bits))}")
    return measured_bits

def sift_keys(alice_bases, bob_bases, alice_bits, bob_measured_bits):
    """Alice and Bob compare bases and keep the bits where bases match."""
    sifted_key_alice = []
    sifted_key_bob = []
    for i in range(len(alice_bases)):
        if alice_bases[i] == bob_bases[i]:
            sifted_key_alice.append(alice_bits[i])
            sifted_key_bob.append(bob_measured_bits[i])
    return sifted_key_alice, sifted_key_bob

def check_for_eavesdropper(key_a, key_b, sample_size):
    """Compares a sample of the keys to check for errors."""
    if not key_a:
        return 0, True
        
    num_to_compare = max(1, int(len(key_a) * sample_size))
    sample_indices = random.sample(range(len(key_a)), num_to_compare)
    
    mismatches = 0
    print("\n--- Error Checking ---")
    print(f"Comparing {num_to_compare} sample bits...")
    for i in sample_indices:
        if key_a[i] != key_b[i]:
            mismatches += 1
            
    error_rate = mismatches / num_to_compare
    return error_rate, mismatches == 0

# --- Main Simulation ---
if __name__ == "__main__":
    NUM_QUBITS = 60 # Using a larger number for a more realistic key size
    
    print("--- Simulating BB84 Quantum Key Distribution ---")
    
    # Step 1: Alice generates her random bits and bases
    print("\n--- Step 1: Alice prepares and sends qubits ---")
    alice_original_bits = generate_random_sequence(NUM_QUBITS)
    alice_bases = generate_random_sequence(NUM_QUBITS)
    
    # Step 2: Bob measures with his random bases
    print("\n--- Step 2: Bob measures the incoming qubits ---")
    bob_bases = generate_random_sequence(NUM_QUBITS)
    qubits_sent_by_alice = encode_qubits(alice_original_bits, alice_bases)
    bob_measured_results = measure_qubits(qubits_sent_by_alice, alice_bases, bob_bases)

    # Step 3: Sifting - They publicly compare bases
    print("\n--- Step 3: Sifting (Public Discussion) ---")
    sifted_alice, sifted_bob = sift_keys(alice_bases, bob_bases, alice_original_bits, bob_measured_results)
    print(f"Bases matched at {len(sifted_alice)} positions.")
    print(f"Sifted Key (Alice): {''.join(map(str, sifted_alice))}")
    print(f"Sifted Key (Bob):   {''.join(map(str, sifted_bob))}")

    # Step 4: Error Checking - They compare a sample to detect eavesdropping
    error_rate, is_secure = check_for_eavesdropper(sifted_alice, sifted_bob, sample_size=0.5)
    print(f"Calculated Error Rate: {error_rate*100:.2f}%")

    # Step 5: Final Key Generation
    print("\n--- Step 5: Final Key Generation ---")
    if is_secure:
        # Note: In a real protocol, the publicly compared bits would be removed.
        final_key = ''.join(map(str, sifted_alice))
        print(f"Secure channel established! The other 23 users do not know this key.")
        print(f"Final Secret Key: {final_key}")
    else:
        print("Eavesdropper detected! Key discarded. Communication is not secure.")