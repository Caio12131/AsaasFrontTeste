import { useState, useRef } from "react"
import { Mail, User, Phone, CreditCard } from "lucide-react"
import { useNavigate } from "react-router-dom"
import InputMask from "react-input-mask"
import "./services.css"
import axios from "axios"

const API_URL = "https://aasaasteste-production.up.railway.app"

export default function Services() {
  const navigate = useNavigate()
  const [nome, setNome] = useState("")
  const [email, setEmail] = useState("")
  const [telefone, setTelefone] = useState("")
  const [cpfCnpj, setCpfCnpj] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsLoading(true)

    try {
      const response = await axios.post(`${API_URL}/customers`, {
        name: nome,
        email: email,
        phone: telefone,
        cpfCnpj: cpfCnpj,
      })

      if (response.status === 201) {
        console.log("Cliente criado com sucesso:", response.data)
        navigate("/payment", {
          state: {
            userId: response.data.id,
            name: nome,
            email: email,
            phone: telefone,
            cpfCnpj: cpfCnpj,
          },
        })
      }
    } catch (error) {
      console.error("Erro ao criar cliente:", error.response?.data || error.message)
      alert("Ocorreu um erro ao criar o cliente. Por favor, tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-r from-pink-400 via-purple-400 to-orange-400 services-container">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-8 form-container">
        <h2 className="text-2xl font-semibold text-center mb-8 text-gray-800">Faça Seu Cadastro!</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              placeholder="Nome"
              className="w-full pl-12 pr-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent input-field"
            />
          </div>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Email"
              className="w-full pl-12 pr-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent input-field"
            />
          </div>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <InputMask
              mask="(99) 99999-9999"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              required
              placeholder="Celular"
            >
              {(inputProps) => (
                <input
                  {...inputProps}
                  type="tel"
                  className="w-full pl-12 pr-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent input-field"
                />
              )}
            </InputMask>
          </div>
          <div className="relative">
            <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <InputMask
              mask="999.999.999-99"
              value={cpfCnpj}
              onChange={(e) => setCpfCnpj(e.target.value)}
              required
              placeholder="CPF"
            >
              {(inputProps) => (
                <input
                  {...inputProps}
                  type="text"
                  className="w-full pl-12 pr-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent input-field"
                />
              )}
            </InputMask>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-6 text-white font-medium bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 submit-button"
          >
            {isLoading ? "Processing..." : "Enviar"}
          </button>
        </form>
      </div>
    </div>
  )
}

