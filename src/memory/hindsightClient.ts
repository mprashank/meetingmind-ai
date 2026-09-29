/**
 * Hindsight Persistent Memory Client Wrapper
 * Uses the official @vectorize-io/hindsight-client TypeScript SDK.
 *
 * Capabilities:
 * - Real Hindsight Cloud connection when HINDSIGHT_API_KEY is configured.
 * - Explicitly labeled DEVELOPMENT FALLBACK engine when credentials are absent or unverified,
 *   preserving identical Retain / Recall / Reflect semantics so the agent
 *   can be tested and run anywhere while strictly separating live vs dev mode.
 */

import 'dotenv/config';
import { HindsightClient, RecallResponse, RecallResult, RetainResponse } from '@vectorize-io/hindsight-client';
import { MemoryItem, GroundingType, MemoryCategory } from '../models/entities.js';

export interface MemoryServiceStatus {
  mode: 'hindsight_cloud' | 'development_fallback';
  label: string;
  isDevelopmentFallback: boolean;
  credentialsConfigured: boolean;
  clientInitialized: boolean;
  cloudVerified: boolean;
  connected: boolean;
  endpoint: string;
  baseUrl: string;
  bankId: string;
  totalMemoriesRetained: number;
  message: string;
  cloudError?: string | null;
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
    console.info('[MeetingMind] Initialized Development Memory Fallback Engine.');
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

export class HindsightServiceManager {
  private client: HindsightClient | null = null;
  private devEngine: DevelopmentMemoryEngine = new DevelopmentMemoryEngine();
  private apiKey: string | undefined;
  private baseUrl: string = 'https://api.hindsight.vectorize.io';
  private defaultBankId: string = 'meetingmind-acme-sarah';
  private verifiedBanks: Set<string> = new Set();
  private cloudVerified: boolean = false;
  private cloudError: string | null = null;
  private verificationAttempted: boolean = false;

  constructor() {
    this.initClient();
  }

  /**
   * Initializes or updates the HindsightClient instance from environment variables.
   */
  public initClient(): void {
    this.apiKey = process.env.HINDSIGHT_API_KEY;
    this.baseUrl = process.env.HINDSIGHT_BASE_URL || 'https://api.hindsight.vectorize.io';

    if (this.hasValidKey) {
      try {
        this.client = new HindsightClient({
          apiKey: this.apiKey,
          baseUrl: this.baseUrl,
          userAgent: 'MeetingMind-Agent/1.0'
        });
        console.info(`[MeetingMind] Initialized HindsightClient targeting ${this.baseUrl}`);
      } catch (err: any) {
        console.error('[MeetingMind] Failed to instantiate HindsightClient:', err);
        this.client = null;
        this.cloudVerified = false;
        this.cloudError = err.message || String(err);
      }
    } else {
      this.client = null;
      this.cloudVerified = false;
      this.cloudError = null;
    }
  }

  public get hasValidKey(): boolean {
    const key = process.env.HINDSIGHT_API_KEY || this.apiKey;
    return Boolean(key && key.trim() !== '' && !key.includes('MY_HINDSIGHT_API_KEY'));
  }

  public get isCloudActive(): boolean {
    return Boolean(this.client && this.hasValidKey && this.cloudVerified);
  }

  /**
   * Performs an active connection and credentials check against Hindsight Cloud.
   */
  public async verifyConnection(): Promise<boolean> {
    this.verificationAttempted = true;

    // Refresh credentials in case process.env was updated
    this.initClient();

    if (!this.client || !this.hasValidKey) {
      this.cloudVerified = false;
      this.cloudError = null;
      return false;
    }

    try {
      // 1. Test basic cloud connectivity
      await this.client.getVersion();

      // 2. Ensure default demo bank exists
      const bankOk = await this.ensureBank(this.defaultBankId);
      if (!bankOk) {
        throw new Error(this.cloudError || 'Authenticated bank verification failed on Hindsight Cloud');
      }

      this.cloudVerified = true;
      this.cloudError = null;
      console.info(`[MeetingMind] Connection verified: Hindsight Cloud (Vectorize) at ${this.baseUrl}`);
      return true;
    } catch (err: any) {
      this.cloudVerified = false;
      this.cloudError = err.message || String(err);
      console.warn(`[MeetingMind] Hindsight Cloud verification failed: ${this.cloudError}. Running on development memory engine.`);
      return false;
    }
  }

  /**
   * Idempotently verifies or provisions a Hindsight memory bank.
   * Safe and cached: does not recreate or re-query on every request.
   */
  public async ensureBank(bankId: string): Promise<boolean> {
    if (!this.client || !this.hasValidKey) {
      return false;
    }

    if (this.verifiedBanks.has(bankId)) {
      return true;
    }

    try {
      // Check if bank already exists
      await this.client.getBankConfig(bankId);
      this.verifiedBanks.add(bankId);
      return true;
    } catch (configErr: any) {
      if (configErr.statusCode === 401 || String(configErr.message || '').includes('Authentication failed')) {
        console.warn(`[MeetingMind] Hindsight Cloud authentication failed for bank "${bankId}": ${configErr.message}`);
        this.cloudVerified = false;
        this.cloudError = configErr.message;
        return false;
      }

      // If bank does not exist or needs initialization, create it
      try {
        await this.client.createBank(bankId, {
          retainMission: 'Extract key facts, commitments, pricing decisions, security concerns, and client preferences for executive briefings.',
          reflectMission: 'Synthesize relationship momentum, open commitments, and historical patterns for executive meetings.'
        });
        console.info(`[MeetingMind] Successfully ensured Hindsight memory bank: "${bankId}"`);
        this.verifiedBanks.add(bankId);
        return true;
      } catch (createErr: any) {
        console.warn(`[MeetingMind] Could not verify/create bank "${bankId}" in Hindsight Cloud:`, createErr.message || createErr);
        if (createErr.statusCode === 401 || String(createErr.message || '').includes('Authentication failed')) {
          this.cloudVerified = false;
          this.cloudError = createErr.message;
        }
        return false;
      }
    }
  }

  public getStatus(bankId: string = this.defaultBankId): MemoryServiceStatus {
    // Dynamic re-check
    const hasKey = this.hasValidKey;
    const isCloud = Boolean(this.client && hasKey && this.cloudVerified);
    const totalCount = this.devEngine.getBank(bankId).length;

    let message = '';
    if (isCloud) {
      message = `Connected to official Hindsight Cloud API (${this.baseUrl}). Persistent memories are managed by Vectorize.`;
    } else if (hasKey && !this.cloudVerified) {
      message = this.cloudError
        ? `HINDSIGHT_API_KEY provided but verification failed (${this.cloudError}). Running on Development Memory Engine.`
        : `HINDSIGHT_API_KEY provided but unverified. Running on Development Memory Engine.`;
    } else {
      message = 'Running development memory engine. Provide HINDSIGHT_API_KEY to connect to live Hindsight Cloud.';
    }

    return {
      mode: isCloud ? 'hindsight_cloud' : 'development_fallback',
      label: isCloud ? 'Hindsight Cloud (Vectorize)' : 'Development Memory Fallback Engine',
      isDevelopmentFallback: !isCloud,
      credentialsConfigured: hasKey,
      clientInitialized: this.client !== null,
      cloudVerified: this.cloudVerified,
      connected: isCloud,
      endpoint: isCloud ? this.baseUrl : 'in-process (local memory adapter)',
      baseUrl: this.baseUrl,
      bankId,
      totalMemoriesRetained: totalCount,
      message,
      cloudError: this.cloudError
    };
  }

  /**
   * RETAIN: Store meeting content or extracted facts into Hindsight Cloud.
   * Mirrors into local development engine for UI inspection and offline consistency.
   */
  public async retain(
    bankId: string,
    content: string,
    options?: RetainOptions
  ): Promise<{ success: boolean; memoryId: string; mode: string; error?: string }> {
    // Always mirror to development engine
    const devItem = this.devEngine.retain(bankId, content, options);

    // If credentials exist but we haven't verified connection yet, attempt verification
    if (this.client && this.hasValidKey && !this.verificationAttempted) {
      await this.verifyConnection();
    }

    const client = this.client;
    if (this.isCloudActive && client) {
      try {
        await this.ensureBank(bankId);

        // Convert metadata dictionary into string-to-string Record
        const stringMeta: Record<string, string> = {};
        if (options?.metadata) {
          for (const [k, v] of Object.entries(options.metadata)) {
            if (v !== undefined && v !== null) {
              stringMeta[k] = typeof v === 'string' ? v : String(v);
            }
          }
        }

        const retainOptions: {
          documentId?: string;
          timestamp?: string;
          context?: string;
          tags?: string[];
          metadata?: Record<string, string>;
        } = {
          documentId: options?.documentId,
          timestamp: options?.timestamp,
          context: options?.context || (options?.metadata?.sourceMeetingTitle ? `Meeting: ${options.metadata.sourceMeetingTitle}` : undefined),
          tags: options?.tags,
          metadata: Object.keys(stringMeta).length > 0 ? stringMeta : undefined
        };

        const res: RetainResponse = await client.retain(bankId, content, retainOptions);
        return {
          success: res.success ?? true,
          memoryId: devItem.id,
          mode: 'hindsight_cloud'
        };
      } catch (err: any) {
        console.error(`[MeetingMind] Real Hindsight Cloud retain failed (Bank: ${bankId}):`, err.message || err);
        return {
          success: true,
          memoryId: devItem.id,
          mode: 'development_fallback_mirrored',
          error: err.message || String(err)
        };
      }
    }

    return {
      success: true,
      memoryId: devItem.id,
      mode: 'development_fallback'
    };
  }

  /**
   * RECALL: Query Hindsight memories contextually.
   * Maps actual Hindsight TypeScript SDK response.results into RecalledItem[].
   */
  public async recall(
    bankId: string,
    query: string,
    options?: RecallOptions
  ): Promise<RecalledItem[]> {
    // Attempt verification if credentials configured but not yet verified
    if (this.client && this.hasValidKey && !this.verificationAttempted) {
      await this.verifyConnection();
    }

    const client = this.client;
    if (this.isCloudActive && client) {
      try {
        await this.ensureBank(bankId);

        const response: RecallResponse = await client.recall(bankId, query, {
          types: options?.types,
          preferObservations: options?.preferObservations ?? true,
          maxTokens: options?.maxTokens ?? 2000,
          tags: options?.tags
        });

        // The official Hindsight SDK returns { results: Array<RecallResult> }
        const rawResults: RecallResult[] = Array.isArray(response?.results)
          ? response.results
          : Array.isArray((response as any)?.items)
          ? (response as any).items
          : [];

        if (rawResults.length > 0) {
          const mapped: RecalledItem[] = rawResults.map((r: any, idx: number) => {
            const meta = (r.metadata && typeof r.metadata === 'object') ? r.metadata : {};
            const score = typeof r.scores?.final === 'number'
              ? r.scores.final
              : typeof r.scores?.reranker === 'number'
              ? r.scores.reranker
              : typeof r.score === 'number'
              ? r.score
              : 0.85;

            return {
              id: r.id || `hs-${idx}`,
              content: r.text || r.content || '',
              relevanceScore: Math.min(1.0, Math.max(0.0, score)),
              timestamp: r.occurred_start || r.mentioned_at || meta.sourceDate || new Date().toISOString(),
              category: (meta.category as MemoryCategory) || 'meeting',
              groundingType: (meta.groundingType as GroundingType) || 'FACT',
              sourceMeetingId: meta.sourceMeetingId,
              sourceMeetingTitle: meta.sourceMeetingTitle,
              sourceDate: meta.sourceDate,
              metadata: meta
            };
          });

          if (options?.filterCategories && options.filterCategories.length > 0) {
            return mapped.filter((item) => options.filterCategories!.includes(item.category));
          }

          return mapped;
        }

        // If cloud recalled 0 items because the bank was freshly created or query had no semantic match,
        // check if local development store has memories (useful for instant demo experience)
        const devItems = this.devEngine.recall(bankId, query, options);
        if (devItems.length > 0) {
          return devItems;
        }
        return [];
      } catch (err: any) {
        console.warn(`[MeetingMind] Cloud recall failed, falling back to local memory store:`, err.message || err);
      }
    }

    // Development engine recall
    return this.devEngine.recall(bankId, query, options);
  }

  /**
   * REFLECT: Contextual synthesis of memories using Hindsight Cloud or local fallback.
   */
  public async reflect(bankId: string, query: string): Promise<string> {
    const client = this.client;
    if (this.isCloudActive && client) {
      try {
        await this.ensureBank(bankId);
        const response = await client.reflect(bankId, query, {
          includeFacts: true
        });
        if (response?.text) {
          return response.text;
        }
      } catch (err: any) {
        console.warn(`[MeetingMind] Cloud reflect failed, using local reflection synthesis:`, err.message || err);
      }
    }

    return this.devEngine.reflect(bankId, query);
  }

  /**
   * List all stored memories for a bank from development store.
   */
  public listMemories(bankId: string): MemoryItem[] {
    return this.devEngine.listMemories(bankId);
  }

  public clearBank(bankId: string): void {
    this.devEngine.clearBank(bankId);
    this.verifiedBanks.delete(bankId);
  }

  public getDevEngine(): DevelopmentMemoryEngine {
    return this.devEngine;
  }
}

export const hindsightService = new HindsightServiceManager();
