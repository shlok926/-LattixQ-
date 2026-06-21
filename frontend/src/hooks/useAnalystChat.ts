import { useRef, useCallback } from "react";
import { analystApi } from "../api/analystApi";
import { useAnalystStore } from "../store/analystStore";
import { useNotificationStore } from "../store/notificationStore";
import { Intent, SSEDoneEvent } from "../types/analyst.types";

export function useAnalystChat() {
  const abortRef = useRef<AbortController | null>(null);
  const intentRef = useRef<Intent>("general");
  const { sessionId, isStreaming, contextEnabled,
          addUserMessage, addStreamingPlaceholder,
          appendStreamChunk, finalizeStreamMessage, markStreamError } = useAnalystStore();

  const sendMessage = useCallback(async (text: string) => {
    if (!sessionId || isStreaming || !text.trim()) return;
    addUserMessage(text.trim());
    const placeholderId = addStreamingPlaceholder();
    abortRef.current = analystApi.streamChat(
      { session_id: sessionId, message: text.trim(),
        include_simulation_context: contextEnabled.simulation,
        include_report_context: contextEnabled.report },
      {
        onStart: (e) => { intentRef.current = e.intent; },
        onChunk: (chunk) => { appendStreamChunk(placeholderId, chunk); },
        onDone: (e: SSEDoneEvent) => { 
          finalizeStreamMessage(placeholderId, e, intentRef.current); 
          abortRef.current = null; 
          
          const riskLevel = String(e.risk_level || "").toUpperCase();
          console.log("AI Analyst stream done. Risk Level:", riskLevel);

          // Trigger security notification if risk level is CRITICAL or HIGH
          if (riskLevel === "CRITICAL" || riskLevel === "HIGH") {
            useNotificationStore.getState().addNotification({
              type: 'alert',
              title: `Security Threat: ${riskLevel} Risk`,
              desc: `AI Analyst flagged a potential post-quantum vulnerability during query analysis.`,
              route: '/analyst'
            });
          }
        },
        onError: (error) => { 
          markStreamError(placeholderId, error); 
          abortRef.current = null; 
          
          const errorStr = String(error || "");
          console.warn("AI Analyst Stream Error caught:", errorStr);

          // Trigger notification on prompt injection / security violation
          if (
            errorStr.toLowerCase().includes("security violation") ||
            errorStr.toLowerCase().includes("restricted input") ||
            errorStr.toLowerCase().includes("prompt injection")
          ) {
            useNotificationStore.getState().addNotification({
              type: 'alert',
              title: 'Prompt Injection Blocked',
              desc: 'Adversarial system override attempt intercepted by AI shield.',
              route: '/analyst'
            });
          }
        },
      }
    );
  }, [sessionId, isStreaming, contextEnabled, addUserMessage, addStreamingPlaceholder, appendStreamChunk, finalizeStreamMessage, markStreamError]);

  const cancelStream = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    const { streamingMessageId, finalizeStreamMessage, messages } = useAnalystStore.getState();
    if (streamingMessageId) {
      const msg = messages.find(m => m.id === streamingMessageId);
      finalizeStreamMessage(
        streamingMessageId,
        {
          type: "done",
          risk_level: msg?.riskLevel || "MEDIUM",
          confidence: msg?.confidence || "HIGH",
          affects_algorithms: msg?.affectsAlgorithms || [],
          next_steps: [],
        },
        intentRef.current
      );
    }
  }, []);

  return { sendMessage, cancelStream };
}