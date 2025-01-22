import React, { useEffect, useState } from "react"

export function PaymentStatus({ paymentId }) {
  const [paymentStatus, setPaymentStatus] = useState(null)

  useEffect(() => {
    const eventSource = new EventSource("/api/events")

    eventSource.onopen = () => {
      console.log("SSE connection opened")
    }

    eventSource.onerror = (error) => {
      console.error("SSE connection error:", error)
      eventSource.close()
    }

    const handlePaymentUpdate = (event) => {
      const data = JSON.parse(event.data)
      if (data.paymentId === paymentId) {
        setPaymentStatus(data)
      }
    }

    eventSource.addEventListener("paymentcreated", handlePaymentUpdate)
    eventSource.addEventListener("paymentreceived", handlePaymentUpdate)
    eventSource.addEventListener("paymentupdated", handlePaymentUpdate)

    return () => {
      eventSource.close()
    }
  }, [paymentId])

  if (!paymentStatus) {
    return <div>Aguardando atualização do pagamento...</div>
  }

  return (
    <div>
      <h2>Status do Pagamento</h2>
      <p>ID do Pagamento: {paymentStatus.paymentId}</p>
      <p>Valor: R$ {paymentStatus.value.toFixed(2)}</p>
      <p>Status: {paymentStatus.status}</p>
      <p>Mensagem: {paymentStatus.message}</p>
    </div>
  )
}

