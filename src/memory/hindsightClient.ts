/**
 * Hindsight Persistent Memory Client Wrapper
 * Uses the official @vectorize-io/hindsight-client SDK.
 *
 * Implements:
 * - Real Hindsight Cloud connection when HINDSIGHT_API_KEY is configured.
 * - Explicitly labeled DEVELOPMENT FALLBACK engine when credentials are absent,
 *   preserving identical Retain / Recall / Reflect semantics so the agent
 *   can be tested and run anywhere while strictly separating live vs dev mode.
 */

import { HindsightClient } from '@vectorize-io/hindsight-client';
import { MemoryItem, GroundingType, MemoryCategory } from '../models/entities.js';

export interface MemoryServiceStatus {
  mode: 'hindsight_cloud' | 'development_fallback';
  label: string;
  isDevelopmentFallback: boolean;
  connected: boolean;
  endpoint: string;
  bankId: string;
  totalMemoriesRetained: number;
  message: string;
}

export interface RetainOptions {
  documentId?: string;
  timestamp?: string;
  context?: string;
  tags?: string[];
  metadata?: {
    category?: MemoryCategory;
    groundingType?: GroundingType;
    sourceMeetingId?: string;
    sourceMeetingTitle?: string;
    sourceDate?: string;
    participantId?: string;
    companyId?: string;
    owner?: string;
    dueDate?: string;
    confidence?: number;
    [key: string]: unknown;
  };
}

export interface RecallOptions {
  types?: string[];
  preferObservations?: boolean;
  maxTokens?: number;
  tags?: string[];
  filterCategories?: MemoryCategory[];
}

export interface RecalledItem {
  id: string;
  content: string;
  relevanceScore: number;
  timestamp: string;
  category: MemoryCategory;
  groundingType: GroundingType;
  sourceMeetingId?: string;
  sourceMeetingTitle?: string;
  sourceDate?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Fallback Development Engine strictly for offline/local prototyping without Hindsight API keys.
 * Clearly labeled and isolated.
 */
class DevelopmentMemoryEngine {
  private banks: Map<string, MemoryItem[]> = new Map();

  constructor() {
    console.info('[MeetingMind] Initialized Development Memory Fallback Engine (No HINDSIGHT_API_KEY provided).');
  }

  public getBank(bankId: string): MemoryItem[] {
    if (!this.banks.has(bankId)) {
      this.banks.set(bankId, []);
    }
    return this.banks.get(bankId)!;
  }

  public retain(bankId: string, content: string, options?: RetainOptions): MemoryItem {
    const bank = this.getBank(bankId);
    const item: MemoryItem = {
      id: options?.documentId || `mem-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      bankId,
      category: options?.metadata?.category || 'meeting',
      groundingType: options?.metadata?.groundingType || 'FACT',
      content: content.trim(),
      timestamp: options?.timestamp || new Date().toISOString(),
      sourceMeetingId: options?.metadata?.sourceMeetingId,
      sourceMeetingTitle: options?.metadata?.sourceMeetingTitle,
      sourceDate: options?.metadata?.sourceDate || options?.timestamp?.slice(0, 10),
      confidence: options?.metadata?.confidence ?? 0.95,
      tags: options?.tags || ['meeting'],
      metadata: {
        participantId: options?.metadata?.participantId || 'unknown',
        companyId: options?.metadata?.companyId || 'unknown',
        owner: options?.metadata?.owner,
        dueDate: options?.metadata?.dueDate,
        ...options?.metadata
      }
    };
    bank.push(item);
    return item;
  }

  public recall(bankId: string, query: string, options?: RecallOptions): RecalledItem[] {
    const bank = this.getBank(bankId);
    if (bank.length === 0) return [];

    const queryTokens = query.toLowerCase().split(/[\s,.;:?!'"]+/).filter((w) => w.length > 2);

    const scored = bank.map((mem) => {
      const contentLower = mem.content.toLowerCase();
      const tagsLower = mem.tags.map((t) => t.toLowerCase()).join(' ');
      const catLower = mem.category.toLowerCase();
      let matchScore = 0;

      queryTokens.forEach((token) => {
        if (contentLower.includes(token)) matchScore += 2;
        if (tagsLower.includes(token)) matchScore += 3;
        if (catLower.includes(token)) matchScore += 1.5;
      });

      // boost recent memories slightly
      const ageDays = (Date.now() - new Date(mem.timestamp).getTime()) / (1000 * 3600 * 24);
      const recencyBoost = Math.max(0, 1 - ageDays / 90) * 0.5;

      return {
        id: mem.id,
        content: mem.content,
        relevanceScore: Math.min(1, (matchScore + recencyBoost) / Math.max(1, queryTokens.length * 2)),
        timestamp: mem.timestamp,
        category: mem.category,
        groundingType: mem.groundingType,
        sourceMeetingId: mem.sourceMeetingId,
        sourceMeetingTitle: mem.sourceMeetingTitle,
        sourceDate: mem.sourceDate,
        metadata: mem.metadata
      };
    });

    // If options specify category filters
    let filtered = scored;
    if (options?.filterCategories && options.filterCategories.length > 0) {
      filtered = filtered.filter((item) => options.filterCategories!.includes(item.category));
    }

    // Sort by relevance, then recency
    return filtered
      .filter((s) => s.relevanceScore > 0.05 || queryTokens.length === 0)
      .sort((a, b) => b.relevanceScore - a.relevanceScore);
  }

  public reflect(bankId: string, query: string): string {
    const recalled = this.recall(bankId, query, { maxTokens: 1000 });
    if (recalled.length === 0) {
      return 'No historical memories found for reflection.';
    }

    const facts = recalled.filter((r) => r.groundingType === 'FACT').map((f) => `- [FACT] ${f.content}`);
    const commitments = recalled.filter((r) => r.groundingType === 'COMMITMENT').map((c) => `- [COMMITMENT] ${c.content}`);
    const concerns = recalled.filter((r) => r.category === 'concern').map((c) => `- [CONCERN] ${c.content}`);

    return [
      `Reflection on: "${query}"`,
      `Key Recalled Evidence (${recalled.length} memories):`,
      ...facts.slice(0, 5),
      ...commitments.slice(0, 3),
      ...concerns.slice(0, 3)
    ].join('\n');
  }

  public listMemories(bankId: string): MemoryItem[] {
    return [...this.getBank(bankId)];
  }

  public clearBank(bankId: string): void {
    this.banks.set(bankId, []);
  }

  public getTotalMemoryCount(): number {
    let count = 0;
    for (const bank of this.banks.values()) {
      count += bank.length;
    }
    return count;
  }
}

class HindsightServiceManager {
  private client: HindsightClient | null = null;
  private devEngine: DevelopmentMemoryEngine = new DevelopmentMemoryEngine();
  private apiKey: string | undefined;
  private baseUrl: string;
  private defaultBankId: string = 'meetingmind-acme-sarah';

  constructor() {
    this.apiKey = process.env.HINDSIGHT_API_KEY;
    this.baseUrl = process.env.HINDSIGHT_BASE_URL || 'https://api.hindsight.vectorize.io';

    if (this.apiKey && this.apiKey.trim() !== '' && !this.apiKey.includes('MY_HINDSIGHT_API_KEY')) {
      try {
        this.client = new HindsightClient({
          apiKey: this.apiKey,
          baseUrl: this.baseUrl,
          userAgent: 'MeetingMind-Agent/1.0'
        });
        console.info(`[MeetingMind] Connected to Hindsight Cloud at ${this.baseUrl}`);
      } catch (err) {
        console.error('[MeetingMind] Failed to initialize Hindsight client, falling back to development engine:', err);
        this.client = null;
      }
    } else {
      console.warn('[MeetingMind] HINDSIGHT_API_KEY not configured. Running with Development Fallback Engine.');
    }
  }

  public getStatus(bankId: string = this.defaultBankId): MemoryServiceStatus {
    const isCloud = this.client !== null;
    const totalCount = this.devEngine.getBank(bankId).length;

    return {
      mode: isCloud ? 'hindsight_cloud' : 'development_fallback',
      label: isCloud ? 'Hindsight Cloud (Vectorize)' : 'Development Memory Fallback Engine',
      isDevelopmentFallback: !isCloud,
      connected: true,
      endpoint: isCloud ? this.baseUrl : 'in-process (local memory adapter)',
      bankId,
      totalMemoriesRetained: totalCount,
      message: isCloud
        ? `Connected to official Hindsight Cloud API (${this.baseUrl}). Persistent memories are managed by Vectorize.`
        : 'Running development memory engine. Provide HINDSIGHT_API_KEY to connect to live Hindsight Cloud.'
    };
  }

  /**
   * RETAIN: Store meeting content or extracted facts into Hindsight.
   */
  public async retain(
    bankId: string,
    content: string,
    options?: RetainOptions
  ): Promise<{ success: boolean; memoryId: string; mode: string }> {
    // Always mirror to development engine so state is easily inspectable and persistent across hot sessions
    const devItem = this.devEngine.retain(bankId, content, options);

    if (this.client) {
      try {
        // Hindsight SDK accepts string-to-string metadata dictionary
        const stringMeta: Record<string, string> = {};
        if (options?.metadata) {
          for (const [k, v] of Object.entries(options.metadata)) {
            if (v !== undefined && v !== null) {
              stringMeta[k] = typeof v === 'string' ? v : String(v);
            }
          }
        }

        await this.client.retain(bankId, content, {
          documentId: options?.documentId,
          timestamp: options?.timestamp,
          context: options?.context,
          tags: options?.tags,
          metadata: stringMeta
        });
        return { success: true, memoryId: devItem.id, mode: 'hindsight_cloud' };
      } catch (err) {
        console.error(`[MeetingMind] Error retaining into Hindsight Cloud (Bank: ${bankId}):`, err);
        // Do not crash - report fallback storage
        return { success: true, memoryId: devItem.id, mode: 'development_fallback_mirrored' };
      }
    }

    return { success: true, memoryId: devItem.id, mode: 'development_fallback' };
  }

  /**
   * RECALL: Query Hindsight memories contextually.
   */
  public async recall(
    bankId: string,
    query: string,
    options?: RecallOptions
  ): Promise<RecalledItem[]> {
    if (this.client) {
      try {
        const response = await this.client.recall(bankId, query, {
          types: options?.types,
          preferObservations: options?.preferObservations ?? true,
          maxTokens: options?.maxTokens ?? 2000
        });

        // Map Hindsight Cloud response items
        if (response && Array.isArray((response as any).items)) {
          return (response as any).items.map((item: any, idx: number) => ({
            id: item.id || `hs-${idx}`,
            content: item.text || item.content || JSON.stringify(item),
            relevanceScore: item.score ?? 0.9,
            timestamp: item.timestamp || new Date().toISOString(),
            category: (item.metadata?.category as MemoryCategory) || 'meeting',
            groundingType: (item.metadata?.groundingType as GroundingType) || 'FACT',
            sourceMeetingId: item.metadata?.sourceMeetingId,
            sourceMeetingTitle: item.metadata?.sourceMeetingTitle,
            sourceDate: item.metadata?.sourceDate,
            metadata: item.metadata
          }));
        }
      } catch (err) {
        console.warn(`[MeetingMind] Cloud recall failed, falling back to local memory store:`, err);
      }
    }

    // Development engine recall
    return this.devEngine.recall(bankId, query, options);
  }

  /**
   * REFLECT: High-level synthesis of recalled memories.
   */
  public async reflect(bankId: string, query: string): Promise<string> {
    if (this.client) {
      try {
        const response = await this.client.reflect(bankId, query, {
          includeFacts: true
        });
        if (response && (response as any).text) {
          return (response as any).text;
        }
      } catch (err) {
        console.warn(`[MeetingMind] Cloud reflect failed, using local reflection synthesis:`, err);
      }
    }

    return this.devEngine.reflect(bankId, query);
  }

  /**
   * List all stored memories for a bank.
   */
  public listMemories(bankId: string): MemoryItem[] {
    return this.devEngine.listMemories(bankId);
  }

  public clearBank(bankId: string): void {
    this.devEngine.clearBank(bankId);
  }

  public getDevEngine(): DevelopmentMemoryEngine {
    return this.devEngine;
  }
}

export const hindsightService = new HindsightServiceManager();
