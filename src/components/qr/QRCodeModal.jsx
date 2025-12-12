import { useState } from 'react';
import { X, Download, Share2, QrCode as QrIcon } from 'lucide-react';
import api from '../../services/api';

const QRCodeModal = ({ isOpen, onClose, modelType, objectId, objectName }) => {
  const [qrData, setQrData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Generar QR al abrir el modal
  useState(() => {
    if (isOpen && !qrData) {
      generateQR();
    }
  }, [isOpen]);

  const generateQR = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.post('/qr-codes/qr-codes/generate/', {
        model_type: modelType,
        object_id: objectId,
        include_data: true
      });
      
      setQrData(response.data);
    } catch (err) {
      setError('Error al generar código QR');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const downloadQR = () => {
    if (!qrData) return;
    
    // Crear link de descarga
    const link = document.createElement('a');
    link.href = `data:image/png;base64,${qrData.qr_image_base64}`;
    link.download = `qr_${modelType}_${objectId}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const shareQR = async () => {
    if (!qrData) return;
    
    const shareData = {
      title: `QR Code - ${objectName}`,
      text: `Código QR para ${modelType}: ${objectName}`,
      url: qrData.scan_url
    };
    
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: copiar URL al portapapeles
        await navigator.clipboard.writeText(qrData.scan_url);
        alert('URL copiada al portapapeles');
      }
    } catch (err) {
      console.error('Error al compartir:', err);
    }
  };

  const printQR = () => {
    if (!qrData) return;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>QR Code - ${objectName}</title>
          <style>
            body {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              margin: 0;
              font-family: Arial, sans-serif;
            }
            .container {
              text-align: center;
              padding: 20px;
            }
            h1 {
              font-size: 24px;
              margin-bottom: 10px;
            }
            p {
              color: #666;
              margin-bottom: 20px;
            }
            img {
              max-width: 400px;
              border: 2px solid #000;
              padding: 20px;
            }
            .footer {
              margin-top: 20px;
              font-size: 12px;
              color: #999;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>${objectName}</h1>
            <p>${modelType.toUpperCase()} #${objectId}</p>
            <img src="data:image/png;base64,${qrData.qr_image_base64}" alt="QR Code" />
            <div class="footer">
              <p>Escanea este código para ver la información completa</p>
              <p>${qrData.scan_url}</p>
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-gray-800 rounded-lg shadow-2xl max-w-md w-full border border-gray-700">
          {/* Header */}
          <div className="p-6 border-b border-gray-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <QrIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Código QR</h2>
                <p className="text-sm text-gray-400">{objectName}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-400">Generando código QR...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-red-500 bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <X className="w-8 h-8 text-red-500" />
                </div>
                <p className="text-red-400 mb-4">{error}</p>
                <button
                  onClick={generateQR}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                >
                  Reintentar
                </button>
              </div>
            ) : qrData ? (
              <>
                {/* QR Image */}
                <div className="bg-white p-6 rounded-lg mb-6">
                  <img
                    src={`data:image/png;base64,${qrData.qr_image_base64}`}
                    alt="QR Code"
                    className="w-full h-auto"
                  />
                </div>

                {/* Info */}
                <div className="bg-gray-750 rounded-lg p-4 mb-6">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">Tipo</p>
                      <p className="text-white font-semibold capitalize">{modelType}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">ID</p>
                      <p className="text-white font-semibold">#{objectId}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-gray-400 mb-1">URL de escaneo</p>
                      <p className="text-blue-400 text-xs break-all">{qrData.scan_url}</p>
                    </div>
                    {qrData.qr_code?.scans_count > 0 && (
                      <div className="col-span-2">
                        <p className="text-gray-400">Escaneos</p>
                        <p className="text-white font-semibold">{qrData.qr_code.scans_count}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={downloadQR}
                    className="flex flex-col items-center gap-2 p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition"
                  >
                    <Download className="w-6 h-6 text-blue-400" />
                    <span className="text-sm text-white">Descargar</span>
                  </button>
                  <button
                    onClick={shareQR}
                    className="flex flex-col items-center gap-2 p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition"
                  >
                    <Share2 className="w-6 h-6 text-green-400" />
                    <span className="text-sm text-white">Compartir</span>
                  </button>
                  <button
                    onClick={printQR}
                    className="flex flex-col items-center gap-2 p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition"
                  >
                    <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    <span className="text-sm text-white">Imprimir</span>
                  </button>
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
};

export default QRCodeModal;
