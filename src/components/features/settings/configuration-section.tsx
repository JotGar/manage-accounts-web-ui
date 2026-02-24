"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { Switch } from "@/src/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar"
import {
  Settings,
  User,
  Globe,
  Moon,
  Sun,
  Camera,
  Mail,
  Phone,
  Lock,
  Bell,
  Shield,
  Download,
  Trash2,
} from "lucide-react"

interface ConfigurationSectionProps {
  darkMode: boolean
  setDarkMode: (value: boolean) => void
}

export function ConfigurationSection({ darkMode, setDarkMode }: ConfigurationSectionProps) {
  const [language, setLanguage] = useState("es")
  const [notifications, setNotifications] = useState(true)
  const [emailNotifications, setEmailNotifications] = useState(false)

  const languages = [
    { code: "es", name: "Español", flag: "🇪🇸" },
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "pt", name: "Português", flag: "🇧🇷" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-2 text-gray-700">
        <Settings className="h-6 w-6" />
        <h1 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>Configuración</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Section */}
        <Card className={darkMode ? "bg-gray-800 border-gray-700" : ""}>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Perfil de Usuario</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Profile Picture */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Avatar className="h-20 w-20">
                  <AvatarImage src="/placeholder.svg?height=80&width=80" />
                  <AvatarFallback className="text-lg">JG</AvatarFallback>
                </Avatar>
                <Button
                  size="sm"
                  className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-blue-600 hover:bg-blue-700"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-1">
                <h3 className="font-medium text-gray-900">Julian Garcia</h3>
                <p className="text-sm text-gray-500">julian.garcia@email.com</p>
                <Button variant="outline" size="sm">
                  Cambiar Foto
                </Button>
              </div>
            </div>

            {/* Personal Information */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className={darkMode ? "text-gray-200" : ""}>
                    Nombre Completo
                  </Label>
                  <Input
                    id="fullName"
                    defaultValue="Julian Garcia"
                    className={darkMode ? "bg-gray-700 border-gray-600 text-white" : ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className={darkMode ? "text-gray-200" : ""}>
                    Correo Electrónico
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      defaultValue="julian.garcia@email.com"
                      className={`pl-10 ${darkMode ? "bg-gray-700 border-gray-600 text-white" : ""}`}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className={darkMode ? "text-gray-200" : ""}>
                    Teléfono
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="phone"
                      defaultValue="+57 300 123 4567"
                      className={`pl-10 ${darkMode ? "bg-gray-700 border-gray-600 text-white" : ""}`}
                    />
                  </div>
                </div>
              </div>
              <Button className="w-full">Guardar Cambios</Button>
            </div>
          </CardContent>
        </Card>

        {/* Appearance & Language */}
        <Card className={darkMode ? "bg-gray-800 border-gray-700" : ""}>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Globe className="h-5 w-5" />
              <span>Apariencia e Idioma</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Theme Toggle */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  {darkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                  <span className={`font-medium ${darkMode ? "text-white" : ""}`}>Tema Oscuro</span>
                </div>
                <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                  Cambia entre tema claro y oscuro
                </p>
              </div>
              <Switch checked={darkMode} onCheckedChange={setDarkMode} />
            </div>

            {/* Language Selection */}
            <div className="space-y-3">
              <Label className={darkMode ? "text-gray-200" : ""}>Idioma de la Aplicación</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      <div className="flex items-center space-x-2">
                        <span>{lang.flag}</span>
                        <span>{lang.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Currency Display */}
            <div className="space-y-3">
              <Label className={darkMode ? "text-gray-200" : ""}>Moneda Principal</Label>
              <Select defaultValue="COP">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="COP">🇨🇴 Peso Colombiano (COP)</SelectItem>
                  <SelectItem value="USD">🇺🇸 Dólar Estadounidense (USD)</SelectItem>
                  <SelectItem value="EUR">🇪🇺 Euro (EUR)</SelectItem>
                  <SelectItem value="GBP">🇬🇧 Libra Esterlina (GBP)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card className={darkMode ? "bg-gray-800 border-gray-700" : ""}>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Seguridad</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full justify-start">
              <Lock className="h-4 w-4 mr-2" />
              Cambiar Contraseña
            </Button>

            <Button variant="outline" className="w-full justify-start">
              <Shield className="h-4 w-4 mr-2" />
              Autenticación de Dos Factores
            </Button>

            <div className="pt-4 border-t">
              <h4 className={`font-medium mb-3 ${darkMode ? "text-white" : ""}`}>Sesiones Activas</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className={`font-medium text-sm ${darkMode ? "text-white" : ""}`}>Navegador Actual</p>
                    <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                      Chrome en Windows • Ahora
                    </p>
                  </div>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Activa</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className={darkMode ? "bg-gray-800 border-gray-700" : ""}>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="h-5 w-5" />
              <span>Notificaciones</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <span className={`font-medium ${darkMode ? "text-white" : ""}`}>Notificaciones Push</span>
                <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                  Recibe alertas sobre transacciones
                </p>
              </div>
              <Switch checked={notifications} onCheckedChange={setNotifications} />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <span className={`font-medium ${darkMode ? "text-white" : ""}`}>Notificaciones por Email</span>
                <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                  Resúmenes mensuales y alertas importantes
                </p>
              </div>
              <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
            </div>

            <div className="pt-4 border-t">
              <h4 className={`font-medium mb-3 ${darkMode ? "text-white" : ""}`}>Frecuencia de Reportes</h4>
              <Select defaultValue="monthly">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Semanal</SelectItem>
                  <SelectItem value="monthly">Mensual</SelectItem>
                  <SelectItem value="quarterly">Trimestral</SelectItem>
                  <SelectItem value="never">Nunca</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Management */}
      <Card className={darkMode ? "bg-gray-800 border-gray-700" : ""}>
        <CardHeader>
          <CardTitle>Gestión de Datos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="justify-start">
              <Download className="h-4 w-4 mr-2" />
              Exportar Datos
            </Button>

            <Button variant="outline" className="justify-start">
              <Download className="h-4 w-4 mr-2" />
              Descargar Reporte
            </Button>

            <Button variant="destructive" className="justify-start">
              <Trash2 className="h-4 w-4 mr-2" />
              Eliminar Cuenta
            </Button>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className={`font-medium text-blue-900 mb-2 ${darkMode ? "text-white" : ""}`}>Respaldo de Datos</h4>
            <p className={`text-sm text-blue-700 mb-3 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              Tus datos se respaldan automáticamente cada 24 horas. Último respaldo: Hoy a las 3:00 AM
            </p>
            <Button size="sm" variant="outline">
              Crear Respaldo Manual
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
