import React, { useState } from "react"
import axios from "axios"
import { PaymentStatus } from "./paymentStatus"

export function Payment() {
  const [value, setValue] = useState("")
  const [description, setDescription] = useState("")
  const [paymentInfo, setPaymentInfo] = useState(null)
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post("/api/payments", { value, description })
      setPaymentInfo(response.data)
      setError("")
    } catch (err) {
      setError("Erro ao gerar pagamento PIX")
      console.error(err)
    }
  }

  return (
    <div>
      <h1>Gerar Pagamento PIX</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="value">Valor:</label>
          <input type="number" id="value" value={value} onChange={(e) => setValue(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="description">Descrição:</label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <button type="submit">Gerar PIX</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {paymentInfo && (
        <div>
          <h2>Informações do Pagamento</h2>
          <p>Valor: R$ {paymentInfo.value}</p>
          <p>Descrição: {paymentInfo.description}</p>
          <img src={paymentInfo.qrCodeImage || "/placeholder.svg"} alt="QR Code PIX" />
          <p>Código PIX: {paymentInfo.pixQrCode}</p>
          <PaymentStatus paymentId={paymentInfo.paymentId} />
        </div>
      )}
    </div>
  )
}

