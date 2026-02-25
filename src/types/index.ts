export type PlanType = 'free_trial' | 'starter' | 'pro' | 'pay_as_you_go';
export type ServiceCategory = 'content' | 'code' | 'data' | 'image' | 'legal' | 'seo' | 'workflow';
export type UsageStatus = 'success' | 'error' | 'rate_limited';
export type TransactionType = 'credit_purchase' | 'subscription' | 'refund';
export type TransactionStatus = 'pending' | 'completed' | 'refunded';
export type SubscriptionStatus = 'active' | 'cancelled' | 'past_due' | 'paused';
export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'critical';
export type AccessChannel = 'web' | 'api' | 'mcp';

export interface Profile {
  id: string;
  full_name: string | null;
  company_name: string | null;
  avatar_url: string | null;
  credits_balance: number;
  plan_type: PlanType;
  api_key: string;
  api_key_created_at: string;
  is_agent: boolean;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  category: ServiceCategory;
  credit_cost: number;
  is_active: boolean;
  icon: string;
  endpoint: string;
  created_at: string;
  updated_at: string;
}

export interface UsageLog {
  id: string;
  user_id: string;
  service_id: string;
  credits_used: number;
  request_payload: Record<string, unknown>;
  response_tokens: number;
  model_used: string;
  latency_ms: number;
  status: UsageStatus;
  channel: AccessChannel;
  ip_address: string;
  created_at: string;
  cost_to_us: number;
}

export interface Transaction {
  id: string;
  user_id: string;
  type: TransactionType;
  amount_usd: number;
  credits_added: number;
  lemon_squeezy_order_id: string | null;
  status: TransactionStatus;
  created_at: string;
  metadata: Record<string, unknown>;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan_type: PlanType;
  lemon_squeezy_subscription_id: string;
  status: SubscriptionStatus;
  current_period_start: string;
  current_period_end: string;
  created_at: string;
  updated_at: string;
}

export interface SupportTicket {
  id: string;
  user_id: string;
  subject: string;
  message: string;
  status: TicketStatus;
  priority: TicketPriority;
  created_at: string;
  updated_at: string;
}

export interface DailyMetrics {
  id: string;
  date: string;
  total_requests: number;
  total_revenue_usd: number;
  total_cost_usd: number;
  total_new_users: number;
  total_active_users: number;
  most_used_service_id: string | null;
  churn_count: number;
  created_at: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  credits_used?: number;
  credits_remaining?: number;
  request_id?: string;
}

export interface CreditPack {
  id: string;
  name: string;
  credits: number;
  price_usd: number;
  lemon_squeezy_variant_id: string;
}

export interface PlanInfo {
  type: PlanType;
  name: string;
  credits_per_month: number;
  price_usd: number;
  requests_per_min: number;
  requests_per_day: number;
  lemon_squeezy_variant_id: string;
}

export const PLANS: Record<string, PlanInfo> = {
  free_trial: {
    type: 'free_trial',
    name: 'Free Trial',
    credits_per_month: 50,
    price_usd: 0,
    requests_per_min: 5,
    requests_per_day: 50,
    lemon_squeezy_variant_id: '',
  },
  starter: {
    type: 'starter',
    name: 'Starter',
    credits_per_month: 500,
    price_usd: 29,
    requests_per_min: 30,
    requests_per_day: 1000,
    lemon_squeezy_variant_id: process.env.NEXT_PUBLIC_LS_STARTER_VARIANT_ID || '',
  },
  pro: {
    type: 'pro',
    name: 'Pro',
    credits_per_month: 1500,
    price_usd: 79,
    requests_per_min: 60,
    requests_per_day: 5000,
    lemon_squeezy_variant_id: process.env.NEXT_PUBLIC_LS_PRO_VARIANT_ID || '',
  },
  pay_as_you_go: {
    type: 'pay_as_you_go',
    name: 'Pay As You Go',
    credits_per_month: 0,
    price_usd: 0,
    requests_per_min: 30,
    requests_per_day: 1000,
    lemon_squeezy_variant_id: '',
  },
};

export const CREDIT_PACKS: CreditPack[] = [
  { id: 'starter_pack', name: 'Starter Pack', credits: 100, price_usd: 8, lemon_squeezy_variant_id: process.env.NEXT_PUBLIC_LS_PACK_100_VARIANT_ID || '' },
  { id: 'growth_pack', name: 'Growth Pack', credits: 500, price_usd: 35, lemon_squeezy_variant_id: process.env.NEXT_PUBLIC_LS_PACK_500_VARIANT_ID || '' },
  { id: 'pro_pack', name: 'Pro Pack', credits: 1000, price_usd: 60, lemon_squeezy_variant_id: process.env.NEXT_PUBLIC_LS_PACK_1000_VARIANT_ID || '' },
  { id: 'mega_pack', name: 'Mega Pack', credits: 2000, price_usd: 100, lemon_squeezy_variant_id: process.env.NEXT_PUBLIC_LS_PACK_2000_VARIANT_ID || '' },
];

export const SERVICES_CONFIG: Omit<Service, 'id' | 'created_at' | 'updated_at'>[] = [
  {
    name: 'AI Content Generator',
    slug: 'content-generator',
    description: 'Generate high-quality blog posts, articles, social media content, marketing copy, and more. Powered by GPT-4o for natural, engaging writing.',
    short_description: 'Blog posts, articles, social media, marketing copy',
    category: 'content',
    credit_cost: 5,
    is_active: true,
    icon: 'FileText',
    endpoint: '/api/v1/generate/content',
  },
  {
    name: 'AI Code Assistant',
    slug: 'code-assistant',
    description: 'Generate code, debug issues, refactor existing code, and get code reviews. Supports all major programming languages and frameworks.',
    short_description: 'Code generation, debugging, refactoring, review',
    category: 'code',
    credit_cost: 8,
    is_active: true,
    icon: 'Code',
    endpoint: '/api/v1/generate/code',
  },
  {
    name: 'AI Document Analyzer',
    slug: 'document-analyzer',
    description: 'Summarize documents, extract key information from contracts, analyze PDFs, and get structured insights from any text document.',
    short_description: 'Summarize, extract, analyze documents & contracts',
    category: 'data',
    credit_cost: 6,
    is_active: true,
    icon: 'FileSearch',
    endpoint: '/api/v1/generate/document',
  },
  {
    name: 'AI Image Generator',
    slug: 'image-generator',
    description: 'Create stunning images for marketing, design, social media, and more. Powered by DALL-E 3 for photorealistic and artistic outputs.',
    short_description: 'DALL-E powered image creation for marketing & design',
    category: 'image',
    credit_cost: 10,
    is_active: true,
    icon: 'ImageIcon',
    endpoint: '/api/v1/generate/image',
  },
  {
    name: 'AI Data Extractor',
    slug: 'data-extractor',
    description: 'Transform unstructured text into clean, structured JSON data. Extract entities, relationships, and key data points automatically.',
    short_description: 'Structured data extraction from unstructured text',
    category: 'data',
    credit_cost: 4,
    is_active: true,
    icon: 'Database',
    endpoint: '/api/v1/generate/extract',
  },
  {
    name: 'AI Translator',
    slug: 'translator',
    description: 'Translate text between 50+ languages with context awareness. Maintains tone, style, and technical accuracy across translations.',
    short_description: 'Multi-language translation with context awareness',
    category: 'content',
    credit_cost: 3,
    is_active: true,
    icon: 'Languages',
    endpoint: '/api/v1/generate/translate',
  },
];
