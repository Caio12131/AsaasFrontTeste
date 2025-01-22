function setupSSE() {
    const eventSource = new EventSource("/events")
  
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data)
      console.log("Received event:", data)
      // Handle the event based on its type
      switch (data.type) {
        case "paymentCreated":
          console.log("Payment created:", data.data)
          // Update UI for payment created
          break
        case "paymentReceived":
          console.log("Payment received:", data.data)
          // Update UI for payment received
          break
        case "paymentUpdated":
          console.log("Payment updated:", data.data)
          // Update UI for payment updated
          break
        default:
          console.log("Unknown event type:", data.type)
      }
    }
  
    eventSource.onerror = (error) => {
      console.error("SSE error:", error)
      eventSource.close()
    }
  
    return eventSource
  }
  
  // Call this function when your app initializes
  const eventSource = setupSSE()
  
  // Remember to close the connection when it's no longer needed
  // eventSource.close()
  
  