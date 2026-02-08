import type { MDiffEvent } from "@/lib/types"

interface IntegrationConfig {
  id: string
  platform: "telegram" | "discord" | "slack"
  webhookUrl?: string
  token?: string
  channelName?: string
  subscribedEvents: string[]
}

interface DispatchResult {
  integrationId: string
  platform: string
  success: boolean
  message?: string
}

export async function dispatchEvent(
  event: MDiffEvent,
  integrations: IntegrationConfig[]
): Promise<DispatchResult[]> {
  const results: DispatchResult[] = []

  for (const integration of integrations) {
    if (!integration.subscribedEvents.includes(event.type)) continue

    try {
      // Placeholder implementations — real dispatch would call platform APIs
      switch (integration.platform) {
        case "telegram":
          // Would POST to https://api.telegram.org/bot{token}/sendMessage
          results.push({
            integrationId: integration.id,
            platform: "telegram",
            success: true,
            message: `Dispatched ${event.type} to Telegram`,
          })
          break
        case "discord":
          // Would POST to webhook URL
          results.push({
            integrationId: integration.id,
            platform: "discord",
            success: true,
            message: `Dispatched ${event.type} to Discord`,
          })
          break
        case "slack":
          // Would POST to webhook URL
          results.push({
            integrationId: integration.id,
            platform: "slack",
            success: true,
            message: `Dispatched ${event.type} to Slack`,
          })
          break
      }
    } catch (err) {
      results.push({
        integrationId: integration.id,
        platform: integration.platform,
        success: false,
        message: err instanceof Error ? err.message : "Unknown error",
      })
    }
  }

  return results
}
