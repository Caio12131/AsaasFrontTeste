import React, { useState, useEffect } from "react"
import { Check, Copy, AlertCircle } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { io } from "socket.io-client"
import axios from "axios"
import "./payment.css"

const API_URL = "https://aasaasteste-production.up.railway.app"

export default function Payment() {
  const navigate = useNavigate()
  const [error, setError] = useState(null)
  const [paymentStatus, setPaymentStatus] = useState("pending")
  const [socketConnected, setSocketConnected] = useState(false)
  const [pixCode, setPixCode] = useState(null)
  const [qrCodeImage, setQrCodeImage] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const value = "R$ 5,00"
  const description = "Plano de Acompanhamento"

  useEffect(() => {
    const socket = io(API_URL, {
      transports: ["websocket", "polling"],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 10000,
      secure: true,
      withCredentials: true,
    })

    socket.on("connect", () => {
      console.log("Socket.IO conectado!")
      setSocketConnected(true)
      setError(null)
    })

    socket.on("connect_error", (err) => {
      console.error("Erro de conexão Socket.IO:", err)
      setSocketConnected(false)
      setError("Erro de conexão com o servidor. Tentando reconectar...")
    })

    socket.on("disconnect", (reason) => {
      console.log("Socket.IO desconectado:", reason)
      setSocketConnected(false)
      if (reason === "io server disconnect") {
        socket.connect()
      }
    })

    socket.on("paymentReceived", (data) => {
      console.log("Evento de pagamento recebido:", data)
      if (data.status === "confirmed") {
        setPaymentStatus("confirmed")
        setError(null)
        setTimeout(() => navigate("/thanks"), 2000)
      } else if (data.status === "failed") {
        setPaymentStatus("failed")
        setError("Pagamento falhou. Tente novamente.")
      }
    })

    return () => {
      socket.disconnect()
    }
  }, [navigate])

  const generatePayment = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const paymentResponse = await axios.post(
        `${API_URL}/payments`,
        {
          value: 5.0,
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // Due date set to 7 days from now
          description: "Plano de Acompanhamento",
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      )

      console.log("Payment response:", paymentResponse)

      if (paymentResponse.status === 200 && paymentResponse.data) {
        const { pixQrCode, qrCodeImage } = paymentResponse.data
        setPixCode(pixQrCode)
        setQrCodeImage(qrCodeImage)
      } else {
        throw new Error("Resposta inesperada do servidor")
      }
    } catch (error) {
      console.error("Erro detalhado:", error.response?.data || error.message)
      setError(error.response?.data?.error || "Ocorreu um erro ao gerar o pagamento. Por favor, tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async () => {
    if (!pixCode) {
      setError("Código PIX não disponível para cópia.")
      return
    }
    try {
      await navigator.clipboard.writeText(pixCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Erro ao copiar:", err)
      setError("Não foi possível copiar o código PIX.")
    }
  }

  return (
    <div className="payment-container">
      <div className="payment-card">
        <h2 className="payment-title">Pagamento PIX</h2>
        <div className="payment-content">
          <h3 className="payment-description">{description}</h3>
          <p className="payment-value">{value}</p>

          {error ? (
            <div className="error-container">
              <AlertCircle className="error-icon" />
              <p className="error-text">{error}</p>
              <button onClick={generatePayment} className="retry-button">
                Tentar novamente
              </button>
            </div>
          ) : (
            <>
              {qrCodeImage ? (
                <img
                  src={qrCodeImage || "/placeholder.svg"}
                  alt="QR Code PIX"
                  className="qr-code"
                  style={{ maxWidth: "200px", width: "100%", height: "auto" }}
                />
              ) : (
                <button onClick={generatePayment} disabled={isLoading} className="generate-payment-button">
                  {isLoading ? "Gerando..." : "Gerar Pagamento PIX"}
                </button>
              )}
            </>
          )}

          {pixCode && (
            <button onClick={copyToClipboard} className="copy-button" disabled={!!error || !socketConnected}>
              {copied ? (
                <>
                  <Check size={20} />
                  <span>Copiado!</span>
                </>
              ) : (
                <>
                  <Copy size={20} />
                  <span>Copiar código PIX</span>
                </>
              )}
            </button>
          )}

          {!error && (
            <div
              className={`payment-status ${
                paymentStatus === "confirmed"
                  ? "status-confirmed"
                  : paymentStatus === "failed"
                    ? "status-failed"
                    : "status-pending"
              }`}
            >
              {paymentStatus === "confirmed"
                ? "Pagamento confirmado!"
                : paymentStatus === "failed"
                  ? "Pagamento falhou. Tente novamente."
                  : "Aguardando pagamento..."}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

