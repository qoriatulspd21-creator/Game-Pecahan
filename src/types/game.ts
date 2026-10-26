/**
 * Game state types for FRACTERRA: Proof Bridge
 */

export type GameMode = 'equivalent' | 'comparing';

export type GameStage = 
  | 'intro'           // Amati model awal
  | 'transforming'    // Model A dipilih, murid membelah/mengubah
  | 'transformed'     // Model A sudah siap
  | 'constructing'    // Menyusun segmen jembatan
  | 'proving'         // Memilih tanda dan alasan logis
  | 'completed';      // Jembatan kokoh, Kiko menyeberang!

export interface FractionValue {
  num: number;
  den: number;
}

export interface FractionPairPreset {
  id: string;
  name: string;
  fractionA: FractionValue;
  fractionB: FractionValue;
  isEquivalent: boolean;
  multiplier?: number; // e.g. times 2
}

export interface PlankSegment {
  id: string;
  type: 'green' | 'beige';
  value: string; // e.g. "1/4", "1/6", "1/8"
  label: string;
}

export type SlotAssignment = (PlankSegment | null)[];
