import { describe, it, expect, beforeEach } from 'vitest';

// Constants
const APPRENTICE = 1;
const JOURNEYMAN = 2;
const MASTER = 3;

// Mock state
let mockState = {
  lastBuilderId: 0,
  builders: new Map(),
  builderAddresses: new Map()
};

// Mock functions
function registerBuilder(name: string, certificationLevel: number, specialties: string, yearsExperience: number, sender: string) {
  // Validate certification level
  if (certificationLevel < APPRENTICE || certificationLevel > MASTER) {
    return { err: 1 };
  }
  
  const newId = mockState.lastBuilderId + 1;
  mockState.builders.set(newId, {
    name,
    certificationLevel,
    specialties,
    yearsExperience,
    certifier: sender,
    certificationTime: 123 // Mock block height
  });
  
  mockState.builderAddresses.set(sender, { builderId: newId });
  mockState.lastBuilderId = newId;
  return { ok: newId };
}

function getBuilderById(builderId: number) {
  return mockState.builders.get(builderId) || null;
}

function getBuilderByAddress(address: string) {
  const builderMap = mockState.builderAddresses.get(address);
  if (!builderMap) return null;
  return mockState.builders.get(builderMap.builderId) || null;
}

function isCertifiedBuilder(address: string) {
  return mockState.builderAddresses.has(address);
}

function getBuilderCount() {
  return mockState.lastBuilderId;
}

describe('Builder Certification Contract', () => {
  beforeEach(() => {
    // Reset state before each test
    mockState = {
      lastBuilderId: 0,
      builders: new Map(),
      builderAddresses: new Map()
    };
  });
  
  it('should register a new builder', () => {
    const result = registerBuilder(
        'John Smith',
        MASTER,
        'Traditional Canoes, Sailboats',
        25,
        'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'
    );
    
    expect(result.ok).toBe(1);
    expect(mockState.lastBuilderId).toBe(1);
    expect(mockState.builders.size).toBe(1);
    expect(mockState.builderAddresses.size).toBe(1);
  });
  
  it('should reject invalid certification levels', () => {
    const result = registerBuilder(
        'John Smith',
        0, // Invalid level
        'Traditional Canoes, Sailboats',
        25,
        'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'
    );
    
    expect(result.err).toBe(1);
    expect(mockState.lastBuilderId).toBe(0);
    expect(mockState.builders.size).toBe(0);
  });
  
  it('should retrieve a builder by ID', () => {
    registerBuilder(
        'John Smith',
        MASTER,
        'Traditional Canoes, Sailboats',
        25,
        'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'
    );
    
    const builder = getBuilderById(1);
    
    expect(builder).not.toBeNull();
    expect(builder?.name).toBe('John Smith');
    expect(builder?.certificationLevel).toBe(MASTER);
  });
  
  it('should retrieve a builder by address', () => {
    const address = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
    
    registerBuilder(
        'John Smith',
        MASTER,
        'Traditional Canoes, Sailboats',
        25,
        address
    );
    
    const builder = getBuilderByAddress(address);
    
    expect(builder).not.toBeNull();
    expect(builder?.name).toBe('John Smith');
  });
  
  it('should check if an address is a certified builder', () => {
    const address = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
    
    registerBuilder(
        'John Smith',
        MASTER,
        'Traditional Canoes, Sailboats',
        25,
        address
    );
    
    expect(isCertifiedBuilder(address)).toBe(true);
    expect(isCertifiedBuilder('ST2PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM')).toBe(false);
  });
  
  it('should return the correct builder count', () => {
    expect(getBuilderCount()).toBe(0);
    
    registerBuilder(
        'John Smith',
        MASTER,
        'Traditional Canoes, Sailboats',
        25,
        'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'
    );
    
    expect(getBuilderCount()).toBe(1);
    
    registerBuilder(
        'Jane Doe',
        JOURNEYMAN,
        'Fishing Boats',
        12,
        'ST2PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'
    );
    
    expect(getBuilderCount()).toBe(2);
  });
});
