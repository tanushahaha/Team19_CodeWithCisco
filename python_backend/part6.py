import os
from cryptography.hazmat.primitives.ciphers.aead import AESGCM

# ==============================================================================
# SECTION A: UTILITY CLASS FOR SYMMETRIC ENCRYPTION
# ==============================================================================

class SymmetricCrypto:
    """A helper class for AES-256-GCM encryption and decryption."""
    def __init__(self, key):
        if len(key) != 32:
            raise ValueError("Key must be 32 bytes for AES-256.")
        self.key = key
        self.aesgcm = AESGCM(self.key)

    def encrypt(self, plaintext):
        """Encrypts plaintext using AES-GCM."""
        # A nonce (number used once) is required and must be random
        nonce = os.urandom(12)
        ciphertext = self.aesgcm.encrypt(nonce, plaintext.encode('utf-8'), None)
        # We prepend the nonce to the ciphertext for use in decryption
        return nonce + ciphertext

    def decrypt(self, ciphertext_with_nonce):
        """Decrypts AES-GCM ciphertext."""
        nonce = ciphertext_with_nonce[:12]
        ciphertext = ciphertext_with_nonce[12:]
        decrypted_bytes = self.aesgcm.decrypt(nonce, ciphertext, None)
        return decrypted_bytes.decode('utf-8')

# ==============================================================================
# SECTION B: CORE SYSTEM COMPONENTS (KDC AND USER)
# ==============================================================================

class KeyDistributionCenter:
    """The trusted central server that manages keys."""
    def __init__(self):
        self._master_keys = {}

    def register_user(self, user_id):
        """Generates and stores a master key for a new user."""
        master_key = os.urandom(32) # AES-256 requires a 32-byte key
        self._master_keys[user_id] = master_key
        return master_key

    def generate_session_key(self, user_a_id, user_b_id):
        """Generates a session key for two users."""
        if user_a_id not in self._master_keys or user_b_id not in self._master_keys:
            raise ValueError("One or both users are not registered.")

        # 1. Generate a new random session key for this conversation
        session_key = os.urandom(32)

        # 2. Create the "ticket" for Bob, encrypted with Bob's master key
        crypto_for_b = SymmetricCrypto(self._master_keys[user_b_id])
        ticket_payload = session_key + user_a_id.encode('utf-8')
        ticket_for_bob = crypto_for_b.encrypt(ticket_payload.decode('latin-1'))

        # 3. Create the final package for Alice, encrypted with Alice's master key
        crypto_for_a = SymmetricCrypto(self._master_keys[user_a_id])
        package_payload = session_key + user_b_id.encode('utf-8') + ticket_for_bob
        package_for_alice = crypto_for_a.encrypt(package_payload.decode('latin-1'))

        return package_for_alice

class User:
    """Represents a user in the secure communication group."""
    def __init__(self, user_id, kdc):
        self.id = user_id
        self.kdc = kdc
        self._master_key = self.kdc.register_user(self.id)
        self._crypto_master = SymmetricCrypto(self._master_key)
        self._session_keys = {}

    def request_key_for(self, other_user_id):
        """Requests a session key from the KDC to talk to another user."""
        # 1. Get the encrypted package from the KDC
        encrypted_package = self.kdc.generate_session_key(self.id, other_user_id)

        # 2. Decrypt the package with our master key
        decrypted_package = self._crypto_master.decrypt(encrypted_package).encode('latin-1')
        
        # 3. Unpack the session key and the ticket
        session_key = decrypted_package[:32]
        ticket = decrypted_package[32+len(other_user_id):]

        # 4. Store the session key for later use
        self._session_keys[other_user_id] = session_key
        print(f"[{self.id}] Successfully received session key for {other_user_id}.")
        return ticket

    def receive_key_ticket(self, ticket, sender_id):
        """Receives and decrypts a ticket from another user."""
        # 1. Decrypt the ticket with our master key
        decrypted_ticket = self._crypto_master.decrypt(ticket).encode('latin-1')

        # 2. Unpack the session key and verify the sender
        session_key = decrypted_ticket[:32]
        original_sender_id = decrypted_ticket[32:].decode('utf-8')

        if original_sender_id != sender_id:
            raise ValueError("Ticket sender mismatch!")

        # 3. Store the session key
        self._session_keys[sender_id] = session_key
        print(f"[{self.id}] Successfully processed ticket and received session key for {sender_id}.")

    def send_message(self, recipient_id, message):
        """Encrypts and sends a message using a shared session key."""
        if recipient_id not in self._session_keys:
            raise ValueError(f"No session key for {recipient_id}. Request one first.")
        
        crypto_session = SymmetricCrypto(self._session_keys[recipient_id])
        encrypted_message = crypto_session.encrypt(message)
        print(f"[{self.id}] Encrypted '{message}' to send to {recipient_id}.")
        return encrypted_message

    def receive_message(self, sender_id, encrypted_message):
        """Receives and decrypts a message."""
        if sender_id not in self._session_keys:
            raise ValueError(f"No session key for {sender_id}.")
            
        crypto_session = SymmetricCrypto(self._session_keys[sender_id])
        decrypted_message = crypto_session.decrypt(encrypted_message)
        print(f"[{self.id}] Received and decrypted message from {sender_id}: '{decrypted_message}'")
        return decrypted_message

# ==============================================================================
# SECTION C: MAIN SIMULATION
# ==============================================================================

if __name__ == "__main__":
    print("--- Simulating Symmetric Key Exchange via a Key Distribution Center (KDC) ---")

    # 1. Setup the KDC and the 25 users
    kdc_server = KeyDistributionCenter()
    users = [User(f"User_{i+1}", kdc_server) for i in range(25)]
    print(f"\nInitialized KDC and {len(users)} users.")

    # 2. Choose three users for our demonstration
    alice = users[0]
    bob = users[1]
    carol = users[2] # An eavesdropper
    print(f"\nDemonstration between {alice.id}, {bob.id}, and {carol.id} (eavesdropper).")

    # 3. Alice requests a key to talk to Bob
    print("\n--- Step 1: Alice requests a key for Bob from the KDC ---")
    ticket_for_bob = alice.request_key_for(bob.id)
    
    # 4. Alice sends the ticket to Bob
    print("\n--- Step 2: Alice sends the encrypted ticket to Bob ---")
    bob.receive_key_ticket(ticket_for_bob, alice.id)

    # 5. Alice and Bob now share a secret key. Let's verify.
    print("\n--- Step 3: Alice sends a secret message to Bob ---")
    secret_message = "The quantum internet is a go."
    encrypted_msg = alice.send_message(bob.id, secret_message)
    bob.receive_message(alice.id, encrypted_msg)

    # 6. Verify that Carol (eavesdropper) cannot decrypt the message
    print("\n--- Step 4: Carol intercepts the message and tries to decrypt it ---")
    try:
        # Carol has no session key for Alice, so this will fail
        carol.receive_message(alice.id, encrypted_msg)
    except Exception as e:
        print(f"[{carol.id}] Decryption failed as expected. Error: {e}")

    print("\n--- Simulation Complete ---")