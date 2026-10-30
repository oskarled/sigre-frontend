import { MapPin, Phone, Mail, Clock, Building2, ExternalLink } from "lucide-react";

// Dirección de la sede. Si cambia, basta con editar estas constantes:
// el mapa y el botón "Abrir en Google Maps" se generan a partir de ellas.
const DIRECCION = "Barrio El Cairo # 30G-60";
const CIUDAD = "Cartagena de Indias, Bolívar";
const MAPS_QUERY = encodeURIComponent(`ECM Training Center, ${DIRECCION}, ${CIUDAD}, Colombia`);
const MAPS_EMBED = `https://maps.google.com/maps?q=${MAPS_QUERY}&z=16&output=embed`;
const MAPS_LINK = `https://www.google.com/maps/search/?api=1&query=${MAPS_QUERY}`;

/**
 * Sección con la dirección de ECM Training Center, el mapa embebido y el enlace a Google Maps.
 */
export function LocationSection() {
  return (
    <div className="mt-16 pb-12">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Contacto
        </h2>
        <p className="text-gray-700">
          Ponte en contacto con nosotros - Estamos listos para atenderte
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" id="google-map-section">
        {/* Mapa de Google */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-orange-100">
          <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-4">
            <div className="flex items-center gap-3">
              <MapPin className="w-6 h-6" />
              <h3 className="font-bold">Encuéntranos</h3>
            </div>
          </div>
          
          {/* Google Maps iframe - ECM Training Center */}
          <div className="relative w-full h-96">
            <iframe
              src={MAPS_EMBED}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`Ubicación ECM Training Center - ${DIRECCION}, ${CIUDAD}`}
            />
          </div>
        </div>

        {/* Información de Contacto */}
        <div className="space-y-6">
          {/* Dirección */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-orange-100">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 mb-2">Cómo Encontrarnos</h4>
                <p className="text-gray-700">
                  {DIRECCION}<br />
                  {CIUDAD}, Colombia
                </p>
                <a
                  href={MAPS_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-orange-700 hover:text-orange-800"
                >
                  Abrir en Google Maps <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Teléfono */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-orange-100">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 mb-2">Teléfonos de Contacto</h4>
                <p className="text-gray-700">
                  <a href="tel:+573148656932" className="block hover:text-orange-700">(+57) 314-8656932</a>
                  <a href="tel:+573205437068" className="block hover:text-orange-700">(+57) 320-5437068</a>
                </p>
              </div>
            </div>
          </div>

          {/* Email */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-orange-100">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 mb-2">Correos Electrónicos</h4>
                <p className="text-gray-700">
                  <a href="mailto:comercial@ecmtc.com.co" className="block hover:text-orange-700">comercial@ecmtc.com.co</a>
                  <a href="mailto:gerencia@ecmtc.com.co" className="block hover:text-orange-700">gerencia@ecmtc.com.co</a>
                </p>
              </div>
            </div>
          </div>

          {/* Redes Sociales y Sitio Web */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-orange-100">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 mb-2">Más Información</h4>
                <p className="text-gray-700">
                  <span className="block">www.ecmtc.com.co</span>
                  <span className="block">Lunes a Viernes: 7:00 AM - 6:00 PM</span>
                  <span className="block">Sábados: 8:00 AM - 1:00 PM</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Llamados a la acción */}
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <a
          href="https://wa.me/573148656932"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-8 py-4 bg-green-700 text-white font-semibold rounded-lg hover:bg-green-800 transition-all shadow-lg hover:shadow-xl"
        >
          <Phone className="w-5 h-5" />
          Contactar por WhatsApp
        </a>
        <a
          href={MAPS_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-700 to-red-700 text-white font-semibold rounded-lg hover:from-orange-800 hover:to-red-800 transition-all shadow-lg hover:shadow-xl"
        >
          <MapPin className="w-5 h-5" />
          Cómo llegar
        </a>
      </div>
    </div>
  );
}