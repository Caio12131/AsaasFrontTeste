import React, { useState, useEffect } from "react"
import axios from "axios"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

export default function Payment() {
  const [value, setValue] = useState("")
  const [description, setDescription] = useState("")
  const [qrCodeImage, setQrCodeImage] = useState("")
  const [pixCode, setPixCode] = useState("")
  const [paymentStatus, setPaymentStatus] = useState("")

  useEffect(() => {
    const eventSource = new EventSource(`${API_URL}/events`)

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data)
      console.log("Received event:", data)

      switch (data.type) {
        case "paymentCreated":
          setPaymentStatus("Pagamento PIX criado com sucesso!")
          break
        case "paymentReceived":
          setPaymentStatus("Pagamento PIX confirmado com sucesso!")
          break
        case "paymentUpdated":
          setPaymentStatus(`Status do pagamento PIX atualizado para ${data.data.status}`)
          break
        default:
          console.log("Unknown event type:", data.type)
      }
    }

    eventSource.onerror = (error) => {
      console.error("SSE error:", error)
      eventSource.close()
    }

    return () => {
      eventSource.close()
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post(`${API_URL}/payments`, { value, description })
      setQrCodeImage(response.data.qrCodeImage)
      setPixCode(response.data.pixQrCode)
      setPaymentStatus("Aguardando pagamento...")
    } catch (error) {
      console.error("Erro ao gerar pagamento:", error)
      setPaymentStatus("Erro ao gerar pagamento. Por favor, tente novamente.")
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Pagamento PIX</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-2">
          <label htmlFor="value" className="block">
            Valor:
          </label>
          <input
            type="number"
            id="value"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            required
            className="border p-2 w-full"
          />
        </div>
        <div className="mb-2">
          <label htmlFor="description" className="block">
            Descrição:
          </label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="border p-2 w-full"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Gerar QR Code PIX
        </button>
      </form>
      {qrCodeImage && (
        <div className="mb-4">
          <h2 className="text-xl font-bold mb-2">QR Code PIX:</h2>
          <img src={qrCodeImage || "/placeholder.svg"} alt="QR Code PIX" className="mb-2" />
          <p className="mb-2">Código PIX:</p>
          <textarea value={pixCode} readOnly className="border p-2 w-full h-24" />
        </div>
      )}
      {paymentStatus && (
        <div className="mt-4">
          <h2 className="text-xl font-bold mb-2">Status do Pagamento:</h2>
          <p>{paymentStatus}</p>
        </div>
      )}
    </div>
  )
}

