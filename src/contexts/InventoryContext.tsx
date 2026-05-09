import React, { createContext, useContext, useState, useEffect } from 'react';
import { InventoryItem, InventoryAdjustment, MaterialUsage } from '../types';

interface InventoryContextType {
  inventory: InventoryItem[];
  history: InventoryAdjustment[];
  addAdjustment: (adjustment: Omit<InventoryAdjustment, 'id' | 'date'>) => void;
  updateStock: (itemId: string, newQuantity: number) => void;
  logUsage: (appointmentId: string, materials: MaterialUsage[], technicianName: string) => void;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

const MOCK_INVENTORY: InventoryItem[] = [
  { id: '1', name: 'Submersible Pump 0.75kW', category: 'Pump', stockQuantity: 12, unit: 'unit', updatedAt: new Date().toISOString() },
  { id: '2', name: 'Centrifugal Pump 1.1kW', category: 'Pump', stockQuantity: 8, unit: 'unit', updatedAt: new Date().toISOString() },
  { id: '3', name: 'Poly Pipe 25mm Class 6', category: 'Pipe', stockQuantity: 500, unit: 'meters', updatedAt: new Date().toISOString() },
  { id: '4', name: 'Ball Valve 25mm Brass', category: 'Fitting', stockQuantity: 45, unit: 'unit', updatedAt: new Date().toISOString() },
  { id: '5', name: 'Elbow 25mm HDPE', category: 'Fitting', stockQuantity: 120, unit: 'unit', updatedAt: new Date().toISOString() },
  { id: '6', name: 'Male Adaptor 25mm', category: 'Fitting', stockQuantity: 85, unit: 'unit', updatedAt: new Date().toISOString() },
  { id: '7', name: 'Pressure Switch Square D', category: 'Electrical', stockQuantity: 15, unit: 'unit', updatedAt: new Date().toISOString() },
];

export function InventoryProvider({ children }: { children: React.ReactNode }) {
  const [inventory, setInventory] = useState<InventoryItem[]>(MOCK_INVENTORY);
  const [history, setHistory] = useState<InventoryAdjustment[]>([]);

  useEffect(() => {
    const savedInv = localStorage.getItem('wps_inventory');
    const savedHistory = localStorage.getItem('wps_inventory_history');
    if (savedInv) setInventory(JSON.parse(savedInv));
    if (savedHistory) setHistory(JSON.parse(savedHistory));
  }, []);

  useEffect(() => {
    localStorage.setItem('wps_inventory', JSON.stringify(inventory));
    localStorage.setItem('wps_inventory_history', JSON.stringify(history));
  }, [inventory, history]);

  const addAdjustment = (adjustment: Omit<InventoryAdjustment, 'id' | 'date'>) => {
    const newAdjustment: InventoryAdjustment = {
      ...adjustment,
      id: Math.random().toString(36).substring(7),
      date: new Date().toISOString(),
    };

    setHistory(prev => [newAdjustment, ...prev]);

    setInventory(prev => prev.map(item => {
      if (item.id === adjustment.itemId) {
        const factor = adjustment.type === 'restock' || adjustment.type === 'return' ? 1 : -1;
        return {
          ...item,
          stockQuantity: item.stockQuantity + (adjustment.quantity * factor),
          updatedAt: new Date().toISOString()
        };
      }
      return item;
    }));
  };

  const updateStock = (itemId: string, newQuantity: number) => {
    setInventory(prev => prev.map(item => 
      item.id === itemId 
        ? { ...item, stockQuantity: newQuantity, updatedAt: new Date().toISOString() }
        : item
    ));
  };

  const logUsage = (appointmentId: string, materials: MaterialUsage[], technicianName: string) => {
    materials.forEach(m => {
      addAdjustment({
        itemId: m.itemId,
        itemName: m.itemName,
        type: 'usage',
        quantity: m.quantity,
        technicianName,
        appointmentId,
        notes: `Used on job #${appointmentId}`
      });
    });
  };

  return (
    <InventoryContext.Provider value={{ inventory, history, addAdjustment, updateStock, logUsage }}>
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const context = useContext(InventoryContext);
  if (context === undefined) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
}
