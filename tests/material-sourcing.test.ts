import { describe, it, expect, beforeEach } from 'vitest';

// Mock state
let mockState = {
  lastMaterialId: 0,
  materials: new Map()
};

// Mock functions
function registerMaterial(name: string, type: string, sourceLocation: string, sustainable: boolean, sender: string) {
  const newId = mockState.lastMaterialId + 1;
  mockState.materials.set(newId, {
    name,
    type,
    sourceLocation,
    sustainable,
    registrar: sender,
    registrationTime: 123 // Mock block height
  });
  mockState.lastMaterialId = newId;
  return { ok: newId };
}

function getMaterial(materialId: number) {
  return mockState.materials.get(materialId) || null;
}

function isSustainable(materialId: number) {
  const material = mockState.materials.get(materialId);
  return material ? material.sustainable : false;
}

function getMaterialCount() {
  return mockState.lastMaterialId;
}

describe('Material Sourcing Contract', () => {
  beforeEach(() => {
    // Reset state before each test
    mockState = {
      lastMaterialId: 0,
      materials: new Map()
    };
  });
  
  it('should register a new material', () => {
    const result = registerMaterial(
        'Cedar',
        'Wood',
        'Pacific Northwest',
        true,
        'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'
    );
    
    expect(result.ok).toBe(1);
    expect(mockState.lastMaterialId).toBe(1);
    expect(mockState.materials.size).toBe(1);
  });
  
  it('should retrieve a material by ID', () => {
    registerMaterial(
        'Cedar',
        'Wood',
        'Pacific Northwest',
        true,
        'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'
    );
    
    const material = getMaterial(1);
    
    expect(material).not.toBeNull();
    expect(material?.name).toBe('Cedar');
    expect(material?.type).toBe('Wood');
    expect(material?.sustainable).toBe(true);
  });
  
  it('should check if a material is sustainable', () => {
    registerMaterial(
        'Cedar',
        'Wood',
        'Pacific Northwest',
        true,
        'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'
    );
    
    registerMaterial(
        'Endangered Teak',
        'Wood',
        'Southeast Asia',
        false,
        'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'
    );
    
    expect(isSustainable(1)).toBe(true);
    expect(isSustainable(2)).toBe(false);
  });
  
  it('should return the correct material count', () => {
    expect(getMaterialCount()).toBe(0);
    
    registerMaterial(
        'Cedar',
        'Wood',
        'Pacific Northwest',
        true,
        'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'
    );
    
    expect(getMaterialCount()).toBe(1);
    
    registerMaterial(
        'Hemp',
        'Fiber',
        'Midwest',
        true,
        'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'
    );
    
    expect(getMaterialCount()).toBe(2);
  });
});
