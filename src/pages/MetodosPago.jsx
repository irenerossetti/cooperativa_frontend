import { useState } from 'react';
import { CreditCard, Banknote, QrCode, X, Download, Check } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

const MetodosPago = () => {
  const [showQRModal, setShowQRModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [paymentData, setPaymentData] = useState({
    amount: '',
    reference: '',
    date: new Date().toISOString().split('T')[0]
  });

  // Métodos de pago disponibles
  const paymentMethods = [
    {
      id: 1,
      name: 'Efectivo',
      description: 'Pago en efectivo en oficina',
      icon: Banknote,
      color: 'from-green-500 to-green-600',
      active: true,
      hasReceipt: true,
      details: 'Aceptamos pagos en efectivo en nuestras oficinas durante horario de atención.'
    },
    {
      id: 3,
      name: 'QR Simple',
      description: 'Pago mediante código QR',
      icon: QrCode,
      color: 'from-purple-500 to-purple-600',
      active: true,
      hasQR: true,
      hasReceipt: true,
      qrImage: '/qr-pago.jpeg',
      qrData: 'Cooperativa Agrícola - Pagos QR',
      details: 'Escanea el código QR con tu aplicación de banca móvil. Compatible con todas las apps bancarias de Bolivia.'
    },
  ];

  const handleShowQR = (method) => {
    setSelectedMethod(method);
    setShowQRModal(true);
  };

  const handleCloseQR = () => {
    setShowQRModal(false);
    setSelectedMethod(null);
  };

  const handleGenerateReceipt = (method) => {
    setSelectedMethod(method);
    setShowReceiptModal(true);
  };

  const handleCloseReceipt = () => {
    setShowReceiptModal(false);
    setSelectedMethod(null);
    setPaymentData({
      amount: '',
      reference: '',
      date: new Date().toISOString().split('T')[0]
    });
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  const handleDownloadReceipt = () => {
    // Generar número de recibo único
    const receiptNumber = `REC-${Date.now()}`;
    alert(`Recibo ${receiptNumber} generado. Funcionalidad de descarga en desarrollo.`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">Métodos de Pago</h1>
            <p className="text-emerald-200/80">Administra los métodos de pago disponibles</p>
          </div>
          <div className="flex items-center space-x-2">
            <CreditCard className="w-6 h-6 text-emerald-400" />
            <span className="text-white font-semibold">{paymentMethods.filter(m => m.active).length} métodos activos</span>
          </div>
        </div>
      </div>

      {/* Payment Methods Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {paymentMethods.map((method) => {
          const Icon = method.icon;
          return (
            <div
              key={method.id}
              className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${method.color}`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{method.name}</h3>
                    <p className="text-emerald-200/70 text-sm">{method.description}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs ${
                  method.active 
                    ? 'bg-green-500/20 text-green-200' 
                    : 'bg-red-500/20 text-red-200'
                }`}>
                  {method.active ? 'Activo' : 'Inactivo'}
                </span>
              </div>

              <div className="bg-white/5 rounded-lg p-4 mb-4">
                <p className="text-white text-sm whitespace-pre-line">{method.details}</p>
              </div>

              <div className="space-y-2">
                {method.hasQR && (
                  <button
                    onClick={() => handleShowQR(method)}
                    className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-all duration-200"
                  >
                    <QrCode className="w-5 h-5" />
                    <span>Ver Código QR</span>
                  </button>
                )}
                {method.hasReceipt && (
                  <button
                    onClick={() => handleGenerateReceipt(method)}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-all duration-200"
                  >
                    <Check className="w-5 h-5" />
                    <span>Generar Recibo</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Instructions */}
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Instrucciones de Pago</h3>
        <div className="space-y-3 text-emerald-200/80">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-emerald-300 text-sm font-semibold">1</span>
            </div>
            <p>Selecciona el método de pago de tu preferencia</p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-emerald-300 text-sm font-semibold">2</span>
            </div>
            <p>Sigue las instrucciones específicas para cada método</p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-emerald-300 text-sm font-semibold">3</span>
            </div>
            <p>Guarda el comprobante de pago para futuras referencias</p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-emerald-300 text-sm font-semibold">4</span>
            </div>
            <p>Contacta con administración para confirmar tu pago</p>
          </div>
        </div>
      </div>

      {/* Receipt Modal */}
      {showReceiptModal && selectedMethod && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-800 rounded-xl border border-white/20 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Generar Recibo de Pago</h2>
                <button
                  onClick={handleCloseReceipt}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* Formulario de datos del pago */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-white text-sm font-semibold mb-2">
                    Monto (Bs.)
                  </label>
                  <input
                    type="number"
                    value={paymentData.amount}
                    onChange={(e) => setPaymentData({...paymentData, amount: e.target.value})}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Ingrese el monto"
                  />
                </div>

                <div>
                  <label className="block text-white text-sm font-semibold mb-2">
                    Referencia / Concepto
                  </label>
                  <input
                    type="text"
                    value={paymentData.reference}
                    onChange={(e) => setPaymentData({...paymentData, reference: e.target.value})}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Ej: Pago de cuota mensual"
                  />
                </div>

                <div>
                  <label className="block text-white text-sm font-semibold mb-2">
                    Fecha
                  </label>
                  <input
                    type="date"
                    value={paymentData.date}
                    onChange={(e) => setPaymentData({...paymentData, date: e.target.value})}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Vista previa del recibo */}
              {paymentData.amount && paymentData.reference && (
                <div className="bg-white rounded-xl p-6 mb-6 print:shadow-none">
                  <div className="border-b-2 border-emerald-600 pb-4 mb-4">
                    <h3 className="text-2xl font-bold text-emerald-900">Cooperativa Agrícola</h3>
                    <p className="text-gray-600 text-sm">Sistema de Gestión Cooperativa</p>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-lg font-bold text-gray-800 mb-2">RECIBO DE PAGO</h4>
                    <p className="text-sm text-gray-600">N° {`REC-${Date.now().toString().slice(-8)}`}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Fecha:</p>
                      <p className="font-semibold text-gray-800">{new Date(paymentData.date).toLocaleDateString('es-BO')}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Método de Pago:</p>
                      <p className="font-semibold text-gray-800">{selectedMethod.name}</p>
                    </div>
                  </div>

                  <div className="bg-emerald-50 rounded-lg p-4 mb-4">
                    <p className="text-sm text-gray-600 mb-1">Concepto:</p>
                    <p className="font-semibold text-gray-800">{paymentData.reference}</p>
                  </div>

                  <div className="bg-emerald-100 rounded-lg p-4 mb-4">
                    <p className="text-sm text-gray-600 mb-1">Monto Total:</p>
                    <p className="text-3xl font-bold text-emerald-900">Bs. {parseFloat(paymentData.amount).toFixed(2)}</p>
                  </div>

                  <div className="border-t pt-4 mt-4">
                    <div className="flex justify-between items-center">
                      <div className="text-center flex-1">
                        <div className="border-t border-gray-400 pt-2 mt-8">
                          <p className="text-sm text-gray-600">Firma del Cajero</p>
                        </div>
                      </div>
                      <div className="text-center flex-1">
                        <div className="border-t border-gray-400 pt-2 mt-8">
                          <p className="text-sm text-gray-600">Firma del Socio</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t text-center">
                    <p className="text-xs text-gray-500">Este documento es un comprobante válido de pago</p>
                    <p className="text-xs text-gray-500">Conserve este recibo para futuras referencias</p>
                  </div>
                </div>
              )}

              {/* Botones de acción */}
              <div className="flex gap-3">
                <button
                  onClick={handlePrintReceipt}
                  disabled={!paymentData.amount || !paymentData.reference}
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-all duration-200"
                >
                  <Download className="w-5 h-5" />
                  <span>Imprimir</span>
                </button>
                <button
                  onClick={handleCloseReceipt}
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QR Modal */}
      {showQRModal && selectedMethod && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-800 rounded-xl border border-white/20 w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Código QR de Pago</h2>
                <button
                  onClick={handleCloseQR}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              <div className="text-center space-y-4">
                <div className="bg-white p-8 rounded-xl mx-auto inline-block shadow-2xl">
                  {/* Mostrar imagen del QR directamente */}
                  {selectedMethod.qrImage ? (
                    <img 
                      src={selectedMethod.qrImage} 
                      alt="Código QR de Pago"
                      className="w-64 h-64 object-contain"
                    />
                  ) : (
                    <QRCodeSVG 
                      value={selectedMethod.qrData}
                      size={256}
                      level="H"
                      includeMargin={true}
                    />
                  )}
                </div>

                <div className="bg-white/10 rounded-lg p-4">
                  <p className="text-white text-sm mb-2 font-semibold">Escanea este código con tu aplicación de banca móvil</p>
                  <p className="text-emerald-200/70 text-xs">Compatible con todas las apps bancarias de Bolivia</p>
                </div>

                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3">
                  <p className="text-emerald-200 text-sm">💡 Tip: Asegúrate de tener buena iluminación al escanear</p>
                </div>

                <div className="text-white/80 text-xs space-y-1">
                  <p>✓ Código QR oficial de la cooperativa</p>
                  <p>✓ Pago seguro y verificado</p>
                </div>
              </div>

              <button
                onClick={handleCloseQR}
                className="w-full mt-6 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MetodosPago;
