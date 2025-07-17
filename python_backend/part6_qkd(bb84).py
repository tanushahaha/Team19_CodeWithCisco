import random


EVE_PRESENCE_PROBABILITY = 0.5 

def generate_random_sequence(length):
    return [random.randint(0, 1) for _ in range(length)]

def encode_qubits(bits, bases):
    print(f"Alice's original bits:  {''.join(map(str, bits))}")
    print(f"Alice's random bases: {''.join(map(str, bases))} (0='+', 1='x')")
    return bits

def eavesdrop_and_resend(qubits, alice_bases):
    eve_bases = generate_random_sequence(len(qubits))
    print(f"Eve's random bases:   {''.join(map(str, eve_bases))}")
    
    eve_measured_bits = []
    for i in range(len(qubits)):
        if alice_bases[i] == eve_bases[i]:
            eve_measured_bits.append(qubits[i])
        else:
            eve_measured_bits.append(random.randint(0, 1))
            
    return eve_measured_bits, eve_bases

def measure_qubits(qubits_received, bases_used_by_sender, bob_bases):
    measured_bits = []
    for i in range(len(qubits_received)):
        if bases_used_by_sender[i] == bob_bases[i]:
            measured_bits.append(qubits_received[i])
        else:
            measured_bits.append(random.randint(0, 1))
    print(f"Bob's random bases:   {''.join(map(str, bob_bases))}")
    print(f"Bob's measured bits:  {''.join(map(str, measured_bits))}")
    return measured_bits

def sift_keys(alice_bases, bob_bases, alice_bits, bob_measured_bits):
    sifted_key_alice = []
    sifted_key_bob = []
    for i in range(len(alice_bases)):
        if alice_bases[i] == bob_bases[i]:
            sifted_key_alice.append(alice_bits[i])
            sifted_key_bob.append(bob_measured_bits[i])
    return sifted_key_alice, sifted_key_bob

def check_for_eavesdropper(key_a, key_b, sample_size):
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

if __name__ == "__main__":
    NUM_QUBITS = 60
    
    for i in range(5): 
        print(f"\n{'='*20} TRIAL {i+1} {'='*20}")
        
        is_eve_present = random.random() < EVE_PRESENCE_PROBABILITY
        
        print("\n--- Step 1: Alice prepares qubits ---")
        alice_original_bits = generate_random_sequence(NUM_QUBITS)
        alice_bases = generate_random_sequence(NUM_QUBITS)
        qubits_sent_by_alice = encode_qubits(alice_original_bits, alice_bases)
        
        if is_eve_present:
            print("\n--- An Eavesdropper (Eve) Intercepts the Channel! ---")
            qubits_for_bob, bases_from_eve = eavesdrop_and_resend(qubits_sent_by_alice, alice_bases)
        else:
            print("\n--- Channel is SECURE. No eavesdropper present. ---")
            qubits_for_bob = qubits_sent_by_alice
            bases_from_eve = alice_bases

        print("\n--- Step 3: Bob measures the incoming qubits ---")
        bob_bases = generate_random_sequence(NUM_QUBITS)
        bob_measured_results = measure_qubits(qubits_for_bob, bases_from_eve, bob_bases)

        print("\n--- Step 4: Sifting (Public Discussion) ---")
        sifted_alice, sifted_bob = sift_keys(alice_bases, bob_bases, alice_original_bits, bob_measured_results)
        print(f"Bases matched at {len(sifted_alice)} positions.")
        
        error_rate, is_secure = check_for_eavesdropper(sifted_alice, sifted_bob, sample_size=0.5)
        print(f"Calculated Error Rate: {error_rate*100:.2f}%")

        print("\n--- Step 6: Final Key Generation ---")
        if is_secure:
            final_key = ''.join(map(str, sifted_alice))
            print(f"Secure channel established! The other 23 users do not know this key.")
            print(f"Final Secret Key: {final_key}")
        else:
            print("Eavesdropper detected! Key discarded. Communication is not secure.")
